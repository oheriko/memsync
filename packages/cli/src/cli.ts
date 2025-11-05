#!/usr/bin/env bun

/**
 * MemSync CLI - Universal Project Memory for AI Agents
 */

import { claudeSetupCommand } from "./commands/claude-setup";
import { configCommand } from "./commands/config";
import { initCommand } from "./commands/init";
import { opencodeSetupCommand } from "./commands/opencode-setup";
import { statusCommand } from "./commands/status";
import { syncCommand } from "./commands/sync";
import { MEMSYNC_VERSION } from "./types";

const args = process.argv.slice(2);
const command = args[0];
const options = {
  yes: args.includes("--yes") || args.includes("-y"),
  help: args.includes("--help") || args.includes("-h"),
  version: args.includes("--version") || args.includes("-v"),
  ai: args.includes("--ai") || args.includes("-a"),
};

async function main() {
  // Handle global options
  if (options.version || (args.length === 0 && command === undefined)) {
    if (args.length === 0) {
      showHelp();
      return;
    }
    if (options.version) {
      console.log(`MemSync v${MEMSYNC_VERSION}`);
      return;
    }
  }

  if (options.help || args.length === 0) {
    showHelp();
    return;
  }

  // Route commands
  switch (command) {
    case "init":
      await initCommand(options);
      break;

    case "sync":
      await syncCommand(options);
      break;

    case "status":
      statusCommand();
      break;

    case "config":
      configCommand();
      break;

    case "claude-setup":
      await claudeSetupCommand();
      break;

    case "opencode-setup":
      await opencodeSetupCommand();
      break;

    case "--version":
    case "-v":
      console.log(`MemSync v${MEMSYNC_VERSION}`);
      break;

    case "--help":
    case "-h":
    case "help":
      showHelp();
      break;

    default:
      console.error(`Unknown command: ${command}`);
      console.error('Run "memsync --help" for usage information');
      process.exit(1);
  }
}

function showHelp() {
  console.log(`
MemSync - Universal Project Memory for AI Agents

USAGE
  memsync [COMMAND] [OPTIONS]

COMMANDS
  init              Initialize MemSync in current project
  sync              Sync state.md with code changes
  status            Show synchronization status
  config            Show current configuration
  claude-setup      Setup Claude Code integration (.claude slash commands)
  opencode-setup    Setup OpenCode integration (.opencode commands)

OPTIONS
  --help, -h        Show this help message
  --version, -v     Show version
  --yes, -y         Auto-confirm prompts (for sync)
  --ai, -a          Use AI to analyze project during init

EXAMPLES
  # Initialize a new project (sets up Claude Code + OpenCode)
  memsync init

  # Initialize with AI analysis
  memsync init --ai

  # Check sync status
  memsync status

  # Sync state with code changes
  memsync sync

  # Auto-confirm sync without prompting
  memsync sync --yes

  # Show configuration
  memsync config

  # Setup Claude Code integration
  memsync claude-setup

  # Setup OpenCode integration
  memsync opencode-setup

VERSION
  ${MEMSYNC_VERSION}

DOCS
  https://github.com/memsync/memsync
`);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
