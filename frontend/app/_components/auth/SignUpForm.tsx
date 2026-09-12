"use client";

import { SignUp } from "@clerk/nextjs";
import AuthLoading from "./AuthLoading";
import { authAppearance } from "./appearance";
import styles from "./auth.module.css";

/**
 * Presentation only.
 *
 * This used to call GET /sync_user/onboarding from an effect to work out where
 * to send an existing user. That call 500'd for a brand new Clerk subject
 * (no row yet), and it duplicated a decision /sync already owns. Everything
 * after "account created" now lands on /sync, which resolves the destination
 * server-side.
 */
export default function SignUpForm() {
  return (
    <div className={styles.widget}>
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        forceRedirectUrl="/sync"
        signInForceRedirectUrl="/sync"
        appearance={authAppearance}
        fallback={<AuthLoading />}
      />
    </div>
  );
}
