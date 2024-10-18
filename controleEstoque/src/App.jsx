import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from './scripts/firebaseConfig';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Importar o auth do Firebase
import TabelaProdutos from './componentes/TabelaProdutos';

function App() {
  const [produtos, setProdutos] = useState([]);
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
  const [email, setEmail] = useState(''); // Estado para o email
  const [senha, setSenha] = useState(''); // Estado para a senha
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false); // Estado para controle de autenticação

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

  // Função para lidar com o login
  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth(app);
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      setUsuarioAutenticado(true); // Define o usuário como autenticado
      setEmail(''); // Limpa o campo de e-mail
      setSenha(''); // Limpa o campo de senha
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  useEffect(() => {
    if (usuarioAutenticado) {
      fetchProdutos();
    }
  }, [usuarioAutenticado]);

  return (
    <div className="container mt-4">
      <h1>Gerenciamento de Produtos</h1>

      {!usuarioAutenticado ? (
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              className="form-control"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3">Login</button>
        </form>
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
