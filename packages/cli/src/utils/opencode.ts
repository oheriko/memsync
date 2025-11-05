/**
 * OpenCode integration utilities
 * Sets up commands and configuration for OpenCode (terminal AI agent)
 */

import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { fileExists, writeFile } from "./files";

const OPENCODE_DIR = ".opencode";
const COMMANDS_DIR = "command";
const CONFIG_FILE = "opencode.json";

/**
 * Ensure .opencode directory structure exists
 */
export function ensureOpenCodeDir(projectRoot: string): void {
  const opencodeDir = join(projectRoot, OPENCODE_DIR);
  const commandsDir = join(opencodeDir, COMMANDS_DIR);

  if (!existsSync(opencodeDir)) {
    mkdirSync(opencodeDir, { recursive: true });
  }

  if (!existsSync(commandsDir)) {
    mkdirSync(commandsDir, { recursive: true });
  }
}

/**
 * Create individual OpenCode command files
 */
export function createOpenCodeCommands(): {
  [commandName: string]: string;
} {
  return {
    "memsync-read.md": `---
description: Read the current project state from .memsync/state.md
agent: memory
---

Read and display the complete project state file (.memsync/state.md).

This gives you:
- Project architecture and design decisions
- Tech stack and constraints
- Current status and recent work
- Known gotchas and important reminders

Start every session by reading the project state to have full context.
`,

    "memsync-status.md": `---
description: Check if project state is in sync with code changes
agent: analysis
---

Check the synchronization status of the project state.

Show:
- Whether state.md is up-to-date
- Number of files changed since last sync
- List of changed files
- Summary of changes (additions/deletions)
- Last sync timestamp

Use this before making changes to understand what's happened.
`,

    "memsync-update.md": `---
description: Update specific sections of project state
agent: memory
---

Update specific sections of the project state file (.memsync/state.md).

Usage:
- Include which section(s) to update (e.g., "Current Status", "Tech Stack")
- Provide the new content for those sections
- The update will be committed to git automatically

Use this after:
- Adding new dependencies
- Changing the tech stack
- Updating architecture
- Completing features
- Fixing bugs

Example:
Update "Current Status" section to: ✅ Authentication: JWT tokens fully implemented
Update "Tech Stack" section to: Added @auth/core ^0.35.0 for secure token handling
`,

    "memsync-sync.md": `---
description: Run full synchronization of project state with code changes
agent: memory
---

Run a complete synchronization of the project state.

This will:
- Analyze all code changes since last sync
- Detect what's drifted from state.md
- Update affected sections automatically
- Commit changes to git

Use this as a checkpoint when:
- You've made significant changes
- Multiple changes across different components
- Ready to hand off to another agent
- Before pushing to main branch

The sync operation is intelligent and only updates sections that need it.
`,
  };
}

/**
 * Create OpenCode configuration file
 */
export function createOpenCodeConfig(projectRoot: string): string {
  return JSON.stringify(
    {
      model: "anthropic/claude-haiku-4-5-20241022",
      small_model: "anthropic/claude-3-5-haiku-20241022",
      provider: {},
      tools: {
        // All tools enabled by default
      },
      permission: {
        edit: "ask",
        bash: "ask",
      },
      agents: {
        memory: {
          description: "Manages project memory and state synchronization",
          tools: {
            read: true,
            write: true,
            bash: true,
          },
        },
        analysis: {
          description: "Analyzes project structure and changes",
          tools: {
            read: true,
            bash: true,
          },
        },
      },
      instructions: [".memsync/LLM.md"],
    },
    null,
    2,
  );
}

/**
 * Setup OpenCode integration
 */
export function setupOpenCodeIntegration(projectRoot: string): {
  commandsCreated: boolean;
  configCreated: boolean;
  commandCount: number;
} {
  try {
    // Ensure directories exist
    ensureOpenCodeDir(projectRoot);

    const commandsDir = join(projectRoot, OPENCODE_DIR, COMMANDS_DIR);
    const configPath = join(projectRoot, OPENCODE_DIR, CONFIG_FILE);

    // Create command files
    const commands = createOpenCodeCommands();
    let commandsCreated = 0;

    for (const [filename, content] of Object.entries(commands)) {
      const commandPath = join(commandsDir, filename);
      writeFile(commandPath, content);
      commandsCreated++;
    }

    // Create or update config
    const configExists = fileExists(configPath);
    const config = createOpenCodeConfig(projectRoot);
    writeFile(configPath, config);

    return {
      commandsCreated: commandsCreated > 0,
      configCreated: !configExists,
      commandCount: commandsCreated,
    };
  } catch (error) {
    console.error("Failed to setup OpenCode integration:", error);
    return {
      commandsCreated: false,
      configCreated: false,
      commandCount: 0,
    };
  }
}

/**
 * Get the path where OpenCode commands are stored
 */
export function getOpenCodeCommandPath(
  projectRoot: string,
  commandName?: string,
): string {
  const base = join(projectRoot, OPENCODE_DIR, COMMANDS_DIR);
  return commandName ? join(base, `${commandName}.md`) : base;
}

/**
 * Get the OpenCode config file path
 */
export function getOpenCodeConfigPath(projectRoot: string): string {
  return join(projectRoot, OPENCODE_DIR, CONFIG_FILE);
}

/**
 * Get the list of OpenCode command names
 */
export function getOpenCodeCommandNames(): string[] {
  const commands = createOpenCodeCommands();
  return Object.keys(commands).map((name) => name.replace(".md", ""));
}
