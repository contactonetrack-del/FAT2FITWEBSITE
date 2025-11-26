// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTiB7gGl4TvzVVc-Wcp76dbdGKsIN-d8s",
  authDomain: "newfat2fitauth.firebaseapp.com",
  projectId: "newfat2fitauth",
  storageBucket: "newfat2fitauth.firebasestorage.app",
  messagingSenderId: "1056758426688",
  appId: "1:1056758426688:web:c85809bb20036b007103a5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db };
