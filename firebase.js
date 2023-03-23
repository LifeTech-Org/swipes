// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { uploadBytes, getDownloadURL, ref, getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNSGlZKaR9T9SM3jAZJ6AjanP2FIBmh-I",
  authDomain: "swipes-eb80e.firebaseapp.com",
  projectId: "swipes-eb80e",
  storageBucket: "swipes-eb80e.appspot.com",
  messagingSenderId: "71337979513",
  appId: "1:71337979513:web:4a7a02a52297579f762ea8",
  measurementId: "G-TVDBXZLPHL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
  provider,
  auth,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut,
  db,
  storage,
};
