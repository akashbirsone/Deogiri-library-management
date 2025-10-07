
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
import { add, format, formatISO, differenceInDays } from "date-fns";
import { useRouter } from "next/navigation";

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
  returnBook: (bookId: string) => Promise<void>;
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
  const router = useRouter();
  
  const { toast } = useToast();

  useEffect(() => {
    const { firestore: fs, auth: au } = initializeFirebase();
    setFirestore(fs);
    setAuth(au);

    setPersistence(au, browserLocalPersistence)
      .then(() => {
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
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Google Sign-In Failed:", error);
      toast({ variant: "destructive", title: "Google Sign-In Failed", description: error.message });
    }
  };

  const signInWithGithub = async () => {
    if (!auth) return;
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
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
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push('/');
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

  const returnBook = async (bookId: string) => {
    if (!studentProfile || !firestore) return;

    const bookToReturn = books.find(b => b.id === bookId);
    if (!bookToReturn) return;

    let fine = 0;
    const today = new Date();
    
    const updatedHistory = studentProfile.borrowHistory.map(item => {
        if (item.bookId === bookId && !item.returnDate) {
            const dueDate = new Date(item.dueDate);
            const daysOverdue = differenceInDays(today, dueDate);

            if (daysOverdue > 0) {
                fine = daysOverdue * 10; // 10 INR per day
            }
            return { ...item, returnDate: formatISO(today), fine: fine };
        }
        return item;
    });

    const totalFines = (studentProfile.fines || 0) + fine;
    const updatedProfile = { ...studentProfile, borrowHistory: updatedHistory, fines: totalFines };
    
    try {
        const updatedBooks = books.map(b => 
            b.id === bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b
        );
        setBooks(updatedBooks);
        setStudentProfile(updatedProfile);

        const studentDocRef = doc(firestore, "students", studentProfile.id);
        await setDoc(studentDocRef, updatedProfile, { merge: true });
        
        toast({
            title: `Book "${bookToReturn.title}" Returned`,
            description: fine > 0 ? `A fine of ₹${fine} has been added to your account.` : 'Thank you for returning the book on time!',
        });

    } catch (error) {
        console.error("Error returning book:", error);
        toast({
            variant: "destructive",
            title: "Return Failed",
            description: "Could not process the book return. Please try again."
        });
        // Revert local state
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
        borrowBook,
        returnBook,
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
