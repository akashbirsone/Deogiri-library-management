
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
import { getFirestore, doc, getDoc, Firestore, setDoc, serverTimestamp } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";
import { Role, Student, Book, BorrowHistoryItem, User } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { books as initialBooks } from "@/lib/data";
import { add, format, formatISO, differenceInDays } from "date-fns";
import { useRouter } from "next/navigation";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  authUser: FirebaseAuthUser | null;
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

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<FirebaseAuthUser | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [firestore, setFirestore] = useState<Firestore | null>(null);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const router = useRouter();
  
  const { toast } = useToast();

  useEffect(() => {
    const { firestore: fs, auth: au } = initializeFirebase();
    setFirestore(fs);
    setAuth(au);

    setPersistence(au, browserLocalPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(au, async (fbUser) => {
          setLoading(true);
          if (fbUser) {
            setAuthUser(fbUser);
            const userDocRef = doc(fs, "users", fbUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              setUser(userDoc.data() as User);
            } else {
              // This is a new user (likely via social login). Create a default student profile.
              const newUser: User = {
                uid: fbUser.uid,
                name: fbUser.displayName || "New User",
                email: fbUser.email,
                role: "student",
                avatar: fbUser.photoURL || `https://i.pravatar.cc/150?u=${fbUser.uid}`,
              };
              await setDoc(userDocRef, newUser)
              .catch(async (serverError) => {
                const permissionError = new FirestorePermissionError({
                  path: userDocRef.path,
                  operation: 'create',
                  requestResourceData: newUser,
                });
                errorEmitter.emit('permission-error', permissionError);
              });
              setUser(newUser);
            }
          } else {
            setAuthUser(null);
            setUser(null);
            router.push('/');
          }
          setLoading(false);
        });
        return () => unsubscribe();
      })
      .catch((error) => {
        console.error("Error setting auth persistence:", error);
        toast({ variant: "destructive", title: "Authentication Error", description: "Could not set session persistence." });
        setLoading(false);
      });
  }, [toast, router]);

  
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
    if (!auth) throw new Error("Firebase Auth not initialized");
    await signInWithEmailAndPassword(auth, email, password);
  }

  const logout = async () => {
    if (!auth) return;
    try {
      await auth.signOut();
      setAuthUser(null);
      setUser(null);
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
    } catch(error: any) {
       console.error("Logout failed:", error);
       toast({ variant: "destructive", title: "Logout Failed", description: error.message });
    }
  }
  
  const borrowBook = async (bookId: string) => {
    if (!user || user.role !== 'student' || !firestore) {
      toast({
        variant: "destructive",
        title: "Action Not Allowed",
        description: "Only students can borrow books.",
      });
      return;
    }
    const studentProfile = user as Student;

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

    const updatedHistory = [...(studentProfile.borrowHistory || []), newBorrowItem];
    const updatedProfile = { ...studentProfile, borrowHistory: updatedHistory };

    const userDocRef = doc(firestore, "users", studentProfile.uid);
    setDoc(userDocRef, { borrowHistory: updatedHistory }, { merge: true })
      .then(() => {
        const updatedBooks = books.map(b =>
          b.id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b
        );
        setBooks(updatedBooks);
        setUser(updatedProfile);
  
        toast({
          title: "Book Borrowed!",
          description: `${bookToBorrow.title} has been added to your books. Due date: ${format(dueDate, "PPP")}.`,
        });
      })
      .catch(async (error) => {
         console.error("Error borrowing book:", error);
         const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'update',
            requestResourceData: { borrowHistory: updatedHistory },
          });
          errorEmitter.emit('permission-error', permissionError);

         toast({
             variant: "destructive",
             title: "Uh oh! Something went wrong.",
             description: "Could not borrow the book. Please try again.",
         });
      });
  };

  const returnBook = async (bookId: string) => {
    if (!user || user.role !== 'student' || !firestore) return;
    const studentProfile = user as Student;

    const bookToReturn = books.find(b => b.id === bookId);
    if (!bookToReturn) return;

    let fine = 0;
    const today = new Date();
    
    const updatedHistory = (studentProfile.borrowHistory || []).map(item => {
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
    
    const userDocRef = doc(firestore, "users", studentProfile.uid);
    setDoc(userDocRef, { borrowHistory: updatedHistory, fines: totalFines }, { merge: true })
      .then(() => {
        const updatedBooks = books.map(b => 
            b.id === bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b
        );
        setBooks(updatedBooks);
        setUser(updatedProfile);
        
        toast({
            title: `Book "${bookToReturn.title}" Returned`,
            description: fine > 0 ? `A fine of ₹${fine} has been added to your account.` : 'Thank you for returning the book on time!',
        });
      })
      .catch(async (error) => {
        console.error("Error returning book:", error);
        const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'update',
            requestResourceData: { borrowHistory: updatedHistory, fines: totalFines },
        });
        errorEmitter.emit('permission-error', permissionError);

        toast({
            variant: "destructive",
            title: "Return Failed",
            description: "Could not process the book return. Please try again."
        });
    });
  };
  

  return (
    <AppContext.Provider value={{
        user,
        setUser,
        authUser,
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
