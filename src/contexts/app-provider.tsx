
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
import { getFirestore, doc, getDoc, Firestore, setDoc } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";
import { Role, Student, Book, BorrowHistoryItem } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { books as initialBooks } from "@/lib/data";
import { add, format, formatISO } from "date-fns";

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  user: Student; 
  authUser: FirebaseAuthUser | null;
  studentProfile: Student | null;
  setStudentProfile: (profile: Student | null) => void;
  loading: boolean;
  firestore: Firestore | null;
  books: Book[];
  
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  emailLogin: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  borrowBook: (bookId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Default user object for when no one is logged in.
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
  const [books, setBooks] = useState<Book[]>(initialBooks);
  
  const { toast } = useToast();

  useEffect(() => {
    const { firestore: fs, auth: au } = initializeFirebase();
    setFirestore(fs);
    setAuth(au);

    // This effect should only run once to initialize Firebase and set up the listener.
    // It's crucial to set persistence *before* the onAuthStateChanged listener is attached
    // to prevent race conditions and ensure the session is persisted correctly.
    setPersistence(au, browserLocalPersistence)
      .then(() => {
        // After persistence is set, attach the auth state listener.
        const unsubscribe = onAuthStateChanged(au, async (user) => {
          if (user) {
            setAuthUser(user);
            // Fetch the user's profile from Firestore.
            const studentDocRef = doc(fs, "students", user.uid);
            const studentDoc = await getDoc(studentDocRef);

            if (studentDoc.exists()) {
              const profile = studentDoc.data() as Student;
              setStudentProfile(profile);
              setRoleState(profile.role);
            } else {
              // This case handles new sign-ups where a profile doesn't exist yet.
              setStudentProfile(null);
            }
          } else {
            // User is signed out.
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
        toast({ variant: "destructive", title: "Authentication Error", description: "Could not set session persistence." });
        setFirebaseLoading(false);
      });
  }, [toast]);

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
    try {
      await auth.signOut();
      setAuthUser(null);
      setStudentProfile(null);
      setRoleState('student');
      console.log("Logout successful.");
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
    } catch(error: any) {
       console.error("Logout failed:", error);
       toast({ variant: "destructive", title: "Logout Failed", description: error.message });
    }
  }
  
  const borrowBook = async (bookId: string) => {
    if (!studentProfile || !firestore) {
      toast({
        variant: "destructive",
        title: "Login Required",
        description: "You must be logged in to borrow a book.",
      });
      return;
    }

    const bookToBorrow = books.find(b => b.id === bookId);
    if (!bookToBorrow) {
      toast({ variant: "destructive", title: "Error", description: "Book not found." });
      return;
    }

    if (bookToBorrow.availableCopies < 1) {
      toast({ variant: "destructive", title: "Unavailable", description: "This book is currently unavailable." });
      return;
    }

    const today = new Date();
    const dueDate = add(today, { days: 14 });

    const newBorrowItem: BorrowHistoryItem = {
      bookId: bookId,
      borrowDate: formatISO(today),
      dueDate: formatISO(dueDate),
    };

    const updatedHistory = [...studentProfile.borrowHistory, newBorrowItem];
    const updatedProfile = { ...studentProfile, borrowHistory: updatedHistory };

    try {
      // Update book availability in local state
      const updatedBooks = books.map(b =>
        b.id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b
      );
      setBooks(updatedBooks);

      // Update student profile in local state
      setStudentProfile(updatedProfile);

      // Update student profile in Firestore
      const studentDocRef = doc(firestore, "students", studentProfile.id);
      await setDoc(studentDocRef, { borrowHistory: updatedHistory }, { merge: true });

      toast({
        title: "Book Borrowed!",
        description: `${bookToBorrow.title} has been added to your books. Due date: ${format(dueDate, "PPP")}.`,
      });

    } catch (error) {
       console.error("Error borrowing book:", error);
       toast({
           variant: "destructive",
           title: "Uh oh! Something went wrong.",
           description: "Could not borrow the book. Please try again.",
       });
       // Revert local state if firestore update fails
       setBooks(books);
       setStudentProfile(studentProfile);
    }
  };
  
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
        books,
        signInWithGoogle,
        signInWithGithub,
        emailLogin,
        logout,
        borrowBook
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
