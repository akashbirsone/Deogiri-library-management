
"use client";

import * as React from "react";
import { useApp } from "@/contexts/app-provider";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Student } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AllStudentsPage() {
    const { users } = useApp();
    const router = useRouter();

    const studentUsers = users.filter(u => u.role === 'student') as Student[];

    const getInitials = (name: string) => {
        if (!name) return "";
        const names = name.split(" ")
        return names.map((n) => n[0]).join("").toUpperCase();
    }
        
    return (
        <div className="flex flex-col gap-4 p-4">
            <header className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                    <span className="sr-only">Back</span>
                </Button>
                <h1 className="font-headline text-2xl font-bold tracking-tight">All Students</h1>
            </header>
            <main className="space-y-4">
                {studentUsers.length > 0 ? studentUsers.map(student => (
                    <Card key={student.uid}>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Avatar className="w-10 h-10">
                                <AvatarImage src={student.avatar} />
                                <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{student.name}</p>
                                <p className="text-xs text-muted-foreground">{student.email}</p>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Department</span>
                                <span className="font-medium">{student.department}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Course</span>
                                <span className="font-medium">{student.course}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">On Loan</span>
                                <span className="font-medium">{(student.borrowHistory || []).filter(h => !h.returnDate).length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Fines</span>
                                <span className="font-medium text-destructive">₹{student.fines || 0}</span>
                            </div>
                        </CardContent>
                    </Card>
                )) : (
                     <div className="text-center py-10 text-muted-foreground">No students found.</div>
                )}
            </main>
        </div>
    );
}
