
"use client";

import * as React from "react";
import { useApp } from "@/contexts/app-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { History } from "lucide-react";
import type { Student } from "@/types";

export function HistoryView() {
    const { user, books: allBooks } = useApp();
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    if (!user || user.role !== 'student') {
        return <div>Student data not found.</div>;
    }
    const studentProfile = user as Student;
    
    const sortedHistory = [...(studentProfile.borrowHistory || [])].sort((a,b) => new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime());

    return (
        <div className="flex flex-col gap-6">
            <h1 className="font-headline text-3xl font-bold tracking-tight">Borrowing History</h1>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <History />
                        Complete Log
                    </CardTitle>
                    <CardDescription>A complete log of all books you've issued and returned.</CardDescription>
                </CardHeader>
                <CardContent>
                    {sortedHistory.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Book Title</TableHead>
                                    <TableHead>Issue Date</TableHead>
                                    <TableHead>Return Date</TableHead>
                                    <TableHead className="text-right">Fine</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedHistory.map((item, index) => {
                                    const book = allBooks.find(b => b.id === item.bookId);
                                    return (
                                        <TableRow key={`${item.bookId}-${item.borrowDate}`}>
                                            <TableCell className="font-medium">{book?.title || 'Loading...'}</TableCell>
                                            <TableCell>{isClient ? format(new Date(item.borrowDate), 'PP') : ''}</TableCell>
                                            <TableCell>
                                                {item.returnDate ? (isClient ? format(new Date(item.returnDate), 'PP') : '') : <Badge variant="outline">On Loan</Badge>}
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {item.fine && item.fine > 0 ? `₹${item.fine}`: '-'}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">You have no borrowing history yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

    
