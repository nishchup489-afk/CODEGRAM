import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ArrowLeft, ArrowUpRight, Check, LockKeyhole, Terminal } from "lucide-react";
import styles from "./auth.module.css";

export type AuthMode = "sign-in" | "sign-up";

const classes = ["build", "ship", "practice", "write", "log"] as const;
const weeks = Array.from({ length: 16 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => {
    const seed = week * 7 + day;
    return {
      kind: classes[(seed * 3 + week) % classes.length],
      empty: seed % 9 === 0 || (day === 6 && week % 3 === 0),
      opacity: [0.35, 0.55, 0.75, 1][(seed + week) % 4],
    };
  }),
);

function RecordPreview({ mode }: { mode: AuthMode }) {
  return (
    <figure className={styles.preview} aria-labelledby="record-caption">
      <div className={styles.record}>
        <div className={styles.recordTop}>
          <span className={styles.recordTitle}>A little work, every day.</span>
          <span className={styles.sample}>Sample record</span>
        </div>
        <div className={styles.months} aria-hidden="true">
          <span>JUN</span><span>JUL</span><span>AUG</span><span>SEP</span>
        </div>
        <div className={styles.graph} role="img" aria-label="An example contribution graph with build, ship, practice, write, and log activity over sixteen weeks.">
          {weeks.map((week, wi) => (
            <div className={styles.week} key={wi}>
              {week.map((cell, di) => (
                <span
                  key={di}
                  className={styles.cell}
                  style={{
                    "--cell-color": cell.empty ? "var(--wash)" : `var(--${cell.kind})`,
                    "--cell-opacity": cell.empty ? 1 : cell.opacity,
                    "--cell-delay": `${200 + wi * 35 + di * 18}ms`,
                  } as CSSProperties}
                />
              ))}
            </div>
          ))}
        </div>
        <ul className={styles.legend} aria-label="Types of work">
          {classes.map((kind) => (
            <li key={kind}><span style={{ background: `var(--${kind})` }} aria-hidden="true" />{kind}</li>
          ))}
        </ul>
        <div className={styles.entry}>
          <span className={styles.entryIcon}><Terminal size={16} aria-hidden="true" /></span>
          <div>
            <p>{mode === "sign-in" ? "Made the slow query a fast one." : "Built something worth remembering."}</p>
            <span>api-service <span aria-hidden="true">/</span> build + log</span>
          </div>
          <Check className={styles.entryCheck} size={15} aria-label="Recorded" />
        </div>
        <div className={styles.recordBottom}>
          <span>More than a commit history.</span>
          <span className={styles.recordDots} aria-hidden="true">{classes.map((kind) => <i key={kind} style={{ background: `var(--${kind})` }} />)}</span>
        </div>
      </div>
      <figcaption id="record-caption">The work behind the work. Finally visible.</figcaption>
    </figure>
  );
}

export default function AuthShell({ mode, children }: { mode: AuthMode; children: ReactNode }) {
  const signingUp = mode === "sign-up";

  return (
    <div className={`dm ${styles.page}`}>
      <a className={styles.skipLink} href="#auth-form">Skip to {signingUp ? "sign up" : "sign in"}</a>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="DevManiac home">
          <span className={styles.mark} aria-hidden="true"><span /><span /><span /></span>
          devmaniac
        </Link>
        <Link className={styles.backLink} href="/"><ArrowLeft size={14} aria-hidden="true" /><span>Back to home</span></Link>
      </header>

      <main className={styles.main}>
        <section className={styles.story} aria-labelledby="auth-story-title">
          <div className={styles.storyContent}>
            <div className={styles.eyebrow}><span aria-hidden="true" />A record of the work you do</div>
            <h1 id="auth-story-title" className={styles.headline}>
              {signingUp ? <>Your work deserves<br />a little more <em>credit.</em></> : <>Good to have<br />you <em>back.</em></>}
            </h1>
            <p className={styles.description}>
              {signingUp
                ? "The builds, the breakthroughs, the afternoons spent figuring it out. Give them a place in your story."
                : "The quiet progress. The problems solved. The things you shipped. Pick up your story where you left off."}
            </p>
            <RecordPreview mode={mode} />
            <p className={styles.storyFootnote}><span>Built for the whole developer.</span><span>Not just the commits.</span></p>
          </div>
        </section>

        <section className={styles.formSection} aria-label={signingUp ? "Create your DevManiac account" : "Sign in to DevManiac"}>
          <div id="auth-form" className={styles.formContent} tabIndex={-1}>
            <div className={styles.formEyebrow}><span className={styles.chapter}>{signingUp ? "01" : "↳"}</span>{signingUp ? "YOUR FIRST CHAPTER" : "YOUR WORKSPACE"}</div>
            {children}
            <div className={styles.privacyNote}><LockKeyhole size={13} aria-hidden="true" /><span>{signingUp ? "Your record starts private. You choose what to share." : "Your work, right where you left it."}</span></div>
            <div className={styles.switchAccount}>
              <span>{signingUp ? "Already have an account?" : "New to DevManiac?"}</span>
              <Link href={signingUp ? "/sign-in" : "/sign-up"}>{signingUp ? "Sign in" : "Start your record"}<ArrowUpRight size={14} aria-hidden="true" /></Link>
            </div>
            <p className={styles.legal}>By continuing, you agree to our <Link href="/terms">Terms</Link> and <Link href="/guidelines">Community Guidelines</Link>, and acknowledge our <Link href="/privacy">Privacy Policy</Link>.</p>
          </div>
        </section>
      </main>

      <footer className={styles.footer}><span>Small steps. A lasting record.</span><span className={styles.release}><span aria-hidden="true" />V2.0-a <span className={styles.releaseDetail}>/ Free while we build in the open</span></span></footer>
    </div>
  );
}
