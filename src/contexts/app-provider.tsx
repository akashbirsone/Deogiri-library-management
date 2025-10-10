
"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
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
import { getFirestore, doc, getDoc, Firestore, setDoc, serverTimestamp, collection, onSnapshot, addDoc, deleteDoc, updateDoc, writeBatch, query, getDocs, collectionGroup, where, limit } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";
import { Role, Student, Book, BorrowHistoryItem, User } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { add, format, formatISO, differenceInDays } from "date-fns";
import { useRouter } from "next/navigation";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { departments } from "@/lib/departments";

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
  borrowBook: (bookPath: string) => Promise<void>;
  returnBook: (bookId: string) => Promise<void>;
  addBook: (path: string, book: Omit<Book, 'id'>) => Promise<void>;
  updateBook: (path: string, book: Partial<Book>) => Promise<void>;
  deleteBook: (path: string) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  seedDatabase: () => Promise<void>;
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
              updateDoc(userDocRef, { lastLogin: serverTimestamp() }).catch(e => console.error("Failed to update last login", e));
            } else {
              const isAdmin = fbUser.email === "deogiri_admin@college.com";
              const newUserRole: Role = isAdmin ? "admin" : "student";
              
              const newUser: Omit<User, 'uid'> & { createdAt: any, lastLogin: any } = {
                name: fbUser.displayName || fbUser.email?.split('@')[0] || "New User",
                email: fbUser.email,
                role: newUserRole,
                avatar: fbUser.photoURL || `https://i.pravatar.cc/150?u=${fbUser.uid}`,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
              };

              if (newUserRole === 'student') {
                (newUser as Partial<Student>).borrowHistory = [];
                (newUser as Partial<Student>).fines = 0;
              }

              setDoc(userDocRef, newUser)
                .then(() => {
                  setUser({ uid: fbUser.uid, ...newUser } as User);
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
            setUsers([]);
            setBooks([]);
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
    if (!firestore) return;
    
    let unsubUsers = () => {};

    if (user && (user.role === 'admin' || user.role === 'librarian')) {
        const usersCollection = collection(firestore, 'users');
        unsubUsers = onSnapshot(usersCollection, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as User));
            setUsers(usersData);
        }, async (error) => {
            const permissionError = new FirestorePermissionError({ path: 'users', operation: 'list' });
            errorEmitter.emit('permission-error', permissionError);
        });
    } else if (user) {
        // For students, just load their own user object into the users array
        const userDocRef = doc(firestore, 'users', user.uid);
        unsubUsers = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
                setUsers([{ ...doc.data(), uid: doc.id } as User]);
            }
        });
    } else {
        setUsers([]); 
    }

    return () => {
        unsubUsers();
    };
}, [firestore, user]);

  const signInWithGoogle = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
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
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        console.error("GitHub Sign-In Failed:", error);
        toast({ variant: "destructive", title: "GitHub Sign-In Failed", description: error.message });
      }
    }
  };

  const emailLogin = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase Auth not initialized");
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
        throw error;
    }
  }

  const logout = async () => {
    if (!auth) return;
    try {
      await auth.signOut();
      setAuthUser(null);
      setUser(null);
      setUsers([]);
      setBooks([]);
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
    } catch(error: any) {
       console.error("Logout failed:", error);
       toast({ variant: "destructive", title: "Logout Failed", description: error.message });
    }
  }
  
 const borrowBook = async (bookPath: string) => {
    if (!user || user.role !== 'student' || !firestore) {
      toast({ variant: "destructive", title: "Action Not Allowed", description: "Only students can borrow books." });
      return;
    }

    const studentProfile = user as Student;
    const bookDocRef = doc(firestore, bookPath);
    
    try {
        const bookDoc = await getDoc(bookDocRef);
        if (!bookDoc.exists()) {
            toast({ variant: "destructive", title: "Error", description: "Book not found." });
            return;
        }

        const bookToBorrow = { id: bookDoc.id, ...bookDoc.data() } as Book;

        if (!bookToBorrow.isAvailable) {
            toast({ variant: "destructive", title: "Unavailable", description: "This book is currently unavailable." });
            return;
        }

        const today = new Date();
        const dueDate = add(today, { days: 14 });

        const newBorrowItem: BorrowHistoryItem = {
            bookId: bookToBorrow.id,
            bookPath: bookPath,
            borrowDate: formatISO(today),
            dueDate: formatISO(dueDate),
        };

        const updatedHistory = [...(studentProfile.borrowHistory || []), newBorrowItem];

        const batch = writeBatch(firestore);
        const userDocRef = doc(firestore, "users", studentProfile.uid);
        
        batch.update(bookDocRef, { isAvailable: false });
        batch.update(userDocRef, { borrowHistory: updatedHistory });

        await batch.commit();

        setUser({ ...studentProfile, borrowHistory: updatedHistory });
        
        toast({
            title: "Book Borrowed!",
            description: `${bookToBorrow.title} has been issued. Due date: ${format(dueDate, "PPP")}.`,
        });

    } catch (error: any) {
        const permissionError = new FirestorePermissionError({
            path: bookPath,
            operation: 'update',
            requestResourceData: { isAvailable: false },
          });
          errorEmitter.emit('permission-error', permissionError);
    }
};


