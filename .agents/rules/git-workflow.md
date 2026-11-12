---
trigger: always_on
description: Strict Git workflow rules prohibiting autonomous commits and pushes until the user explicitly insists or instructs.
---

## Git Workflow & Autonomous Commit Rules

### 1. Zero Autonomous Commits & Pushes (Strict Guard)
- **Never Commit Autonomously**: Agents MUST NEVER execute `git commit` autonomously after writing code, fixing bugs, applying edits, running tests, or updating documentation.
- **Never Push Autonomously**: Agents MUST NEVER execute `git push` autonomously to any branch or remote.
- **Wait for Explicit User Instruction**: Keep all changes in the working tree (staged or unstaged) so the user can review them. Do NOT run `git commit` until the user explicitly insists and directs you to commit (e.g. "commit it", "commit", "make a commit", "commit and push").

### 2. Allowed Pre-Commit Preparation
While waiting for user direction to commit, agents SHOULD:
- Run verification checks: `npm run typecheck`, `npm test` or `npx vitest run <path>`.
- Run formatting and linting: `npx vp fmt`, `npx vp check --deny-warnings`.
- Keep the knowledge graph up to date: `graphify update .`.
- Present a concise summary of modified files and invite the user to review before committing.

### 3. Execution When User Requests a Commit
When the user explicitly instructs to commit:
- Stage only relevant files (or `git add -A` if all changes belong to the requested scope).
- Write a clean Conventional Commit message (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `perf:`).
- Do NOT push unless the user also specifically requested to push.

