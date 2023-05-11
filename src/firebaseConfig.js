// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfwUx54LwE6io9De1b7SWckSlofCVGjdQ",
  authDomain: "blogs-dca73.firebaseapp.com",
  projectId: "blogs-dca73",
  storageBucket: "blogs-dca73.appspot.com",
  messagingSenderId: "919782416524",
  appId: "1:919782416524:web:9f33e5ccf5cae3c5a55ba9",
  measurementId: "G-ECJWNQXR7K",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);

export const database = getFirestore(app);
