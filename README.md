# MemSync

**Universal Project Memory for AI Agents**

One `.memsync/` folder. Works with every AI coding tool. Forever.

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

### 🔄 Bidirectional Sync

Unlike tools like spec-kit that only go one direction:

- **Agents make changes** → State updates automatically
- **You edit code manually** → State syncs to match reality
- **Always consistent** → No drift, no stale docs

### 🧠 Comprehensive Context

Your `.memsync/state.md` contains everything agents need:

```markdown
# Project Overview
What this project does and why it exists

# Current Status
Build health, active work, recent completions

# Architecture
How the system is structured

# Tech Stack
Languages, frameworks, libraries, versions

# Constraints
Performance targets, compatibility requirements, business rules

# Key Decisions
Why things are the way they are (architectural decision records)

# Notes
Gotchas, TODOs, important reminders
```

Agents never ask redundant questions. They already know.

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

That's it! Your AI coding assistant will automatically:
1. Read `state.md` to understand your project
2. Make code changes
3. Update `state.md` to reflect changes

### Keep in Sync

When you manually edit code:

```bash
memsync sync
```

Or let it happen automatically (configure in `memsync.toml`).

---

## 💡 How It Works

### For Agents (via MCP)

MemSync exposes tools through the Model Context Protocol:

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

### For Humans

MemSync watches your git commits:

```bash
# You make changes
git add . && git commit -m "Add OAuth support"

# MemSync detects drift (in advisory mode)
⚠️  memsync: state.md may be stale (3 files changed since last sync)

# You sync when ready
memsync sync
# Analyzes diff, updates state.md, commits
```

### The Sync Engine

1. **Detect drift**: Compare `state.md` timestamp with latest git commit
2. **Analyze changes**: Get diff of files changed since last sync
3. **LLM decides**: Is this significant? What sections need updating?
4. **Regenerate sections**: Update affected parts of `state.md`
5. **Commit**: Save updated state (mode dependent)

**Smart, not noisy.** Only updates for significant changes.

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

### v1.0 (Current Focus)
- ✅ Core CLI (`init`, `sync`, `status`)
- ✅ Git integration and drift detection
- ✅ LLM-powered sync engine
- ✅ MCP server implementation
- ⏳ Testing and documentation

### v1.1 (Future)
- **Merge conflict resolution** - Smart handling when branches both update state.md
- Multi-file support for huge projects
- Visual diff previews
- Project templates (React, Django, etc.)
- Performance optimizations
- Additional LLM providers

### v2.0 (Ideas)
- IDE extensions (VS Code, etc.)
- GitHub Actions integration
- Team collaboration features
- Analytics and insights

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
