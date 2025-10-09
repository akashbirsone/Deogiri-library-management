
"use client";

import { useApp } from "@/contexts/app-provider";
import { StudentInfoForm } from "@/components/student-info-form";
import LoginPage from "@/components/login-page";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Role } from "@/types";

// Helper to determine where to redirect based on role and profile status
const getRedirectPath = (role: Role, hasProfile: boolean): string | null => {
  if (role === 'admin' || role === 'librarian') {
    return '/dashboard';
  }
  if (role === 'student' && hasProfile) {
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
      const hasProfile = !!user?.studentId; // A simple check to see if the student profile is complete
      const path = getRedirectPath(user.role, hasProfile);
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
  // This is the key state for new student sign-ups.
  if (authUser && user.role === 'student' && !user.studentId) {
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
