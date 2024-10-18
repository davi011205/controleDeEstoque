import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app, auth } from './scripts/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import TabelaProdutos from './componentes/TabelaProdutos';
import Login from './componentes/Login'; // Importa o componente de login

function App() {
  const [produtos, setProdutos] = useState([]);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editandoProduto, setEditandoProduto] = useState(null);
  const [novoProduto, setNovoProduto] = useState({
    nome: '',
    categoria: '',
    preco: '',
    quantidade: '',
    imagem: ''
  });
  const [imagem, setImagem] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Verifica o estado da autenticação ao carregar o app
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            setUsuarioAutenticado(true); // O usuário está logado
            fetchProdutos(); // Carrega produtos quando o usuário está autenticado
        } else {
            setUsuarioAutenticado(false); // O usuário não está logado
        }
    });

    return () => unsubscribe(); // Limpa o ouvinte ao desmontar
}, []);

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
    setEditandoProduto(produto);
    setNovoProduto({
      nome: produto.nome,
      categoria: produto.categoria,
      preco: produto.preco,
      quantidade: produto.quantidade,
      imagem: produto.imagem
    });
    setShowForm(true);
  };

  return (
    <div className="container mt-4">
      <h1>Gerenciamento de Produtos</h1>

      {!usuarioAutenticado ? (
        <Login onLoginSuccess={() => setUsuarioAutenticado(true)} />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default App;
