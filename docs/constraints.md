# Constraints

What MemSync will **not** do, and why.

## Core Philosophical Constraints

### 1. Universal Over Opinionated
**We will NOT**:
- Generate framework-specific scaffolding (Next.js, SvelteKit, Rails)
- Generate starter code or boilerplate
- Make assumptions about tech stack

**Why**: MemSync's value is in the memory structure, not code generation. Focus matters. Tech-specific guidance goes in `tech.md` templates, not in generated code.

### 2. Memory Over Automation
**We will NOT**:
- Automatically update code
- Set up CI/CD pipelines
- Install dependencies
- Configure build tools

**Why**: The hard part isn't writing code, it's maintaining shared understanding across time and collaborators. Let users write code and configure tools; we document and remember.

### 3. No Lock-In
**We will NOT**:
- Use proprietary formats or databases
- Lock users into specific tools or platforms
- Hide project state or decisions

**Why**: Generated files are plain markdown. Users own their projects. They can fork the docs, delete files, or use MemSync with any tool.

## Implementation Constraints

### 1. Plain Markdown, Forever
**We will NOT**:
- Use databases or proprietary formats
- Require special tools to read/edit docs

**Why**: Markdown is universal, version-controllable, and readable in any editor. It's the only format that truly works with git.

### 2. Human and AI Readable
**We will NOT**:
- Create docs that are optimized for one or the other
- Use complex structures that confuse either humans or LLMs
- Hide information behind abstraction layers

**Why**: The whole point is bidirectional collaboration. Both humans and AI need to understand the structure.

### 3. No Surprises
**We will NOT**:
- Modify existing files without permission
- Make network calls or collect telemetry
- Have hidden processes or "magic" behavior

**Why**: Developers must trust the tool completely. No black boxes.

## Boundaries

### 1. Not a Code Generator
MemSync does **not** generate code. It generates:
- Documentation structure
- Template guidance (what patterns to follow)
- Examples and best practices

Users write the actual code.

### 2. Not a Project Manager
MemSync does **not** manage:
- Tasks and TODO items (use Issues/Projects)
- Sprints or milestones
- Team workflows or permissions

That's outside the scope of "memory."

### 3. Not a Build System
MemSync does **not** configure:
- Build tools or compilation
- Dependency management
- CI/CD pipelines

Users configure these. MemSync documents them in `tech.md`.

### 4. Not a Documentation Generator
MemSync does **not** generate:
- API documentation (use OpenAPI, JSDoc, Sphinx)
- Code comments (developers write these)
- Internal API specs

MemSync is **project-level context**, not **code-level documentation**.

## Non-Negotiables

These will **never** change:

1. **MIT License, Forever** — MIT license in perpetuity
2. **Stable Structure at v1.0** — No breaking changes to memory structure after v1.0
3. **Universal Approach** — Core structure works for any tech stack
4. **User Ownership** — Users own their projects completely
