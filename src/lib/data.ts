
import type { Book, User, Student } from "@/types";

// This file is now used as a fallback or for initial structure, 
// but the primary data source is Firestore.
// The user data here ensures default users are available for demonstration.

export const users: User[] = [
  {
    uid: "Dzl57IC8VjVuwXwQwgNgHxssz3u2",
    name: "Deogiri Admin",
    email: "deogiri_admin@college.com",
    role: "admin",
    avatar: "https://i.pravatar.cc/150?u=admin",
  },
  {
    uid: "librarian1-user-id",
    name: "Librarian 1",
    email: "librarian1@yourapp.com",
    role: "librarian",
    avatar: "https://i.pravatar.cc/150?u=librarian1",
  },
];


export const books: Book[] = []; // This will be populated from Firestore

    