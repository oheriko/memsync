/**
 * Setup OpenCode integration for MemSync
 */

import { cancel, intro, outro } from "@clack/prompts";
import { getProjectRoot, isGitRepo } from "@memsync/core";
import {
  getOpenCodeCommandNames,
  getOpenCodeCommandPath,
  getOpenCodeConfigPath,
  setupOpenCodeIntegration,
} from "../utils/opencode";

export async function opencodeSetupCommand(): Promise<void> {
  intro("🚀 Setup OpenCode Integration");

  const projectRoot = getProjectRoot();

  // Check if it's a git repo
  if (!isGitRepo(projectRoot)) {
    cancel("Not a git repository. OpenCode integration requires git.");
    process.exit(1);
  }

  try {
    const result = setupOpenCodeIntegration(projectRoot);

    if (result.commandsCreated && result.commandCount > 0) {
      console.log("\n✅ Created OpenCode commands");
      console.log(`   Location: ${getOpenCodeCommandPath(projectRoot)}`);
      console.log(`   Commands created:`);
      getOpenCodeCommandNames().forEach((cmd) => {
        console.log(`     • /${cmd}`);
      });
    }

    if (result.configCreated) {
      console.log("\n✅ Created OpenCode configuration");
      console.log(`   Location: ${getOpenCodeConfigPath(projectRoot)}`);
    } else {
      console.log("\n✓ OpenCode configuration already exists");
      console.log(`   Location: ${getOpenCodeConfigPath(projectRoot)}`);
    }

    outro(
      `✅ OpenCode integration setup complete!

Next steps:
  1. Review .opencode/opencode.json and customize if needed
  2. Add to git: git add .opencode/
  3. Run OpenCode: opencode
  4. Use slash commands: /memsync-read, /memsync-status, etc.

Read more: cat .opencode/command/memsync-read.md`,
    );
  } catch (error) {
    cancel(`Setup failed: ${error}`);
    process.exit(1);
  }
}
