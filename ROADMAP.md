# Roadmap

Where MemSync is going and what's coming next.

## Vision

**Phase 1 (Now)**: Establish the memory structure and prove it works.
**Phase 2 (Later)**: Multi-stack support and real-world integration.
**Phase 3 (Future)**: AI agent integrations and collaborative features.

### Why This Sequence?

Get the core memory structure right before adding tech-specific templates. Avoid building on a shaky foundation. Only add features that genuinely enhance the memory system, not features that add noise.

## Phase 1: Core Memory Structure (v0.1 - v1.0)

### Current Focus
- ✅ Universal memory structure (requirements, constraints, decisions, state, LLM rules)
- ✅ Bun/TypeScript template
- ✅ Interactive CLI with graceful cancellation
- ✅ Pure generator functions for maintainability
- 🔄 Documentation and real-world testing
- 🔄 Gather feedback on memory structure effectiveness

**Success Criteria**:
- Users can initialize projects and use memory structure effectively
- Documentation is clear and the philosophy is understood
- Real feedback from actual usage (solo devs, teams, open source)

### What Won't Happen Yet
- Bidirectional sync (tracking code changes and updating state)
- MCP integrations with specific AI tools
- Multiple language templates
- Config files or presets

**Why Not Yet**: Get the core memory structure proven before adding complexity. Avoid over-engineering before we understand real usage patterns.

## Phase 2: Multi-Stack Support (v1.1 - v1.5)

### Multiple Tech Stack Templates
- [ ] **Go template** — `docs/tech.md` for Go projects
- [ ] **Python template** — `docs/tech.md` for Python projects
- [ ] **Rust template** — `docs/tech.md` for Rust projects
- [ ] **Generic/Language-Agnostic** template

Each generates appropriate tech guidance while keeping the memory structure identical (requirements, constraints, decisions).

### Real-World Validation
- [ ] Gather feedback from diverse projects and teams
- [ ] Identify missing documentation sections
- [ ] Refine prompts based on actual usage
- [ ] Update tech.md templates based on real patterns

### Template System
- [ ] Make templates pluggable/selectable
- [ ] Document how to create custom templates
- [ ] Extract common patterns from templates
- [ ] Template validation

## Phase 3: Sync Engine & AI Integration (v2.0)

### Bidirectional Sync
- [ ] Detect code changes since last sync
- [ ] Analyze diffs to understand what changed
- [ ] Use LLM to decide which docs need updating
- [ ] Regenerate relevant sections of `.memsync/state.md`
- [ ] Git integration for clean commits
- [ ] Analyze changelog entries to suggest semantic version bumps
- [ ] Propose version changes and package manifest updates (for developer approval)

**Value**: When you manually edit code, `.memsync/state.md` stays current automatically. No manual updates needed. Version management is intelligent and stays in sync with actual changes.

### MCP Server Implementation
- [ ] Generic MCP server for any AI tool
- [ ] Expose `read_project_state()` tool
- [ ] Expose `update_project_state()` tool
- [ ] Expose `get_constraints()` tool
- [ ] Document MCP integration for tool developers

**Value**: Claude Code, GitHub Copilot, Cursor, Cline, etc. can all read and update project state natively.

### Migration Tools
- [ ] Detect existing project structures
- [ ] Convert existing docs to MemSync format
- [ ] Preserve existing content where possible
- [ ] Migration guides for popular frameworks

**Value**: Existing projects can adopt MemSync without starting from scratch.

## Phase 4: Ecosystem & Collaboration (v3.0+)

### Plugin System
- [ ] Custom question modules
- [ ] Custom file generators
- [ ] Template extensions
- [ ] Hook system (pre/post generation)

**Value**: Community can extend MemSync for specific use cases without forking.

### Collaborative Features
- [ ] Team-level presets (shared memory templates)
- [ ] Conflict resolution for concurrent edits to state.md
- [ ] Audit trail (who changed what, when)
- [ ] Permission levels (read-only docs, editable state)

**Value**: Teams can collaborate on projects with shared, consistent understanding.

### Distribution & Tooling
- [ ] Publish to NPM, package registries
- [ ] Standalone binary (`bun build --compile`)
- [ ] Homebrew/system package managers
- [ ] VSCode extension for navigating memory structure
- [ ] Web-based generator (for non-CLI users)

**Value**: MemSync becomes accessible to everyone, everywhere.

## Not Planned (Out of Scope)

These violate MemSync's core philosophy and won't be built:

### Code Generation
- Framework-specific scaffolding (Next.js, Django, Rails starter code)
- Boilerplate generation
- Starter server/client code

*Why*: MemSync is about memory structure, not code scaffolding. Use framework-specific CLIs for this.

### Build & Infrastructure
- Dependency installation
- Build pipeline configuration
- CI/CD setup
- Container configuration

*Why*: Opinionated and stack-specific. Varies wildly between projects. Tech.md documents approaches; users configure.

### Project Management
- Task/TODO management
- Sprint tracking
- Issue/project board integration

*Why*: That's what GitHub Issues, Jira, etc. are for. MemSync is project understanding, not task tracking.

### Low-Level Automation
- Automatic code fixes
- Linting or formatting rules
- Automatic commits

*Why*: Developers need control. Developers should explicitly choose to commit. No magic.

## Decision Criteria

When evaluating new features, we ask:

1. **Does this enhance the memory structure?** — If not, skip it
2. **Is this universal or stack-specific?** — If stack-specific, goes in templates only
3. **Does this align with constraints?** — See [docs/constraints.md](./docs/constraints.md)
4. **Does this automate or document?** — We document. We don't automate.
5. **Does it add essential value?** — If not, it adds noise

## How Priorities Are Set

Features are built based on:
- **Real-world feedback** from actual users and teams
- **Pain points** discovered during adoption
- **Alignment with philosophy** (see constraints.md and decisions.md)
- **Impact on memory system value** (does it make MemSync more useful?)

**Not all requests will be built.** Focus and clarity matter more than feature count.

## Version Milestones

| Version | When | Goals |
|---------|------|-------|
| **v0.1** | Now | Prove core memory structure works. Get feedback. |
| **v1.0** | 2025 | Stable structure, Bun template, comprehensive docs. |
| **v1.5** | 2025 | Multi-stack support (Go, Python, Rust). Real-world validation. |
| **v2.0** | 2025+ | Bidirectional sync. MCP server. AI tool integrations. |
| **v3.0** | Future | Plugin system. Collaborative features. Broad distribution. |

**Dates are rough.** We prioritize correctness over speed. MemSync is long-term infrastructure, not a sprint project.
