"use client"

import { useApp } from "@/contexts/app-provider";
import { books, students } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { History } from "lucide-react";

export function HistoryView() {
    const { user } = useApp();
    const studentData = students.find((s) => s.id === user.id);

    if (!studentData) {
        return <div>Student data not found.</div>;
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="font-headline text-3xl font-bold tracking-tight">Borrowing History</h1>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <History />
                        Complete Log
                    </CardTitle>
                    <CardDescription>A complete log of all books you've previously issued and returned.</CardDescription>
                </CardHeader>
                <CardContent>
                    {studentData.borrowHistory.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Book Title</TableHead>
                                    <TableHead>Borrowed</TableHead>
                                    <TableHead>Returned</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {studentData.borrowHistory.map(item => {
                                    const book = books.find(b => b.id === item.bookId);
                                    return (
                                        <TableRow key={item.bookId + item.borrowDate}>
                                            <TableCell className="font-medium">{book?.title || 'Unknown Book'}</TableCell>
                                            <TableCell>{format(new Date(item.borrowDate), 'PP')}</TableCell>
                                            <TableCell>
                                                {item.returnDate ? format(new Date(item.returnDate), 'PP') : <Badge variant="outline">On Loan</Badge>}
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
