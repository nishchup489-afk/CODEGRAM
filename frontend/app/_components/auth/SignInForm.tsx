"use client";

import { SignIn } from "@clerk/nextjs";
import AuthLoading from "./AuthLoading";
import { authAppearance } from "./appearance";
import styles from "./auth.module.css";

/**
 * Presentation only.
 *
 * The "already signed in, go away" case is handled in middleware, before this
 * page is ever rendered. Doing it here with `useUser()` + `useEffect` meant a
 * signed-in visitor loaded the whole widget, saw it, and only then got
 * bounced.
 */
export default function SignInForm() {
  return (
    <div className={styles.widget}>
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl="/sync"
        signUpForceRedirectUrl="/sync"
        appearance={authAppearance}
        fallback={<AuthLoading />}
      />
    </div>
  );
}
