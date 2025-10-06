
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./config";

// Initialize Firebase
let app;
if (!getApps().length) {  
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const firestore = getFirestore(app);
const auth = getAuth(app);

export const initializeFirebase = () => {
    return { app, firestore, auth };
};
