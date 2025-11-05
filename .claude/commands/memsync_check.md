# Check Collaboration Rules

Quickly review the collaboration boundaries and constraints for working on MemSync.

Use this command to check what you can and cannot do, and when you need approval.

## Quick Reference

### Always Allowed ✅

- Writing TypeScript/Bun code
- Implementing CLI commands and MCP features
- Adding pure generator functions
- Writing tests
- Improving documentation clarity
- Proposing architectural improvements
- Refactoring for clarity and performance

### Requires Approval ⚠️

Ask before implementing:
- Changes to core memory structure (state.md format, llm.md sections)
- Major architectural refactors
- New dependencies or packages
- Phase 2+ features (multi-stack templates)
- Changes to Bun-native philosophy
- Features not in ROADMAP

### Never Do ❌

- Generate code beyond MemSync itself
- Create framework-specific scaffolding (Next.js, Django, Rails)
- Add unnecessary dependencies
- Skip graceful cancellation
- Modify existing code without permission
- Build plugins before Phase 2
- Add telemetry or tracking
- Make network calls

## The Three Constraints

**1. Universal Over Opinionated**
- No framework-specific code
- No language assumptions
- Works for Python, Go, Rust, TypeScript, etc.

**2. Memory Over Automation**
- No automatic code fixes or commits
- No CI/CD setup
- No dependency installation
- Document, don't automate

**3. No Lock-In**
- Plain markdown files only
- No databases or proprietary formats
- Users own their projects completely
- Works with any AI tool or editor

## Red Flags 🚩

Stop and ask if you're about to:
- Write code generation for starter scaffolding
- Add a new framework-specific template
- Commit a feature not in ROADMAP
- Add a dependency without discussion
- Remove graceful cancellation
- Create automatic code modifications
- Add config files or presets (Phase 1 only)

## Decision Framework

Before implementing something, ask:

1. **Is this in the ROADMAP?** → If no, ask first
2. **Does it violate constraints?** → See docs/constraints.md
3. **Does it respect the philosophy?** → See README.md
4. **Is it universal or stack-specific?** → Stack-specific goes in templates only
5. **Does it add complexity?** → Simple is better

## Where to Learn More

- **[.memsync/llm.md](./.memsync/llm.md)** — Full collaboration rules
- **[.memsync/state.md](./.memsync/state.md)** — Project status and roadmap
- **[docs/constraints.md](./docs/constraints.md)** — What we will NOT do
- **[docs/decisions.md](./docs/decisions.md)** — Why we chose what we chose
- **[ROADMAP.md](./ROADMAP.md)** — Where we're going

## Common Questions

**Q: Can I add a new package to dependencies?**
A: No, not without discussion. See ADR-003 (Minimal Dependencies). Ask first.

**Q: Can I create a Go template?**
A: Not yet. That's Phase 2 (v1.5). Current phase is v0.1 only.

**Q: Can I make changes automatically?**
A: No. MemSync documents, doesn't automate. Developers need control.

**Q: Can I change the state.md structure?**
A: Not without approval. Core memory structure is stable.

**Q: Can I add a UI or web interface?**
A: Not yet. That's Phase 4. Current phase (Phase 1) is core structure only.

## Next Steps

1. Read [.memsync/llm.md](./.memsync/llm.md) in full
2. Review the current roadmap in [.memsync/state.md](./.memsync/state.md)
3. Check [docs/constraints.md](./docs/constraints.md) and [docs/decisions.md](./docs/decisions.md)
4. Start implementing Phase 1 work

Good luck! 🚀
