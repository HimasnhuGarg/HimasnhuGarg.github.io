import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMUk8OqvrDaCiU0FeoLgErwyiYWcEcGwY",
  authDomain: "breathesafenow-ccf45.firebaseapp.com",
  projectId: "breathesafenow-ccf45",
  storageBucket: "breathesafenow-ccf45.appspot.com",
  messagingSenderId: "942819749529",
  appId: "1:942819749529:web:86ce5611de960e094c9208",
  measurementId: "G-13DKS1FCYZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function () {
    messageDiv.style.opacity = 0;
  }, 5000);
}

const signIn = document.getElementById('btn4');
signIn.addEventListener('click', (event) => {
  event.preventDefault();
  const email = document.getElementById('email1').value.trim();
  const password = document.getElementById('password1').value.trim();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      if (user.emailVerified) {
        showMessage('Login is Successful', 'signInMessage');
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href = 'home.html';
      } else {
        showMessage('Please verify your email before logging in.', 'signInMessage');
        auth.signOut();
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/wrong-password') {
        showMessage('Incorrect Email or Password !!!', 'signInMessage');
      } else if (errorCode === 'auth/user-not-found') {
        showMessage('Account does not exist', 'signInMessage');
      } else {
        showMessage('Error: ' + error.message, 'signInMessage');
      }
    });
});

const googleSignInBtn = document.getElementById('googleSignInBtn');
googleSignInBtn.addEventListener('click', (event) => {
  event.preventDefault();
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      if (user.emailVerified) {
        console.log('User signed in: ', user);
        window.location.href = 'home.html';
      } else {
        showMessage('Please verify your email before logging in.', 'signInMessage');
        auth.signOut();
      }
    })
    .catch((error) => {
      console.error('Error during sign-in: ', error);
      showMessage('Error during Google sign-in: ' + error.message, 'signInMessage');
    });
});
