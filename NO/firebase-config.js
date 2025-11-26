// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxoft68Jjh96OBm3xR05LEw1u-XP5v66A",
  authDomain: "admin-auth-7f238.firebaseapp.com",
  projectId: "admin-auth-7f238",
  storageBucket: "admin-auth-7f238.firebasestorage.app",
  messagingSenderId: "955150354018",
  appId: "1:955150354018:web:7945303b9945527501333b",
  measurementId: "G-7ESEHJS3GP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db };
