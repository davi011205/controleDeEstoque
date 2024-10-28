// // TabelaProdutos.jsx
// import React, { useState } from 'react';
// import { FaEdit, FaTrash, FaSignOutAlt } from 'react-icons/fa';
// import CadastroProduto from './CadastroProduto';
// import EditarProduto from './EditarProduto';

// function TabelaProdutos({ produtos, onRemoveProduto, onLogout, fetchProdutos }) {
//     const [showCadastroForm, setShowCadastroForm] = useState(false);
//     const [produtoParaEditar, setProdutoParaEditar] = useState(null);

//     const handleEditProduto = (produto) => {
//         setProdutoParaEditar(produto);
//         setShowCadastroForm(false); // Certifica-se de que o formulário de cadastro não será exibido ao editar
//     };

//     const handleCloseForms = () => {
//         setShowCadastroForm(false);
//         setProdutoParaEditar(null);
//     };

//     return (
//         <div className="principalTabela">
//             <header>
//                 {!showCadastroForm && !produtoParaEditar && (
//                     <div>
//                         <button onClick={() => setShowCadastroForm(true)} className="btn btn-primary">
//                             Cadastrar Produto
//                         </button>
//                         <button onClick={onLogout} className="btn btn-danger">
//                             <FaSignOutAlt /> Sair
//                         </button>
//                     </div>
//                 )}
//             </header>

//             {/* Exibe o formulário de cadastro ou edição conforme o botão clicado */}
//             {showCadastroForm ? (
//                 <CadastroProduto onSave={() => { fetchProdutos(); handleCloseForms(); }} />
//             ) : produtoParaEditar ? (
//                 <EditarProduto produto={produtoParaEditar} onSave={() => { fetchProdutos(); handleCloseForms(); }} />
//             ) : (
//                 // Exibe a tabela de produtos quando não estiver cadastrando ou editando
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>Nome</th>
//                             <th>Categoria</th>
//                             <th>Preço</th>
//                             <th>Quantidade</th>
//                             <th>Descrição</th>
//                             <th>Ações</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {produtos.map((produto) => (
//                             <tr key={produto.id}>
//                                 <td>{produto.nome}</td>
//                                 <td>{produto.categoria}</td>
//                                 <td>{produto.preco}</td>
//                                 <td>{produto.quantidade}</td>
//                                 <td>{produto.infoAdicionais}</td>
//                                 <td>
//                                     <button onClick={() => handleEditProduto(produto)} className="btn btn-primary">
//                                         <FaEdit /> Editar
//                                     </button>
//                                     <button onClick={() => onRemoveProduto(produto.id)} className="btn btn-danger">
//                                         <FaTrash /> Excluir
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}
//         </div>
//     );
// }

// export default TabelaProdutos;

import React from 'react';
import { FaEdit, FaTrash, FaSignOutAlt } from 'react-icons/fa';

function TabelaProdutos({ produtos, onRemoveProduto, onLogout, onAbrirCadastro, onAbrirEdicao }) {
  return (
    <div className="principalTabela">
      <header>
        <button onClick={onAbrirCadastro} className="btn btn-success mb-3">Cadastrar Produto</button>
        <button onClick={onLogout} className="btn btn-danger mb-3">
          <FaSignOutAlt /> Sair
        </button>
      </header>

<div className="table">

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Categorias</th>
            <th>Preço</th>
            <th>estoque</th>
            <th>Descrição</th>
            <th colSpan={2}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id}>
              <td>{produto.nome}</td>
              <td>{produto.categoria}</td>
              <td>{produto.preco}</td>
              <td>{produto.estoque}</td>
              <td>{produto.infoAdicionais}</td>
              <td style={{cursor: 'pointer'}}>
                  <FaEdit onClick={() => onAbrirEdicao(produto)}/>
              </td>
              <td style={{cursor: 'pointer'}}>
                  <FaTrash onClick={() => onRemoveProduto(produto.id)}/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
</div>
    </div>
  );
}

export default TabelaProdutos;
