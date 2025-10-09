
"use client";

import * as React from "react";
import { useApp } from "@/contexts/app-provider";
import { books } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Library, RefreshCw } from "lucide-react";
import type { Student } from "@/types";

export function MyBooksView() {
    const { user, returnBook } = useApp();
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    if (!user || user.role !== 'student') {
        return <div>Student data not found.</div>;
    }
    const studentProfile = user as Student;
    const currentlyBorrowed = studentProfile?.borrowHistory?.filter((item) => !item.returnDate) || [];

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
                <CardContent>
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
                                    const book = books.find(b => b.id === item.bookId);
                                    if (!book) return null;
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
                                                <Button size="sm" onClick={() => returnBook(book.id)}>
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

    