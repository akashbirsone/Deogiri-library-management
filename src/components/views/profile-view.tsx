"use client"

import { useApp } from "@/contexts/app-provider"
import { students, books } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from 'date-fns';

export function ProfileView() {
  const { user } = useApp()
  const studentData = students.find((s) => s.id === user.id)

  const getInitials = (name: string) => {
    const names = name.split(" ")
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (user.role !== 'student' || !studentData) {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="font-headline text-3xl font-bold tracking-tight">Profile</h1>
            <Card>
                <CardContent className="pt-6">
                     <p className="text-muted-foreground">Profile view is only available for students in this demo.</p>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">My Profile</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <Badge className="mt-2">{user.role}</Badge>
              </div>
               <div className="w-full text-center bg-muted p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">Outstanding Fines</p>
                    <p className="text-2xl font-bold">₹{studentData.fines}</p>
                </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Borrowing History</CardTitle>
                    <CardDescription>A record of all the books you've borrowed.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Book Title</TableHead>
                                <TableHead>Borrowed</TableHead>
                                <TableHead>Due</TableHead>
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
                                        <TableCell>{format(new Date(item.dueDate), 'PP')}</TableCell>
                                        <TableCell>
                                            {item.returnDate ? format(new Date(item.returnDate), 'PP') : <Badge variant="secondary">On Loan</Badge>}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
