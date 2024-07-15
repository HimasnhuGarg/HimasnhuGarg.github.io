// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, onAuthStateChanged,signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAMUk8OqvrDaCiU0FeoLgErwyiYWcEcGwY",
  authDomain: "breathesafenow-ccf45.firebaseapp.com",
  projectId: "breathesafenow-ccf45",
  storageBucket: "breathesafenow-ccf45.appspot.com",
  messagingSenderId: "942819749529",
  appId: "1:942819749529:web:86ce5611de960e094c9208",
  measurementId: "G-13DKS1FCYZ"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Function to update UI based on user authentication state
const updateUI = (user) => {
  const loginButton = document.getElementById('loginButton');
  if (user) {
    // User is logged in
    loginButton.textContent = 'Logout';
    loginButton.onclick = () => {
      signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        console.error('Sign out error', error);
      });
    };
  } else {
    // User is logged out
    loginButton.textContent = 'Login';
    loginButton.onclick = () => {
      // Redirect to login page or show login modal
      window.location.href = '/login.html';
    };
  }
};

// Check authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    
  } else {
    
    window.location.replace("login.html");
  }
});

// Initial UI update based on current user authentication state
updateUI(auth.currentUser);
// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
  updateUI(user); // Update UI based on user authentication state
});