
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "career-ai-18e21.firebaseapp.com",
  projectId: "career-ai-18e21",
  storageBucket: "career-ai-18e21.firebasestorage.app",
  messagingSenderId: "69152703042",
  appId: "1:69152703042:web:b934779a260d6a3b0823db"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export { auth , provider}