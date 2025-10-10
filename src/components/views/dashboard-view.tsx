
"use client";

import * as React from "react";
import { useApp } from "@/contexts/app-provider";
import { Book, CheckCircle, Clock, Users, IndianRupee, Library, CalendarClock, Database, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Student, Book as BookType } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";


export function DashboardView() {
  const { user } = useApp();

  if (!user) {
    return <div className="text-center py-16">Loading dashboard...</div>;
  }

  switch (user.role) {
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
    const { books: allBooks, users, seedDatabase } = useApp();
    const { toast } = useToast();
    
    const borrowedBooksCount = allBooks.filter(b => !b.isAvailable).length;
    const totalStudents = users.filter(u => u.role === 'student').length;
    const totalFines = (users.filter(u => u.role === 'student') as Student[]).reduce((acc, student) => acc + (student.fines || 0), 0);
    const [isClient, setIsClient] = React.useState(false);
    const [isSeeding, setIsSeeding] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    const getInitials = (name: string) => {
        if (!name) return "";
        const names = name.split(" ")
        return names.map((n) => n[0]).join("").toUpperCase();
    }
    
    const allBorrowedItems = (users.filter(u => u.role === 'student') as Student[])
        .flatMap(s => (s.borrowHistory || []).filter(h => !h.returnDate).map(h => ({student: s, history: h})));

    const chartData = allBorrowedItems
        .reduce((acc, { history }) => {
            const book = allBooks.find(b => b.id === history.bookId);
            if (book) {
                const existing = acc.find(item => item.name === book.title);
                if (existing) {
                    existing.borrowed += 1;
                } else {
                    acc.push({ name: book.title.slice(0, 15) + (book.title.length > 15 ? '...' : ''), borrowed: 1 });
                }
            }
            return acc;
        }, [] as {name: string, borrowed: number}[])
        .sort((a,b) => b.borrowed - a.borrowed).slice(0, 5);
        
    const handleSeed = async () => {
        setIsSeeding(true);
        try {
            await seedDatabase();
            toast({
                title: "Database Seeded",
                description: "The book catalog has been populated with initial data.",
            })
        } catch(e) {
            toast({
                title: "Seeding Failed",
                description: "There was an error seeding the database.",
                variant: "destructive"
            })
        } finally {
            setIsSeeding(false);
        }
    }


  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <Button onClick={handleSeed} variant="outline" disabled={isSeeding}>
            {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
            {isSeeding ? "Seeding..." : "Seed Books"}
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allBooks.length}</div>
            <p className="text-xs text-muted-foreground">Unique titles in library</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borrowed Books</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{borrowedBooksCount}</div>
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
            <CardTitle className="text-sm font-medium">Total Fines</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalFines}</div>
             <p className="text-xs text-muted-foreground">Total outstanding fines</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
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
                        {allBorrowedItems.slice(0, 5).map(({student, history}) => {
                            const book = allBooks.find(b => b.id === history.bookId);
                            return (
                                <TableRow key={`${student.uid}-${history.bookId}`}>
                                    <TableCell>{book?.title}</TableCell>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>{isClient ? format(new Date(history.dueDate), "PPP") : ''}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>

       <Card>
            <CardHeader>
                <CardTitle className="font-headline">Student Overview</CardTitle>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Books on Loan</TableHead>
                            <TableHead className="text-right">Fines</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(users.filter(u => u.role === 'student') as Student[]).map(student => (
                            <TableRow key={student.uid}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={student.avatar} />
                                            <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{student.name}</p>
                                            <p className="text-xs text-muted-foreground">{student.email}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{student.department}</TableCell>
                                <TableCell>{student.course}</TableCell>
                                <TableCell className="font-medium">{(student.borrowHistory || []).filter(h => !h.returnDate).length}</TableCell>
                                <TableCell className="text-right font-medium">₹{student.fines || 0}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

    </div>
  );
};

const LibrarianDashboard = () => {
    const { books, users } = useApp();
    const borrowedBooksCount = books.filter(b => !b.isAvailable).length;
    const totalBooks = books.length;
    const availableBooks = totalBooks - borrowedBooksCount;
    const lowStockBooks = books.filter(book => !book.isAvailable).length; // Simplified
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);
    
    const allBorrowedItems = (users.filter(u => u.role === 'student') as Student[])
        .flatMap(s => (s.borrowHistory || []).filter(h => !h.returnDate).map(h => ({student: s, history: h})));

    return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">Librarian Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooks}</div>
            <p className="text-xs text-muted-foreground">Across all titles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Books</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableBooks}</div>
            <p className="text-xs text-muted-foreground">Ready to be borrowed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borrowed Books</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{borrowedBooksCount}</div>
             <p className="text-xs text-muted-foreground">Currently on loan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unavailable Books</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockBooks}</div>
            <p className="text-xs text-muted-foreground">Total unavailable titles</p>
          </CardContent>
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
                        {allBorrowedItems.slice(0, 5).map(({student, history}) => {
                            const book = books.find(b => b.id === history.bookId);
                            return (
                                <TableRow key={`${student.uid}-${history.bookId}`}>
                                    <TableCell>{book?.title}</TableCell>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>{isClient ? format(new Date(history.dueDate), "PPP") : ''}</TableCell>
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
  const { user, books } = useApp();
  const studentProfile = user as Student;
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!studentProfile || user?.role !== 'student') {
    return <div>Loading student data...</div>;
  }

  const currentlyBorrowed = studentProfile.borrowHistory?.filter((item) => !item.returnDate) || [];
  const upcomingReturns = currentlyBorrowed
    .map(item => ({...item, book: books.find(b => b.id === item.bookId)}))
    .filter(item => item.book)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="flex flex-col gap-6">
       <h1 className="font-headline text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Books on Loan</CardTitle>
                    <Library className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{currentlyBorrowed.length}</div>
                    <p className="text-xs text-muted-foreground">Currently borrowed books</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Outstanding Fines</CardTitle>
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive">₹{studentProfile.fines || 0}</div>
                    <p className="text-xs text-muted-foreground">Total amount due</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Next Due Date</CardTitle>
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {upcomingReturns.length > 0 ? (
                        <>
                            <div className="text-2xl font-bold">{isClient ? format(new Date(upcomingReturns[0].dueDate), "PPP") : '...'}</div>
                            <p className="text-xs text-muted-foreground truncate" title={upcomingReturns[0].book?.title}>{upcomingReturns[0].book?.title}</p>
                        </>
                    ) : (
                         <>
                            <div className="text-2xl font-bold">-</div>
                            <p className="text-xs text-muted-foreground">No books currently on loan</p>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Upcoming Returns</CardTitle>
                <CardDescription>Books you need to return soon.</CardDescription>
            </CardHeader>
            <CardContent>
                {upcomingReturns.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Book Title</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Time Left</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {upcomingReturns.map(item => {
                             const dueDate = new Date(item.dueDate);
                             const isOverdue = new Date() > dueDate;
                            return (
                                <TableRow key={`${item.bookId}-${item.borrowDate}`}>
                                    <TableCell className="font-medium">{item.book?.title}</TableCell>
                                    <TableCell>{isClient ? format(dueDate, "PPP") : ''}</TableCell>
                                    <TableCell>
                                        <Badge variant={isOverdue ? "destructive" : "outline"}>
                                            {isClient ? formatDistanceToNow(dueDate, { addSuffix: true }) : ''}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>You have no books to return.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
};

    