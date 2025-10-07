
"use client";

import { useApp } from "@/contexts/app-provider";
import { StudentInfoForm } from "@/components/student-info-form";
import LoginPage from "@/components/login-page";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { authUser, studentProfile, loading } = useApp();
  const router = useRouter();

  // This effect handles the final, successful redirection to the dashboard.
  // It only runs when the user is fully authenticated and has a profile.
  useEffect(() => {
    // If we are done loading, the user is authenticated, and they have a profile,
    // then it's safe to redirect to the dashboard.
    if (!loading && authUser && studentProfile) {
      router.replace('/dashboard');
    }
  }, [authUser, studentProfile, loading, router]);


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

  // If the user is authenticated but doesn't yet have a student profile in Firestore,
  // we must show them the form to collect the required additional information.
  if (authUser && !studentProfile) {
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
