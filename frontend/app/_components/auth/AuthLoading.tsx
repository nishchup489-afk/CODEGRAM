"use client";

import { useEffect, useState } from "react";
import styles from "./auth.module.css";

export default function AuthLoading({ redirecting = false }: { redirecting?: boolean }) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setSlow(true), 12000);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div className={styles.loading} role="status" aria-live="polite">
      <span className={styles.loadingBar} aria-hidden="true" />
      <span className={styles.loadingBar} aria-hidden="true" />
      <span className={styles.loadingBar} aria-hidden="true" />
      <p>{slow ? <>This is taking a little longer than usual. Check your connection and <a href={redirecting ? "/sync" : ""}>try again</a>.</> : redirecting ? "Opening your workspace…" : "Getting your secure sign-in ready…"}</p>
    </div>
  );
}
