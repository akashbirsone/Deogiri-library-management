
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Library } from "lucide-react"
import { useApp } from "@/contexts/app-provider"
import { useToast } from "@/hooks/use-toast"
import { doc, setDoc } from "firebase/firestore"
import { User } from "@/types"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"

const departments = {
    "B.Sc IT / CS": ["B.Sc. CS", "B.Sc. IT", "BCA", "M.Sc. CS"],
    "Faculty of Commerce & Management": ["B.Com", "BBA", "MBA"],
    "Faculty of Arts & Social Science": ["BA", "MA", "B.Lib.I.Sc"],
}

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  department: z.string({ required_error: "Please select a department."}),
  course: z.string({ required_error: "Please select a course."}),
  contactNumber: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit contact number."}),
  yearOfStudy: z.string({ required_error: "Please select your year of study."}),
})

export function StudentInfoForm() {
  const { authUser, firestore, setUser, logout } = useApp();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: authUser?.displayName || "",
      department: "",
      course: "",
      contactNumber: "",
      yearOfStudy: "",
    },
  });

  const selectedDepartment = form.watch("department");

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!authUser || !firestore) return;

    const studentId = `2526${Math.floor(100000 + Math.random() * 900000)}`;
    const studentProfileData = {
        uid: authUser.uid,
        studentId: studentId,
        name: values.fullName,
        email: authUser.email,
        role: "student" as const,
        avatar: authUser.photoURL || `https://i.pravatar.cc/150?u=${authUser.uid}`,
        department: values.department,
        course: values.course,
        contactNumber: values.contactNumber,
        yearOfStudy: values.yearOfStudy,
        fines: 0,
        borrowHistory: []
    };

    const userDocRef = doc(firestore, "users", authUser.uid);
    setDoc(userDocRef, studentProfileData, { merge: true })
      .then(() => {
        setUser(studentProfileData as User);
        toast({
            title: "Profile Saved!",
            description: "Your information has been saved successfully. Redirecting...",
        });
      })
      .catch(async (serverError) => {
          const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'create',
            requestResourceData: studentProfileData,
          });

          errorEmitter.emit('permission-error', permissionError);

          toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: "Could not save your profile. Please try again.",
          });
      });
  }
  
  const handleBack = () => {
    logout();
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/50 p-4">
      <Card className="w-full max-w-lg relative">
         <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 text-muted-foreground"
            onClick={handleBack}
            aria-label="Back to login"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        <CardHeader className="text-center pt-12">
            <div className="flex justify-center items-center mb-2">
                <Library className="h-8 w-8 mr-2" />
                <CardTitle className="text-2xl font-headline">Complete Your Profile</CardTitle>
            </div>
          <CardDescription>We need a little more information before you can proceed to the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(departments).map(dep => (
                            <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedDepartment}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedDepartment && departments[selectedDepartment as keyof typeof departments].map(course => (
                            <SelectItem key={course} value={course}>{course}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Enter your 10-digit mobile number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="yearOfStudy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year of Study</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your year of study" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1st">1st Year</SelectItem>
                        <SelectItem value="2nd">2nd Year</SelectItem>
                        <SelectItem value="3rd">3rd Year</SelectItem>
                        <SelectItem value="4th">4th Year (if applicable)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">Save and Continue</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
