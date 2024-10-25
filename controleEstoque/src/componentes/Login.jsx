// Login.jsx
import React, { useState } from 'react';
import { auth } from '../scripts/firebaseConfig'; // Importa o objeto auth
import { signInWithEmailAndPassword } from 'firebase/auth';
import imagemLogin from '../assets/imgLogin.gif'
function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState(''); // Estado para armazenar mensagens de erro


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, senha);
            setEmail('');
            onLoginSuccess(); // Chama a função de sucesso do login
        } catch (error) {
            switch (error.code) {
                case 'auth/wrong-password':
                    setError('Senha incorreta. Tente novamente.');
                    break;
                case 'auth/invalid-email':
                    setError('E-mail inválido. Verifique seu e-mail.');
                    break;
                default:
                    setError('Erro ao fazer login. Tente novamente.');
            }
        }
    };

    return (
        <div className='principalLogin'>
            <div className="imagemLogin">
                <img src={imagemLogin} alt="" />
            </div>
            <div className="conteudoLogin">
                <form onSubmit={handleLogin}>
                    <div className="tituloLogin">
                        <h2>Login</h2>
                    </div>
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
                    <div className="buttonLogin">
                        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Exibe a mensagem de erro */}
                        <button type="submit">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;