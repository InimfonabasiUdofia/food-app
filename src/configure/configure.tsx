// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import {getFirestore}from "firebase/firestore"
const firebaseConfig = {
  apiKey: "AIzaSyDA3jZOHW9zjMcX9IMdVSC9hLlgSUlB8Pw",
  authDomain: "examination-7308f.firebaseapp.com",
  projectId: "examination-7308f",
  storageBucket: "examination-7308f.firebasestorage.app",
  messagingSenderId: "908509975494",
  appId: "1:908509975494:web:a5ed70fdf600cf79e198c7",
  measurementId: "G-05X8N8NQB2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const sign=getAuth(app);
export const provider=new GoogleAuthProvider();

export const db=getFirestore(app)
