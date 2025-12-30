# AGENTS — Occupational Builder Repository Rules (Codex + Automation)

These rules are **non-negotiable** for Codex and any automated agent modifying this repository.
If a prompt conflicts with this file, **this file wins**.

---

## 0) Most important clarification (prevents “I can’t proceed” failures)

Agents **ARE ALLOWED** to:
- Read any files in this repository
- Create/edit/delete files in this repository
- Output changes as a patch (diff) or full file contents

Agents **ARE NOT ALLOWED** to:
- Run any shell commands (npm/node/git/bash/etc.)
- Install dependencies
- Assume network access

If an agent claims it “cannot inspect files without commands”, that is incorrect.
The agent must proceed by reading and editing repo files directly.
If the tool is not connected to the repo workspace, the agent must request being run in a repo-connected mode (not ask for random file pastes by default).

---

## 1) No commands, ever

Forbidden:
- npm install / npm ci
- npm run build / test / lint
- node scripts
- any git CLI commands
- any shell execution

Allowed:
- Reasoning from code
- TypeScript-safe edits
- Let GitHub Actions verify builds (the user will check Actions)

---

## 2) GitHub Actions policy

- Do not modify `.github/workflows/*` or GitHub Pages settings
- Only change Actions if the user explicitly requests it

---

## 3) Dependencies policy

- Do not add dependencies unless explicitly requested
- If adding dependencies:
  - pin exact versions (no ranges)
  - React stays on **v18** for v1
  - `@react-three/fiber` must stay on **v8.x** while React is 18

---

## 4) Versioning and changelog policy (mandatory)

### Source of truth
- App version lives in: `src/app/version.ts`
  - `export const APP_VERSION = "X.Y.Z";`

### UI requirement
- Top bar must display: `Occupational Builder vX.Y.Z`

### README requirement
- Every meaningful change must:
  1) bump `APP_VERSION` (semver)
  2) add a matching entry in `README.md` under a Changelog section

### Version bump guidance
- Major (X.0.0): architecture or scope change
- Minor (X.Y.0): new feature
- Patch (X.Y.Z): bugfix / refactor / UI polish

---

## 5) Change hygiene

- Prefer **one PR per feature**.
- Prefer **one logical change per commit** (examples: UI shell, grid, selection, inspector bindings).
- Keep diffs small and reviewable.

When outputting changes, agents must provide:
- A short list of files changed
- A patch/diff (preferred) or full file contents

---

## 6) Build safety (without running commands)

Agents must not claim “green build” themselves (no commands).
Agents must:
- keep TypeScript types consistent
- avoid breaking imports/exports
- minimise risk by making small, compilable changes

The user will confirm “green” via GitHub Actions.

---

## 7) Export/import rules (avoid common TS failures)

- If imported as default, it **must** be `export default`
- Named exports must be imported with braces
- Do not change export style without updating all imports

---

## 8) Scope limits (v1)

Allowed:
- UI
- 2D design
- 3D preview (view-only)
- PDF export
- localStorage save/load

Not allowed:
- pricing
- authentication/login
- backend APIs
- collaboration

---

## 9) Failure protocol (what to do instead of refusing)

If a request risks:
- breaking TypeScript compilation
- introducing hidden dependencies
- changing scope

Then the agent must:
- implement the smallest safe subset that compiles
- leave clear TODOs for the risky parts
- explain what was intentionally deferred
