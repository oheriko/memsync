# Project State

Current status, architecture, and focus for MemSync.

## Project Overview

**MemSync** is a universal project memory system for human-AI collaboration. It maintains persistent, structured documentation that enables AI agents to understand projects completely, without repeating questions across sessions.

**Problem**: Every AI coding session starts from zero context. Agents re-ask about tech stack, constraints, and decisions repeatedly.

**Solution**: Single `.memsync/` folder in every project containing:
- `.memsync/state.md` — Current architecture, status, decisions
- `.memsync/llm.md` — AI collaboration rules and boundaries
- `memsync.toml` — Configuration

Works with any language, framework, or AI tool via the Model Context Protocol (MCP).

## Current Status

**Version**: v0.1.0 (active development)

**Phase**: Phase 1: Core Memory Structure

### Build Health

✅ **Core Functionality**:
- Universal memory structure defined (requirements, constraints, decisions, state, LLM rules)
- `memsync init` command fully implemented
- Interactive prompts with graceful cancellation (Ctrl+C support)
- Pure generator functions for all doc templates
- MCP server skeleton with tool definitions
- Bun/TypeScript tech.md template

🔄 **In Progress**:
- MCP server implementation (read_project_state, update_project_state)
- Testing infrastructure and unit tests
- Real-world validation and feedback gathering

❌ **Not Yet**:
- Bidirectional sync (memsync sync command)
- Multi-stack templates (Go, Python, Rust)
- Full test coverage
- Automated CI/CD

### Recent Changes

- Initial project structure and core CLI
- Universal memory structure documentation
- Architectural decision records (ADR-001 through ADR-008)
- Bun-native philosophy for tech guidance
- Graceful cancellation on Ctrl+C in all prompts

### Known Issues & Limitations

1. **MCP Server**: Currently exposes tool definitions but doesn't fully implement them
   - `read_project_state()` needs file I/O implementation
   - `update_project_state()` needs smart section detection
   - Requires integration testing with Claude Code and other MCP-compatible tools

2. **No Bidirectional Sync Yet**:
   - Agents can update state manually via MCP
   - Humans must commit changes manually
   - `memsync sync` command coming in v2.0

3. **Single Tech Stack Template**:
   - Only Bun/TypeScript template included
   - Multi-stack support (Go, Python, Rust) planned for v1.5

4. **Limited Error Handling**:
   - Some edge cases in generator functions need more robust error handling
   - File I/O error paths could be more graceful

## Architecture

### Three-Package Monorepo

```
packages/
  core/         - Generators and utilities (pure functions)
  cli/          - Command-line interface (memsync init, status, config, sync)
  mcp/          - Model Context Protocol server (AI agent integration)
```

### Core Package (`packages/core`)

Pure functions that generate documentation content:
- `generateStateMarkdown()` — Creates .memsync/state.md template
- `generateLLMRulesMarkdown()` — Creates .memsync/llm.md template
- `generateTechMarkdown()` — Creates docs/tech.md (tech-specific)
- `generateRequirementsMarkdown()` — Creates docs/requirements.md
- `generateConstraintsMarkdown()` — Creates docs/constraints.md
- `generateDecisionsMarkdown()` — Creates docs/decisions.md
- `initProject()` — Orchestrates all generators

**Key Principle**: Generators are pure. They return strings, not write files. This allows testing and composition.

### CLI Package (`packages/cli`)

Commands for interacting with MemSync:
- `memsync init` — Interactive setup (prompts for project details, generates structure)
- `memsync status` — Check state sync status (v0.1: shows current state info)
- `memsync config` — Display memsync.toml configuration
- `memsync sync` — Sync code changes to state.md (v2.0, not yet implemented)
- `--version`, `--help` — Standard CLI help

**Input**: Interactive prompts via @clack/prompts
**Output**: Generated files, colored terminal output via kleur
**Logging**: consola for structured logging

### MCP Server Package (`packages/mcp`)

Exposes tools to AI agents via Model Context Protocol:
- `read_project_state()` — Returns project state.md content
- `update_project_state()` — Updates sections of state.md
- `get_constraints()` — Returns constraints.md
- `get_requirements()` — Returns requirements.md

**Status**: Tool definitions exist; implementation incomplete. Needs:
- File I/O to read actual project files
- Smart section detection for state.md updates
- Error handling and validation

## Tech Stack

### Core Technologies

- **Bun 1.x** — JavaScript/TypeScript runtime (native file I/O, testing, bundling)
- **TypeScript** — Static typing for maintainability
- **Model Context Protocol** — AI agent integration standard

### Dependencies

All packages combined use only **4 production dependencies**:
- `@clack/prompts` — Interactive terminal prompts
- `kleur` — Terminal colors
- `consola` — Structured logging
- `toml` — TOML config file parsing

**Rationale (ADR-003)**: Minimal deps = faster, smaller, easier to audit.

