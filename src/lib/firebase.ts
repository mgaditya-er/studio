
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "albumace",
  appId: "1:181871628545:web:0afe4ef6fd347febf90b00",
  storageBucket: "albumace.firebasestorage.app",
  apiKey: "AIzaSyB89EuEs_FaYCRQzwNTm1I2Tnv4wkjDBYw",
  authDomain: "albumace.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "181871628545"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
