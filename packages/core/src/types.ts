/**
 * Core type definitions and constants for MemSync
 */

export interface SyncStatus {
  isSynced: boolean;
  filesChanged: number;
  lastSyncTime: string | null;
  lastCommitTime: string | null;
  drift: string[];
}

export interface DiffInfo {
  files: string[];
  additions: number;
  deletions: number;
  summary: string;
}

export const MEMSYNC_VERSION = "0.1.0";
export const MEMSYNC_DIR = ".memsync";
export const STATE_FILE = "state.md";
export const LLM_FILE = "LLM.md";
export const CONFIG_FILE = "memsync.toml";
