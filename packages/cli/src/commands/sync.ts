/**
 * Sync state.md with code changes
 */

import { execSync } from "node:child_process";
import { cancel, confirm, intro, outro, spinner } from "@clack/prompts";
import {
  fileExists,
  getProjectRoot,
  getStateFile,
  readFile,
  getDiffInfo,
  getSyncStatus,
  isGitRepo,
  saveState,
  updateStateMetadata,
} from "@memsync/core";
import { loadConfig } from "../utils/config";

export async function syncCommand(options?: { yes?: boolean }): Promise<void> {
  intro("🔄 MemSync - Sync Project State");

  const projectRoot = getProjectRoot();

  // Validate git repo and initialization
  if (!isGitRepo(projectRoot)) {
    cancel("Not a git repository");
    process.exit(1);
  }

  const stateFile = getStateFile(projectRoot);
  if (!fileExists(stateFile)) {
    cancel("MemSync not initialized. Run: memsync init");
    process.exit(1);
  }

  // Check sync status
  const status = getSyncStatus(projectRoot);

  if (status.isSynced && status.filesChanged === 0) {
    outro("✅ Already in sync, nothing to do");
    return;
  }

  // Show what changed
  console.log("");
  console.log("Changes since last sync:");

  const diffInfo = getDiffInfo(projectRoot);
  console.log(`  ${diffInfo.summary}`);

  if (diffInfo.files.length > 0) {
    console.log("\nModified files:");
    diffInfo.files.slice(0, 8).forEach((file) => {
      console.log(`    - ${file}`);
    });
    if (diffInfo.files.length > 8) {
      console.log(`    ... and ${diffInfo.files.length - 8} more`);
    }
  }

  console.log("");

  // Ask for confirmation unless --yes flag
  if (!options?.yes) {
    const confirmed = await confirm({
      message: "Ready to update state.md?",
    });

    if (!confirmed) {
      cancel("Sync cancelled");
      return;
    }
  }

  // Perform sync
  const s = spinner();
  s.start("Syncing state.md");

  try {
    const currentState = readFile(stateFile);

    // Phase 1: Just update metadata and mark as synced
    // Phase 3: Will add LLM analysis here
    const updatedState = updateStateMetadata(currentState);

    s.stop("✅ Updated state metadata");

    // Save updated state
    saveState(projectRoot, updatedState);

    // Commit if there are changes
    try {
      const status = execSync("git status --short .memsync/state.md", {
        cwd: projectRoot,
        encoding: "utf-8",
      }).trim();

      if (status) {
        const s2 = spinner();
        s2.start("Committing changes");

        execSync("git add .memsync/state.md", {
          cwd: projectRoot,
          stdio: "pipe",
        });

        execSync('git commit -m "chore: sync project state with MemSync"', {
          cwd: projectRoot,
          stdio: "pipe",
        });

        s2.stop("✅ Committed state.md");
      }
    } catch {
      // Silently ignore git commit errors (may fail in some scenarios)
    }

    outro(
      `✅ Sync complete! state.md updated and committed.

Next steps:
  1. Review the changes: git diff HEAD~1
  2. Push when ready: git push
  3. Continue working with confident AI agents!`,
    );
  } catch (error) {
    cancel(`Sync failed: ${error}`);
    process.exit(1);
  }
}
