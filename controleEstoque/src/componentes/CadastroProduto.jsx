// import React, { useState } from 'react';
// import { getFirestore, collection, addDoc } from 'firebase/firestore';
// import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { app } from '../scripts/firebaseConfig';

// const categoriasPredefinidas = [
//     'Eletrônicos',
//     'Roupas',
//     'Alimentos',
//     'Móveis',
//     'Livros'
// ];

// function CategoriaModal({ isOpen, onRequestClose, onSelect }) {
//     const [selectedCategories, setSelectedCategories] = useState([]);

//     const toggleCategory = (categoria) => {
//         setSelectedCategories(prev =>
//             prev.includes(categoria)
//                 ? prev.filter(c => c !== categoria)
//                 : [...prev, categoria]
//         );
//     };

//     const handleConfirm = () => {
//         onSelect(selectedCategories);
//         onRequestClose();
//     };

//     if (!isOpen) return null; // Não renderiza se não estiver aberto

//     return (
//         <div className="modal">
//             <div className="modal-content">
//                 <h2>Selecione as Categorias</h2>
//                 {categoriasPredefinidas.map(categoria => (
//                     <div key={categoria}>
//                         <label>
//                             <input
//                                 type="checkbox"
//                                 checked={selectedCategories.includes(categoria)}
//                                 onChange={() => toggleCategory(categoria)}
//                             />
//                             {categoria}
//                         </label>
//                     </div>
//                 ))}
//                 <button onClick={handleConfirm}>Confirmar</button>
//                 <button onClick={onRequestClose}>Cancelar</button>
//             </div>
//         </div>
//     );
// }

// function CadastroProduto({ onSave }) {
//     const [novoProduto, setNovoProduto] = useState({
//         nome: '',
//         categoria: [],
//         preco: '',
//         quantidade: '',
//         infoAdicionais: ''
//     });
//     const [imagem, setImagem] = useState(null);
//     const [uploading, setUploading] = useState(false);
//     const [modalOpen, setModalOpen] = useState(false);

//     const handleInputChange = (e) => {
//         setNovoProduto({ ...novoProduto, [e.target.name]: e.target.value });
//     };

//     const handleFileChange = (e) => {
//         setImagem(e.target.files[0]);
//     };

//     const handleSelectCategories = (selectedCategories) => {
//         setNovoProduto({ ...novoProduto, categoria: selectedCategories });
//     };

//     const uploadImagem = async () => {
//         const storage = getStorage(app);
//         const storageRef = ref(storage, `produtos/${imagem.name}`);
//         const uploadTask = uploadBytesResumable(storageRef, imagem);

//         return new Promise((resolve, reject) => {
//             uploadTask.on(
//                 'state_changed',
//                 () => {},
//                 (error) => reject(error),
//                 async () => {
//                     const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//                     resolve(downloadURL);
//                 }
//             );
//         });
//     };

//     const handleSaveProduto = async (e) => {
//         e.preventDefault();
//         setUploading(true);

//         try {
//             const imageUrl = imagem ? await uploadImagem() : '';
//             const db = getFirestore(app);

//             await addDoc(collection(db, 'produtos'), {
//                 ...novoProduto,
//                 imagem: imageUrl
//             });

//             onSave();
//             setNovoProduto({ nome: '', categoria: [], preco: '', quantidade: '', infoAdicionais: '' });
//             setImagem(null);
//         } catch (error) {
//             console.error('Erro ao cadastrar o produto:', error);
//         }
//         setUploading(false);
//     };

