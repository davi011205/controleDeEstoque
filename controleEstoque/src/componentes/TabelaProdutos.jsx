import React, { useState } from 'react';
import { FaEdit, FaTrash, FaSignOutAlt } from 'react-icons/fa';
import { getFirestore, collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../scripts/firebaseConfig';

function TabelaProdutos({ produtos, onRemoveProduto, onLogout }) {
  const [showForm, setShowForm] = useState(false);
  const [editandoProduto, setEditandoProduto] = useState(null);
  const [novoProduto, setNovoProduto] = useState({
    nome: '',
    categoria: '',
    preco: '',
    quantidade: '',
    imagem: '',
    infoAdicionais: ''
  });
  const [imagem, setImagem] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    setNovoProduto({
      ...novoProduto,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setImagem(e.target.files[0]);
  };

  const uploadImagem = async () => {
    const storage = getStorage(app);
    const storageRef = ref(storage, `produtos/${imagem.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imagem);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleSaveProduto = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = novoProduto.imagem;
      if (imagem) {
        imageUrl = await uploadImagem();
      }

      const db = getFirestore(app);
      if (editandoProduto) {
        await updateDoc(doc(db, 'produtos', editandoProduto.id), {
          ...novoProduto,
          imagem: imageUrl
        });
        setEditandoProduto(null);
      } else {
        await addDoc(collection(db, 'produtos'), {
          ...novoProduto,
          imagem: imageUrl
        });
      }

      setNovoProduto({ nome: '', categoria: '', preco: '', quantidade: '', imagem: '', infoAdicionais: '' });
      setImagem(null);
      setShowForm(false);
      // Refresh products after saving
      const produtosSnapshot = await getDocs(collection(db, 'produtos'));
      const produtosList = produtosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProdutos(produtosList);
    } catch (error) {
      console.error('Erro ao salvar o produto:', error);
    }

    setUploading(false);
  };

  const handleEditProduto = (produto) => {
    setEditandoProduto(produto);
    setNovoProduto({
      nome: produto.nome,
      categoria: produto.categoria,
      preco: produto.preco,
      quantidade: produto.quantidade,
      imagem: produto.imagem,
      infoAdicionais: produto.infoAdicionais
    });
    setShowForm(true);
  };

  const handleRemoveClick = (id) => {
    if (window.confirm('Tem certeza que deseja remover este produto?')) {
      onRemoveProduto(id);
    }
  };

  return (
    <div>
      <button onClick={onLogout} className="btn btn-danger mb-3">
        <FaSignOutAlt /> Sair
      </button>

      <button
        className="btn btn-success mb-3"
        onClick={() => {
          setShowForm(!showForm);
          setEditandoProduto(null);
          setNovoProduto({ nome: '', categoria: '', preco: '', quantidade: '', imagem: '' });
        }}
      >
        {showForm ? 'Fechar Formulário' : 'Cadastrar Produto'}
      </button>

      {showForm && (
        <form onSubmit={handleSaveProduto}>
          <div className="form-group">
            <label>Nome do Produto</label>
            <input
              type="text"
              className="form-control"
              name="nome"
              value={novoProduto.nome}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Categoria</label>
            <input
              type="text"
              className="form-control"
              name="categoria"
              value={novoProduto.categoria}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Preço</label>
            <input
              type="number"
              className="form-control"
              name="preco"
              value={novoProduto.preco}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Quantidade Disponível</label>
            <input
              type="number"
              className="form-control"
              name="quantidade"
              value={novoProduto.quantidade}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Descrição</label>
            <input
              type="text"
              className="form-control"
              name="infoAdicionais"
              value={novoProduto.infoAdicionais}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Imagem do Produto</label>
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
            />
          </div>

          <button type="submit" className="btn btn-primary mt-3" disabled={uploading}>
            {uploading ? 'Salvando...' : editandoProduto ? 'Editar Produto' : 'Salvar'}
          </button>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Quantidade</th>
            <th>Categoria</th>
            <th>Imagem</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id}>
              <td>{produto.nome}</td>
              <td>{produto.preco}</td>
              <td>{produto.quantidade}</td>
              <td>{produto.categoria}</td>
              <td>
                {produto.imagem && <img src={produto.imagem} alt={produto.nome} style={{ width: '50px' }} />}
              </td>
              <td>
                <button onClick={() => handleEditProduto(produto)}>
                  <FaEdit /> {/* Ícone de edição */}
                </button>
                <button onClick={() => handleRemoveClick(produto.id)}>
                  <FaTrash /> {/* Ícone de remoção */}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TabelaProdutos;
