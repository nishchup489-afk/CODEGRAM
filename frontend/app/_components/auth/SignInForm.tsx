"use client";

import dynamic from "next/dynamic";
import AuthLoading from "./AuthLoading";
import { authAppearance } from "./appearance";
import styles from "./auth.module.css";

// Keep Clerk's browser-only host out of server hydration.
const SignIn = dynamic(() => import("@clerk/nextjs").then((clerk) => clerk.SignIn), {
  ssr: false,
  loading: () => <AuthLoading />,
});

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
