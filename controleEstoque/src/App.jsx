import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from './scripts/firebaseConfig';
import TabelaProdutos from './componentes/TabelaProdutos';

function App() {
  const [produtos, setProdutos] = useState([]);
  const [showForm, setShowForm] = useState(false); // Controla a exibição do formulário
  const [editandoProduto, setEditandoProduto] = useState(null); // Estado para identificar se estamos editando
  const [novoProduto, setNovoProduto] = useState({
    nome: '',
    categoria: '',
    preco: '',
    quantidade: '',
    imagem: ''
  });
  const [imagem, setImagem] = useState(null); // Estado para armazenar o arquivo de imagem
  const [uploading, setUploading] = useState(false); // Estado para controlar o upload

  const fetchProdutos = async () => {
    const db = getFirestore(app);
    const produtosSnapshot = await getDocs(collection(db, 'produtos'));
    const produtosList = produtosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProdutos(produtosList);
  };

  const handleRemoveProduto = async (id) => {
    const db = getFirestore(app);
    await deleteDoc(doc(db, 'produtos', id));
    fetchProdutos();
  };

  const handleInputChange = (e) => {
    setNovoProduto({
      ...novoProduto,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setImagem(e.target.files[0]); // Armazena o arquivo de imagem selecionado
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
        imageUrl = await uploadImagem(); // Upload da imagem se uma nova imagem for selecionada
      }

      const db = getFirestore(app);
      if (editandoProduto) {
        // Atualiza o produto existente
        await updateDoc(doc(db, 'produtos', editandoProduto.id), {
          ...novoProduto,
          imagem: imageUrl
        });
        setEditandoProduto(null); // Resetando o estado de edição
      } else {
        // Adiciona novo produto
        await addDoc(collection(db, 'produtos'), {
          ...novoProduto,
          imagem: imageUrl
        });
      }

      setNovoProduto({ nome: '', categoria: '', preco: '', quantidade: '', imagem: '' });
      setImagem(null);
      setShowForm(false);
      fetchProdutos();
    } catch (error) {
      console.error('Erro ao salvar o produto:', error);
    }

    setUploading(false);
  };

  const handleEditProduto = (produto) => {
    setEditandoProduto(produto); // Define o produto a ser editado
    setNovoProduto({
      nome: produto.nome,
      categoria: produto.categoria,
      preco: produto.preco,
      quantidade: produto.quantidade,
      imagem: produto.imagem
    });
    setShowForm(true); // Mostra o formulário para edição
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  return (
    <div className="container mt-4">
      <h1>Gerenciamento de Produtos</h1>
      
      <button
        className="btn btn-success mb-3"
        onClick={() => {
          setShowForm(!showForm);
          setEditandoProduto(null); // Resetando o estado de edição ao abrir o formulário vazio
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

      {!showForm && (
        <TabelaProdutos produtos={produtos} onRemoveProduto={handleRemoveProduto} onEditProduto={handleEditProduto} />
      )}
    </div>
  );
}

export default App;