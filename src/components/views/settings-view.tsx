"use client"

import * as React from "react"
import { useApp } from "@/contexts/app-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { students } from "@/lib/data"
import { Separator } from "@/components/ui/separator"
import { BookCheck, BookCopy, IndianRupee } from "lucide-react"

export function SettingsView() {
  const { user } = useApp()
  const { toast } = useToast()
  
  // Find the detailed student data
  const studentData = students.find(s => s.id === user.id);

  const getInitials = (name: string) => {
    const names = name.split(" ")
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
    });
  }
  
  const booksIssued = studentData?.borrowHistory.filter(b => !b.returnDate).length ?? 0;
  const booksReturned = studentData?.borrowHistory.filter(b => b.returnDate).length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">Profile & Settings</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Profile & Stats */}
        <div className="lg:col-span-1 flex flex-col gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="font-headline text-2xl">{user.name}</CardTitle>
                        <CardDescription>
                            {studentData?.department ? `${studentData.department} | ` : ''} Student ID: {user.id}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div>
                        <Label>Email Address</Label>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                     </div>
                     <div>
                        <Label>Membership Status</Label>
                        <p><Badge variant="secondary">Active</Badge></p>
                     </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Library Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <BookCopy className="h-5 w-5 text-muted-foreground"/>
                            <span className="text-sm font-medium">Books Currently Issued</span>
                        </div>
                        <span className="font-bold text-lg">{booksIssued}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <BookCheck className="h-5 w-5 text-muted-foreground"/>
                            <span className="text-sm font-medium">Total Books Returned</span>
                        </div>
                        <span className="font-bold text-lg">{booksReturned}</span>
                    </div>
                    <Separator />
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                             <IndianRupee className="h-5 w-5 text-muted-foreground"/>
                             <span className="text-sm font-medium">Outstanding Fines</span>
                        </div>
                        <span className="font-bold text-lg text-destructive">₹{studentData?.fines ?? 0}</span>
                    </div>
                </CardContent>
             </Card>
        </div>

        {/* Right Column: Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Account Settings</CardTitle>
            <CardDescription>Update your account password. For other changes, please contact the admin.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6 max-w-md" onSubmit={handlePasswordChange}>
                <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" placeholder="••••••••" />
                </div>
                <Button type="submit">Change Password</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
