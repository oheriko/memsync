# MemSync

**Universal Project Memory for AI Agents**

Structured and synced documentation across your project. Works with every AI coding tool. Forever.

---

## Why MemSync?

### The Problem

Every AI coding assistant starts from zero context:
- "What's your tech stack?" (for the 50th time)
- "What are your constraints?" (again)
- "Why did you choose this architecture?" (you explained this yesterday)

Documentation drifts from reality. Specs become outdated. Agents repeat suggestions you've already rejected. Manual code edits break AI-generated plans.

### The Solution

**MemSync maintains living project memory that stays in sync with your code.**

Agents read `.memsync/state.md` to understand your project completely. As they work, they update it. When you manually edit code, MemSync detects the changes and keeps state synchronized.

**One source of truth. Always current. Works everywhere.**

---

## ✨ Key Features

### 🌍 Completely Universal

Works with **any** AI coding tool:
- ✅ Claude Code
- ✅ GitHub Copilot
- ✅ OpenCode
- ✅ Cursor
- ✅ Windsurf
- ✅ Cline
- ✅ Any future MCP-compatible agent

Works with **any** tech stack:
- Any language (Python, TypeScript, Rust, Go, Java...)
- Any framework (React, Django, Rails, Next.js...)
- Any project type (web apps, CLIs, libraries, monorepos...)

**No lock-in. No proprietary formats. Just markdown + git.**

### 🔄 Future Bidirectional Sync (v2.0)

Unlike tools like spec-kit that only go one direction, MemSync is designed for future bidirectional sync:

- **Agents make changes** → State updates via MCP tools (v2.0)
- **You edit code manually** → Sync detects changes and regenerates docs (v2.0)
- **Always consistent** → No drift, no stale docs (goal for v2.0)

Currently (v0.1): Agents manually update state via MCP, humans commit state with code changes.

### 🧠 Comprehensive Context

Agents get complete context from your project documentation:

**`.memsync/state.md`** — Living project memory:
- Project Overview & purpose
- Current Status & build health
- Architecture & system design
- Tech Stack & dependencies
- Key Decisions & rationale
- Active work & notes

**Supporting docs** (read via MCP):
- `docs/requirements.md` — What you're building
- `docs/constraints.md` — Guardrails & boundaries
- `docs/decisions.md` — Why you chose specific approaches
- `docs/tech.md` — Tech stack guidance
- `ROADMAP.md` — Future plans
- `.memsync/llm.md` — Collaboration rules

Agents read all of these before working, so they never ask redundant questions. They already know.

---

## 🚀 Quick Start

### Install

```bash
bun add @memsync/cli @memsync/mcp
# or
pnpm add @memsync/cli @memsync/mcp
# or
npm install -g @memsync/cli @memsync/mcp
```

### Initialize

```bash
cd your-project
memsync init
```

This creates:
```
.memsync/
  state.md       # Your project's memory
  llm.md         # Instructions for agents
memsync.toml     # Configuration
```

### Use with AI Agents

Your AI coding assistant can now:
1. Read `state.md` via MCP to understand your project
2. Make code changes
3. Call `update_project_state()` to update relevant sections

For Claude Code:
- Use `/memsync read` to read state
- Use `/memsync update` to update sections
- Configure MCP server in `.claude/mcp.json`

For OpenCode:
- Use the memsync commands in `.opencode/` directory
- Commands auto-generated during init

### Manual Sync (v2.0 Coming)

Automatic drift detection (`memsync sync`) coming in v2.0. For now:
- Update `.memsync/state.md` manually alongside code changes
- Commit both together: `git add . && git commit`

Future versions will detect code changes and auto-regenerate state sections.

---

## 💡 How It Works

### For Agents (via MCP) — v0.1

MemSync exposes tools through the Model Context Protocol for agents to read and update project state:

```typescript
// Agent reads project state
const state = await read_project_state()

// Agent makes code changes
// ... your code changes ...

// Agent updates relevant sections
await update_project_state({
  "Current Status": "✅ Auth: OAuth fully implemented",
  "Tech Stack": "Added @auth0/nextjs-auth0 for OAuth"
})
```

**Note**: In v0.1, agents manually call `update_project_state()`. Full automatic sync is planned for v2.0.

### For Humans — v0.1

Today, you manage state.md in git like any other file:

```bash
# You make changes to code and .memsync/state.md
git add . && git commit -m "Add OAuth support"

# Future: memsync sync will auto-detect and regenerate (v2.0)
memsync sync  # Coming in v2.0
```

### The Sync Engine (v2.0 — Future)

When implemented, the sync engine will:

1. **Detect drift**: Compare `state.md` timestamp with latest git commit
2. **Analyze changes**: Get diff of files changed since last sync
3. **LLM decides**: Is this significant? What sections need updating?
4. **Regenerate sections**: Update affected parts of `state.md`
5. **Commit**: Save updated state (mode dependent)

For now (v0.1), state.md updates are manual—commit state changes alongside code changes.

---

## 🎯 Use Cases

### Solo Developer
- Never re-explain your project to AI assistants
- Document decisions as you make them
- Keep constraints and requirements visible

