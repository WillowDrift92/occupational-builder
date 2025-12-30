# AGENTS — Automation & Codex Rules

This file defines **non-negotiable rules** for Codex and any automated agent modifying this repository.

If instructions in this file conflict with a prompt, **this file wins**.

---

## Core Rules

1. **Never run commands**
   - No npm install
   - No builds
   - No tests

2. **Never modify GitHub Actions**
   - Unless explicitly instructed

3. **Never add dependencies casually**
   - All dependencies must be pinned
   - React remains on v18 for v1
   - @react-three/fiber must stay on v8.x while React is 18

4. **One logical change per commit**
   - UI shell
   - Canvas grid
   - Selection logic
   - Inspector bindings
   - etc

5. **Green build is mandatory**
   - If a change risks the build, stop
  
## Allowed vs forbidden in this repo (Codex/agents)

Allowed:
- Read any repository files.
- Create, edit, and delete repository files.
- Propose changes as patches/diffs or full file contents.
- Make commits via GitHub UI (no CLI required).

Forbidden:
- Running shell commands of any kind (npm, node, git, bash, etc.).
- Installing dependencies locally.
- Any network access assumptions.

If you need information, inspect the repo files directly (do not use commands).

---

## Export Rules

- Components that are imported as default **must export default**
- Named exports must be imported explicitly
- Do not change export style without changing imports

---

## Changelog Rules

- Every meaningful change must:
  1. Bump the version in README.md
  2. Add an entry to the Changelog section

### Version Bump Guidance
- Major (X.0.0): architecture or scope change
- Minor (X.Y.0): new feature
- Patch (X.Y.Z): bugfix or refactor

---

## Allowed Scope by Phase

### Current Phase: v1
Allowed:
- UI
- 2D design
- 3D preview (view-only)
- PDF export
- Local storage

Not allowed:
- Pricing
- Authentication
- Backend APIs
- Collaboration

---

## Failure Protocol

If a requested change risks:
- breaking the build
- changing scope
- introducing hidden dependencies

Then:
- Stop
- Explain the risk
- Ask for confirmation
