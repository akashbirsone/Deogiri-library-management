
"use client";

import * as React from "react";
import { useApp } from "@/contexts/app-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Library, RefreshCw } from "lucide-react";
import type { Student } from "@/types";

export function MyBooksView() {
    const { user, returnBook, books: allBooks } = useApp();
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    if (!user || user.role !== 'student') {
        return <div>Student data not found.</div>;
    }
    const studentProfile = user as Student;
    const currentlyBorrowed = studentProfile?.borrowHistory?.filter((item) => !item.returnDate) || [];

    const renderBookDetails = (item: any, book: any) => {
        const isOverdue = new Date(item.dueDate) < new Date();
        if (!book) {
            return { title: 'Loading...', isOverdue: false };
        }
        return { title: book.title, isOverdue };
    };

    return (
        <div className="flex flex-col gap-6">
            <h1 className="font-headline text-3xl font-bold tracking-tight">My Books</h1>
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <Library />
                        Your Issued Books
                    </CardTitle>
                    <CardDescription>Books you have currently borrowed from the library.</CardDescription>
                </CardHeader>
                
                {/* Mobile View */}
                <CardContent className="md:hidden p-4 space-y-4">
                    {currentlyBorrowed.length > 0 ? (
                        currentlyBorrowed.map(item => {
                            const book = allBooks.find(b => b.id === item.bookId);
                            const { title, isOverdue } = renderBookDetails(item, book);

                            if (!book) {
                                return <Card key={`${item.bookId}-${item.borrowDate}`}><CardContent className="p-4">Loading book details...</CardContent></Card>;
                            }
                            
                            return (
                                <Card key={`${item.bookId}-${item.borrowDate}`}>
                                    <CardHeader>
                                        <CardTitle className="text-base">{title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Issue Date</span>
                                            <span className="font-medium">{isClient ? format(new Date(item.borrowDate), "PP") : ''}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Due Date</span>
                                            <span className="font-medium">{isClient ? format(new Date(item.dueDate), "PP") : ''}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Status</span>
                                            <Badge variant={isOverdue ? 'destructive' : 'secondary'}>
                                                {isOverdue ? 'Overdue' : 'On Loan'}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button size="sm" className="w-full" onClick={() => returnBook(book.id, user.uid)}>
                                            <RefreshCw className="mr-2 h-4 w-4" />
                                            Return Book
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })
                    ) : (
                         <p className="text-muted-foreground text-center py-8">You have no books currently issued.</p>
                    )}
                </CardContent>

                {/* Desktop View */}
                <CardContent className="hidden md:block">
                    {currentlyBorrowed.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Book Title</TableHead>
                                    <TableHead>Issue Date</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentlyBorrowed.map(item => {
                                    const book = allBooks.find(b => b.id === item.bookId);
                                    if (!book) { 
                                        return (
                                             <TableRow key={`${item.bookId}-${item.borrowDate}`}>
                                                <TableCell colSpan={5} className="font-medium text-center">Loading book details...</TableCell>
                                             </TableRow>
                                        )
                                    }
                                    const isOverdue = new Date(item.dueDate) < new Date();
                                    return (
                                        <TableRow key={`${item.bookId}-${item.borrowDate}`}>
                                            <TableCell className="font-medium">{book.title}</TableCell>
                                            <TableCell>{isClient ? format(new Date(item.borrowDate), "PP") : ''}</TableCell>
                                            <TableCell>{isClient ? format(new Date(item.dueDate), "PP") : ''}</TableCell>
                                            <TableCell>
                                                <Badge variant={isOverdue ? 'destructive' : 'secondary'}>
                                                    {isOverdue ? 'Overdue' : 'On Loan'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" onClick={() => returnBook(book.id, user.uid)}>
                                                    <RefreshCw className="mr-2 h-4 w-4" />
                                                    Return Book
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">You have no books currently issued.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
