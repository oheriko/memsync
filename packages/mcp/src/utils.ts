/**
 * Utility functions for MCP server
 * Wraps CLI functionality for agent consumption
 */

import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { getStateFile, readFile } from "@memsync/core";
import { getDiffInfo, getSyncStatus } from "@memsync/core";
import { saveState, updateStateMetadata } from "@memsync/core";

export interface ToolResult {
  success: boolean;
  message: string;
  data?: unknown;
}

/**
 * Read project state from state.md
 */
export function readProjectStateFile(
  projectRoot: string,
  sections?: string[],
): string {
  const stateFile = getStateFile(projectRoot);

  if (!existsSync(stateFile)) {
    throw new Error(
      "Project state not found. Run 'memsync init' to initialize MemSync.",
    );
  }

  const state = readFileSync(stateFile, "utf-8");

  if (!sections || sections.length === 0) {
    return state;
  }

  // Filter to specific sections
  const lines = state.split("\n");
  const result: string[] = [];
  let inRequestedSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headerMatch = line.match(/^#{1,2}\s+(.+)$/);

    if (headerMatch) {
      const sectionName = headerMatch[1].trim();

      if (sections.includes(sectionName)) {
        inRequestedSection = true;
        result.push(line);
        continue;
      } else if (inRequestedSection) {
        // Hit a new section, stop capturing
        inRequestedSection = false;
      }
    }

    if (inRequestedSection) {
      result.push(line);
    }
  }

  return result.join("\n") || "Requested sections not found in state.md";
}

/**
 * Check synchronization status
 */
export function checkStatus(projectRoot: string): ToolResult {
  const status = getSyncStatus(projectRoot);
  const diffInfo = getDiffInfo(projectRoot);

  return {
    success: true,
    message: status.isSynced
      ? "Project state is up-to-date"
      : "Project state is out of sync",
    data: {
      isSynced: status.isSynced,
      filesChanged: status.filesChanged,
      lastSyncTime: status.lastSyncTime,
      lastCommitTime: status.lastCommitTime,
      changedFiles: status.drift.slice(0, 10),
      diffSummary: diffInfo.summary,
      moreFiles: status.drift.length > 10 ? status.drift.length - 10 : 0,
    },
  };
}

/**
 * Update project state with new section content
 */
export function updateStateWithChanges(
  projectRoot: string,
  updates: Record<string, string>,
  commitMessage?: string,
): ToolResult {
  const stateFile = getStateFile(projectRoot);

  if (!existsSync(stateFile)) {
    throw new Error(
      "Project state not found. Run 'memsync init' to initialize MemSync.",
    );
  }

  try {
    let content = readFileSync(stateFile, "utf-8");

    // Update each section
    for (const [sectionName, newContent] of Object.entries(updates)) {
      content = updateSection(content, sectionName, newContent);
    }

    // Update metadata
    content = updateStateMetadata(content);

    // Save the file
    saveState(projectRoot, content);

    // Commit if there are changes
    try {
      const status = execSync("git status --short .memsync/state.md", {
        cwd: projectRoot,
        encoding: "utf-8",
      }).trim();

      if (status) {
        execSync("git add .memsync/state.md", {
          cwd: projectRoot,
          stdio: "pipe",
        });

        const message =
          commitMessage || "chore: update project state with agent changes";
        execSync(`git commit -m "${message}"`, {
          cwd: projectRoot,
          stdio: "pipe",
        });
      }
    } catch (error) {
      // Silently ignore git errors - state is updated even if commit fails
    }

    return {
      success: true,
      message: "Project state updated successfully",
      data: {
        updatedSections: Object.keys(updates),
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `Failed to update state: ${errorMessage}`,
    };
  }
}

/**
 * Update a specific section in state.md
 */
function updateSection(
  content: string,
  sectionName: string,
  newContent: string,
): string {
  const lines = content.split("\n");
  let sectionStart = -1;
  let sectionEnd = -1;

  // Find the section
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headerMatch = line.match(/^#{1,2}\s+(.+)$/);

    if (headerMatch && headerMatch[1].trim() === sectionName) {
      sectionStart = i;
      // Find the end of this section (next header at same or higher level)
      const headerLevel = line.match(/^#+/)?.[0].length || 1;

      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j];
        const nextHeaderMatch = nextLine.match(/^#{1,2}\s/);
        if (nextHeaderMatch) {
          const nextLevel = nextLine.match(/^#+/)?.[0].length || 1;
          if (nextLevel <= headerLevel) {
            sectionEnd = j;
            break;
          }
        }
      }

      if (sectionEnd === -1) {
        sectionEnd = lines.length;
      }
      break;
    }
  }

  if (sectionStart === -1) {
    // Section not found, append it
    const headerLevel = 2;
    const newSection = `\n${"#".repeat(headerLevel)} ${sectionName}\n\n${newContent}`;
    return content + newSection;
  }

  // Replace the section content
  const before = lines.slice(0, sectionStart + 1);
  const after = lines.slice(sectionEnd);
  return [...before, "", newContent, "", ...after].join("\n");
}

/**
 * Run full sync of project state
 */
export function performSync(projectRoot: string, force?: boolean): ToolResult {
  const stateFile = getStateFile(projectRoot);

  if (!existsSync(stateFile)) {
    throw new Error(
      "Project state not found. Run 'memsync init' to initialize MemSync.",
    );
  }

  const status = getSyncStatus(projectRoot);

  if (!force && status.isSynced && status.filesChanged === 0) {
    return {
      success: true,
      message: "Project already in sync, nothing to do",
      data: { skipped: true },
    };
  }

  try {
    const currentState = readFile(stateFile);

    // Update metadata to mark as synced
    const updatedState = updateStateMetadata(currentState);
    saveState(projectRoot, updatedState);

    // Commit the update
    try {
      const gitStatus = execSync("git status --short .memsync/state.md", {
        cwd: projectRoot,
        encoding: "utf-8",
      }).trim();

      if (gitStatus) {
        execSync("git add .memsync/state.md", {
          cwd: projectRoot,
          stdio: "pipe",
        });

        execSync('git commit -m "chore: sync project state with MemSync"', {
          cwd: projectRoot,
          stdio: "pipe",
        });
      }
    } catch (error) {
      // Silently ignore git errors
    }

    const diffInfo = getDiffInfo(projectRoot);
    return {
      success: true,
      message: "Project state synced successfully",
      data: {
        filesChanged: status.filesChanged,
        changeSummary: diffInfo.summary,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `Sync failed: ${errorMessage}`,
    };
  }
}
