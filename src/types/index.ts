
export type Role = "admin" | "librarian" | "student";

export interface User {
  uid: string;
  name: string;
  email: string | null;
  role: Role;
  avatar: string;
  studentId?: string;
  department?: string; // This will now be the department ID
  course?: string; // This will be the course ID
  contactNumber?: string;
  yearOfStudy?: string;
  borrowHistory?: BorrowHistoryItem[];
  fines?: number;
  createdAt?: any; // Should be Firestore Timestamp
  lastLogin?: any; // Should be Firestore Timestamp
}

export interface Book {
  id: string;
  title: string;
  author: string;
  subject: string; // "Category" is now "Subject"
  isAvailable: boolean; // Replaces copy counting
  coverImage: string;
  coverImageHint: string;
  addedBy?: string;
  addedDate?: string;
  // Note: department, course, semester are part of the path now
}

export interface BorrowHistoryItem {
  bookId: string;
  // We need to store the full path to the book for context
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
