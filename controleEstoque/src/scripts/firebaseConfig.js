// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Importa o módulo de autenticação
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAqo5lsn87old7RE3WZTgG0kctghX-FO78",
    authDomain: "estoquedeprodutos-43061.firebaseapp.com",
    projectId: "estoquedeprodutos-43061",
    storageBucket: "estoquedeprodutos-43061.appspot.com",
    messagingSenderId: "306108970349",
    appId: "1:306108970349:web:dea4d986c85d3cf01b1664"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Inicializa o serviço de autenticação
const storage = getStorage(app); // Inicializa o Storage

export { db, app, auth, storage };