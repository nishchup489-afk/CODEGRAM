"use client";

import { SignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AuthLoading from "./AuthLoading";
import { authAppearance } from "./appearance";
import styles from "./auth.module.css";

export default function SignInForm() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) router.replace("/sync");
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className={styles.widget}>
      {isSignedIn ? <AuthLoading redirecting /> : (
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          forceRedirectUrl="/sync"
          signUpForceRedirectUrl="/sync"
          appearance={authAppearance}
          fallback={<AuthLoading />}
        />
      )}
    </div>
  );
}
