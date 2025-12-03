
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
  sendPasswordResetEmail,
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
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  borrowBook: (bookId: string) => Promise<void>;
  returnBook: (bookId: string, studentId?: string) => Promise<void>;
  addBook: (path: string, book: Omit<Book, 'id' | 'path'>) => Promise<void>;
  updateBook: (path: string, book: Partial<Book>) => Promise<void>;
  deleteBook: (path: string) => Promise<void>;
  restoreBook: (path: string, book: Book) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  seedDatabase: (deptId: string, courseId: string, semId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<FirebaseAuthUser | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [firestore, setFirestore] = useState<Firestore | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
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
          setAuthLoading(true);
          if (fbUser) {
            setAuthUser(fbUser);
            const userDocRef = doc(fs, "users", fbUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              const userData = userDoc.data() as User;
              setUser({ ...userData, uid: fbUser.uid } as User);
              updateDoc(userDocRef, { lastLogin: serverTimestamp() }).catch(e => console.error("Failed to update last login", e));
            } else {
              const isAdmin = fbUser.email === "deogiri_admin@college.com";
              const newUserRole: Role = isAdmin ? "admin" : "student";
              
              const newUser: Omit<User, 'uid'> & { createdAt: any, lastLogin: any } = {
                name: fbUser.displayName || fbUser.email?.split('@')[0] || "New User",
                email: fbUser.email || "",
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
          setAuthLoading(false);
        });
        return () => unsubscribe();
      })
      .catch((error) => {
        console.error("Error setting auth persistence:", error);
        toast({ variant: "destructive", title: "Authentication Error", description: "Could not set session persistence." });
        setAuthLoading(false);
      });
  }, [toast, router]);

    useEffect(() => {
        if (!firestore || !user) {
            return;
        }

        let unsubUsers: () => void = () => {};
        let unsubBooks: () => void = () => {};

        if (user.role === 'admin' || user.role === 'librarian') {
            const usersCollection = collection(firestore, 'users');
            unsubUsers = onSnapshot(usersCollection, (snapshot) => {
                const usersData = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as User));
                setUsers(usersData);
            }, (error) => {
                const permissionError = new FirestorePermissionError({ path: 'users', operation: 'list' });
                errorEmitter.emit('permission-error', permissionError);
            });
        } else {
             const userDocRef = doc(firestore, 'users', user.uid);
             unsubUsers = onSnapshot(userDocRef, (doc) => {
                if (doc.exists()) {
                    setUsers([{ ...doc.data(), uid: doc.id } as User]);
                }
             });
        }
        
        const booksQuery = query(collectionGroup(firestore, 'books'));
        unsubBooks = onSnapshot(booksQuery, (snapshot) => {
            const booksData = snapshot.docs.map(doc => ({ id: doc.id, path: doc.ref.path, ...doc.data() } as Book));
            setBooks(booksData);
        }, (error) => {
            const permissionError = new FirestorePermissionError({ path: '/books (collectionGroup)', operation: 'list' });
            errorEmitter.emit('permission-error', permissionError);
            setBooks([]);
        });


        return () => {
            unsubUsers();
            unsubBooks();
        };
    }, [firestore, user]);


  const signInWithGoogle = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        toast({
            variant: "destructive",
            title: "Email already in use.",
            description: "An account with this email already exists. Please sign in with the method you originally used.",
        });
      } else if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
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
      if (error.code === 'auth/account-exists-with-different-credential') {
        toast({
            variant: "destructive",
            title: "Email already in use.",
            description: "An account with this email already exists. Please sign in with the method you originally used.",
        });
      } else if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
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

  const sendPasswordReset = async (email: string) => {
    if (!auth) throw new Error("Firebase Auth not initialized");
    await sendPasswordResetEmail(auth, email);
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
  
 const borrowBook = async (bookId: string) => {
    if (!user || user.role !== 'student' || !firestore) {
      toast({ variant: "destructive", title: "Action Not Allowed", description: "Only students can borrow books." });
      return;
    }

    const studentProfile = user as Student;

    const currentlyBorrowedCount = (studentProfile.borrowHistory || []).filter(item => !item.returnDate).length;
    if (currentlyBorrowedCount >= 3) {
      toast({
        variant: "destructive",
        title: "Borrowing Limit Reached",
        description: "Borrowing limit of 3 books reached. Please return a book to borrow another."
      });
      return;
    }

    const bookToBorrow = books.find(b => b.id === bookId);
    
    if (!bookToBorrow) {
        toast({ variant: "destructive", title: "Error", description: "Book not found." });
        return;
    }

    if (!bookToBorrow.isAvailable) {
        toast({ variant: "destructive", title: "Unavailable", description: "This book is currently unavailable." });
        return;
    }
    const bookDocRef = doc(firestore, bookToBorrow.path);

    const today = new Date();
    const dueDate = add(today, { days: 15 });

    const newBorrowItem: BorrowHistoryItem = {
        bookId: bookToBorrow.id,
        bookPath: bookToBorrow.path,
        borrowDate: formatISO(today),
        dueDate: formatISO(dueDate),
    };

    const updatedHistory = [...(studentProfile.borrowHistory || []), newBorrowItem];

    const batch = writeBatch(firestore);
    const userDocRef = doc(firestore, "users", studentProfile.uid);
    
    batch.update(bookDocRef, { isAvailable: false });
    batch.update(userDocRef, { borrowHistory: updatedHistory });

    await batch.commit().catch(async (error: any) => {
        const permissionError = new FirestorePermissionError({
            path: bookDocRef.path,
            operation: 'update',
            requestResourceData: { isAvailable: false },
          });
          errorEmitter.emit('permission-error', permissionError);
    });
    
    toast({
        title: "Book Borrowed!",
        description: `${bookToBorrow.title} has been issued. Due date: ${format(dueDate, "PPP")}.`,
    });
};


const returnBook = async (bookId: string, studentId?: string) => {
    if (!user || !firestore) return;

    // If studentId is not provided, it means the user is returning their own book.
    const targetStudentId = studentId || user.uid;

    const studentToUpdate = users.find(u => u.uid === targetStudentId && u.role === 'student') as Student | undefined;

    if (!studentToUpdate) {
        toast({ variant: "destructive", title: "Error", description: "Student not found." });
        return;
    }

    const itemToReturn = (studentToUpdate.borrowHistory || []).find(item => item.bookId === bookId && !item.returnDate);

    if (!itemToReturn) {
        toast({ variant: "destructive", title: "Error", description: "Cannot find this book in the student's borrowed list." });
        return;
    }
    
    const bookToReturn = books.find(b => b.id === bookId);
    if (!bookToReturn) {
        toast({ variant: "destructive", title: "Error", description: "Book details not found." });
        return;
    }

    const bookDocRef = doc(firestore, bookToReturn.path);
    
    try {
        let fine = 0;
        const today = new Date();
        const dueDate = new Date(itemToReturn.dueDate);

        if (today > dueDate) {
            const daysOverdue = differenceInDays(today, dueDate);
            fine = daysOverdue * 10;
        }

        const updatedHistory = (studentToUpdate.borrowHistory || []).map(item =>
            (item.bookId === bookId && !item.returnDate)
                ? { ...item, returnDate: formatISO(today), fine: fine }
                : item
        );

        const totalFines = (studentToUpdate.fines || 0) + fine;

        const batch = writeBatch(firestore);
        const userDocRef = doc(firestore, "users", targetStudentId);

        batch.update(bookDocRef, { isAvailable: true });
        batch.update(userDocRef, { borrowHistory: updatedHistory, fines: totalFines });

        await batch.commit();
        
        toast({
          title: `Book "${bookToReturn.title}" Returned`,
          description: `By ${studentToUpdate.name}. ${fine > 0 ? `A fine of ₹${fine} has been added.` : 'Returned on time!'}`,
        });

    } catch (error: any) {
        const permissionError = new FirestorePermissionError({
            path: bookDocRef.path,
            operation: 'update',
            requestResourceData: { isAvailable: true },
        });
        errorEmitter.emit('permission-error', permissionError);
    }
};

  
    const addBook = async (path: string, book: Omit<Book, 'id' | 'path'>) => {
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

    const restoreBook = async (path: string, book: Book) => {
        if (!firestore) return;
        const bookDocRef = doc(firestore, path);
        // We remove 'id' and 'path' from the book object before saving
        const { id, path: bookPath, ...bookData } = book;
        setDoc(bookDocRef, bookData).catch(async (error) => {
            const permissionError = new FirestorePermissionError({ path: path, operation: 'create', requestResourceData: bookData });
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

    const seedDatabase = useCallback(async (deptId: string, courseId: string, semId: string) => {
        if (!firestore || !user || (user.role !== 'admin' && user.role !== 'librarian')) return;

        const department = departments.find(d => d.id === deptId);
        const course = department?.courses.find(c => c.id === courseId);
        const semester = course?.semesters.find(s => s.id === semId);

        if (!semester) return;

        const batch = writeBatch(firestore);
        let booksAddedCount = 0;

        for (const subject of semester.subjects) {
            const booksPath = `departments/${deptId}/courses/${courseId}/semesters/${semId}/subjects/${subject.name}/books`;
            const booksCollectionRef = collection(firestore, booksPath);
            
            const q = query(booksCollectionRef, limit(1));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                const newBook: Omit<Book, 'id' | 'path'> = {
                    title: subject.name,
                    author: "Auto-Generated",
                    subject: subject.name,
                    isAvailable: true,
                    coverImage: subject.coverImage || `https://picsum.photos/seed/${encodeURIComponent(subject.name)}/300/450`,
                    coverImageHint: subject.name,
                    addedBy: "system-seed",
                    addedDate: new Date().toISOString(),
                    department: deptId,
                    course: courseId,
                    semester: semId,
                };
                const newBookRef = doc(booksCollectionRef);
                batch.set(newBookRef, newBook);
                booksAddedCount++;
            }
        }

        if (booksAddedCount > 0) {
            try {
                await batch.commit();
                toast({
                    title: "Database Seeded",
                    description: `${booksAddedCount} dummy book(s) have been added.`,
                });
            } catch (error) {
                console.error("Error seeding database:", error);
                toast({
                    variant: "destructive",
                    title: "Seeding Failed",
                    description: "Could not add dummy books to the database.",
                });
            }
        }
    }, [firestore, user, toast]);

  return (
    <AppContext.Provider value={{
        user,
        setUser,
        authUser,
        loading: authLoading,
        firestore,
        books,
        users,
        signInWithGoogle,
        signInWithGithub,
        emailLogin,
        sendPasswordReset,
        logout,
        borrowBook,
        returnBook,
        addBook,
        updateBook,
        deleteBook,
        restoreBook,
        updateUser,
        deleteUser,
        seedDatabase,
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

    