
"use client";

import { useApp } from "@/contexts/app-provider";
import { StudentInfoForm } from "@/components/student-info-form";
import LoginPage from "@/components/login-page";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Role, User } from "@/types";

// Helper to determine where to redirect based on role and profile status
const getRedirectPath = (user: User | null): string | null => {
  if (!user) {
    return null;
  }
  
  if (user.role === 'admin' || user.role === 'librarian') {
    return '/dashboard';
  }
  
  if (user.role === 'student' && user.studentId) {
    return '/dashboard';
  }
  
  return null; // Stay on the current page (which will show the form for new students)
};

export default function Page() {
  const { authUser, user, loading } = useApp();
  const router = useRouter();

  // This effect handles all redirection logic once loading is complete.
  useEffect(() => {
    if (!loading && authUser) {
      const path = getRedirectPath(user);
      if (path) {
        router.replace(path);
      }
    }
  }, [authUser, user, loading, router]);


  // While Firebase is initializing and checking the auth state, show a loading screen.
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If we are done loading and there is no authenticated user, show the login page.
  if (!authUser) {
    return <LoginPage />;
  }
  
  // If the user is authenticated but doesn't have a complete profile yet, show the form.
  // This is the key state for new student sign-ups. Admins/Librarians will be redirected by the useEffect.
  if (authUser && user?.role === 'student' && !user.studentId) {
    return <StudentInfoForm />;
  }

  // This is a fallback state that appears briefly while the useEffect hook
  // is processing the redirection to the dashboard for a fully authenticated user.
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">Redirecting to your dashboard...</div>
    </div>
  );
}
