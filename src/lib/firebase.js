// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUVDId1MQDMbqZ3xpi8qGrAR7VPsTNfz4",
  authDomain: "word-quiz-fca02.firebaseapp.com",
  projectId: "word-quiz-fca02",
  storageBucket: "word-quiz-fca02.firebasestorage.app",
  messagingSenderId: "985797147166",
  appId: "1:985797147166:web:d959328a4625bc893a8c0f",
  "site": "word-quiz-fca02-a7817",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);