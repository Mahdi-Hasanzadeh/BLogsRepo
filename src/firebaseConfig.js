// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWo5cdFnOWtUlmNxp6AqCvpeRb5kBh4es",
  authDomain: "blogs-e7492.firebaseapp.com",
  projectId: "blogs-e7492",
  storageBucket: "blogs-e7492.appspot.com",
  messagingSenderId: "298982332019",
  appId: "1:298982332019:web:bd2146d9ffb2dc90b97c06",
  measurementId: "G-BS0N8JE01L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const database = getFirestore(app);
export const auth = getAuth(app);
