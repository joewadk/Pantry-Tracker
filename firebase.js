// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUUVZmey_H3TkTs5uLI8MaZK2rt_G84D8",
  authDomain: "inventorytracker-d53c1.firebaseapp.com",
  projectId: "inventorytracker-d53c1",
  storageBucket: "inventorytracker-d53c1.appspot.com",
  messagingSenderId: "664288781307",
  appId: "1:664288781307:web:bd9bd3a83881d09a60a15e",
  measurementId: "G-30PMS1BFJY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export{firestore}