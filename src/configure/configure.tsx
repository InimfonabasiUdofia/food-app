// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEIU5ZrIGPfa-eLCCBckJ5briUs_FEMuc",
  authDomain: "quiz-907a8.firebaseapp.com",
  projectId: "quiz-907a8",
  storageBucket: "quiz-907a8.firebasestorage.app",
  messagingSenderId: "478574665833",
  appId: "1:478574665833:web:7b73fd295512974e2282f8",
  measurementId: "G-PEMHBNW7CC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const sign=getAuth(app);
export const provider=new GoogleAuthProvider()
