
export type Role = "admin" | "librarian" | "student";

export interface User {
  uid: string;
  name: string;
  email: string | null;
  role: Role;
  avatar: string;
  studentId?: string;
  department?: string;
  course?: string;
  contactNumber?: string;
  yearOfStudy?: string;
  borrowHistory?: BorrowHistoryItem[];
  fines?: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  department?: string;
  publicationYear: number;
  totalCopies: number;
  availableCopies: number;
  coverImage: string;
  coverImageHint: string;
}

export interface BorrowHistoryItem {
  bookId: string;
  borrowDate: string;
  returnDate?: string;
  dueDate: string;
  fine?: number;
}

export interface Student extends User {
  role: "student";
  studentId: string;
  department: string;
  course: string;
  contactNumber: string;
  yearOfStudy: string;
  borrowHistory: BorrowHistoryItem[];
  fines: number;
}
