/**
 * Check sync status
 */

import { intro, outro } from "@clack/prompts";
import {
  fileExists,
  getProjectRoot,
  getStateFile,
  getSyncStatus,
  hasCommits,
  isGitRepo,
} from "@memsync/core";

export function statusCommand(): void {
  intro("📊 MemSync Status");

  const projectRoot = getProjectRoot();

  if (!isGitRepo(projectRoot)) {
    outro("⚠️  Not a git repository");
    return;
  }

  if (!hasCommits(projectRoot)) {
    outro("ℹ️  No commits yet. Make your first commit, then run: memsync init");
    return;
  }

  const stateFile = getStateFile(projectRoot);
  if (!fileExists(stateFile)) {
    outro("⚠️  MemSync not initialized. Run: memsync init");
    return;
  }

  const status = getSyncStatus(projectRoot);

  const syncStatus = status.isSynced ? "✅ In sync" : "⚠️  Out of sync";
  const lastSync = status.lastSyncTime
    ? new Date(status.lastSyncTime).toLocaleString()
    : "Never";

  console.log("");
  console.log(`Status: ${syncStatus}`);
  console.log(`Last sync: ${lastSync}`);
  console.log(`Files changed since sync: ${status.filesChanged}`);

  if (status.filesChanged > 0) {
    console.log("\nChanged files:");
    status.drift.slice(0, 10).forEach((file) => {
      console.log(`  - ${file}`);
    });

    if (status.drift.length > 10) {
      console.log(`  ... and ${status.drift.length - 10} more`);
    }
  }

  outro("");
}
