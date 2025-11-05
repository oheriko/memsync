# LLM Collaboration Rules

Instructions for AI assistants working on MemSync.

## Core Mission

**MemSync is a universal project memory system.** AI agents and humans collaborate through structured documentation to maintain persistent understanding of projects.

**Your role**: Implement features, fix bugs, improve architecture, and refine documentation—all while keeping project memory current.

## Read These First

Before working on MemSync:
1. **[README.md](../README.md)** — What MemSync is and why it exists
2. **[docs/requirements.md](../docs/requirements.md)** — What we're building
3. **[docs/constraints.md](../docs/constraints.md)** — What we will NOT do (important!)
4. **[docs/decisions.md](../docs/decisions.md)** — Why we made architectural choices
5. **[ROADMAP.md](../ROADMAP.md)** — Where we're going

## Collaboration Boundaries

### What You CAN Do

✅ **Implementation**:
- Write TypeScript/Bun code following tech.md guidance
- Implement CLI commands and MCP server features
- Add pure generator functions
- Write tests and improve coverage
- Refactor for clarity and performance

✅ **Documentation**:
- Improve clarity in docs (requirements, constraints, decisions)
- Add examples and use cases
- Update tech stack guidance
- Document new features and capabilities

✅ **Decision Making**:
- Propose architectural improvements
- Suggest new features aligned with constraints
- Identify and discuss trade-offs
- Challenge decisions if evidence supports it

### What You CANNOT Do

❌ **Off-Limits**:
- **Generate code** beyond MemSync itself (don't add starter code to templates)
- **Violate universal design** (no language/framework-specific implementation)
- **Add to constraints/decisions unilaterally** (propose changes, don't commit them)
- **Change core memory structure** without discussion (requirements, constraints, decisions, state, llm.md)
- **Add unnecessary dependencies** (see ADR-003: Minimal Dependencies)
- **Skip graceful cancellation** (every prompt must check `isCancel()`)

❌ **Do Not**:
- Add features not in ROADMAP without approval
- Increase scope of any phase without discussion
- Commit to dates or versions
- Build plugins or integrations before Phase 2

## Technical Guidelines

### Principles

1. **Bun-first** — Use Bun's native APIs (Bun.serve, bun:sqlite, Bun.file, etc.)
2. **Minimal dependencies** — Only essential packages (@clack/prompts, kleur, consola)
3. **Pure functions** — Generators return content, don't write files
4. **Graceful cancellation** — Every prompt checks `clack.isCancel()`
5. **Clear separation** — Core utilities, CLI commands, MCP server in distinct packages

### Architecture

**Three Packages**:
- `packages/core` — Utilities and generators (pure functions)
- `packages/cli` — Command-line interface (memsync init, status, config, sync)
- `packages/mcp` — Model Context Protocol server (read_project_state, update_project_state)

**Exports**:
- Core exports pure generators
- CLI uses core generators + Bun I/O
- MCP server exposes tools for AI agents

### Code Style

- TypeScript strict mode
- Clear function names (generateStateMarkdown, initProject, etc.)
- Comments for complex logic
- Export type definitions alongside functions
- Test files adjacent to source (file.ts + file.test.ts)

## Updating Project State

Whenever you complete work:

1. **Update `.memsync/state.md`**:
   - Current Status → What you just completed
   - Recent Changes → Summary of implementation
   - Any known issues or limitations

2. **Update CHANGELOG.md**:
   - Add entry under [Unreleased] > Added/Fixed/Changed
   - Reference issue/PR if applicable

3. **Update ROADMAP.md** if context changed:
   - Mark completed items with ✅
   - Adjust timelines if necessary
   - Add blockers or dependencies discovered

**Example**:
```markdown
## Current Status

✅ **v0.1**: Core CLI and MCP server implemented
- memsync init generates universal memory structure
- MCP server exposes read_project_state() and update_project_state()
- Interactive prompts with graceful cancellation
- Bun/TypeScript tech.md template

🔄 **Testing**: Need unit tests for generators and CLI
🔄 **Documentation**: Real-world usage feedback needed
```

## Decision Process

### When You See a Problem

**Don't**: Just fix it unilaterally.
**Do**: Discuss in context of constraints and philosophy.

Example Decision Flow:
1. Identify problem (e.g., "Generator functions are verbose")
2. Propose solution (e.g., "Use template engine instead")
3. Check against constraints:
   - Does it violate universal design? (ADR-001)
   - Does it add dependencies? (ADR-003)
   - Does it respect user control? (ADR-004)
4. Document decision in docs/decisions.md if adopted

### What Needs Approval

Ask before implementing:
- Changes to core memory structure (state.md format, llm.md sections)
- Major architectural refactors
- New dependencies or packages
- Phase 2+ features (multi-stack templates, bidirectional sync)
- Changes to Bun-native philosophy

Simple changes don't need approval:
- Bug fixes
- Test additions
- Documentation improvements
- Performance optimizations
- Error handling enhancements

## How to Test

```bash
# Install dependencies
bun install

# Run dev mode
bun run dev

# Run tests
bun test

# Test CLI locally
bun packages/cli/src/index.ts init

# Test MCP server
bun packages/mcp/src/index.ts
```

## Common Tasks

### Adding a New CLI Command

1. Create handler in `packages/cli/src/commands/command-name.ts`
2. Export from `packages/cli/src/index.ts`
3. Add to command routing in main CLI entry
4. Update CHANGELOG.md
5. Add tests in `packages/cli/src/commands/command-name.test.ts`

### Improving a Generator

1. Find function in `packages/core/src/generators/`
2. Make changes to generated content
3. Add test cases in `*.test.ts`
4. Run `bun test` to verify
5. Update examples in docs if output changed

### Fixing a Bug

1. Create test case that reproduces it
2. Verify test fails
3. Fix the bug
4. Verify test passes
5. Update CHANGELOG.md under Fixed section

## Red Flags

⚛️ **Stop and ask if you see**:
- New framework-specific code (violates universal design)
- Code generation beyond memory structure
- Features not in ROADMAP
- Config files or presets (Phase 2)
- Automatic code fixes or commits
- Removed graceful cancellation
- New major dependencies

## Questions?

When in doubt:
1. Check `docs/constraints.md` — What's forbidden?
2. Check `docs/decisions.md` — Why did we choose this?
3. Check ROADMAP.md — Is this planned?
4. Ask in context of philosophy — Does this serve "universal memory"?

## Success Metrics

You're doing great if:
- ✅ Code follows Bun-native, minimal-dependency philosophy
- ✅ Every feature aligns with constraints and decisions
- ✅ Project state stays current with your work
- ✅ Tests pass and new code has coverage
- ✅ Documentation reflects implementation
- ✅ Users understand why MemSync exists
