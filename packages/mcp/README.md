# MemSync MCP Server

MCP (Model Context Protocol) server that exposes MemSync project state and update tools to AI agents.

## Installation

```bash
bun install
```

## Development

Run the server in development mode:

```bash
bun run dev
```

This starts the MCP server listening on stdin/stdout for JSON-RPC protocol messages.

## Build

Create a production build:

```bash
bun run build
```

This outputs to `dist/mcp.js`.

## Features

The MCP server exposes four main tools:

### `read_project_state`

Reads the current project state from `.memsync/state.md`.

**Parameters:**
- `sections` (optional): Array of specific sections to read (e.g., `["Architecture", "Tech Stack"]`)

**Returns:** The full state.md or specified sections

### `check_sync_status`

Checks if the project state is in sync with actual code changes.

**Returns:** Sync status including:
- `isSynced`: Whether state is up-to-date
- `filesChanged`: Number of changed files
- `lastSyncTime`: When state was last updated
- `changedFiles`: List of modified files
- `diffSummary`: Summary of changes

### `update_project_state`

Updates specific sections of the project state.

**Parameters:**
- `updates`: Object mapping section names to new content
- `commitMessage` (optional): Git commit message (default: "chore: update project state with agent changes")

**Returns:** Result object with success status

### `sync_project_state`

Runs a full sync of the project state, analyzing code changes and updating `state.md`.

**Parameters:**
- `force` (optional): Force sync even if state appears up-to-date

**Returns:** Sync result with summary of changes

## Resource

The server also provides a resource endpoint:

- `memsync://state.md` - Direct access to the state.md file in markdown format

## Configuration

The server uses environment variable `MEMSYNC_PROJECT_ROOT` to determine the project root directory. If not set, it defaults to `process.cwd()`.

## Architecture

- **index.ts** - Main MCP server implementation with tool and resource handlers
- **utils.ts** - Helper functions that wrap CLI utilities for agent consumption
- Uses `@memsync/cli` utilities for state management, git integration, and file operations
- Implements MCP protocol using `@modelcontextprotocol/sdk`

## Integration with Claude Code

To use this with Claude Code, configure it in your Claude Code settings to connect to this MCP server.
