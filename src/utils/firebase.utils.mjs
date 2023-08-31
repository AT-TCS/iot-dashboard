/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWCscNl--oKsYvtIM_ByI_1diSYxfFIHY",
  authDomain: "iot-visualisation.firebaseapp.com",
  projectId: "iot-visualisation",
  storageBucket: "iot-visualisation.appspot.com",
  messagingSenderId: "703357770045",
  appId: "1:703357770045:web:2af03aa4dc862733ce0d54",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth();

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);
