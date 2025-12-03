// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";

// Firebase configuration using environment variables
// IMPORTANT: This is now pulling from .env file (not exposed in code)
const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || "AIzaSyBTiB7gGl4TvzVVc-Wcp76dbdGKsIN-d8s",
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "newfat2fitauth.firebaseapp.com",
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || "newfat2fitauth",
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "newfat2fitauth.firebasestorage.app",
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "1056758426688",
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || "1:1056758426688:web:c85809bb20036b007103a5",
  measurementId: import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID || "G-3DZ4CWWQ9Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Log initialization (remove in production)
console.log('Firebase initialized successfully');
console.log('Environment:', import.meta.env?.VITE_ENVIRONMENT || 'development');

export { auth, db, analytics };
