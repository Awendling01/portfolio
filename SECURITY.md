# Security policy

Personal portfolio site. I take security reports seriously and respond to
every one.

## Reporting a vulnerability

**Do not open a public GitHub issue.** Send the report to
<gohikeco1@gmail.com> with `security` in the subject line, or use GitHub's
[private vulnerability reporting](https://github.com/Awendling01/portfolio/security/advisories/new).

Please include:

- A description of the issue
- The steps needed to reproduce it
- The impact (what an attacker could do)
- Any suggested mitigations, if you have them

I aim to acknowledge within 48 hours and ship a fix within 7 days for anything
exploitable. I'll credit you (or your handle of choice) in the fix commit
unless you prefer to stay anonymous.

## Scope

In scope:

- The deployed site at `andrewwendling.info`
- Anything in this repository

Out of scope:

- Issues that require a compromised admin password (the admin area is
  intentionally protected by a single-factor secret)
- Theoretical issues without a working proof of concept
- Findings purely about missing security headers when the existing CSP /
  CSRF / HSTS setup mitigates the underlying class
- Bots probing `/login` — this is expected and rate-limited

## Supported versions

Only the version deployed at `andrewwendling.info` (i.e. whatever is on
`main`) is supported. Older commits are not patched.
