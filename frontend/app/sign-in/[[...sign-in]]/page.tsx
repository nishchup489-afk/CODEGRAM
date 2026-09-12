import type { Metadata } from "next";
import AuthShell from "@/app/_components/auth/AuthShell";
import SignInForm from "@/app/_components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Welcome back to DevManiac. Pick up your work record where you left off.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <AuthShell mode="sign-in"><SignInForm /></AuthShell>;
}
