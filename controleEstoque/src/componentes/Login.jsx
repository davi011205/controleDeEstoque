// Login.jsx
import React, { useState } from 'react';
import { auth } from '../scripts/firebaseConfig'; // Importa o objeto auth
import { signInWithEmailAndPassword } from 'firebase/auth';

function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, senha);
            alert('Login bem-sucedido!');
            onLoginSuccess(); // Chama a função de sucesso do login
        } catch (error) {
            console.error('Erro ao fazer login:', error.message);
            alert(error.message); // Exibe a mensagem de erro para o usuário
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Senha:</label>
                <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Login</button>
        </form>
    );
}

export default Login;
