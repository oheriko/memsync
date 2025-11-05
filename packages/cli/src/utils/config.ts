/**
 * Configuration loading and management
 */

import { parse, stringify } from "smol-toml";
import { type Config, DEFAULT_CONFIG, MEMSYNC_VERSION } from "../types";
import { fileExists, getConfigFile, readFile, writeFile } from "./files";

export function loadConfig(projectRoot: string): Config {
  const configPath = getConfigFile(projectRoot);

  if (!fileExists(configPath)) {
    return DEFAULT_CONFIG;
  }

  try {
    const content = readFile(configPath);
    const parsed = parse(content) as Record<string, any>;

    // Merge with defaults for any missing keys
    return mergeWithDefaults(parsed);
  } catch (error) {
    console.warn(`Failed to parse config: ${error}`);
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(projectRoot: string, config: Config): void {
  const configPath = getConfigFile(projectRoot);
  const content = stringify(config);
  writeFile(configPath, content);
}

export function createDefaultConfig(): Config {
  return {
    ...DEFAULT_CONFIG,
  };
}

function mergeWithDefaults(partial: Record<string, any>): Config {
  const config = createDefaultConfig();

  if (partial.version) config.version = partial.version;

  if (partial.sync) {
    if (partial.sync.mode) config.sync.mode = partial.sync.mode;
    if (typeof partial.sync.checkOnStartup === "boolean")
      config.sync.checkOnStartup = partial.sync.checkOnStartup;
    if (typeof partial.sync.autoCommit === "boolean")
      config.sync.autoCommit = partial.sync.autoCommit;
  }

  if (partial.state) {
    if (partial.state.maxRecentCompletions)
      config.state.maxRecentCompletions = partial.state.maxRecentCompletions;
    if (typeof partial.state.statusCheckEnabled === "boolean")
      config.state.statusCheckEnabled = partial.state.statusCheckEnabled;
  }

  if (partial.llm) {
    if (partial.llm.provider) config.llm.provider = partial.llm.provider;
    if (partial.llm.model) config.llm.model = partial.llm.model;
  }

  if (Array.isArray(partial.ignore)) {
    config.ignore = partial.ignore;
  }

  return config;
}
