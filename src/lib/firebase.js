// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVfDjPf361KJuOMc1pIdJii6BOe7jEv9I",
  authDomain: "word-quiz-e531a.firebaseapp.com",
  projectId: "word-quiz-e531a",
  storageBucket: "word-quiz-e531a.firebasestorage.app",
  messagingSenderId: "362531799820",
  appId: "1:362531799820:web:98bd57016f34f9c0d33f29",
  measurementId: "G-XR7EP8Y775"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);