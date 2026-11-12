---
trigger: always_on
description: Strict Git workflow rules: commit ONLY upon explicit user instruction, and NEVER push to origin (user pushes manually).
---

## Git Workflow & Autonomous Commit Rules

### 1. Strict No-Push Guard (User Pushes Exclusively)
- **NEVER Push to Remote**: Agents MUST NEVER execute `git push` to origin or any remote under any circumstances.
- **Pushing is User-Only**: Only the user executes `git push`. Agents must never run `git push`, even if the user says "commit and push" (the agent only commits and reminds the user to push).

### 2. Zero Autonomous Commits
- **Never Commit Autonomously**: Agents MUST NEVER execute `git commit` autonomously after writing code, fixing bugs, applying edits, running tests, or updating documentation.
- **Wait for Explicit User Instruction**: Keep all changes in the working tree (staged or unstaged) so the user can review them. Do NOT run `git commit` until the user explicitly insists and directs you to commit (e.g. "commit it", "commit").

### 3. Allowed Pre-Commit Preparation
While waiting for user direction to commit, agents SHOULD:
- Run verification checks: `npm run typecheck`, `npm test` or `npx vitest run <path>`.
- Run formatting and linting: `npx vp fmt`, `npx vp check --deny-warnings`.
- Keep the knowledge graph up to date: `graphify update .`.
- Present a concise summary of modified files and invite the user to review before committing.

### 4. Execution When User Requests a Commit
When the user explicitly instructs to commit (e.g. "commit it", "commit"):
- Stage only relevant files (or `git add -A` if all changes belong to the requested scope).
- Write a clean Conventional Commit message (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `perf:`).
- Run `git commit` locally.
- **STOP immediately after committing**. Never run `git push`. Remind the user that they can push to origin whenever they are ready.
