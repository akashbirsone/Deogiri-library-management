
"use client";

import * as React from "react";
import { useApp } from "@/contexts/app-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Student } from "@/types";
import { format } from "date-fns";

export default function AllBorrowedBooksPage() {
    const { users, books: allBooks } = useApp();
    const router = useRouter();
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    const allBorrowedItems = (users.filter(u => u.role === 'student') as Student[])
        .flatMap(s => (s.borrowHistory || []).filter(h => !h.returnDate).map(h => ({ student: s, history: h })));
        
    return (
        <div className="flex flex-col gap-4 p-4">
            <header className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                    <span className="sr-only">Back</span>
                </Button>
                <h1 className="font-headline text-2xl font-bold tracking-tight">All Borrowed Books</h1>
            </header>
            <main className="space-y-4">
                {allBorrowedItems.length > 0 ? allBorrowedItems.map(({ student, history }) => {
                    const book = allBooks.find(b => b.id === history.bookId);
                    return (
                        <Card key={`${student.uid}-${history.bookId}`}>
                            <CardHeader>
                                <CardTitle className="text-base truncate">{book?.title || 'Unknown Book'}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Student</span>
                                    <span className="font-medium">{student.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Due Date</span>
                                    <span className="font-medium">{isClient ? format(new Date(history.dueDate), "PP") : ''}</span>
                                </div>
                            </CardContent>
                        </Card>
                    )
                }) : (
                    <div className="text-center py-10 text-muted-foreground">No borrowed books found.</div>
                )}
            </main>
        </div>
    );
}
