import { useState } from "react";

function CategoriaModal({ isOpen, onRequestClose, onSelect }) {
    const [selectedCategories, setSelectedCategories] = useState([]);

    const categoriasPredefinidas = [
        'Eletrônicos',
        'Roupas',
        'Alimentos',
        'Móveis',
        'Livros'
    ];
    
    const toggleCategory = (categoria) => {
        setSelectedCategories(prev =>
            prev.includes(categoria)
                ? prev.filter(c => c !== categoria)
                : [...prev, categoria]
        );
    };

    const handleConfirm = () => {
        onSelect(selectedCategories);
        onRequestClose();
    };

    if (!isOpen) return null; // Não renderiza se não estiver aberto

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Selecione as Categorias</h2>
                {categoriasPredefinidas.map(categoria => (
                    <div key={categoria}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(categoria)}
                                onChange={() => toggleCategory(categoria)}
                            />
                            {categoria}
                        </label>
                    </div>
                ))}
                <button onClick={handleConfirm}>Confirmar</button>
                <button onClick={onRequestClose}>Cancelar</button>
            </div>
        </div>
    );
}
export default CategoriaModal;
