
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  User as FirebaseAuthUser,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  Auth,
} from "firebase/auth";
import { getFirestore, doc, getDoc, Firestore } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";
import { Role, Student } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  user: Student; 
  authUser: FirebaseAuthUser | null;
  studentProfile: Student | null;
  setStudentProfile: (profile: Student | null) => void;
  loading: boolean;
  firestore: Firestore | null;
  
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  emailLogin: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultStudent: Student = {
    id: 'default',
    name: "Guest",
    email: "",
    role: "student",
    avatar: "",
    fines: 0,
    borrowHistory: [],
    department: '',
    course: '',
    contactNumber: '',
    yearOfStudy: '',
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>("student");
  const [authUser, setAuthUser] = useState<FirebaseAuthUser | null>(null);
  const [studentProfile, setStudentProfile] = useState<Student | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [firestore, setFirestore] = useState<Firestore | null>(null);
  const [firebaseLoading, setFirebaseLoading] = useState(true);
  
  const { toast } = useToast();

  useEffect(() => {
    const { firestore: fs, auth: au } = initializeFirebase();
    setFirestore(fs);

    // This sets the session persistence type. By doing this once when the app loads,
    // we ensure that Firebase knows to keep the user signed in across browser sessions.
    setPersistence(au, browserLocalPersistence)
      .then(() => {
        // After persistence is set, we can safely set up the auth state listener.
        // This avoids race conditions and internal Firebase errors.
        setAuth(au);
        const unsubscribe = onAuthStateChanged(au, async (user) => {
          if (user) {
            setAuthUser(user);
            const studentDocRef = doc(fs, "students", user.uid);
            const studentDoc = await getDoc(studentDocRef);

            if (studentDoc.exists()) {
              const profile = studentDoc.data() as Student;
              setStudentProfile(profile);
              setRoleState(profile.role);
            } else {
              setStudentProfile(null);
            }
          } else {
            setAuthUser(null);
            setStudentProfile(null);
            setRoleState("student");
          }
          setFirebaseLoading(false);
        });
        return () => unsubscribe();
      })
      .catch((error) => {
        console.error("Error setting auth persistence:", error);
        setFirebaseLoading(false);
      });
  }, []);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
  };
  
  const signInWithGoogle = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      console.log("Attempting Google Sign-In...");
      await signInWithPopup(auth, provider);
      console.log("Google Sign-In Successful.");
    } catch (error: any) {
      console.error("Google Sign-In Failed:", error);
      toast({ variant: "destructive", title: "Google Sign-In Failed", description: error.message });
    }
  };

  const signInWithGithub = async () => {
    if (!auth) return;
    const provider = new GithubAuthProvider();
    try {
      console.log("Attempting GitHub Sign-In...");
      await signInWithPopup(auth, provider);
      console.log("GitHub Sign-In Successful.");
    } catch (error: any) {
      console.error("GitHub Sign-In Failed:", error);
      toast({ variant: "destructive", title: "GitHub Sign-In Failed", description: error.message });
    }
  };

  const emailLogin = async (email: string, password: string) => {
    if (!auth) return;
    await signInWithEmailAndPassword(auth, email, password);
  }

  const logout = async () => {
    if (!auth) return;
    console.log("Logging out...");
    await auth.signOut();
    console.log("Logout successful.");
  }
  
  const loading = firebaseLoading;

  return (
    <AppContext.Provider value={{
        role,
        setRole,
        user: studentProfile || defaultStudent,
        authUser,
        studentProfile,
        setStudentProfile,
        loading,
        firestore,
        signInWithGoogle,
        signInWithGithub,
        emailLogin,
        logout
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
