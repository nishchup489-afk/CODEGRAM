import Link from "next/link";

/* ─────────────────────────────────────────────────────────
   V2.0-a LANDING PAGE
   Design system lives in app/globals.css (.dm-* classes).
───────────────────────────────────────────────────────── */

type ClassKey = "build" | "ship" | "practice" | "write" | "log";

const CLASS_COLOR: Record<ClassKey, string> = {
  build: "#2D5BD6",
  ship: "#0E8A6A",
  practice: "#7A4BC9",
  write: "#C2761B",
  log: "#B33A46",
};

const EMPTY = "#F2F2F0";

/** Blend a class colour over the empty-cell wash at a given intensity. */
function tint(key: ClassKey, level: number) {
  const alpha = [0.28, 0.42, 0.62, 0.82, 1][Math.max(0, Math.min(4, level - 1))];
  const hex = CLASS_COLOR[key];
  const f = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const b = [242, 242, 240];
  const out = f.map((c, i) => Math.round(c * alpha + b[i] * (1 - alpha)));
  return "rgb(" + out[0] + " " + out[1] + " " + out[2] + ")";
}

/* ── Hero comparison data ─────────────────────────────── */

type Cell = { c: ClassKey; l: number; r?: ClassKey } | null;

const WEEK_LABELS = [
  "Jul 20",
  "Jul 27",
  "Aug 3",
  "Aug 10",
  "Aug 17",
  "Aug 24",
  "Aug 31",
];

const MINE: Cell[][] = [
  [
    { c: "practice", l: 4, r: "ship" },
    { c: "log", l: 3 },
    { c: "log", l: 1 },
    null,
    { c: "build", l: 5, r: "practice" },
    { c: "build", l: 4 },
    { c: "build", l: 4 },
  ],
  [
    { c: "build", l: 5, r: "practice" },
    { c: "write", l: 1 },
    { c: "build", l: 4 },
    { c: "build", l: 4, r: "write" },
    null,
    { c: "build", l: 4, r: "ship" },
    { c: "log", l: 3 },
  ],
  [
    { c: "build", l: 5, r: "practice" },
    { c: "practice", l: 4, r: "ship" },
    { c: "build", l: 4, r: "ship" },
    { c: "practice", l: 4 },
    { c: "log", l: 3 },
    { c: "practice", l: 4, r: "write" },
    { c: "build", l: 4 },
  ],
  [
    { c: "build", l: 4, r: "ship" },
    { c: "ship", l: 2 },
    { c: "ship", l: 3, r: "build" },
    null,
    { c: "practice", l: 5, r: "build" },
    null,
    null,
  ],
  [
    { c: "practice", l: 4, r: "build" },
    null,
    { c: "practice", l: 4, r: "ship" },
    { c: "practice", l: 4, r: "ship" },
    { c: "log", l: 4, r: "ship" },
    null,
    null,
  ],
  [
    { c: "practice", l: 3 },
    { c: "log", l: 4, r: "build" },
    { c: "log", l: 3 },
    { c: "practice", l: 5, r: "build" },
    { c: "log", l: 4, r: "write" },
    { c: "ship", l: 2 },
    null,
  ],
  [
    { c: "build", l: 4, r: "write" },
    { c: "practice", l: 4 },
    { c: "log", l: 3 },
    { c: "ship", l: 3, r: "write" },
    { c: "build", l: 3 },
    { c: "build", l: 2 },
    { c: "ship", l: 3, r: "practice" },
  ],
];

/** GitHub's own contribution scale, light theme. Index 0 is an empty day. */
const GH_SCALE = ["#EBEDF0", "#9BE9A8", "#40C463", "#30A14E", "#216E39"];

/** The same seven weeks as GitHub sees them: four commit days, its own colours. */
const GH_LEVELS: Record<string, number> = {
  "0-5": 2,
  "1-3": 1,
  "2-6": 3,
  "3-4": 1,
};

const GITHUB: number[][] = Array.from({ length: 7 }, (_, w) =>
  Array.from({ length: 7 }, (_, d) => GH_LEVELS[w + "-" + d] ?? 0)
);

/* ── The graph section ────────────────────────────────── */

