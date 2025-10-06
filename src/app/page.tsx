"use client";

import { useApp } from "@/contexts/app-provider";
import { StudentInfoForm } from "@/components/student-info-form";
import LoginPage from "@/components/login-page";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { authUser, studentProfile, loading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!loading && authUser && studentProfile) {
      router.replace('/dashboard');
    }
  }, [authUser, studentProfile, loading, router]);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!authUser) {
    return <LoginPage />;
  }

  if (authUser && !studentProfile) {
    return <StudentInfoForm />;
  }

  // If user and profile exist, the useEffect will trigger the redirect.
  // A loading state can be shown here as well.
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">Redirecting...</div>
    </div>
  );
}
