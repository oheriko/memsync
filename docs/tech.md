# Tech Stack

How `MemSync` itself is built. Stack-specific implementation details.

## Runtime

**Bun** — JavaScript/TypeScript runtime and toolkit.

```bash
bun run cli -- init          # Run the CLI
bun test                     # Run tests
bun install                  # Install dependencies
```

### Why Bun?

- Native TypeScript support (no compilation step)
- Built-in test runner
- Fast execution
- Minimal ecosystem dependencies
- Demonstrates the Bun-first philosophy sync promotes

## Dependencies

### Core Dependencies

**`@clack/prompts`** — Interactive CLI prompts
- Minimal, modern, maintained
- Better UX than raw readline
- Built-in cancellation handling

**`kleur`** — Terminal colors
- Tiny single-file package
- No dependencies
- Fast and reliable

**`consola`** — logger

### Why These?

Evaluated alternatives:
- `inquirer` + `chalk` — Heavier, more features we don't need
- `prompts` + `picocolors` — Similar weight, less maintained
- Zero deps — Would need to reinvent prompts (not worth it)

Chose the minimal set that provides good UX without bloat.

## Architecture

### Module Structure

```
cli/
  init.ts          — Entry point, orchestration
  prompts.ts       — Interactive question flows
  generators.ts    — Pure doc generation functions
  README.md        — CLI documentation
```

### Data Flow

```
User runs: memsync init [directory]
    ↓
init.ts parses args (target directory)
    ↓
prompts.ts asks questions → returns ProjectConfig
    ↓
generators.ts generates content (pure functions)
    ↓
init.ts writes files to disk
    ↓
Success! Project initialized
```

### Key Design Patterns

**Pure Generator Functions**
- No side effects (no file I/O inside generators)
- Input: ProjectConfig object
- Output: string (file content)
- Easy to test, easy to compose

**Graceful Cancellation**
- Every `@clack/prompts` prompt checks `isCancel()`
- Clean exit on Ctrl+C
- No partial state left behind

**Minimal Orchestration**
- `init.ts` handles I/O and coordination
- `prompts.ts` handles user interaction
- `generators.ts` handles content generation
- Clear separation of concerns

## File Operations

Using native Bun APIs for optimized file I/O:

```typescript
import { $ } from "bun";

// Create directories
await $`mkdir -p ${targetDir}/docs`;

// Write files (Bun.write uses platform-specific syscalls for speed)
const content = generateIndex(config);
await Bun.write(Bun.file(`${targetDir}/docs/index.md`), content);
```

### Why Native Bun APIs?

- **`Bun.write()`** — Intelligently uses fastest system calls per platform
  - Linux: `copy_file_range` (faster for large files)
  - macOS: `clonefile` (optimized for system)
  - Outperforms Node.js `fs.writeFileSync()` by leveraging platform capabilities

- **`Bun.file(path)`** — Lazy-loaded file representation
  - Check existence: `.exists()`
  - Read in multiple formats: `.text()`, `.json()`, `.stream()`, `.arrayBuffer()`
  - Metadata access: `.size`, `.type`
  - Delete files: `.delete()`

- **For directory operations** — Bun delegates to nearly-complete Node.js `fs` compatibility layer
  - `mkdir -p` via shell is idiomatic and clear
  - Or use `fs.mkdirSync()` if needed for Node.js compatibility

## Testing Strategy

### Unit Tests (Generators)

Pure functions are trivial to test:

```typescript
import { test, expect } from "bun:test";
import { generateIndex } from "./generators";

test("generates index with project name", () => {
  const config = { projectName: "test-project", /* ... */ };
  const result = generateIndex(config);
  expect(result).toContain("# test-project Documentation");
});
```

### Integration Tests (CLI Flow)

Test full flow with mocked prompts:

```typescript
test("full CLI flow", async () => {
  // Mock clack prompts
  // Run init.ts
  // Verify files created
});
```

### Manual Testing

Run actual CLI and verify output:

```bash
bun run cli -- init ./out
# Verify files in out/
```

## Build & Distribution

### Local Development

```bash
bun install                  # Install dependencies
bun run cli                  # Test CLI locally
```

### Future Distribution Options

- **NPM Registry** — Publish as npm package
~~- **Bun Package Registry** — Native Bun distribution~~
- **Standalone Binary** — `bun build --compile` for single executable
- **Homebrew/Package Managers** — System-level install

Not implemented yet. Start with direct repo usage.

## Performance Considerations

### Current Performance

- Initialization: <100ms (instant)
- File generation: <50ms (5 files)
- Total runtime: <200ms

Fast enough that optimization isn't needed.

### If Performance Becomes an Issue

- Parallel file writes (currently sequential)
- Template caching (if templates grow large)
- Streaming file writes (currently in-memory)

Not needed now. Optimize when benchmarks show problems.

## Development Workflow

### Adding New Files to Generation

1. Add generator function to `generators.ts`
2. Update `generateAllDocs()` to include new file
3. Add template logic based on `ProjectConfig`
4. Test with `bun run cli -- init ./test`

### Adding New Prompts

1. Add question to `prompts.ts`
2. Add field to `ProjectConfig` interface
3. Handle cancellation with `isCancel()` check
4. Use answer in generator functions

### Adding Tech Templates

Future work:
1. Create template modules (e.g., `templates/go.ts`)
2. Select template based on project type
3. Generate tech-specific `docs/tech.md`
4. Keep universal structure the same

## Code Style

- **TypeScript** — Strict mode, full type coverage
- **Imports** — Named imports, explicit paths
- **Functions** — Pure functions where possible
- **Error Handling** — Explicit error messages, no silent failures
- **Comments** — Explain why, not what (code should be self-documenting)

## References

- **[Bun Documentation](https://bun.sh/docs)** — Runtime APIs
- **[@clack/prompts Documentation](https://github.com/bombshell-dev/clack/tree/main/packages/prompts)** — Prompt library
- **[kleur Documentation](https://github.com/lukeed/kleur)** — Color library
- **[consola Documentation](https://github.com/bombshell-dev/clack/tree/main/packages/prompts)** — Logger library
