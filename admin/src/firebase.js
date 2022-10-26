// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPh1skJuDDGdfGPW2o52GNYggA4uwbLpI",
  authDomain: "longpets-50c17.firebaseapp.com",
  projectId: "longpets-50c17",
  storageBucket: "longpets-50c17.appspot.com",
  messagingSenderId: "558660784736",
  appId: "1:558660784736:web:0a34eb3780dbd1ba9ee905"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;