const returnBook = async (bookId: string) => {
    if (!user || user.role !== 'student' || !firestore) return;

    const studentProfile = user as Student;
    const itemToReturn = (studentProfile.borrowHistory || []).find(item => item.bookId === bookId && !item.returnDate);

    if (!itemToReturn) {
        toast({ variant: "destructive", title: "Error", description: "Cannot find this book in your borrowed list." });
        return;
    }

    const bookDocRef = doc(firestore, itemToReturn.bookPath);
    
    try {
        let fine = 0;
        const today = new Date();
        const dueDate = new Date(itemToReturn.dueDate);
        const daysOverdue = differenceInDays(today, dueDate);

        if (daysOverdue > 0) {
            fine = daysOverdue * 10; // 10 INR per day
        }

        const updatedHistory = (studentProfile.borrowHistory || []).map(item =>
            (item.bookId === bookId && !item.returnDate)
                ? { ...item, returnDate: formatISO(today), fine: fine }
                : item
        );

        const totalFines = (studentProfile.fines || 0) + fine;

        const batch = writeBatch(firestore);
        const userDocRef = doc(firestore, "users", studentProfile.uid);

        batch.update(bookDocRef, { isAvailable: true });
        batch.update(userDocRef, { borrowHistory: updatedHistory, fines: totalFines });

        await batch.commit();

        setUser({ ...studentProfile, borrowHistory: updatedHistory, fines: totalFines });
        const bookDoc = await getDoc(bookDocRef);
        
        toast({
            title: `Book "${bookDoc.data()?.title}" Returned`,
            description: fine > 0 ? `A fine of ₹${fine} has been added.` : 'Returned on time!',
        });

    } catch (error: any) {
        const permissionError = new FirestorePermissionError({
            path: itemToReturn.bookPath,
            operation: 'update',
            requestResourceData: { isAvailable: true },
        });
        errorEmitter.emit('permission-error', permissionError);
    }
};

  
    const addBook = async (path: string, book: Omit<Book, 'id'>) => {
        if (!firestore) return;
        const booksCollection = collection(firestore, path);
        addDoc(booksCollection, book).catch(async (error) => {
            const permissionError = new FirestorePermissionError({ path: path, operation: 'create', requestResourceData: book });
            errorEmitter.emit('permission-error', permissionError);
        });
    };

    const updateBook = async (path: string, book: Partial<Book>) => {
        if (!firestore) return;
        const bookDoc = doc(firestore, path);
        updateDoc(bookDoc, book).catch(async (error) => {
            const permissionError = new FirestorePermissionError({ path: path, operation: 'update', requestResourceData: book });
            errorEmitter.emit('permission-error', permissionError);
        });
    };

    const deleteBook = async (path: string) => {
        if (!firestore) return;
        const bookDoc = doc(firestore, path);
        deleteDoc(bookDoc).catch(async (error) => {
            const permissionError = new FirestorePermissionError({ path: path, operation: 'delete' });
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

    useEffect(() => {
        if (!firestore) {
            setBooks([]);
            return;
        }
        
        setLoading(true);

        const booksQuery = query(collectionGroup(firestore, 'books'));

        const unsub = onSnapshot(booksQuery, (snapshot) => {
            const booksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book));
            setBooks(booksData);
            setLoading(false);
        }, (error) => {
             const permissionError = new FirestorePermissionError({ path: '/books (collectionGroup)', operation: 'list' });
             errorEmitter.emit('permission-error', permissionError);
             setLoading(false);
             setBooks([]);
        });

        return () => unsub();
    }, [firestore]);

    const seedDatabase = async () => {
      if (!firestore || !user || user.role !== 'admin') {
          toast({ variant: 'destructive', title: 'Permission Denied' });
          return;
      }
  
      let booksUpdatedCount = 0;
      let booksAddedCount = 0;
      const batch = writeBatch(firestore);
  
      for (const dept of departments) {
          for (const course of dept.courses) {
              for (const semester of course.semesters) {
                  for (const subject of semester.subjects) {
                      const bookCollectionPath = `departments/${dept.id}/courses/${course.id}/semesters/${semester.id}/subjects/${subject.name}/books`;
                      
                      try {
                          const existingBookQuery = query(collection(firestore, bookCollectionPath), where("subject", "==", subject.name));
                          const existingBookSnapshot = await getDocs(existingBookQuery);
  
                          if (existingBookSnapshot.empty) {
                              const newBookRef = doc(collection(firestore, bookCollectionPath));
                              const newBookData: Omit<Book, 'id'> = {
                                  title: subject.name,
                                  author: "Faculty of " + dept.name,
                                  subject: subject.name,
                                  isAvailable: true,
                                  coverImage: subject.coverImage || "",
                                  coverImageHint: subject.name.split(" ").slice(0, 2).join(" "),
                                  addedBy: user.email || 'admin',
                                  addedDate: new Date().toISOString(),
                                  department: dept.id,
                                  course: course.id,
                                  semester: semester.id,
                              };
                              batch.set(newBookRef, newBookData);
                              booksAddedCount++;
                          } else {
                              existingBookSnapshot.docs.forEach(bookDoc => {
                                  if (bookDoc.data().coverImage !== subject.coverImage) {
                                      batch.update(bookDoc.ref, { coverImage: subject.coverImage });
                                      booksUpdatedCount++;
                                  }
                              });
                          }
                      } catch (e: any) {
                          const permissionError = new FirestorePermissionError({
                              path: bookCollectionPath,
                              operation: 'list', 
                          });
                          errorEmitter.emit('permission-error', permissionError);
                          toast({ variant: "destructive", title: "Seeding Error", description: "Could not access book data to perform update." });
                          return; 
                      }
                  }
              }
          }
      }
  
      if (booksAddedCount === 0 && booksUpdatedCount === 0) {
          toast({
              title: "Database is Already Up-to-date",
              description: "No new book placeholders or cover image updates were needed.",
          });
          return;
      }
  
      try {
          await batch.commit();
          toast({
              title: "Database Seeding Complete",
              description: `${booksAddedCount} new book(s) added and ${booksUpdatedCount} cover image(s) updated.`,
          });
      } catch (e: any) {
          const permissionError = new FirestorePermissionError({
              path: '/departments',
              operation: 'create',
              requestResourceData: { info: 'Batch write for seeding/updating database.' }
          });
          errorEmitter.emit('permission-error', permissionError);
          toast({ variant: "destructive", title: "Seeding Failed", description: "An error occurred while committing the changes." });
      }
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
        deleteUser,
        seedDatabase
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

    