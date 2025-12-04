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
import { 
    BookCheck, BookCopy, IndianRupee, Camera, User as UserIcon, Mail, Phone, GraduationCap, Pencil, Save, X 
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { doc, updateDoc } from "firebase/firestore"
import type { Student } from "@/types"
// IMPORT: Master departments list
import { departments } from "@/lib/departments"

export function SettingsView() {
  const { user, firestore, setUser } = useApp()
  const { toast } = useToast()
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // State for Edit Mode
  const [isEditing, setIsEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Form States
  const [fullName, setFullName] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [course, setCourse] = React.useState("");
  const [yearOfStudy, setYearOfStudy] = React.useState("");
  const [contactNumber, setContactNumber] = React.useState("");

  // Sync state with user data on load
  React.useEffect(() => {
    if (user) {
        setFullName(user.name || "");
        setDepartment(user.department || "");
        setCourse(user.course || "");
        setYearOfStudy(user.yearOfStudy || "");
        setContactNumber(user.contactNumber || "");
    }
  }, [user]);

  // Logic: Get courses based on selected department
  const availableCourses = React.useMemo(() => {
      const selectedDept = departments.find(d => d.name === department);
      return selectedDept ? selectedDept.courses : [];
  }, [department]);

  const getInitials = (name: string) => {
    if (!name) return "";
    const names = name.split(" ")
    return names.map((n) => n[0]).join("").toUpperCase();
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      toast({
        title: "Profile Picture Updated",
        description: "Your new profile picture has been uploaded.",
      });
    }
  }

  const handleSaveProfile = async () => {
      if (!user || !firestore) return;
      setLoading(true);

      try {
          const userRef = doc(firestore, "users", user.uid);
          const updatedData = {
              name: fullName,
              department: department, // Ye ab sahi list se save hoga
              course: course,
              yearOfStudy: yearOfStudy,
              contactNumber: contactNumber
          };

          await updateDoc(userRef, updatedData);
          
          // Update local user state immediately
          setUser({ ...user, ...updatedData });
          
          toast({ title: "Success", description: "Profile updated successfully!" });
          setIsEditing(false);
      } catch (error) {
          console.error(error);
          toast({ variant: "destructive", title: "Error", description: "Failed to update profile." });
      } finally {
          setLoading(false);
      }
  }

  const handleCancel = () => {
      // Revert changes
      if (user) {
        setFullName(user.name || "");
        setDepartment(user.department || "");
        setCourse(user.course || "");
        setYearOfStudy(user.yearOfStudy || "");
        setContactNumber(user.contactNumber || "");
      }
      setIsEditing(false);
  }
  
  if (!user) {
    return <div>Loading profile...</div>
  }

  const isStudent = user.role === 'student';
  const studentProfile = isStudent ? (user as Student) : null;
  const booksIssued = studentProfile?.borrowHistory?.filter(b => !b.returnDate).length ?? 0;
  const booksReturned = studentProfile?.borrowHistory?.filter(b => b.returnDate).length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Profile & Settings</h1>
        {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                <Pencil className="h-4 w-4" /> Edit Profile
            </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 order-2 lg:order-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Your Information</CardTitle>
                <CardDescription>
                    {isEditing ? "Update your details below." : "This is your profile information."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* --- EDIT MODE --- */}
                {isEditing ? (
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Full Name</Label>
                            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                        </div>
                        
                        {isStudent && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Department</Label>
                                        <Select value={department} onValueChange={(val) => { setDepartment(val); setCourse(""); }}>
                                            <SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
                                            <SelectContent>
                                                {departments.map((d) => (
                                                    <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Course</Label>
                                        <Select value={course} onValueChange={setCourse} disabled={!department}>
                                            <SelectTrigger><SelectValue placeholder="Select Course" /></SelectTrigger>
                                            <SelectContent>
                                                {availableCourses.map((c) => (
                                                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Year of Study</Label>
                                    <Select value={yearOfStudy} onValueChange={setYearOfStudy}>
                                        <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1st">1st Year</SelectItem>
                                            <SelectItem value="2nd">2nd Year</SelectItem>
                                            <SelectItem value="3rd">3rd Year</SelectItem>
                                            <SelectItem value="4th">4th Year</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}

                        <div className="grid gap-2">
                            <Label>Contact Number</Label>
                            <Input value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="ghost" onClick={handleCancel} disabled={loading}>
                                Cancel
                            </Button>
                            <Button onClick={handleSaveProfile} disabled={loading} className="gap-2">
                                {loading ? "Saving..." : <><Save className="h-4 w-4" /> Save Changes</>}
                            </Button>
                        </div>
                    </div>
                ) : (
                /* --- VIEW MODE (READ ONLY) --- */
                <>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-3">
                        <UserIcon className="h-5 w-5 text-muted-foreground mt-1" />
                        <div>
                            <p className="text-muted-foreground">Full Name</p>
                            <p className="font-medium">{user.name}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground mt-1" />
                        <div>
                            <p className="text-muted-foreground">Email Address</p>
                            <p className="font-medium">{user.email}</p>
                        </div>
                    </div>
                    {isStudent && studentProfile && (
                        <>
                        <div className="flex items-start gap-3">
                            <GraduationCap className="h-5 w-5 text-muted-foreground mt-1" />
                            <div>
                                <p className="text-muted-foreground">Department</p>
                                {/* Agar department match nahi ho raha to red dikhao taaki user update kare */}
                                <p className={`font-medium ${!departments.some(d => d.name === studentProfile.department) ? "text-destructive font-bold" : ""}`}>
                                    {studentProfile.department} 
                                    {!departments.some(d => d.name === studentProfile.department) && " (Please Update!)"}
                                </p>
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
                        </>
                    )}
                    </div>
                </>
                )}
                
                <Separator/>
                <p className="text-xs text-muted-foreground">
                  {isEditing 
                    ? "Make sure to select your Department carefully." 
                    : isStudent 
                        ? "If your information is incorrect, please click 'Edit Profile' to update it."
                        : "To update your details, please contact the system administrator."
                  }
                </p>
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
                            {isStudent && studentProfile ? `Student ID: ${studentProfile.studentId}` : `Role: ${user.role}`}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isStudent && (
                        <div>
                            <Label>Student Status</Label>
                            <div><Badge variant="secondary">Active</Badge></div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {isStudent && studentProfile && (
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
                          <span className="font-bold text-lg text-destructive">₹{studentProfile.fines ?? 0}</span>
                      </div>
                  </CardContent>
               </Card>
            )}
        </div>
      </div>
    </div>
  )
}