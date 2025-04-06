// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ✅ Your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAxiF5wTZrofCEl3nq02DeI16PIAN9q2W8",
  authDomain: "samarra-kitchen.firebaseapp.com",
  projectId: "samarra-kitchen",
  storageBucket: "samarra-kitchen.firebasestorage.app",
  messagingSenderId: "142156887840",
  appId: "1:142156887840:web:2488096f703772aa0a4945",
  measurementId: "G-TH2LTPW9DV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Firestore (this is what your app uses!)
export const db = getFirestore(app);
