
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./config";

// Initialize Firebase
// This pattern ensures that we initialize the app only once, which is a best practice.
let app;
if (!getApps().length) {  
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Get and export the Firestore and Auth services.
// These instances will be used throughout the application.
const firestore = getFirestore(app);
const auth = getAuth(app);

// This function is a wrapper to provide the initialized services to the app.
// It's called in the AppProvider to get access to Firebase.
export const initializeFirebase = () => {
    return { app, firestore, auth };
};
