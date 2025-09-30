export type Role = "admin" | "librarian" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
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
}

export interface Student extends User {
  role: "student";
  borrowHistory: BorrowHistoryItem[];
  fines: number;
}
