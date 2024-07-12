// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-app-12e13.firebaseapp.com",
  projectId: "blog-app-12e13",
  storageBucket: "blog-app-12e13.appspot.com",
  messagingSenderId: "926630540935",
  appId: "1:926630540935:web:515d6f45218caa630c6a22"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
