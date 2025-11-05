# MemSync Documentation

**Universal Project Memory for AI Agents**

Every AI coding assistant starts from zero context. MemSync solves this by maintaining living project memory that stays in sync with your code.

## Quick Navigation

### For Users
- **[README.md](../README.md)** — What MemSync is and how to use it
- **[CHANGELOG.md](../CHANGELOG.md)** — What's been built
- **[ROADMAP.md](../ROADMAP.md)** — What's coming next

### For Projects Using MemSync
- **[Requirements](./requirements.md)** — What you're building
- **[Constraints](./constraints.md)** — Guardrails and boundaries
- **[Decisions](./decisions.md)** — Why choices were made
- **[Tech Stack](./tech.md)** — Stack-specific guidance

### For AI Agents
- **[.memsync/llm.md](../.memsync/llm.md)** — Collaboration rules and boundaries
- **[.memsync/state.md](../.memsync/state.md)** — Current project focus and status

## The Problem MemSync Solves

Every time you start an AI-assisted coding session, the agent starts from scratch:

```
You: "Add OAuth authentication"
Agent: "What OAuth provider? What's your current auth system?
        What are your performance constraints? What's your tech stack?"
You: [Re-explains everything you told the last agent]
Agent: [Makes changes that violate your performance constraints
       because it didn't know about them]
```

This context loss, decision drift, and constraint violations compound over time.

## How MemSync Works

**MemSync maintains a single source of truth** — your project's memory structure.

Agents read `.memsync/state.md` to understand your project completely. They know your tech stack, constraints, and decisions. When they make code changes, they update the state. When you manually edit code, MemSync detects changes and keeps state synchronized.

## The Structure

Every MemSync project has:

```
docs/
  requirements.md  — What you're building
  constraints.md   — What's off-limits
  decisions.md     — Why you chose things
  tech.md          — How to build it

.memsync/
  state.md         — Current focus and status
  llm.md           — How AI should collaborate

README.md          — Project overview
CHANGELOG.md       — Project history
ROADMAP.md         — What's next
```

Human-facing docs in `docs/`, AI collaboration metadata in `.memsync/`.

## Stack-Agnostic Design

The memory structure works for any language or framework:
- Bun/TypeScript projects
- Go services
- Python APIs
- Rust systems
- Whatever you're building

Only `tech.md` changes per stack. The rest is universal.

## For Humans

Read the docs to understand:
- What the project does (requirements.md)
- What rules exist (constraints.md)
- Why decisions were made (decisions.md)
- How to build it (tech.md)

## For AI Assistants

Read the docs to understand:
- Project context (requirements, constraints, decisions)
- Collaboration boundaries (.memsync/llm.md)
- Current focus (.memsync/state.md)
- Stack-specific patterns (tech.md)

This persistent memory prevents context loss across sessions.
