// import React, { useEffect, useState } from 'react';
// import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
// import { app, auth } from './scripts/firebaseConfig';
// import { onAuthStateChanged, signOut } from 'firebase/auth';
// import TabelaProdutos from './componentes/TabelaProdutos';
// import Login from './componentes/Login';

// function App() {
//   const [produtos, setProdutos] = useState([]);
//   const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUsuarioAutenticado(true);
//         fetchProdutos();
//       } else {
//         setUsuarioAutenticado(false);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const fetchProdutos = async () => {
//     const db = getFirestore(app);
//     const produtosSnapshot = await getDocs(collection(db, 'produtos'));
//     const produtosList = produtosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     setProdutos(produtosList);
//   };

//   const handleRemoveProduto = async (id) => {
//     const db = getFirestore(app);
//     await deleteDoc(doc(db, 'produtos', id));
//     fetchProdutos();
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       alert('Logout bem-sucedido!');
//     } catch (error) {
//       console.error('Erro ao fazer logout:', error.message);
//     }
//   };

//   return (
//     <div className='container'>
//       {!usuarioAutenticado ? (
//         <Login onLoginSuccess={() => setUsuarioAutenticado(true)} />
//       ) : (
//         <TabelaProdutos produtos={produtos} onRemoveProduto={handleRemoveProduto} onLogout={handleLogout} />
//       )}
//     </div>
//   );
// }

// export default App;

import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { app, auth } from './scripts/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import TabelaProdutos from './componentes/TabelaProdutos';
import Login from './componentes/Login';
import CadastroProduto from './componentes/CadastroProduto';
import EditarProduto from './componentes/EditarProduto';

function App() {
  const [produtos, setProdutos] = useState([]);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [produtoParaEditar, setProdutoParaEditar] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuarioAutenticado(!!user);
      if (user) fetchProdutos();
    });
    return () => unsubscribe();
  }, []);

  const fetchProdutos = async () => {
    const db = getFirestore(app);
    const produtosSnapshot = await getDocs(collection(db, 'produtos'));
    setProdutos(produtosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleRemoveProduto = async (id) => {
    const db = getFirestore(app);
    await deleteDoc(doc(db, 'produtos', id));
    fetchProdutos();
  };

  const handleLogout = async () => {
    await signOut(auth);
    alert('Logout bem-sucedido!');
  };

  return (
    <div className="container">
      {!usuarioAutenticado ? (
        <Login onLoginSuccess={() => setUsuarioAutenticado(true)} />
      ) : (
        <>
          <TabelaProdutos
            produtos={produtos}
            onRemoveProduto={handleRemoveProduto}
            onLogout={handleLogout}
            onAbrirCadastro={() => setModalCadastroAberto(true)}
            onAbrirEdicao={(produto) => {
              setProdutoParaEditar(produto);
              setModalEdicaoAberto(true);
            }}

            
          />
          {modalCadastroAberto && (
            <CadastroProduto
              onClose={() => setModalCadastroAberto(false)}
              onSalvar={() => {
                setModalCadastroAberto(false);
                fetchProdutos();
              }}
            />
          )}
          {modalEdicaoAberto && produtoParaEditar && (
            <EditarProduto
              produto={produtoParaEditar}
              onClose={() => setModalEdicaoAberto(false)}
              onSalvar={() => {
                setModalEdicaoAberto(false);
                fetchProdutos();
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
