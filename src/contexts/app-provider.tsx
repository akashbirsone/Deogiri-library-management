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
  const [authLoading, setAuthLoading] = useState(true);
  
  const { toast } = useToast();

  useEffect(() => {
    const { app, firestore: fs, auth: au } = initializeFirebase();
    setFirestore(fs);

    setPersistence(au, browserLocalPersistence)
        .then(() => {
            setAuth(au);
        })
        .catch((error) => {
            console.error("Error setting auth persistence:", error);
        })
        .finally(() => {
            setFirebaseLoading(false);
        });
  }, []);

  useEffect(() => {
    // FIX 1: Ensure auth and firestore are available before proceeding.
    if (firebaseLoading || !auth || !firestore) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setAuthLoading(true);
        if (user) {
            setAuthUser(user);
            // FIX 2: firestore is now definitely available due to the check above
            const studentDocRef = doc(firestore, "students", user.uid); 
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
        setAuthLoading(false);
    });

    // Dependencies must include firestore now, so auth state changes only trigger
    // if firestore is ready.
    return () => unsubscribe();
  }, [auth, firestore, firebaseLoading]); // <-- firestore added here

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
  };
  
  const signInWithGoogle = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
    } catch (error: any) {
        toast({ variant: "destructive", title: "Google Sign-In Failed", description: error.message });
    }
  };

  const signInWithGithub = async () => {
    if (!auth) return;
    const provider = new GithubAuthProvider();
    try {
        await signInWithPopup(auth, provider);
    } catch (error: any) {
        toast({ variant: "destructive", title: "GitHub Sign-In Failed", description: error.message });
    }
  };

  const emailLogin = async (email: string, password: string) => {
    if (!auth) return;
    await signInWithEmailAndPassword(auth, email, password);
  }

  const logout = async () => {
    if (!auth) return;
    await auth.signOut();
  }
  
  const loading = firebaseLoading || authLoading;

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
      {!loading && children}
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