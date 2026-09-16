import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCwYZIxj_XkoeXh8LWfBtQQjKavKSsy0I4",
  authDomain: "nurjahan-afa41.firebaseapp.com",
  projectId: "nurjahan-afa41",
  storageBucket: "nurjahan-afa41.firebasestorage.app",
  messagingSenderId: "1092980083912",
  appId: "1:1092980083912:web:63274974603464bb78a9fd",
  measurementId: "G-ZZ6MLRZ0H5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export { app, firebaseConfig };