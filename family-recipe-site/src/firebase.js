// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);