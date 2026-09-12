"use client";

import { SignUp, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import api from "@/app/_lib/api";
import AuthLoading from "./AuthLoading";
import { authAppearance } from "./appearance";
import styles from "./auth.module.css";

export default function SignUpForm() {
  const { isLoaded, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !user?.id) return;
    let cancelled = false;

    async function redirectExistingUser() {
      try {
        const { data } = await api.get("/sync_user/onboarding");
        if (cancelled) return;
        router.replace(data?.onboarding_completed && data?.username
          ? `/u/${data.username}`
          : "/onboarding");
      } catch {
        if (!cancelled) router.replace("/sync");
      }
    }

    void redirectExistingUser();
    return () => { cancelled = true; };
  }, [isLoaded, user?.id, router]);

  return (
    <div className={styles.widget}>
      {user ? <AuthLoading redirecting /> : (
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          forceRedirectUrl="/sync"
          signInFallbackRedirectUrl="/sync"
          appearance={authAppearance}
          fallback={<AuthLoading />}
        />
      )}
    </div>
  );
}
