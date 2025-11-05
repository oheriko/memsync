/**
 * Show configuration
 */

import { intro, outro } from "@clack/prompts";
import { stringify } from "smol-toml";
import { fileExists, getConfigFile, getProjectRoot } from "@memsync/core";
import { loadConfig } from "../utils/config";

export function configCommand(): void {
  intro("⚙️  MemSync Config");

  const projectRoot = getProjectRoot();
  const configFile = getConfigFile(projectRoot);

  if (!fileExists(configFile)) {
    outro("❌ No memsync.toml found. Run: memsync init");
    return;
  }

  const config = loadConfig(projectRoot);

  console.log("");
  console.log("Current configuration:");
  console.log("");
  console.log(stringify(config));
  console.log("");
  outro(`Config file: ${configFile}`);
}
