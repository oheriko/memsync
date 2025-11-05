# /memsync read

Read the MemSync project state to understand the current status, architecture, and collaboration rules.

This command reads both the project state and LLM collaboration rules to provide full context.

## When to Use

Use this command to:
- Understand the current project status and what's being worked on
- Learn the architecture and how packages are organized
- Check what's off-limits and what requires approval
- See the roadmap and priorities
- Review constraints and design decisions

## What It Does

1. Reads `.memsync/state.md` — Current status, architecture, and roadmap
2. Reads `.memsync/llm.md` — Collaboration boundaries and technical guidelines

Together, these give you complete context for contributing to MemSync.

## Usage

```
/memsync read
```

This will display:
- Current project status and build health
- Architecture overview
- Tech stack and dependencies
- Roadmap and priorities
- Collaboration rules and boundaries

## Files Used

- `.memsync/state.md` — Project overview, status, roadmap
- `.memsync/llm.md` — AI collaboration rules and boundaries
