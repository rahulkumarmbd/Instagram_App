import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDDFo47EbLbAcC2uPWn3T1gaERr4_nYYBo",
  authDomain: "instagram-dev-f3280.firebaseapp.com",
  projectId: "instagram-dev-f3280",
  storageBucket: "instagram-dev-f3280.appspot.com",
  messagingSenderId: "501425004707",
  appId: "1:501425004707:web:4c2a1e56513367d341df16",
  measurementId: "G-RMG3B0VS5F",
  databaseURL:
    "https://instagram-dev-f3280-default-rtdb.asia-southeast1.firebasedatabase.app",
};

export let app;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const db = getFirestore();

export const storage = getStorage(app);

export const auth = getAuth(app);

export const database = getDatabase(app);
