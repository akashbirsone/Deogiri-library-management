
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
} from "firebase/auth";
import { getFirestore, doc, getDoc, Firestore } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";
import { Role, Student } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  user: Student; // This will now hold the full student profile from firestore
  authUser: FirebaseAuthUser | null;
  studentProfile: Student | null;
  setStudentProfile: (profile: Student | null) => void;
  loading: boolean;
  firestore: Firestore | null;
  
  // Auth methods
  signInWithGoogle: () => void;
  signInWithGithub: () => void;
  emailLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// A default student object for the initial state before a user is loaded
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
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const { app, firestore, auth } = initializeFirebase();

  useEffect(() => {
    if (!auth) {
        setLoading(false);
        return;
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setLoading(true);
        if (user) {
            setAuthUser(user);
            // User is signed in, now check for their profile in Firestore.
            const studentDocRef = doc(firestore, "students", user.uid);
            const studentDoc = await getDoc(studentDocRef);

            if (studentDoc.exists()) {
                const profile = studentDoc.data() as Student;
                setStudentProfile(profile);
                setRoleState(profile.role);
            } else {
                // User is authenticated, but no profile exists.
                // The UI will show the StudentInfoForm.
                setStudentProfile(null);
            }
        } else {
            // User is signed out.
            setAuthUser(null);
            setStudentProfile(null);
            setRoleState("student");
        }
        setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  const setRole = (newRole: Role) => {
    // This function can be used for demo/testing purposes
    // but the primary role should come from the student profile.
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

  return (
    <AppContext.Provider value={{
        role,
        setRole,
        user: studentProfile || defaultStudent, // Provide the detailed profile or a default
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
