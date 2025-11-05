/**
 * Core type definitions for MemSync CLI
 */

import {
  SyncStatus,
  DiffInfo,
  MEMSYNC_VERSION,
  MEMSYNC_DIR,
  STATE_FILE,
  LLM_FILE,
  CONFIG_FILE,
} from "@memsync/core";

// Re-export shared types
export type { SyncStatus, DiffInfo };
export { MEMSYNC_VERSION, MEMSYNC_DIR, STATE_FILE, LLM_FILE, CONFIG_FILE };

export interface Config {
  version: string;
  sync: {
    mode: "advisory" | "interactive" | "automatic";
    checkOnStartup: boolean;
    autoCommit: boolean;
  };
  state: {
    maxRecentCompletions: number;
    statusCheckEnabled: boolean;
  };
  llm: {
    provider: string;
    model: string;
  };
  ignore: string[];
}

export interface ProjectState {
  metadata: {
    lastUpdated: string;
    projectVersion: string;
    memsyncVersion: string;
  };
  content: string;
}

export const DEFAULT_CONFIG: Config = {
  version: "1.0.0",
  sync: {
    mode: "advisory",
    checkOnStartup: true,
    autoCommit: false,
  },
  state: {
    maxRecentCompletions: 10,
    statusCheckEnabled: true,
  },
  llm: {
    provider: "anthropic",
    model: "claude-haiku-4-5",
  },
  ignore: [
    "node_modules/**",
    "dist/**",
    ".git/**",
    ".memsync/**",
    "build/**",
    "coverage/**",
  ],
};
