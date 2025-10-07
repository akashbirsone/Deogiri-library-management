
"use client";

import { useApp } from "@/contexts/app-provider";
import { StudentInfoForm } from "@/components/student-info-form";
import LoginPage from "@/components/login-page";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { authUser, studentProfile, loading } = useApp();
  const router = useRouter();

  // This effect handles redirection based on the authentication and profile status.
  useEffect(() => {
    // We wait until the initial loading is complete before making any decisions.
    if (loading) {
      return;
    }

    // If the user is authenticated and has a complete student profile,
    // they should be on the dashboard.
    if (authUser && studentProfile) {
      router.replace('/dashboard');
    }
    
    // If the user is logged out, they should be on the login page.
    if (!authUser) {
      // No explicit router.replace('/') is needed here, because the component's
      // render logic below will render the LoginPage. This prevents a flash
      // of the "Redirecting..." message on initial load for logged-out users.
      return;
    }
    
    // If the user is authenticated but does NOT have a profile, they should stay on this page
    // to see the StudentInfoForm. If they are not logged in, they should see the LoginPage.
    // No explicit redirection is needed for these cases as the component handles it below.

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
  // is processing the redirection to the dashboard.
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">Redirecting to dashboard...</div>
    </div>
  );
}
