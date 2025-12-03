"use client"

import { Book, Github, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/contexts/app-provider";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

export default function LoginPage() {
  const { signInWithGoogle, signInWithGithub, emailLogin } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ variant: "destructive", title: "Error", description: "Please enter email and password." });
      return;
    }

    setLoading(true);
    const auth = getAuth();

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: "Account Created", description: "Welcome! You are now logged in." });
      } else {
        await emailLogin(email, password);
        toast({ title: "Success", description: "Logged in successfully." });
      }
      router.push("/dashboard");
    } catch (error: any) {
      let title = isSignUp ? "Sign Up Failed" : "Login Failed";
      let description = error.message;

      if (error.code === "auth/email-already-in-use") description = "Email already registered.";
      if (error.code === "auth/wrong-password") description = "Incorrect password.";
      if (error.code === "auth/user-not-found") description = "No account found.";
      if (error.code === "auth/weak-password") description = "Password too weak.";

      toast({ variant: "destructive", title, description });
    } finally {
      setLoading(false);
    }
  }

  const handleSocialLogin = async (providerMethod: () => Promise<void>) => {
    try {
      await providerMethod();
      router.push("/dashboard");
    } catch (error) {
      console.error("Social login error", error);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-muted/50 overflow-hidden">
      <Card className="mx-auto w-full max-w-sm shadow-xl border-0 sm:border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardHeader className="text-center pb-2 pt-6">
          <div className="flex justify-center items-center mb-1">
            <Book className="h-5 w-5 mr-2 text-primary" />
            <CardTitle className="text-lg font-bold tracking-tight">
              Deogiri Library Management
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            {isSignUp ? "Create account to get started" : "Welcome back! Please login"}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-6 px-6">
          <form onSubmit={handleAuth}>
            <div className="grid gap-3">

              <div className="grid gap-1.5">
                <Label htmlFor="email" className="text-xs font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>

              <div className="grid gap-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-xs font-medium">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>


              <Button type="submit" className="w-full mt-2 h-8 text-sm font-semibold shadow-sm" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
                {isSignUp ? "Sign Up" : "Login"}
              </Button>

              <div className="text-center text-xs mt-1">
                <span className="text-muted-foreground">
                  {isSignUp ? "Existing user? " : "New student? "}
                </span>
                <button
                  type="button"
                  className="underline text-primary hover:text-primary/80 font-medium ml-1 transition-colors"
                  onClick={() => setIsSignUp(!isSignUp)}
                >
                  {isSignUp ? "Login here" : "Create account"}
                </button>
              </div>


              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-background px-2 text-muted-foreground font-medium">
                    Or
                  </span>
                </div>
              </div>


              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full h-8 px-0 text-xs shadow-sm" type="button" onClick={() => handleSocialLogin(signInWithGoogle)}>
                  <svg className="mr-2 h-3 w-3" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.902,35.688,44,30.41,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="w-full h-8 px-0 text-xs shadow-sm" type="button" onClick={() => handleSocialLogin(signInWithGithub)}>
                  <Github className="mr-2 h-3 w-3" />
                  GitHub
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}