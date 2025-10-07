"use client";

import { useApp } from "@/contexts/app-provider";
import { StudentInfoForm } from "@/components/student-info-form";
import LoginPage from "@/components/login-page";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { authUser, studentProfile, loading } = useApp();
  const router = useRouter();

  // This effect handles redirection after login.
  useEffect(() => {
    // We wait until loading is false to ensure auth state is determined.
    // If the user is authenticated (authUser exists) and has a profile,
    // we redirect them to the dashboard.
    if (!loading && authUser && studentProfile) {
      router.replace('/dashboard');
    }
  }, [authUser, studentProfile, loading, router]);


  // Show a loading indicator while Firebase is initializing.
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If not loading and there's no authenticated user, show the login page.
  if (!authUser) {
    return <LoginPage />;
  }

  // If the user is authenticated but doesn't have a student profile in Firestore,
  // show the form to collect additional information.
  if (authUser && !studentProfile) {
    return <StudentInfoForm />;
  }

  // This is a fallback state while the useEffect for redirection is running.
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">Redirecting...</div>
    </div>
  );
}
