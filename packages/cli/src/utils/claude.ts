/**
 * Claude Code integration utilities
 * Sets up slash commands and MCP configuration for Claude Code
 */

import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { fileExists, writeFile } from "./files";

const CLAUDE_DIR = ".claude";
const COMMANDS_DIR = "commands";
const MCP_CONFIG_FILE = "mcp.json";

/**
 * Ensure .claude directory structure exists
 */
export function ensureClaudeDir(projectRoot: string): void {
  const claudePath = join(projectRoot, CLAUDE_DIR);
  const commandsPath = join(claudePath, COMMANDS_DIR);

  if (!existsSync(claudePath)) {
    mkdirSync(claudePath, { recursive: true });
  }

  if (!existsSync(commandsPath)) {
    mkdirSync(commandsPath, { recursive: true });
  }
}

/**
 * Create the MemSync slash command file
 */
export function createMemsyncCommand(): string {
  return `# MemSync Slash Commands

## Overview

These slash commands provide quick access to MemSync project state and sync operations within Claude Code.

## Commands

### /memsync-read

Read the current project state from \`.memsync/state.md\`.

This gives you complete context about:
- Project architecture and design decisions
- Tech stack and constraints
- Current status and recent work
- Known gotchas and important reminders

Use this at the start of a session or whenever you need to refresh your context.

### /memsync-status

Check if the project state is in sync with actual code changes.

This shows:
- Whether state.md is up-to-date
- Number of files changed since last sync
- Last sync timestamp
- List of changed files
- Summary of changes (additions/deletions)

Use this before making changes to understand what's changed.

### /memsync-update

Update specific sections of the project state after making code changes.

When you add new dependencies, change the tech stack, update architecture, or complete major features:

\`\`\`
/memsync-update
Section: Current Status
Content: ✅ Feature X: Fully implemented and tested
\`\`\`

This ensures the next agent has accurate context.

### /memsync-sync

Run a full sync of project state with all code changes.

Use this as a checkpoint when:
- You've made significant changes
- Multiple changes across different components
- Ready to hand off to another agent
- Before pushing to main branch

This analyzes all changes since last sync and updates state.md automatically.

## Workflow

**Recommended workflow within Claude Code:**

1. **Start session**: \`/memsync-read\` to load project context
2. **Check status**: \`/memsync-status\` to see what's changed
3. **Make changes**: Build the feature/fix
4. **Update state**: \`/memsync-update\` for significant changes
5. **Checkpoint**: \`/memsync-sync\` before finishing
6. **Next agent**: They start with up-to-date context

## Notes

- These commands are powered by the MemSync MCP server
- They work seamlessly with manual \`memsync\` CLI commands
- State.md is committed to git automatically
- Multiple agents can use these commands and stay in sync
`;
}

/**
 * Create MCP configuration for Claude Code
 */
export function createMCPConfig(projectRoot: string): string {
  // For local development, use the relative path to the built MCP server
  const mcpPath = "bun run packages/mcp/dist/mcp.js";

  return JSON.stringify(
    {
      mcpServers: {
        memsync: {
          command: "bun",
          args: ["run", "packages/mcp/dist/mcp.js"],
          env: {
            MEMSYNC_PROJECT_ROOT: projectRoot,
          },
        },
      },
    },
    null,
    2,
  );
}

/**
 * Setup Claude Code integration
 */
export function setupClaudeIntegration(projectRoot: string): {
  commandsCreated: boolean;
  mcp_config_exists: boolean;
} {
  try {
    // Ensure directories exist
    ensureClaudeDir(projectRoot);

    const commandFilePath = join(
      projectRoot,
      CLAUDE_DIR,
      COMMANDS_DIR,
      "memsync.md",
    );
    const mcp_config_path = join(projectRoot, CLAUDE_DIR, MCP_CONFIG_FILE);

    // Create/update slash commands file
    const commandContent = createMemsyncCommand();
    writeFile(commandFilePath, commandContent);

    // Create MCP config if it doesn't exist
    const mcp_config_exists = fileExists(mcp_config_path);
    if (!mcp_config_exists) {
      const mcp_config = createMCPConfig(projectRoot);
      writeFile(mcp_config_path, mcp_config);
    }

    return {
      commandsCreated: true,
      mcp_config_exists,
    };
  } catch (error) {
    console.error("Failed to setup Claude integration:", error);
    return {
      commandsCreated: false,
      mcp_config_exists: false,
    };
  }
}

/**
 * Get the path where Claude commands are stored
 */
export function getClaudeCommandPath(
  projectRoot: string,
  commandName?: string,
): string {
  const base = join(projectRoot, CLAUDE_DIR, COMMANDS_DIR);
  return commandName ? join(base, `${commandName}.md`) : base;
}

/**
 * Get the MCP config file path
 */
export function getMCPConfigPath(projectRoot: string): string {
  return join(projectRoot, CLAUDE_DIR, MCP_CONFIG_FILE);
}
