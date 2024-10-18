import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Pacote de ícones

function TabelaProdutos({ produtos, onRemoveProduto, onEditProduto  }) {
  const handleRemoveClick = (id) => {
    if (window.confirm('Tem certeza que deseja remover este produto?')) {
      onRemoveProduto(id);
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Preço</th>
          <th>Quantidade</th>
          <th>Categoria</th>
          <th>Descrição</th>
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
            <td>{produto.infoAdicionais}</td>
            <td>
              <button onClick={() => onEditProduto(produto)}>
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
  );
}

export default TabelaProdutos;