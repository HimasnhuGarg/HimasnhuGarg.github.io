// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMUk8OqvrDaCiU0FeoLgErwyiYWcEcGwY",
  authDomain: "breathesafenow-ccf45.firebaseapp.com",
  projectId: "breathesafenow-ccf45",
  storageBucket: "breathesafenow-ccf45",
  messagingSenderId: "942819749529",
  appId: "1:942819749529:web:86ce5611de960e094c9208",
  measurementId: "G-13DKS1FCYZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function () {
    messageDiv.style.opacity = 0;
  }, 5000);
}

const signup = document.getElementById('btn1');
signup.addEventListener('click', (event) => {
  event.preventDefault();

  const name = document.getElementById('username').value.trim();
  const age = document.getElementById('age').value.trim();
  const phone = document.getElementById('phone_number').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirmPassword').value.trim();

  if (password !== confirmPassword) {
    showMessage('Passwords do not match', 'signUpMessage');
    return;
  }

  const auth = getAuth();
  const db = getFirestore();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      sendEmailVerification(user).then(() => {
        showMessage('Verification email sent. Please check your inbox.', 'signUpMessage');
      }).catch((error) => {
        console.error("Error sending verification email", error);
      });

      const userData = {
        email: email,
        name: name,
        age: age,
        phone: phone
      };

      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          showMessage('Account Created Successfully', 'signUpMessage');
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 5000);
        })
        .catch((error) => {
          console.error("Error writing the document", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/email-already-in-use') {
        showMessage('Email Already Exists !!!', 'signUpMessage');
      } else {
        showMessage('Unable to create user', 'signUpMessage');
      }
    });
});
