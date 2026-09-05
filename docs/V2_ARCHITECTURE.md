# DevManiac V2 — SWE Verification Plan

## Verification Levels

- **V0 — Self-Reported**: no independent evidence.
- **V1 — Evidence Submitted**: user uploaded evidence, not independently validated.
- **V2 — Source Corroborated**: DevManiac independently finds supporting public/connected evidence.
- **V3 — Source Verified**: authoritative source, authenticated account, official API, or ownership challenge verifies the claim or specific fields.
- **V4 — Institution Verified**: employer, university, organizer, or trusted verification provider directly confirms the claim.

### Verification metadata

Each claim can also track:

- verification coverage
- confidence
- freshness: `current | aging | stale`
- status: `verified | partially_verified | conflicting | expired | revoked | unable_to_verify`

## Verification UI

Keep V0–V4 and confidence details internal by default.

Public states:

- **Verified**
- **Partially verified**
- **Evidence-backed**
- **Self-reported**
- **Stale / conflicting** only when needed

Example claim:

```text
Microsoft
Software Engineering Intern
May–Aug 2027

✓ Verified
```

On click:

```text
Employer   ✓
Role       ✓
Dates      ✓
Location   —

Source: Employer confirmation
Coverage: 86%
Confidence: 98%
Verified: Sep 2027
```

Profile summary:

```text
SWE Score: 812
Career Verified: 91%

16 verified
3 partial
2 self-reported
```

Rule: **complex verification engine, simple verification UX.**

---

# Skill Verification

## Skill import

1. If a strong LinkedIn archive is submitted, import skills from it.
2. Match imported skills against resume data.
3. Deduplicate aliases and remove noise/fluff.
4. Move unsupported/noisy skills to **Draft/Junk** instead of public profile.
5. If no LinkedIn archive exists, use resume as the initial skill source.

## Separate claim state from experience level

### Claim state

- **Draft** — imported but unsupported/not selected.
- **Claimed** — user explicitly keeps the skill or some evidence exists.
- **Verified** — strong supporting evidence exists from verified sources.

### Experience level

- **No demonstrated experience**
- **Foundational**
- **Applied**
- **Advanced**
- **Professional**

Example:

```text
Python
Claim state: Verified
Experience: Advanced
Evidence strength: High
```

## Evidence strength

| Evidence | Strength |
|---|---|
| LinkedIn endorsement | Low |
| Resume mention | Very low |
| Article/blog | Low |
| Small GitHub project | Low |
| Completion certificate | Low |
| Assessed certificate | Low-medium |
| Large completed project | Medium |
| Tutorial with real audience/reviews | Medium |
| Open-source contribution | High |
| Professional certification | High |
| Internship using the skill | Very high |
| Professional work using the skill | Very high |
| Future DevManiac OA | Very high |

Rules:

- **Evidence quality > evidence quantity.**
- Ten toy/tutorial repos must not outrank one serious production system.
- LinkedIn skill alone stays **Draft**.
- Skill experience should be inferred from demonstrated work, not self-selected labels.
- Generic soft/noise skills should not affect SWE score.

## Skill evidence graph

Example:

```text
Python
├── completed projects
├── production deployments
├── OSS contributions
├── internship/work evidence
├── HackerRank/other assessments
├── certifications
└── future DevManiac OA
```

Skills should be scored from the evidence graph, not from a single source.

---

# Certificates

## Certificate classes

| Tier | Type | Example | SWE score impact |
|---|---|---|---|
| **C1** | Completion only | Udemy/Coursera completion | None |
| **C2** | Assessed course certificate | graded projects/quizzes | None |
| **C3** | Proctored / exam-based | AWS Cloud Practitioner | Very low |
| **C4** | Professional industry certification | AWS SAA, CKA, Security+ | Mild |
| **C5** | Elite / difficult credential | selective, rigorous technical credential | Higher, but capped |

## Certificate scoring rules

- **C1**: may weakly endorse a skill; no direct SWE score impact.
- **C2**: stronger skill endorsement; no direct SWE score impact.
- **C3**: moderate skill endorsement; very small direct score impact.
- **C4**: strong skill/domain endorsement; mild direct score impact.
- **C5**: strong endorsement and meaningful but capped score impact.
- Certificate farming must never be a viable way to inflate SWE score.
- Certificates should support skills; they should not create skill proficiency by themselves.

## Public visibility

- C1/C2: hidden from primary profile or shown in a bottom **Learning & Coursework** section.
- C3/C4/C5: public when source-verified.
- Self-reported/unverified certificates: Draft by default.

## Certificate verification

1. **Official issuer API / verification page** — strongest.
2. **Digital credential provider** — Credly, Accredible, Badgr, etc.
3. **Authoritative public credential page**.
4. **Uploaded PDF/image** — V1 Evidence Submitted only.
5. **Self-reported** — V0.

An uploaded certificate image/PDF **does not receive verified status or ranking impact** until DevManiac validates the credential against an authoritative source.

### Certificate model

```text
CertificateClaim
├── issuer
├── name
├── credential_id
├── credential_url
├── issued_at
├── expires_at
├── verification_level
├── verification_source
├── verified_at
└── status
```

Example verified credential:

```text
AWS Solutions Architect Associate
✓ Credential verified
Issuer: AWS
Active until: May 2029
```

Example uploaded-only credential:

```text
Python Course Certificate
◇ Evidence-backed
Uploaded certificate only
```

## Core principle

> **Skills are inferred from evidence. Certificates only strengthen the evidence graph.**
