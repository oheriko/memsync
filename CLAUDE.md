# MemSync — Project Guidelines

A universal project memory system for human-AI collaboration.

**For complete documentation, see [docs/index.md](./docs/index.md).**

## Quick Links

- **[README](./README.md)** — What is sync and why it matters
- **[CHANGELOG](./CHANGELOG.md)** — What's been built
- **[ROADMAP](./ROADMAP.md)** — What's next
- **[Requirements](./docs/requirements.md)** — What we're building
- **[Constraints](./docs/constraints.md)** — Guardrails and boundaries
- **[Decisions](./docs/decisions.md)** — Choices made and why
- **[Tech Stack](./docs/tech.md)** — How the project is built
- **[LLM Collaboration Rules](./.memsync/llm.md)** — Working with AI assistants (internal)
- **[Project State](./.memsync/state.md)** — Current status (internal)

## TL;DR

**What**: Universal project memory system for AI-assisted development

**Why**: LLMs lose context. Projects need persistent memory, guardrails, and decision history.

**How**: Structured docs that capture requirements, constraints, decisions, state, and collaboration rules.

**Stack-agnostic**: Works with any language/framework. Currently generates Bun templates, more coming.

## Core Structure

```
README.md — Project overview and mission statement
CHANGELOG.md   — Project history and changes
ROADMAP.md     — Future plans and milestones

docs/
  requirements.md  — What we're building
  constraints.md   — What's off-limits
  decisions.md     — Choices made and why
  tech.md          — Stack-specific guidance

.memsync/
  llm.md           — AI collaboration rules
  state.md         — Current focus
```

Human-facing docs in `docs/`, AI metadata in `.memsync/`.
