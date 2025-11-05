/**
 * File system utilities
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { CONFIG_FILE, LLM_FILE, MEMSYNC_DIR, STATE_FILE } from "./types";

export function ensureMemsyncDir(projectRoot: string): void {
  const memsyncPath = join(projectRoot, MEMSYNC_DIR);
  if (!existsSync(memsyncPath)) {
    mkdirSync(memsyncPath, { recursive: true });
  }
}

export function getMemsyncPath(projectRoot: string, file?: string): string {
  const base = join(projectRoot, MEMSYNC_DIR);
  return file ? join(base, file) : base;
}

export function getStateFile(projectRoot: string): string {
  return getMemsyncPath(projectRoot, STATE_FILE);
}

export function getConfigFile(projectRoot: string): string {
  return join(projectRoot, CONFIG_FILE);
}

export function getLLMFile(projectRoot: string): string {
  return getMemsyncPath(projectRoot, LLM_FILE);
}

export function fileExists(filePath: string): boolean {
  return existsSync(filePath);
}

export function readFile(filePath: string): string {
  return readFileSync(filePath, "utf-8");
}

export function writeFile(filePath: string, content: string): void {
  writeFileSync(filePath, content, "utf-8");
}

export function getProjectRoot(): string {
  // For now, assume current working directory
  // In future, could walk up to find git root
  return process.cwd();
}

export function fileSize(filePath: string): number {
  try {
    const content = readFile(filePath);
    return content.length;
  } catch {
    return 0;
  }
}