//     return (
//         <div className="overLayCadastroProduto">
//             <div className='cadastroProduto'>
//                 <form onSubmit={handleSaveProduto}>
//                     <div>
//                         <label>Nome do Produto</label>
//                         <input type="text" name="nome" value={novoProduto.nome} onChange={handleInputChange} required />
//                     </div>
//                     <div>
//                         <label style={{cursor: "pointer"}} onClick={() => setModalOpen(true)}>Selecionar Categorais</label>
//                         <div>
//                             {novoProduto.categoria.join(', ')}
//                         </div>
//                     </div>
//                     <div>
//                         <label>Estoque</label>
//                         <input type="number" name="quantidade" value={novoProduto.quantidade} onChange={handleInputChange} required />
//                     </div>
//                     <div>
//                         <label>Preço Normal</label>
//                         <input type="number" name="preco" value={novoProduto.preco} onChange={handleInputChange} required />
//                     </div>
//                     <div>
//                         <label>Preço Promoção</label>
//                         <input type="number" name="preco" value={novoProduto.preco} onChange={handleInputChange} />
//                     </div>
//                     <div>
//                         <label>Imagem do Produto</label>
//                         <input type="file" onChange={handleFileChange} required/>
//                     </div>
//                     <div>
//                         <button type="submit" className="btn btn-primary mt-3" disabled={uploading}>
//                             {uploading ? 'Salvando...' : 'Cadastrar'}
//                         </button>
//                     </div>
//                 </form>
//                 <CategoriaModal
//                     isOpen={modalOpen}
//                     onRequestClose={() => setModalOpen(false)}
//                     onSelect={handleSelectCategories}
//                 />
//             </div>
//         </div>
//     );
// }

// export default CadastroProduto;


import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../scripts/firebaseConfig';

const categoriasPredefinidas = [
    'Eletrônicos',
    'Roupas',
    'Alimentos',
    'Móveis',
    'Livros'
];

function CategoriaModal({ isOpen, onRequestClose, onSelect }) {
    const [selectedCategories, setSelectedCategories] = useState([]);

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

    if (!isOpen) return null;

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

function CadastroProduto({ onSave }) {
    const [novoProduto, setNovoProduto] = useState({
        nome: '',
        categoria: [],
        preco: '',
        quantidade: '',
        infoAdicionais: ''
    });
    const [imagem, setImagem] = useState(null);
    const [previewImagem, setPreviewImagem] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const handleInputChange = (e) => {
        setNovoProduto({ ...novoProduto, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImagem(file);
        setPreviewImagem(URL.createObjectURL(file)); // Cria a pré-visualização da imagem
    };

    const handleSelectCategories = (selectedCategories) => {
        setNovoProduto({ ...novoProduto, categoria: selectedCategories });
    };

    const uploadImagem = async () => {
        const storage = getStorage(app);
        const storageRef = ref(storage, `produtos/${imagem.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imagem);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                () => {},
                (error) => reject(error),
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
            const imageUrl = imagem ? await uploadImagem() : '';
            const db = getFirestore(app);

            await addDoc(collection(db, 'produtos'), {
                ...novoProduto,
                imagem: imageUrl
            });

            onSave();
            setNovoProduto({ nome: '', categoria: [], preco: '', quantidade: '', infoAdicionais: '' });
            setImagem(null);
            setPreviewImagem(null); // Remove a pré-visualização
        } catch (error) {
            console.error('Erro ao cadastrar o produto:', error);
        }
        setUploading(false);
    };

    return (
        <div className="overLayCadastroProduto">
            <div className='cadastroProduto'>
                <form onSubmit={handleSaveProduto}>
                    <div>
                        <label>Nome do Produto</label>
                        <input type="text" name="nome" value={novoProduto.nome} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <label style={{ cursor: "pointer" }} onClick={() => setModalOpen(true)}>Selecionar Categorais</label>
                        <div>
                            {novoProduto.categoria.join(', ')}
                        </div>
                    </div>
                    <div>
                        <label>Estoque</label>
                        <input type="number" name="quantidade" value={novoProduto.quantidade} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <label>Preço Normal</label>
                        <input type="number" name="preco" value={novoProduto.preco} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <label>Preço Promoção</label>
                        <input type="number" name="preco" value={novoProduto.preco} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Imagem do Produto</label>
                        <input type="file" onChange={handleFileChange} required />
                        {previewImagem && <img src={previewImagem} alt="Pré-visualização" style={{ width: '100px', marginTop: '10px' }} />}
                    </div>
                    <div>
                        <button type="submit" className="btn btn-primary mt-3" disabled={uploading}>
                            {uploading ? 'Salvando...' : 'Cadastrar'}
                        </button>
                    </div>
                </form>
                <CategoriaModal
                    isOpen={modalOpen}
                    onRequestClose={() => setModalOpen(false)}
                    onSelect={handleSelectCategories}
                />
            </div>
        </div>
    );
}

export default CadastroProduto;
