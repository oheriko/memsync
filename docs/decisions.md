# Decisions

Why we chose what we chose. Trade-offs, alternatives considered, and reasoning.

## Architectural Decisions

### ADR-001: Universal Memory Structure Over Tech-Specific Tools

**Decision**: Build a stack-agnostic project memory system, not a language/framework-specific tool.

**Problem**: Every language and framework has its own project setup tools, but they all have the same problem: AI agents lose context across sessions.

**Why Not**:
- Bun-only tool: Only helps TypeScript/JavaScript projects
- Framework-specific (Next.js, Rails, Django): Fragmentated, no universal applicability
- Documentation generator: Doesn't capture decision history or constraints

**Why This**:
The memory structure (requirements, constraints, decisions, state, collaboration rules) is **universally valuable**. Tech stack is just one variable. Separating universal memory from tech-specific implementation allows MemSync to work for Python, Go, Rust, TypeScript, Java, etc.

**How It Works**:
- Core structure (requirements, constraints, decisions): Universal across all projects
- Tech-specific guidance (tech.md): Different per stack, but same structure
- AI collaboration rules (.memsync/llm.md): Universal across all tools

**Commitment**: MemSync will never become language-specific. The structure is stable; only tech.md templates change per stack.

---

### ADR-002: Separate Human and AI Documentation

**Decision**: Split documentation into `docs/` (human-facing) and `.memsync/` (AI collaboration metadata).

**Problem**: Humans and AI agents need different information from project memory. Mixing them creates noise and makes both less effective.

**Why Not**:
- Single flat structure: Unclear what's for whom
- All hidden in `.memsync/`: Humans wouldn't read it
- All public in `docs/`: AI doesn't need human narrative

**Why This**:
- Humans read `docs/` — Requirements, constraints, decisions, tech stack guidance
- AI reads `.memsync/` — State, collaboration rules, boundaries
- Clear separation allows different update frequencies and purposes

**In Practice**:
- When you make a decision, you update `docs/decisions.md` (human-facing)
- When AI completes work, it updates `.memsync/state.md` (machine-readable)
- When you manually code, you run `memsync sync` to update `.memsync/state.md`
- Neither crowds the other out

**Trade-offs**:
- Two locations instead of one
- But: Clear intent, less noise, better separation of concerns

---

### ADR-003: Minimal Dependencies

**Decision**: Only use `@clack/prompts` (prompts), `kleur` (colors), `consola` (logger). No other packages.

**Context**: Every dependency is a liability (security, maintenance, bundle size).

**Alternatives Considered**:
- `inquirer` + `chalk` (heavier, more features)
- `prompts` + `picocolors` (similar weight)
- Zero dependencies (reinvent prompts)

**Why This**:
- `clack` is minimal, modern, maintained
- `kleur` is tiny (single-file, no deps)
- Bun handles everything else natively

**Trade-offs**:
- Less feature-rich than inquirer
- But: Faster, lighter, easier to audit

---

### ADR-004: Pure Generator Functions

**Decision**: Generator functions are pure (no side effects, no file I/O).

**Context**: Testability, composability, and predictability matter.

**Alternatives Considered**:
- Generators write files directly
- Generators return file paths + content
- Template engine (handlebars, eta)

**Why This**:
- Pure functions are trivial to test
- Allows independent composition
- Single responsibility (generate content vs. write files)

**Trade-offs**:
- Slightly more verbose orchestration
- But: Much easier to reason about and test

---

~~### ADR-005: Interactive-Only (No Config Files)~~

~~**Decision**: No config files, no presets. User answers questions every time.~~

~~**Context**: Configuration adds complexity and hidden state.~~

~~**Alternatives Considered**:~~
~~- `.syncrc` or `sync.config.js` for presets~~
~~- Template repository URLs~~
~~- Previous answers cached locally~~

~~**Why This**:~~
~~- Forces intentional setup every time~~
~~- No hidden configuration to debug~~
~~- Simpler implementation~~

~~**Trade-offs**:~~
~~- More friction for repeat use~~
~~- But: Can add config later if needed. Start simple.~~

---

### ADR-006: No Code Generation (Yet)

**Decision**: Generate documentation structure only. No starter code or templates.

**Context**: Code generation is opinionated and stack-specific. Memory structure is universal.

**Alternatives Considered**:
- Generate `package.json` with dependencies
- Generate starter server code
- Generate test scaffolding

**Why This**:
- Focus on the core value (memory structure)
- Avoid opinionation about implementation
- Easier to maintain

**Trade-offs**:
- Less "batteries included" feeling
- But: Keeps tool focused and universal. Code generation can be added as plugins.

---

### ADR-007: Graceful Cancellation

**Decision**: Every prompt checks `clack.isCancel()` and exits cleanly on Ctrl+C.

**Context**: Users should be able to bail out without leaving partial state.

**Alternatives Considered**:
- Ignore cancellation (complete setup regardless)
- Catch global signal and cleanup
- Rollback mechanism for partial generation

**Why This**:
- Respects user intent immediately
- No cleanup needed (nothing written yet)
- Better UX than half-baked state

**Trade-offs**:
- More verbose prompt handling
- But: Clean exit is worth it

---

### ADR-008: Bun-Native Wherever Possible

**Decision**: Use Bun's built-in APIs instead of npm packages.

**Context**: Bun provides batteries-included functionality.

**Alternatives Considered**:
- Node.js compatibility mode with npm packages
- Hybrid approach (Bun + selected npm packages)

**Why This**:
- Smaller bundle size
- Faster execution
- No dependency churn
- Demonstrates Bun-first philosophy

**Trade-offs**:
- Less portable to Node.js
- But: Tool is explicitly Bun-first. Not a constraint.

---

## Decision Principles

When making future decisions, ask:

1. **Does this add essential value?** — If not, don't add it.
2. **Can Bun do this natively?** — If yes, use Bun.
3. **Is this universal or stack-specific?** — Universal goes in core, stack-specific goes in templates.
4. **Does this respect user control?** — If it's magic or opaque, reconsider.
5. **Is this maintainable long-term?** — Complexity is a liability.

## Decisions to Revisit

These decisions may change as the project matures:

- **ADR-005 (No Config Files)** — May add optional presets if users request it
- **ADR-006 (No Code Generation)** — May add as optional plugin system
- **Template System** — May need proper templating engine if tech templates grow complex

## Decisions That Are Final

These will not change:

- **ADR-001 (Universal Structure)** — Core identity of the project
- **ADR-002 (Documentation Structure)** — Stability matters for generated projects
- **ADR-003 (Minimal Dependencies)** — Philosophical commitment
- **ADR-008 (Bun-Native)** — Tool's identity
