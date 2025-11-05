# MemSync Commands

Claude Code commands for working on the MemSync project.

## Available Commands

### `/memsync-read`
**Read project state and collaboration rules**

Read the full project state (status, architecture, roadmap) and collaboration guidelines. Use this when you:
- Start working on MemSync
- Need to understand current priorities
- Want to know what work is approved
- Are uncertain about the architecture

```
/memsync-read
```

---

### `/memsync-update`
**Update project state after completing work**

Update `.memsync/state.md` to reflect completed work. Use this when you:
- Finish implementing a feature
- Fix a bug
- Make architectural decisions
- Discover limitations or blockers
- Change the roadmap

```
/memsync-update
```

---

### `/memsync-check`
**Check collaboration boundaries and constraints**

Quick reference for what you can and cannot do. Use this when you:
- Want to know if something requires approval
- Are unsure about boundaries
- Need to review constraints
- Want to verify you're following the philosophy

```
/memsync-check
```

---

## Quick Start

1. **Start here**: `/memsync-read` — Understand the project
2. **Before implementing**: `/memsync-check` — Verify what's approved
3. **When done**: `/memsync-update` — Keep state current

## Key Resources

- **[.memsync/state.md](./.memsync/state.md)** — Current status, architecture, roadmap
- **[.memsync/llm.md](./.memsync/llm.md)** — Full collaboration rules (required reading)
- **[README.md](./README.md)** — What MemSync is and why it exists
- **[ROADMAP.md](./ROADMAP.md)** — Future plans and phases
- **[docs/constraints.md](./docs/constraints.md)** — What we will NOT do (important!)
- **[docs/decisions.md](./docs/decisions.md)** — Why we chose what we chose

## Philosophy

MemSync is a **universal project memory system** — it works for any language, framework, or project type. All decisions and boundaries flow from this core principle.

Before you code:
1. Understand the constraints (no code generation, no framework specificity)
2. Check if your idea is in the ROADMAP
3. Verify it aligns with the philosophy
4. Ask if you're unsure

## Common Workflows

### I want to implement a feature

1. `/memsync-read` — Check the roadmap
2. `/memsync-check` — Verify it's approved
3. Implement the feature
4. `/memsync-update` — Update the state
5. Create a PR with changes + state update

### I found a bug

1. Create test case that reproduces it
2. Implement the fix
3. Verify tests pass
4. `/memsync-update` — Document the fix
5. Commit with changes + updated state

### I want to propose a change

1. `/memsync-read` — Understand current state
2. `/memsync-check` — Check if it requires approval
3. If yes: Create an issue/discussion explaining the proposal
4. If approved: Implement and `/memsync-update`

## Questions?

See [.memsync/llm.md](./.memsync/llm.md) for detailed collaboration rules.

---

**MemSync is built using MemSync. Everything we document here applies to how we work together. 🚀**
