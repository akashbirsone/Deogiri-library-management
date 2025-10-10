
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
  createdAt?: any; 
  lastLogin?: any; 
}

export interface Book {
  id: string;
  path: string;
  title: string;
  author: string;
  subject: string; 
  isAvailable: boolean;
  coverImage: string;
  coverImageHint: string;
  addedBy?: string;
  addedDate?: string;
  department: string;
  course: string;
  semester: string;
}

export interface BorrowHistoryItem {
  bookId: string;
  bookPath: string; 
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
