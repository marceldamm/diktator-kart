# Instructions for GitHub Copilot in this repository

Read the root `AGENTS.md` before changing files. It contains the canonical project, team, safety, budget, Git, and review rules. Do not copy those rules into another competing source.

For each assigned issue:

- Confirm that it is an approved task. An issue marked as an unconfirmed proposal is for analysis only; do not implement it without an explicit approval recorded in the issue.
- Follow the issue's scope and acceptance criteria. Do not silently change established product principles or Sarah's original ideas.
- Work only on the active Babylon.js project (`src/`, `public/`, `art-source/`) and its relevant documentation. Legacy paths are historical references.
- Keep the four canonical team files (`CURRENT-WORKLIST.md`, `LONG-TERM-GOALS.md`, `TEAM-CHANGES.md`, `TEAM-NOTES.md`) consistent with any accepted workflow or project decision. Record technical evidence and limits in `PROGRESS-LOG.md`.
- Run the repository checks required by the issue and report exactly what ran and what remains unverified. `npm test` and `npm run build` are the automated baseline; visible browser/art review remains a separate human check.
- Do not push directly to `main`, change repository settings, add paid services, publish the game, or merge a pull request. Prepare a reviewable pull request and wait for human approval.

If an issue requires an unresolved creative decision, confidential workplace information, a paid service, or a visual/runtime judgment you cannot perform, stop that part, preserve the work, and state the specific decision or evidence needed.
