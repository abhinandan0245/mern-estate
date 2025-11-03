
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-30318.firebaseapp.com",
  projectId: "mern-estate-30318",
  storageBucket: "mern-estate-30318.firebasestorage.app",
  messagingSenderId: "410158091329",
  appId: "1:410158091329:web:cd0de20de172fa1d144ac0",
  measurementId: "G-NHPCP2RQY8",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);