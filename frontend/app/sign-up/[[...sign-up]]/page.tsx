import type { Metadata } from "next";
import AuthShell from "@/app/_components/auth/AuthShell";
import SignUpForm from "@/app/_components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Start your DevManiac record. Give every build, breakthrough, and quiet bit of progress a place in your story.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <AuthShell mode="sign-up"><SignUpForm /></AuthShell>;
}
