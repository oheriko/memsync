# Update Project State

Update sections of the MemSync project state when you complete work.

Use this command to keep `.memsync/state.md` current as you implement features, fix bugs, or make architectural decisions.

## When to Use

Use this command when you:
- Complete a feature or fix
- Make architectural changes
- Update dependencies
- Discover limitations or blockers
- Change the roadmap or priorities
- Make design decisions

## What to Update

Common sections to update in `.memsync/state.md`:

### 1. Current Status
```markdown
### Build Health

✅ **Done**: Features completed
🔄 **In Progress**: What you're working on now
❌ **Not Yet**: Future work
```

Update when:
- You complete a feature → Move to ✅ Done
- You start working → Move to 🔄 In Progress
- You discover blockers → Add under Known Issues

### 2. Recent Changes
```markdown
### Recent Changes

- Specific implementation detail
- Architecture improvement
- Bug fix with impact
- Breaking change (if any)
```

Update when:
- You finish a significant change
- The change impacts project structure
- Other developers need to know about it

### 3. Known Issues & Limitations
```markdown
### Known Issues & Limitations

1. **Issue Name**: Description of problem
   - Impact on users/developers
   - Workaround (if any)
   - Planned fix (if applicable)
```

Update when:
- You discover a limitation
- You find a bug that needs investigation
- You implement a workaround
- You fix an issue (remove it)

### 4. Architecture Changes
If you change the package structure, move code around, or redesign:
```markdown
## Architecture

### Three-Package Monorepo

[Update structure if changed]
```

### 5. Tech Stack
If you add/remove dependencies:
```markdown
## Tech Stack

### Dependencies

[Update list with new packages]
```

Update when:
- You add a new dependency (including why)
- You remove a dependency (clean up)
- You upgrade a major version

### 6. Roadmap Status
```markdown
### Phase 1: Core Memory Structure (v0.1 - v1.0) ← **CURRENT**

✅ **Done**: [Mark items as completed]
🔄 **Now**: [Update current work]
[ ] **Not Yet**: [Add blockers if discovered]
```

Update when:
- You complete a planned item → Add ✅
- You discover new work → Add [ ]
- You find blockers → Add note in item

## How to Structure Your Update

When you commit changes to MemSync code:

1. **Also update** `.memsync/state.md`:
   ```bash
   # Make code changes
   git add packages/...

   # Update state
   git add .memsync/state.md

   # Commit together
   git commit -m "Add feature X, update project state"
   ```

2. **Update CHANGELOG.md** as well:
   ```markdown
   ## [Unreleased]

   ### Added
   - New feature description

   ### Fixed
   - Bug fix description
   ```

## Example Updates

### After Implementing a Feature

```markdown
### Recent Changes

- Implemented `memsync sync` command with git diff analysis
- Added section detection for smart state.md updates
- Created integration tests with Claude Code MCP server

### Build Health

✅ **v0.1**: Core CLI and MCP server implemented
✅ **v1.0**: Bidirectional sync fully working (NEW!)
🔄 **Testing**: Integration tests with real MCP tools
```

### After Discovering a Blocker

```markdown
### Known Issues & Limitations

1. **MCP Section Detection**: Current regex-based approach fails on malformed markdown
   - Impact: state.md updates may be inaccurate with non-standard formatting
   - Workaround: Always format sections consistently
   - Fix: Switch to AST-based parsing (v2.1)
```

### After Making an Architecture Decision

Also update `docs/decisions.md` with the ADR:

```markdown
### ADR-009: AST-Based State Parsing

**Decision**: Use markdown-it for parsing instead of regex.

**Why**: Handles edge cases, more robust, easier to maintain.

**Trade-offs**: Adds one dependency (worth it for reliability).

**Committed**: v1.5
```

Then reference it in state.md.

## Don't Forget

- ✅ Update `.memsync/state.md`
- ✅ Update `CHANGELOG.md`
- ✅ Add/update `docs/decisions.md` if you made an architectural choice
- ✅ Update `ROADMAP.md` if priorities changed
- ✅ Commit all together with clear message

## Questions?

See `.memsync/llm.md` for collaboration boundaries and what requires approval.
