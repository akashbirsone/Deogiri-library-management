
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
import { Separator } from "@/components/ui/separator"
import { BookCheck, BookCopy, IndianRupee, Camera, User, Mail, Phone, GraduationCap } from "lucide-react"

export function SettingsView() {
  const { user, studentProfile } = useApp()
  const { toast } = useToast()
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const getInitials = (name: string) => {
    if (!name) return "";
    const names = name.split(" ")
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, you would upload the file and update the user's avatar URL.
      // Here, we just show a toast notification.
      toast({
        title: "Profile Picture Updated",
        description: "Your new profile picture has been uploaded.",
      });
    }
  }
  
  if (!studentProfile) {
    return <div>Loading profile...</div>
  }

  const booksIssued = studentProfile?.borrowHistory.filter(b => !b.returnDate).length ?? 0;
  const booksReturned = studentProfile?.borrowHistory.filter(b => b.returnDate).length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">Profile & Settings</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 order-2 lg:order-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Your Information</CardTitle>
                <CardDescription>This is the information stored in your student profile.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                          <p className="text-muted-foreground">Full Name</p>
                          <p className="font-medium">{studentProfile.name}</p>
                      </div>
                  </div>
                   <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                          <p className="text-muted-foreground">Email Address</p>
                          <p className="font-medium">{studentProfile.email}</p>
                      </div>
                  </div>
                  <div className="flex items-start gap-3">
                      <GraduationCap className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                          <p className="text-muted-foreground">Department</p>
                          <p className="font-medium">{studentProfile.department}</p>
                      </div>
                  </div>
                  <div className="flex items-start gap-3">
                      <GraduationCap className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                          <p className="text-muted-foreground">Course</p>
                          <p className="font-medium">{studentProfile.course}</p>
                      </div>
                  </div>
                  <div className="flex items-start gap-3">
                      <GraduationCap className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                          <p className="text-muted-foreground">Year of Study</p>
                          <p className="font-medium">{studentProfile.yearOfStudy}</p>
                      </div>
                  </div>
                   <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                          <p className="text-muted-foreground">Contact Number</p>
                          <p className="font-medium">{studentProfile.contactNumber}</p>
                      </div>
                  </div>
                </div>
                <Separator/>
                <p className="text-xs text-muted-foreground">If any of this information is incorrect, please contact the library administration to get it updated.</p>
              </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6 order-1 lg:order-2">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="relative w-16 h-16">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        variant="outline"
                        className="absolute -bottom-1 -right-1 rounded-full h-7 w-7 bg-background"
                        onClick={handleAvatarClick}
                      >
                        <Camera className="h-4 w-4" />
                        <span className="sr-only">Change profile picture</span>
                      </Button>
                      <Input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange}
                        className="hidden" 
                        accept="image/*"
                      />
                    </div>
                    <div>
                        <CardTitle className="font-headline text-2xl">{user.name}</CardTitle>
                        <CardDescription>
                            Student ID: {user.id}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div>
                        <Label>Membership Status</Label>
                        <div><Badge variant="secondary">Active</Badge></div>
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
                            <span className="text-sm font-medium">Active (Currently Issued)</span>
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
                             <span className="text-sm font-medium">Total Outstanding Fines</span>
                        </div>
                        <span className="font-bold text-lg text-destructive">₹{studentProfile?.fines ?? 0}</span>
                    </div>
                </CardContent>
             </Card>
        </div>
      </div>
    </div>
  )
}