### Team Collaboration
- Shared understanding across all agents used by team members
- Onboard new developers faster (they read `state.md`)
- Track architectural decisions with rationale

### Open Source
- Help AI assistants contribute effectively
- Document "why" not just "what"
- Maintain consistency across contributors

### Legacy Codebases
- Bootstrap understanding for AI refactoring tools
- Document tribal knowledge
- Track modernization progress

---

## ⚙️ Configuration

Edit `memsync.toml`:

```toml
version = "1.0.0"

[sync]
mode = "advisory"                # "advisory" | "interactive" | "automatic"
checkOnStartup = true            # Agent checks for drift before working
autoCommit = false               # Auto-commit in automatic mode

[state]
maxRecentCompletions = 10        # Items in "Recently Completed"
statusCheckEnabled = true        # Include health checks

[llm]
provider = "anthropic"           # Future: support multiple providers
model = "claude-haiku-4-5"

ignore = [                       # TODO: add VCS ignore
  "node_modules/**",
  "dist/**",
  ".git/**"
]
```

---

## 🛠️ CLI Reference

```bash
# Initialize MemSync in current project
memsync init

# Check sync status
memsync status

# Sync state.md with code changes
memsync sync

# Show configuration
memsync config

# Show version
memsync --version

# Show help
memsync --help
```

---

## 🏗️ Architecture

### Philosophy

**Git handles history. MemSync handles understanding.**

- Git tracks *what* changed and *when*
- MemSync tracks *why* and *how it works now*

### Design Principles

1. **Markdown over databases** - Human readable, version controllable, universal
2. **Git over custom storage** - Don't reinvent the wheel
3. **MCP over proprietary APIs** - Work with any compatible agent
4. **Section regeneration over surgical edits** - Reliable and predictable
5. **LLM decides significance** - Smart about what matters

### Non-Goals

- ❌ Not a TODO list manager (use Issues/Projects)
- ❌ Not a documentation generator (use JSDoc/Sphinx/etc)
- ❌ Not API documentation (use OpenAPI/etc)
- ❌ Not a replacement for code comments

MemSync is **project-level context**, not **code-level documentation**.

---

## 📖 Examples

### Before MemSync

```
You: Add OAuth authentication
Agent: What OAuth provider? What's your current auth system?
       What are your security requirements? Do you have rate limiting?
       What's your session management approach?

You: [explains everything again]

Agent: [makes changes that don't account for your performance constraints
       because it didn't know about them]
```

### After MemSync

```
You: Add OAuth authentication
Agent: [reads state.md]
       - Current auth: JWT tokens
       - Constraints: <100ms API response time, Safari 15+ support
       - Stack: Next.js 14 with App Router
       [makes appropriate changes]
       [updates state.md with OAuth details]

You: ✅ Done right, first try
```

---

## 🤝 Contributing

MemSync is open source and contributions are welcome!

### Development Setup

```bash
git clone https://github.com/memsync/memsync.git

cd memsync

bun install
bun run dev
```

### Running Tests

```bash
bun run test
```

### Dogfooding

MemSync is built using MemSync! Check `.memsync/state.md` in this repo to see it in action.

---

## 📚 Learn More

- **[CHANGELOG.md](./CHANGELOG.md)** — What's been built
- **[ROADMAP.md](./ROADMAP.md)** — What's next
- **[docs/](./docs/)** — Full project documentation
- **[.memsync/llm.md](./.memsync/llm.md)** — LLM collaboration rules

---

## 🗺️ Roadmap

**See [ROADMAP.md](./ROADMAP.md) for the full roadmap.**

### v0.1 (Current — Active Development)
- ✅ Core CLI (`init`)
- ✅ MCP server with `read_project_state()`, `update_project_state()`
- ✅ Claude Code & OpenCode integration setup
- ⏳ Full testing and documentation

### v1.0 (Planned)
- [ ] Stable memory structure
- [ ] Comprehensive documentation and guides
- [ ] Multi-stack templates (Go, Python, Rust)
- [ ] Real-world feedback and validation

### v2.0 (Planned — Bidirectional Sync)
- [ ] Automatic drift detection (`memsync sync`)
- [ ] LLM-powered section regeneration
- [ ] Full MCP server with sync capabilities
- [ ] GitHub integration for branch sync

### v3.0+ (Future)
- [ ] Plugin system and custom templates
- [ ] Team collaboration features
- [ ] IDE extensions
- [ ] Broad ecosystem integrations

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

## 🙏 Acknowledgments

Inspired by:
- [spec-kit](https://github.com/github/spec-kit) - Unidirectional specification system
- [Cline Memory Bank](https://docs.cline.bot/prompting/cline-memory-bank) - Memory concepts for agents
- Architecture Decision Records (ADR) pattern

Built with the Model Context Protocol (MCP) by Anthropic.

---

<div align="center">

**MemSync: Because AI agents deserve to remember.**

[Get Started](#-quick-start) • [Documentation](./docs/) • [GitHub](https://github.com/memsync/memsync)

</div>
