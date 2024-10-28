// EditarProduto.jsx
import React, { useState, useEffect } from 'react';
import { getFirestore, updateDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../scripts/firebaseConfig';

function EditarProduto({ produto, onSave }) {
    const [produtoEditado, setProdutoEditado] = useState(produto);
    const [imagem, setImagem] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        setProdutoEditado(produto);
    }, [produto]);

    const handleInputChange = (e) => {
        setProdutoEditado({ ...produtoEditado, [e.target.name]: e.target.value });
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
                () => {},
                (error) => reject(error),
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                }
            );
        });
    };

    const handleUpdateProduto = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            const imageUrl = imagem ? await uploadImagem() : produtoEditado.imagem;
            const db = getFirestore(app);

            await updateDoc(doc(db, 'produtos', produtoEditado.id), {
                ...produtoEditado,
                imagem: imageUrl
            });

            onSave();
        } catch (error) {
            console.error('Erro ao editar o produto:', error);
        }

        setUploading(false);
    };

    return (
        <div className="containerEditar" style={{border: '10px solid red'}}>

        
        <form onSubmit={handleUpdateProduto}>
            <div className="form-group">
                <label>Nome do Produto</label>
                <input type="text" className="form-control" name="nome" value={produtoEditado.nome} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
                <label>Categoria</label>
                <input type="text" className="form-control" name="categoria" value={produtoEditado.categoria} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
                <label>Preço</label>
                <input type="number" className="form-control" name="preco" value={produtoEditado.preco} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
                <label>Quantidade Disponível</label>
                <input type="number" className="form-control" name="quantidade" value={produtoEditado.quantidade} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
                <label>Descrição</label>
                <input type="text" className="form-control" name="infoAdicionais" value={produtoEditado.infoAdicionais} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
                <label>Imagem do Produto</label>
                <input type="file" className="form-control" onChange={handleFileChange} />
            </div>

            <button type="submit" className="btn btn-primary mt-3" disabled={uploading}>
                {uploading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
        </form>
        </div>
    );
}

export default EditarProduto;