const DAYS: { day: string; bands: { c: ClassKey; n: number }[] }[] = [
  { day: "Mon", bands: [{ c: "build", n: 3 }, { c: "write", n: 1 }] },
  {
    day: "Tue",
    bands: [
      { c: "practice", n: 3 },
      { c: "build", n: 2 },
      { c: "log", n: 1 },
    ],
  },
  { day: "Wed", bands: [{ c: "build", n: 3 }, { c: "ship", n: 1 }] },
  { day: "Thu", bands: [{ c: "log", n: 2 }, { c: "write", n: 1 }] },
  {
    day: "Fri",
    bands: [
      { c: "build", n: 3 },
      { c: "ship", n: 1 },
      { c: "write", n: 1 },
    ],
  },
  { day: "Sat", bands: [{ c: "practice", n: 2 }, { c: "write", n: 1 }] },
  { day: "Sun", bands: [] },
];

const CLASSES: { key: ClassKey; what: string; cap: number; short: string }[] = [
  { key: "build", what: "Commits, pull requests, merges", cap: 3, short: "commits, PRs" },
  { key: "ship", what: "Releases, tags, deploys", cap: 1, short: "releases" },
  { key: "practice", what: "Exercises, coursework, drills", cap: 3, short: "exercises" },
  { key: "write", what: "Posts, docs, review comments", cap: 1, short: "docs, reviews" },
  { key: "log", what: "Research, design, debugging, meetings", cap: 2, short: "everything else" },
];

/* ── Other sections ───────────────────────────────────── */

const CORROBORATION = [
  {
    mark: "check",
    name: "Corroborated",
    body: "A commit you authored inside the window describes the same work. The strongest thing the record can say about an entry.",
  },
  {
    mark: "half",
    name: "Partly corroborated",
    body: "You were committing around it, but nothing in the history matches the text. Common, and honest.",
  },
  {
    mark: "open",
    name: "Attested",
    body: "Your word, server-timestamped and frozen. Can still be corroborated later by whatever it produced.",
  },
];

const DEADLINES = [
  {
    name: "MLH Fellowship — Spring 2027",
    meta: "Closes 11 Sep · Remote · 12 weeks",
    left: "in 3 days",
  },
  {
    name: "HackMIT 2026",
    meta: "Closes 14 Sep · Cambridge MA",
    left: "in 6 days",
  },
  {
    name: "Google STEP Internship — Summer 2027",
    meta: "Closes 30 Sep · Sophomore · US",
    left: "in 22 days",
  },
];

const PRIVACY = [
  {
    name: "Entry text and timestamps",
    body: "What you wrote, and when it reached us. The timestamp is ours, never your machine's — that's the part that makes the record worth reading.",
  },
  {
    name: "GitHub events, not source",
    body: "Commit metadata for repos you link. For private repos, a daily count and nothing else. We request no repository content scope.",
  },
  {
    name: "Private until you publish",
    body: "Your profile is off by default. A daily commit pattern is inferable employer information, so publishing is an explicit choice you make once.",
  },
  {
    name: "Leaving takes everything",
    body: "Delete your record and the matched GitHub events go with it. Export first if you want a copy.",
  },
];

const ROADMAP = [
  {
    version: "V2.0-a",
    status: "Live",
    live: true,
    title: "The record",
    body: "The log, the graph, and the two ways work gets in. No judgment of any kind.",
    items: [
      "CLI and git hook",
      "GitHub App + private counts",
      "Five-class graph",
      "Deadline tracker",
    ],
  },
  {
    version: "V2.0-b",
    status: "Coming soon",
    live: false,
    title: "Corroboration",
    body: "Commit ingestion for linked repos, and the engine that checks an entry against the history around it.",
    items: [
      "Corroborated / partial / attested",
      "Retroactive corroboration",
      "Weekly review",
      "Review doc export — paid",
    ],
  },
  {
    version: "V2.0-c",
    status: "Coming soon",
    live: false,
    title: "Artifact depth",
    body: "A deterministic scan of linked repositories: secrets, tests, CI, migrations, hygiene, history. Rules first, one cached model pass after.",
    items: [
      "Engineering maturity, 9 dimensions",
      "Project tier, derived not chosen",
      "First score, banded",
    ],
  },
  {
    version: "V2.1",
    status: "Later",
    live: false,
    title: "Profile depth",
    body: "The rest of a career, held to the same standard: evidence or it doesn't count.",
    items: [
      "Résumé and LinkedIn import",
      "Skills from the evidence graph",
      "Certificate verification",
      "LeetCode ownership",
    ],
  },
  {
    version: "V2.2+",
    status: "Later",
    live: false,
    title: "Production evidence",
    body: "Claimed usage, verified with the provider that holds it — never a number typed into a form.",
    items: [
      "Stripe, one analytics provider",
      "Open source contribution",
      "Hackathons via organisers",
      "Research via ORCID",
    ],
  },
];

