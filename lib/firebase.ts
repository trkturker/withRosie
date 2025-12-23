
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCza_reTcfjUq8Z5yYTcYWkSQvnSY746I",
  authDomain: "rosie-b59d8.firebaseapp.com",
  projectId: "rosie-b59d8",
  storageBucket: "rosie-b59d8.firebasestorage.app",
  messagingSenderId: "57344144454",
  appId: "1:57344144454:web:69652561dfa4f902c88647",
  measurementId: "G-PTN7WE7R64"
};

// Initialize Firebase
// const analytics = getAnalytics(app);
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
