
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
import { getFirestore, doc, getDoc, Firestore, setDoc, serverTimestamp, collection, onSnapshot, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";
import { Role, Student, Book, BorrowHistoryItem, User } from "@/types";
import { useToast } from "@/hooks/use-toast";
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
  users: User[];
  
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  emailLogin: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  borrowBook: (bookId: string) => Promise<void>;
  returnBook: (bookId: string) => Promise<void>;
  addBook: (book: Omit<Book, 'id'>) => Promise<void>;
  updateBook: (book: Book) => Promise<void>;
  deleteBook: (bookId: string) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<FirebaseAuthUser | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [firestore, setFirestore] = useState<Firestore | null>(null);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
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
              const userData = userDoc.data() as User;
              setUser(userData);
              // Update last login timestamp for existing user
              updateDoc(userDocRef, { lastLogin: serverTimestamp() }).catch(e => console.error("Failed to update last login", e));

            } else {
              // This is a new user, create their profile
              const isAdmin = fbUser.email === "deogiri_admin@college.com";
              const newUserRole = isAdmin ? "admin" : "student";
              
              const newUser: Omit<User, 'uid'> & { createdAt: any, lastLogin: any } = {
                name: isAdmin ? "Deogiri Admin" : (fbUser.displayName || "New User"),
                email: fbUser.email,
                role: newUserRole,
                avatar: fbUser.photoURL || `https://i.pravatar.cc/150?u=${fbUser.uid}`,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
              };

              setDoc(userDocRef, newUser)
                .then(() => {
                  setUser({ uid: fbUser.uid, ...newUser });
                })
                .catch(async (serverError) => {
                  const permissionError = new FirestorePermissionError({
                    path: userDocRef.path,
                    operation: 'create',
                    requestResourceData: newUser,
                  });
                  errorEmitter.emit('permission-error', permissionError);
                });
            }
          } else {
            setAuthUser(null);
            setUser(null);
            setUsers([]); // Clear users on logout
            setBooks([]); // Clear books on logout
             // When logging out, ensure we are on the home page.
            if (window.location.pathname !== '/') {
              router.push('/');
            }
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

  useEffect(() => {
    if (!firestore || !user) {
        setBooks([]);
        setUsers([]);
        return;
    };
    
    // All users can read books
    const booksCollection = collection(firestore, 'books');
    const unsubBooks = onSnapshot(booksCollection, (snapshot) => {
        const booksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book));
        setBooks(booksData);
    }, async (error) => {
        const permissionError = new FirestorePermissionError({ path: 'books', operation: 'list' });
        errorEmitter.emit('permission-error', permissionError);
    });

    let unsubUsers = () => {};
    // Only admins and librarians can read all users
    if (user.role === 'admin' || user.role === 'librarian') {
        const usersCollection = collection(firestore, 'users');
        unsubUsers = onSnapshot(usersCollection, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as User));
            setUsers(usersData);
        }, async (error) => {
            const permissionError = new FirestorePermissionError({ path: 'users', operation: 'list' });
            errorEmitter.emit('permission-error', permissionError);
        });
    }


    return () => {
        unsubBooks();
        unsubUsers();
    };
  }, [firestore, user]);
  
  const signInWithGoogle = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        console.error("Google Sign-In Failed:", error);
        toast({ variant: "destructive", title: "Google Sign-In Failed", description: error.message });
      }
    }
  };

  const signInWithGithub = async () => {
    if (!auth) return;
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        console.error("GitHub Sign-In Failed:", error);
        toast({ variant: "destructive", title: "GitHub Sign-In Failed", description: error.message });
      }
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
      setUsers([]);
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

    const userDocRef = doc(firestore, "users", studentProfile.uid);
    const bookDocRef = doc(firestore, "books", bookId);
    const bookUpdateData = { availableCopies: bookToBorrow.totalCopies - 1 };
    const userUpdateData = { borrowHistory: updatedHistory };

    setDoc(userDocRef, userUpdateData, { merge: true })
      .then(() => {
        return setDoc(bookDocRef, bookUpdateData, { merge: true });
      })
      .then(() => {
        setUser({ ...studentProfile, borrowHistory: updatedHistory });
        toast({
          title: "Book Borrowed!",
          description: `${bookToBorrow.title} has been added to your books. Due date: ${format(dueDate, "PPP")}.`,
        });
      })
      .catch(async (error) => {
          const isUserDocError = error.message.includes("users");
          const permissionError = new FirestorePermissionError({
            path: isUserDocError ? userDocRef.path : bookDocRef.path,
            operation: 'update',
            requestResourceData: isUserDocError ? userUpdateData : bookUpdateData,
          });
          errorEmitter.emit('permission-error', permissionError);
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
    
    const userDocRef = doc(firestore, "users", studentProfile.uid);
    const updateData = { borrowHistory: updatedHistory, fines: totalFines };
    const bookDocRef = doc(firestore, "books", bookId);
    const bookUpdateData = { availableCopies: bookToReturn.availableCopies + 1 };

    setDoc(userDocRef, updateData, { merge: true })
      .then(() => {
        return setDoc(bookDocRef, bookUpdateData, { merge: true });
      })
      .then(() => {
        setUser({ ...studentProfile, borrowHistory: updatedHistory, fines: totalFines });
        toast({
            title: `Book "${bookToReturn.title}" Returned`,
            description: fine > 0 ? `A fine of ₹${fine} has been added to your account.` : 'Thank you for returning the book on time!',
        });
      })
      .catch(async (error) => {
        const isUserDocError = error.message.includes("users");
        const permissionError = new FirestorePermissionError({
            path: isUserDocError ? userDocRef.path : bookDocRef.path,
            operation: 'update',
            requestResourceData: isUserDocError ? updateData : bookUpdateData,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
  };
  
    const addBook = async (book: Omit<Book, 'id'>) => {
        if (!firestore) return;
        const booksCollection = collection(firestore, 'books');
        addDoc(booksCollection, book).catch(async (error) => {
            const permissionError = new FirestorePermissionError({ path: 'books', operation: 'create', requestResourceData: book });
            errorEmitter.emit('permission-error', permissionError);
        });
    };

    const updateBook = async (book: Book) => {
        if (!firestore) return;
        const { id, ...bookData } = book;
        const bookDoc = doc(firestore, 'books', id);
        setDoc(bookDoc, bookData, { merge: true }).catch(async (error) => {
            const permissionError = new FirestorePermissionError({ path: bookDoc.path, operation: 'update', requestResourceData: bookData });
            errorEmitter.emit('permission-error', permissionError);
        });
    };

    const deleteBook = async (bookId: string) => {
        if (!firestore) return;
        const bookDoc = doc(firestore, 'books', bookId);
        deleteDoc(bookDoc).catch(async (error) => {
            const permissionError = new FirestorePermissionError({ path: bookDoc.path, operation: 'delete' });
            errorEmitter.emit('permission-error', permissionError);
        });
    };

    const updateUser = async (userToUpdate: User) => {
        if (!firestore) return;
        const userDoc = doc(firestore, 'users', userToUpdate.uid);
        setDoc(userDoc, userToUpdate, { merge: true }).catch(async (error) => {
            const permissionError = new FirestorePermissionError({ path: userDoc.path, operation: 'update', requestResourceData: userToUpdate });
            errorEmitter.emit('permission-error', permissionError);
        });
    };

    const deleteUser = async (userId: string) => {
        if (!firestore) return;
        const userDoc = doc(firestore, 'users', userId);
        deleteDoc(userDoc).catch(async (error) => {
            const permissionError = new FirestorePermissionError({ path: userDoc.path, operation: 'delete' });
            errorEmitter.emit('permission-error', permissionError);
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
        users,
        signInWithGoogle,
        signInWithGithub,
        emailLogin,
        logout,
        borrowBook,
        returnBook,
        addBook,
        updateBook,
        deleteBook,
        updateUser,
        deleteUser
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
