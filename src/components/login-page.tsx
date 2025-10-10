
"use client"

import { Book, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/contexts/app-provider";
import React from "react";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const { signInWithGoogle, signInWithGithub, emailLogin } = useApp();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Please enter both email and password.",
        });
        return;
    }
    try {
        await emailLogin(email, password);
    } catch (error: any) {
        let title = "Login Failed";
        let description = "An unexpected error occurred. Please try again.";

        switch (error.code) {
            case 'auth/invalid-credential':
                title = "Invalid Credentials";
                description = "The email or password you entered is incorrect. Please check and try again.";
                break;
            case 'auth/too-many-requests':
                title = "Too Many Attempts";
                description = "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.";
                break;
            case 'auth/user-not-found':
                 title = "User Not Found";
                 description = "No user found with this email address. Please sign up or check the email you entered.";
                 break;
        }

         toast({
            variant: "destructive",
            title: title,
            description: description,
        });
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Popup sign-in error", error);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await signInWithGithub();
    } catch (error) {
      console.error("Popup sign-in error", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/50">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-2">
            <Book className="h-8 w-8 mr-2" />
            <CardTitle className="text-2xl font-headline">Login to Library Management</CardTitle>
          </div>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignIn}>
                  <div className="flex items-center justify-center">
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
                          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.902,35.688,44,30.41,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                      </svg>
                      Continue with Google
                  </div>
              </Button>
              <Button variant="outline" className="w-full" type="button" onClick={handleGithubSignIn}>
                <Github className="mr-2 h-4 w-4" />
                Continue with GitHub
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
