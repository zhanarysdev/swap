// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import { getAuth, onAuthStateChanged } from "firebase/auth";

// const auth = getAuth();
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     console.log("User is authenticated:", user.uid);
//   } else {
//     console.log("No user is authenticated");
//   }
// });

const firebaseConfig = {
  apiKey: "AIzaSyCSNdotIs3uArcfCLC1o-nyUW4z6AbKrT4",
  authDomain: "swap-c14de.firebaseapp.com",
  projectId: "swap-c14de",
  storageBucket: "swap-c14de.firebasestorage.app",
  messagingSenderId: "3066422761",
  appId: "1:3066422761:web:29d114d87fd8787db99778",
  measurementId: "G-CL8CCYR88Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app) 