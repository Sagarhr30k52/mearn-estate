// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-322f8.firebaseapp.com",
  projectId: "mern-estate-322f8",
  storageBucket: "mern-estate-322f8.firebasestorage.app",
  messagingSenderId: "887501502331",
  appId: "1:887501502331:web:c2d22e1071a17715c06fde"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);