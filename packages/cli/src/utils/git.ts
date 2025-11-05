/**
 * Git integration for drift detection and diff analysis
 */

import { execSync } from "child_process";
import type { DiffInfo, SyncStatus } from "../types";
import { fileExists, getStateFile } from "./files";

/**
 * Check if a directory is a git repository
 */
export function isGitRepo(projectRoot: string): boolean {
  try {
    execSync("git rev-parse --git-dir", {
      cwd: projectRoot,
      stdio: "pipe",
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if the repository has any commits
 */
export function hasCommits(projectRoot: string): boolean {
  try {
    execSync("git rev-parse HEAD", {
      cwd: projectRoot,
      stdio: "pipe",
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the timestamp of the last git commit
 */
export function getLastCommitTime(projectRoot: string): string | null {
  try {
    const timestamp = execSync("git log -1 --format=%aI", {
      cwd: projectRoot,
      encoding: "utf-8",
      stdio: "pipe",
    }).trim();

    if (!timestamp) return null;
    return timestamp;
  } catch {
    return null;
  }
}

/**
 * Get file modification time
 */
export function getFileModTime(filePath: string): string | null {
  try {
    const { statSync } = require("fs");
    const stat = statSync(filePath);
    return stat.mtime.toISOString();
  } catch {
    return null;
  }
}

/**
 * Check if state.md is out of sync with git history
 */
export function isDrifted(projectRoot: string): boolean {
  const stateFile = getStateFile(projectRoot);

  if (!fileExists(stateFile)) {
    return true; // No state file = drifted
  }

  const stateTime = getFileModTime(stateFile);
  const commitTime = getLastCommitTime(projectRoot);

  if (!stateTime || !commitTime) {
    return true;
  }

  // If last commit is newer than state.md, we're drifted
  return new Date(commitTime) > new Date(stateTime);
}

/**
 * Get list of files changed since state.md was last updated
 */
export function getChangedFiles(projectRoot: string): string[] {
  const stateFile = getStateFile(projectRoot);

  if (!fileExists(stateFile)) {
    // If no state file, return all tracked files
    try {
      const files = execSync("git ls-files", {
        cwd: projectRoot,
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      })
        .trim()
        .split("\n")
        .filter((f) => f && !f.startsWith(".memsync"));
      return files;
    } catch {
      return [];
    }
  }

  try {
    const stateTime = getFileModTime(stateFile);
    if (!stateTime) return [];

    // Get all commits since state.md was modified
    const files = execSync(
      `git log --since="${new Date(new Date(stateTime).getTime() - 1000).toISOString()}" --name-only --pretty=format: --diff-filter=ACMRT`,
      {
        cwd: projectRoot,
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      },
    )
      .trim()
      .split("\n")
      .filter((f) => f && !f.startsWith(".memsync"))
      .filter((f, i, arr) => arr.indexOf(f) === i); // Deduplicate

    return files;
  } catch {
    return [];
  }
}

/**
 * Get detailed diff information
 */
export function getDiffInfo(projectRoot: string): DiffInfo {
  const stateFile = getStateFile(projectRoot);
  const files = getChangedFiles(projectRoot);

  let additions = 0;
  let deletions = 0;

  try {
    if (fileExists(stateFile)) {
      const stateTime = getFileModTime(stateFile);
      if (stateTime) {
        const stats = execSync(
          `git log --since="${new Date(new Date(stateTime).getTime() - 1000).toISOString()}" --numstat --pretty=format:`,
          {
            cwd: projectRoot,
            encoding: "utf-8",
            stdio: ["pipe", "pipe", "pipe"],
          },
        )
          .trim()
          .split("\n")
          .filter((line) => line && !line.startsWith(".memsync"))
          .forEach((line) => {
            const [add, del] = line.split("\t");
            if (add !== "-" && del !== "-") {
              additions += parseInt(add, 10);
              deletions += parseInt(del, 10);
            }
          });
      }
    }
  } catch {
    // Ignore errors, use defaults
  }

  return {
    files,
    additions,
    deletions,
    summary: `${files.length} files changed, +${additions}/-${deletions} lines`,
  };
}

/**
 * Get sync status
 */
export function getSyncStatus(projectRoot: string): SyncStatus {
  const drifted = isDrifted(projectRoot);
  const changed = getChangedFiles(projectRoot);
  const stateFile = getStateFile(projectRoot);

  return {
    isSynced: !drifted,
    filesChanged: changed.length,
    lastSyncTime: fileExists(stateFile) ? getFileModTime(stateFile) : null,
    lastCommitTime: getLastCommitTime(projectRoot),
    drift: changed,
  };
}
