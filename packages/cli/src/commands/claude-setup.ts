/**
 * Setup Claude Code integration for MemSync
 */

import { cancel, intro, outro } from "@clack/prompts";
import { getProjectRoot, isGitRepo } from "@memsync/core";
import {
  getClaudeCommandPath,
  getMCPConfigPath,
  setupClaudeIntegration,
} from "../utils/claude";

export async function claudeSetupCommand(): Promise<void> {
  intro("🔧 Setup Claude Code Integration");

  const projectRoot = getProjectRoot();

  // Check if it's a git repo
  if (!isGitRepo(projectRoot)) {
    cancel("Not a git repository. Claude integration requires git.");
    process.exit(1);
  }

  try {
    const result = setupClaudeIntegration(projectRoot);

    if (result.commandsCreated) {
      console.log("\n✅ Created Claude slash commands");
      console.log(
        `   Location: ${getClaudeCommandPath(projectRoot, "memsync")}`,
      );
      console.log(
        "   Commands: /memsync-read, /memsync-status, /memsync-update, /memsync-sync",
      );
    }

    if (!result.mcp_config_exists) {
      console.log("\n✅ Created MCP configuration");
      console.log(`   Location: ${getMCPConfigPath(projectRoot)}`);
      console.log("   Configure this in Claude Code settings");
    } else {
      console.log("\n✓ MCP configuration already exists");
    }

    outro(
      `✅ Claude Code integration setup complete!

Next steps:
  1. Review .claude/mcp.json and update if needed
  2. Add to git: git add .claude/
  3. In Claude Code settings, configure the MCP server
  4. Use slash commands to interact with MemSync

Read more: cat .claude/commands/memsync.md`,
    );
  } catch (error) {
    cancel(`Setup failed: ${error}`);
    process.exit(1);
  }
}