/* ── Small pieces ─────────────────────────────────────── */

function Mark({ size = 16 }: { size?: number }) {
  return (
    <span
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: size / 4,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        flex: "0 0 auto",
      }}
    >
      <span style={{ height: "31%", background: "#8E9198" }} />
      <span style={{ height: "38%", background: "currentColor" }} />
      <span style={{ height: "31%", background: "currentColor" }} />
    </span>
  );
}

function Swatch({ k }: { k: ClassKey }) {
  return (
    <span
      aria-hidden
      style={{
        width: 10,
        height: 10,
        borderRadius: 2,
        background: CLASS_COLOR[k],
        flex: "0 0 auto",
      }}
    />
  );
}

function Grid({
  weeks,
  github = false,
}: {
  weeks: Cell[][] | number[][];
  github?: boolean;
}) {
  return (
    <div className="flex gap-2.5 sm:gap-5">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          <div
            className="grid gap-1"
            style={{
              gridTemplateRows: "repeat(7, 14px)",
              gridAutoFlow: "column",
            }}
          >
            {(week as (Cell | number)[]).map((cell, di) => {
              if (github) {
                return (
                  <div
                    key={di}
                    className="dm-cell"
                    style={{
                      background: GH_SCALE[cell as number],
                      borderRadius: 2,
                    }}
                  />
                );
              }
              const c = cell as Cell;
              if (!c) return <div key={di} className="dm-cell" />;
              return (
                <div
                  key={di}
                  className="dm-cell"
                  style={{ background: tint(c.c, c.l) }}
                >
                  {c.r ? (
                    <span
                      style={{ height: 3, background: CLASS_COLOR[c.r] }}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
          <div className="dm-fine">{WEEK_LABELS[wi]}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────── */

export default function Page() {
  return (
    <div className="dm min-h-screen">
      {/* NAV */}
      <header className="dm-band sticky top-0 z-50 border-b border-(--line)">
        <nav className="dm-shell flex h-17 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-(--ink)">
            <Mark />
            <span className="text-[15px] font-medium tracking-[-0.01em]">
              devmaniac
            </span>
          </Link>

          <div className="flex items-center gap-5 sm:gap-7">
            <a
              href="#how-it-works"
              className="dm-body hidden text-[15px] sm:block"
            >
              How it works
            </a>
            <a
              href="#corroboration"
              className="dm-body hidden text-[15px] sm:block"
            >
              Corroboration
            </a>
            <a href="#roadmap" className="dm-body hidden text-[15px] sm:block">
              Roadmap
            </a>
            <Link href="/sign-in" className="text-[15px]">
              Log in
            </Link>
            <Link href="/sign-up" className="dm-btn dm-btn-sm">
              Sign up
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="dm-band">
        <div className="dm-shell pt-16 pb-20 sm:pt-24 sm:pb-28">
          <h1 className="dm-h1 max-w-165">
            GitHub only counts commits. Your work is bigger than that.
          </h1>

          <p className="dm-lede mt-7 max-w-[54ch]">
            Research, design docs, reviews, debugging, private repos — the days
            that look empty on GitHub. DevManiac records them, then checks them
            against your commits so the record means something.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/sign-up" className="dm-btn">
              Start your record
            </Link>
            <span className="dm-chip">
              {'devmaniac push -t "…" -p "…" -s "…"'}
            </span>
          </div>

          <p className="dm-fine mt-7">
            Free while V2.0-a is in the open. No card, no scoring, nothing to
            game.
          </p>

          {/* Comparison card */}
          <div className="mt-14 rounded-lg border border-(--line) bg-(--card) p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="dm-h3">The same seven weeks, two records</h2>
              <span className="dm-fine">
                40 days on your record · 4 visible on GitHub
              </span>
            </div>

            <div className="mt-7">
              <div className="dm-fine">On DevManiac</div>
              <div className="mt-3 overflow-x-auto pb-1">
                <Grid weeks={MINE} />
              </div>
            </div>

            <hr className="dm-rule-soft my-8" />

            <div>
              <div className="dm-fine">On GitHub</div>
              <div className="mt-3 overflow-x-auto pb-1">
                <Grid weeks={GITHUB} github />
              </div>
            </div>

            <hr className="dm-rule-soft my-8" />

            <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {CLASSES.map((c) => (
                <li key={c.key} className="flex items-center gap-2">
                  <Swatch k={c.key} />
                  <span className="text-[14px]">{c.key}</span>
                  <span className="dm-fine">{c.short}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* HOW WORK LANDS */}
      <section id="how-it-works" className="dm-band">
        <div className="dm-shell pb-20 sm:pb-28">
          <p className="dm-eyebrow">How work lands</p>
          <h2 className="dm-h2 mt-3">
            Three ways in, none of them a form
          </h2>
          <p className="dm-lede mt-6 max-w-[58ch]">
            A project is created the first time you push to it. It is never
            submitted for evaluation — that was the part everybody skipped.
          </p>

          <hr className="dm-rule mt-12" />

          <div className="grid gap-x-12 gap-y-12 pt-10 md:grid-cols-2">
            <div>
              <h3 className="dm-h3">One command</h3>
              <p className="dm-body mt-3 max-w-[46ch]">
                Title, problem, solution. The project and the linkable commits
                come from the repo you&apos;re standing in.
              </p>
              <pre className="dm-pre mt-5">
{`devmaniac push \\
  -t "Fixed the N+1 in the feed query" \\
  -p "3.2s load, 400 queries per request" \\
  -s "Eager-loaded authors, added an index"`}
              </pre>
            </div>

            <div>
              <h3 className="dm-h3">A git hook</h3>
              <p className="dm-body mt-3 max-w-[46ch]">
                Prompts for one line of why after every commit, pre-linked to
                that commit. Never blocks the commit.
              </p>
              <pre className="dm-pre mt-5">devmaniac hook install</pre>
            </div>

            <div>
              <h3 className="dm-h3">GitHub, including private</h3>
              <p className="dm-body mt-3 max-w-[46ch]">
                Commits, PRs, reviews and releases arrive on their own. Private
                repos report a count and nothing else — we request no repository
                access.
              </p>
              <p className="dm-fine mt-4">
                Your employer&apos;s source never touches our servers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* THE GRAPH */}
      <section className="dm-band">
        <div className="dm-shell pb-20 sm:pb-28">
          <p className="dm-eyebrow">The graph</p>
          <h2 className="dm-h2 mt-3">Five classes, no judgment</h2>
          <p className="dm-lede mt-6 max-w-[60ch]">
            A day is a composition, not an intensity. A day of research and a
            design doc renders as a real day — on GitHub it&apos;s blank. What
            the work was worth is a separate question, and not one this graph
            answers.
          </p>

          <div className="mt-12 flex gap-2 sm:gap-4">
            {DAYS.map((d) => (
              <div key={d.day} className="min-w-0 flex-1">
                <div
                  className="flex flex-col overflow-hidden rounded-xs"
                  style={{ height: 82, background: EMPTY }}
                >
                  {d.bands.map((b, i) => (
                    <span
                      key={i}
                      style={{
                        flex: b.n,
                        background: CLASS_COLOR[b.c],
                      }}
                    />
                  ))}
                </div>
                <div className="dm-fine mt-2">{d.day}</div>
              </div>
            ))}
          </div>

          <hr className="dm-rule mt-12" />

          <ul>
            {CLASSES.map((c) => (
              <li
                key={c.key}
                className="flex items-center gap-4 border-b border-(--line) py-5"
              >
                <Swatch k={c.key} />
                <span className="w-23 flex-none text-[16px]">{c.key}</span>
                <span className="dm-body flex-1">{c.what}</span>
                <span className="dm-mono text-(--ink-3)">cap {c.cap}</span>
              </li>
            ))}
          </ul>

          <div className="grid gap-x-12 gap-y-10 pt-12 md:grid-cols-2">
            <div>
              <h3 className="dm-h3">Forty commits and three fill the same square</h3>
              <p className="dm-body mt-3 max-w-[46ch]">
                Each class saturates per day. The graph measures showing up, and
                showing up doesn&apos;t have a volume dial.
              </p>
            </div>
            <div>
              <h3 className="dm-h3">No streak to protect</h3>
              <p className="dm-body mt-3 max-w-[46ch]">
                Days active over six months, not consecutive days. Missing
                Tuesday breaks nothing, so there&apos;s nothing you&apos;d pad
                with filler.
              </p>
            </div>
            <div>
              <h3 className="dm-h3">Private work looks like work</h3>
              <p className="dm-body mt-3 max-w-[46ch]">
                Private contributions render as build with no repo name, on your
                graph and on your public profile alike.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CORROBORATION */}
      <section id="corroboration" className="dm-band-wash">
        <div className="dm-shell py-20 sm:py-28">
          <p className="dm-eyebrow">Corroboration</p>
          <h2 className="dm-h2-serif mt-3">
            A repository can be cloned. A journal cannot be backdated.
          </h2>
          <p className="dm-lede mt-6 max-w-[60ch]">
            Entries are stamped when they reach the server and freeze after 24
            hours. Every one is checked against the commits you authored around
            it, so the log can be read against the history it claims to
            describe.
          </p>

          <hr className="dm-rule mt-12" />

          <ul>
            {CORROBORATION.map((row) => (
              <li
                key={row.name}
                className="grid grid-cols-[24px_1fr] gap-x-4 gap-y-2 border-b border-(--line) py-6 md:grid-cols-[24px_260px_1fr]"
              >
                <span aria-hidden className="pt-1 text-(--ink-2)">
                  {row.mark === "check" ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M1.5 7.5 5 11l7.5-8.5"
                        stroke="#0E8A6A"
                        strokeWidth="1.5"
                      />
                    </svg>
                  ) : row.mark === "half" ? (
                    <svg width="13" height="13" viewBox="0 0 13 13">
                      <circle
                        cx="6.5"
                        cy="6.5"
                        r="5.75"
                        fill="none"
                        stroke="#5A5D63"
                      />
                      <path d="M6.5 0.75a5.75 5.75 0 0 1 0 11.5z" fill="#5A5D63" />
                    </svg>
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 13 13">
                      <circle
                        cx="6.5"
                        cy="6.5"
                        r="5.75"
                        fill="none"
                        stroke="#8E9198"
                      />
                    </svg>
                  )}
                </span>
                <span className="text-[17px] font-medium">{row.name}</span>
                <span className="dm-body col-start-2 md:col-start-3">
                  {row.body}
                </span>
              </li>
            ))}
          </ul>

          <div className="pt-10">
            <h3 className="dm-h3">Research days count by what they produced</h3>
            <p className="dm-body mt-3 max-w-[62ch]">
              {'You can\'t prove reading directly. Link Monday\'s "read the Postgres locking docs" to Thursday\'s merged migration PR and Monday upgrades itself. Three invisible days, then a visible one — which is how the work actually goes.'}
            </p>
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="dm-band">
        <div className="dm-shell py-20 sm:py-28">
          <p className="dm-eyebrow">Who it&apos;s for</p>
          <h2 className="dm-h2 mt-3">One log, two outputs</h2>

          <hr className="dm-rule mt-10" />

          <div className="grid gap-x-12 gap-y-12 pt-10 md:grid-cols-2">
            <div>
              <h3 className="dm-h3">If you&apos;re still getting hired</h3>
              <p className="dm-body mt-4">
                {'Your public record is the artifact — a link that shows six months of composition instead of a résumé line that says "self-taught". GitHub shows the commits; this shows the reading, the debugging and the design work around them.'}
              </p>
              <ul className="mt-7">
                {[
                  "Public profile and graph",
                  "Corroborated entry count",
                  "Deadline tracker",
                ].map((i) => (
                  <li
                    key={i}
                    className="border-t border-(--line) py-3.5 text-[15px] text-(--ink-2)"
                  >
                    {i}
                  </li>
                ))}
                <li className="border-t border-b border-(--line) py-3.5 text-[15px] font-medium">
                  Free, permanently
                </li>
              </ul>
            </div>

            <div>
              <h3 className="dm-h3">If you&apos;re already employed</h3>
              <p className="dm-body mt-4">
                Most of your week is invisible to git: design docs, reviews,
                incidents, mentoring, private repos. Log it as it happens and
                stop reconstructing December from memory.
              </p>
              <ul className="mt-7">
                {[
                  "Private by default",
                  "Private contribution counts only",
                  "Your problem and solution, not a commit message",
                ].map((i) => (
                  <li
                    key={i}
                    className="border-t border-(--line) py-3.5 text-[15px] text-(--ink-2)"
                  >
                    {i}
                  </li>
                ))}
                <li className="border-t border-b border-(--line) py-3.5 text-[15px] font-medium">
                  Review document export — V2.0-b
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* DEADLINES */}
      <section className="dm-band">
        <div className="dm-shell pb-20 sm:pb-28">
          <p className="dm-eyebrow">Also shipping</p>
          <h2 className="dm-h2 mt-3 max-w-155">
            Deadlines, because some days aren&apos;t coding days
          </h2>
          <p className="dm-lede mt-6 max-w-[56ch]">
            Hackathons, fellowships and sophomore programmes, scraped and
            grouped by how soon they close.
          </p>

          <hr className="dm-rule mt-10" />

          <ul>
            {DEADLINES.map((d) => (
              <li
                key={d.name}
                className="flex flex-wrap items-start justify-between gap-x-6 gap-y-1 border-b border-(--line) py-5"
              >
                <div>
                  <div className="text-[17px]">{d.name}</div>
                  <div className="dm-fine mt-1">{d.meta}</div>
                </div>
                <div className="text-[16px] whitespace-nowrap">{d.left}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PRIVACY */}
      <section className="dm-band">
        <div className="dm-shell pb-20 sm:pb-28">
          <p className="dm-eyebrow">Privacy</p>
          <h2 className="dm-h2 mt-3">
            What we hold, and what we never ask for
          </h2>

          <hr className="dm-rule mt-10" />

          <ul>
            {PRIVACY.map((p) => (
              <li
                key={p.name}
                className="grid gap-x-10 gap-y-2 border-b border-(--line) py-6 md:grid-cols-[300px_1fr]"
              >
                <span className="text-[17px] font-medium">{p.name}</span>
                <span className="dm-body">{p.body}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" className="dm-band-ink">
        <div className="dm-shell py-20 sm:py-28">
          <p className="dm-eyebrow">Roadmap</p>
          <h2 className="dm-h2 mt-3 text-(--onink)">
            V2.0-a is what&apos;s live. Here&apos;s the rest of it.
          </h2>
          <p className="dm-lede mt-6 max-w-[58ch]">
            Nothing below is behind a waitlist and nothing below has a date. It
            ships in this order because each phase needs the one before it to
            mean anything.
          </p>

          <hr className="dm-rule mt-12" />

          <ul>
            {ROADMAP.map((phase) => (
              <li
                key={phase.version}
                className="grid gap-x-10 gap-y-6 border-b border-(--onink-line) py-9 md:grid-cols-[240px_1fr]"
              >
                <div>
                  <div className="dm-mono text-(--onink-3)">
                    {phase.version}
                  </div>
                  <span
                    className={
                      "dm-badge mt-3 " + (phase.live ? "dm-badge-live" : "")
                    }
                  >
                    {phase.status}
                  </span>
                  <ul className="mt-7 space-y-1.5">
                    {phase.items.map((i) => (
                      <li key={i} className="text-[15px] text-(--onink-2)">
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="dm-h3 text-(--onink)" style={{ fontSize: 19 }}>
                    {phase.title}
                  </h3>
                  <p className="dm-body mt-3 max-w-[62ch]">{phase.body}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="pt-10">
            <h3 className="dm-h3 text-(--onink)">
              Two things that will never ship
            </h3>
            <p className="dm-body mt-3 max-w-[62ch]">
              A follower count that affects your standing, and a public badge
              accusing anyone of anything. Reach measures who knows you exist.
              Negative findings go to you first, or they don&apos;t publish.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="dm-band">
        <div className="dm-shell py-20 sm:py-28">
          <h2 className="dm-h2">Your record starts with the first push.</h2>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/sign-up" className="dm-btn">
              Start your record
            </Link>
            <span className="dm-chip">pipx install devmaniac</span>
          </div>
          <p className="dm-fine mt-7">
            Two minutes: connect GitHub, flip on private contributions, push
            once.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="dm-band border-t border-(--line)">
        <div className="dm-shell flex flex-wrap items-center justify-between gap-4 py-7">
          <div className="flex items-center gap-2 text-(--ink)">
            <Mark size={14} />
            <span className="text-[15px]">devmaniac</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            {[
              { label: "Changelog", href: "/changelog" },
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Docs", href: "https://docs.devmaniac.com" },
              { label: "GitHub", href: "https://github.com/devmaniac" },
            ].map((l) => (
              <Link key={l.label} href={l.href} className="dm-body text-[15px]">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
