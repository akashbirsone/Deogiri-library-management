"use client";

import { useApp } from "@/contexts/app-provider";
import { Book, CheckCircle, Clock, Users, IndianRupee, Library, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { books, students } from "@/lib/data";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export function DashboardView() {
  const { role } = useApp();

  switch (role) {
    case "admin":
      return <AdminDashboard />;
    case "librarian":
      return <LibrarianDashboard />;
    case "student":
      return <StudentDashboard />;
    default:
      return null;
  }
}

const AdminDashboard = () => {
    const totalBooks = books.length;
    const borrowedBooks = books.reduce((acc, book) => acc + (book.totalCopies - book.availableCopies), 0);
    const availableBooks = books.reduce((acc, book) => acc + book.availableCopies, 0);
    const totalStudents = students.length;
    const totalFines = students.reduce((acc, student) => acc + student.fines, 0);

    const chartData = books.map(book => ({
        name: book.title.slice(0, 15) + (book.title.length > 15 ? '...' : ''),
        borrowed: book.totalCopies - book.availableCopies,
    })).sort((a,b) => b.borrowed - a.borrowed).slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooks}</div>
            <p className="text-xs text-muted-foreground">Unique titles in library</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borrowed Books</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{borrowedBooks}</div>
            <p className="text-xs text-muted-foreground">Currently on loan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Registered student members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fines Collected</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalFines}</div>
             <p className="text-xs text-muted-foreground">Total outstanding fines</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Most Borrowed Books</CardTitle>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                    <Bar dataKey="borrowed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
};

const LibrarianDashboard = () => {
    const totalBooks = books.reduce((acc, book) => acc + book.totalCopies, 0);
    const borrowedBooks = books.reduce((acc, book) => acc + (book.totalCopies - book.availableCopies), 0);
    const availableBooks = totalBooks - borrowedBooks;
    const lowStockBooks = books.filter(book => book.availableCopies <= 2 && book.availableCopies > 0).length;

    return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">Librarian Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Copies</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooks}</div>
            <p className="text-xs text-muted-foreground">Across all titles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Copies</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableBooks}</div>
            <p className="text-xs text-muted-foreground">Ready to be borrowed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borrowed Copies</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{borrowedBooks}</div>
             <p className="text-xs text-muted-foreground">Currently on loan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockBooks}</div>
            <p className="text-xs text-muted-foreground">Titles with &lt;= 2 copies</p>
          </C</CardContent>
        </Card>
      </div>
       <Card>
            <CardHeader>
                <CardTitle className="font-headline">Recently Borrowed</CardTitle>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Book Title</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead>Due Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.flatMap(s => s.borrowHistory.filter(h => !h.returnDate).map(h => ({student: s, history: h}))).slice(0, 5).map(({student, history}) => {
                            const book = books.find(b => b.id === history.bookId);
                            return (
                                <TableRow key={`${student.id}-${history.bookId}`}>
                                    <TableCell>{book?.title}</TableCell>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>{format(new Date(history.dueDate), "PPP")}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
    )
};

const StudentDashboard = () => {
  const { user } = useApp();
  const studentData = students.find((s) => s.id === user.id);
  
  const getInitials = (name: string) => {
    const names = name.split(" ");
    return names.map((n) => n[0]).join("").toUpperCase();
  };

  if (!studentData) {
    return <div>Student data not found.</div>;
  }

  const currentlyBorrowedCount = studentData?.borrowHistory.filter((item) => !item.returnDate).length || 0;
  const overdueBooksCount = studentData?.borrowHistory.filter(item => !item.returnDate && new Date(item.dueDate) < new Date()).length || 0;


  return (
    <div className="flex flex-col gap-6">
       <h1 className="font-headline text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Books on Loan</CardTitle>
                        <Library className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{currentlyBorrowedCount}</div>
                        <p className="text-xs text-muted-foreground">Currently borrowed books</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overdueBooksCount}</div>
                        <p className="text-xs text-muted-foreground">Books past their due date</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Welcome, {user.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4 text-center">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                        <Badge variant="outline" className="mt-2">Active Member</Badge>
                    </div>
                    <div className="w-full text-center bg-muted p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">Outstanding Fines</p>
                        <p className="text-2xl font-bold">₹{studentData.fines}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Announcements</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">No new announcements.</p>
                </CardContent>
             </Card>
        </div>
      </div>
    </div>
  );
};
