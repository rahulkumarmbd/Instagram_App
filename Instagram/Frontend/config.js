// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDFo47EbLbAcC2uPWn3T1gaERr4_nYYBo",
  authDomain: "instagram-dev-f3280.firebaseapp.com",
  projectId: "instagram-dev-f3280",
  storageBucket: "instagram-dev-f3280.appspot.com",
  messagingSenderId: "501425004707",
  appId: "1:501425004707:web:4c2a1e56513367d341df16",
  measurementId: "G-RMG3B0VS5F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);