### Bun Native APIs Used

- `Bun.file()` — File I/O
- `Bun.build()` — Building for distribution
- `bun test` — Unit testing
- `Bun.$` — Shell commands
- `bun:sqlite` — Future database needs
- Process APIs for CLI execution

## Constraints (What We Will NOT Do)

**Hard Constraints** (from docs/constraints.md):

❌ **Not a code generator** — We generate doc structure, not starter code
❌ **Not opinionated** — No framework-specific scaffolding (Next.js, Django, Rails)
❌ **Not a build system** — Don't configure CI/CD, dependencies, or compilation
❌ **Not a project manager** — Don't manage tasks or sprints (that's GitHub Issues)
❌ **Not a documentation generator** — Don't generate API docs or code comments
❌ **No lock-in** — Plain markdown, no databases or proprietary formats
❌ **No surprises** — No hidden processes, network calls, or telemetry

**These constraints define MemSync's identity and scope.**

## Key Decisions (Architecture Records)

**ADR-001**: Universal structure over tech-specific tools
- Memory structure (requirements, constraints, decisions) works for any language
- Tech-specific guidance in templates only
- Commitment: MemSync will never be language-locked

**ADR-002**: Separate human and AI documentation
- `docs/` for humans (requirements, constraints, decisions, tech guidance)
- `.memsync/` for AI collaboration (state, LLM rules)
- Clear separation, different update frequencies

**ADR-003**: Minimal dependencies
- Only essential packages (@clack, kleur, consola)
- Bun handles everything else natively
- Security and maintainability over features

**ADR-004**: Pure generator functions
- Generators return strings, don't write files
- Orchestrator handles file I/O
- Enables testing and composition

**ADR-008**: Bun-native wherever possible
- Use Bun.file, bun:sqlite, Bun.serve
- Smaller bundle, faster execution
- Demonstrates Bun-first philosophy

## Roadmap & Priorities

### Phase 1: Core Memory Structure (v0.1 - v1.0) ← **CURRENT**

✅ **Done**:
- Universal memory structure
- Bun/TypeScript template
- Interactive CLI
- Pure generator architecture
- Graceful cancellation

🔄 **Now**:
- [ ] Complete MCP server implementation
- [ ] Unit test coverage (generators, CLI, MCP)
- [ ] Real-world feedback from actual projects
- [ ] Verify memory structure is sufficient

### Phase 2: Multi-Stack Support (v1.1 - v1.5)

Planned (not yet started):
- [ ] Go tech.md template
- [ ] Python tech.md template
- [ ] Rust tech.md template
- [ ] Generic/language-agnostic template
- [ ] Template selection in `memsync init`
- [ ] Real-world validation with diverse projects

### Phase 3: Bidirectional Sync & AI Integration (v2.0)

Planned (not yet started):
- [ ] `memsync sync` command
- [ ] Git-aware diff analysis
- [ ] LLM decides which sections need updating
- [ ] Automatic state.md regeneration
- [ ] Full MCP server implementation
- [ ] AI tool integrations (Claude Code, GitHub Copilot, Cursor, Cline)

### Phase 4: Ecosystem & Collaboration (v3.0+)

Future (post-v2.0):
- [ ] Plugin system for custom templates
- [ ] Team collaboration features
- [ ] IDE extensions
- [ ] Web-based generator
- [ ] Standalone binary distribution

## How to Use MemSync

### For Users (in their projects)

```bash
# Initialize MemSync
cd my-project
memsync init

# Answer prompts about project (interactive)
# Files created: .memsync/state.md, .memsync/llm.md, memsync.toml, docs/*

# Share with AI agent
# - AI reads .memsync/state.md via MCP
# - AI understands project completely
# - AI makes changes
# - AI calls update_project_state() to keep state current

# For now: you manually update state alongside code changes
git add . && git commit -m "Add feature X"
```

### For AI Agents (via MCP)

```typescript
// Agent reads state
const state = await read_project_state()
// Now the agent knows: tech stack, constraints, decisions, status

// Agent makes code changes
// ... implementation ...

// Agent updates state (v0.1: manual, v2.0: automatic)
await update_project_state({
  "Current Status": "✅ Feature X implemented",
  "Tech Stack": "Added @library/X v2.0"
})
```

### For Developers (contributing to MemSync)

See [.memsync/llm.md](./.memsync/llm.md) for collaboration rules.

## Success Metrics

We'll know MemSync is working when:

✅ Users never re-explain their projects to AI agents
✅ AI agents make context-aware changes on first try
✅ Documentation stays in sync with code
✅ New team members onboard via `.memsync/state.md`
✅ Decision history is preserved and accessible
✅ Works equally well for Python, Go, Rust, TypeScript, Java, etc.

## Contact & Feedback

See [README.md](../README.md) for contribution guidelines.

MemSync is a work in progress. Feedback from real usage drives prioritization.
