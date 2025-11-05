/**
 * Initialize MemSync in a project
 */

import { cancel, confirm, intro, outro, text } from "@clack/prompts";
import {
  CONFIG_FILE,
  LLM_FILE,
  MEMSYNC_DIR,
  STATE_FILE,
  ensureMemsyncDir,
  fileExists,
  getMemsyncPath,
  getProjectRoot,
  writeFile,
  isGitRepo,
  createInitialState,
  createLLMInstructions,
  saveState,
} from "@memsync/core";
import { setupClaudeIntegration } from "../utils/claude";
import { createDefaultConfig, saveConfig } from "../utils/config";
import {
  analyzeProject,
  generateEnhancedLLMInstructions,
  generateEnhancedState,
} from "../utils/llm";
import { setupOpenCodeIntegration } from "../utils/opencode";

interface InitOptions {
  ai?: boolean;
  yes?: boolean;
  help?: boolean;
  version?: boolean;
}

export async function initCommand(options?: InitOptions): Promise<void> {
  intro("📝 Initialize MemSync");

  const projectRoot = getProjectRoot();

  // Check if already initialized
  const stateFile = getMemsyncPath(projectRoot, STATE_FILE);
  if (fileExists(stateFile)) {
    outro("✓ MemSync already initialized in this project");
    return;
  }

  // Check git repo
  if (!isGitRepo(projectRoot)) {
    const initGit = await confirm({
      message: "This directory is not a git repository. Initialize git first?",
    });

    if (initGit === false) {
      cancel("MemSync requires git. Exiting.");
      process.exit(1);
    }
  }

  // Get project name
  const projectName = await text({
    message: "Project name:",
    placeholder: "my-awesome-project",
    defaultValue: projectRoot.split("/").pop() || "my-project",
  });

  if (!projectName) {
    cancel("Project name is required");
    process.exit(1);
  }

  try {
    // Create .memsync directory
    ensureMemsyncDir(projectRoot);

    let stateContent: string;
    let llmInstructions: string;

    // Use AI analysis if requested
    if (options?.ai) {
      const analysis = await analyzeProject(projectRoot);
      stateContent = generateEnhancedState(projectName, analysis);
      llmInstructions = generateEnhancedLLMInstructions(analysis);
    } else {
      // Ask if user wants to use AI analysis
      const useAI = await confirm({
        message:
          "Would you like AI assistance to analyze your project and auto-populate files?",
        initialValue: true,
      });

      if (useAI) {
        const analysis = await analyzeProject(projectRoot);
        stateContent = generateEnhancedState(projectName, analysis);
        llmInstructions = generateEnhancedLLMInstructions(analysis);
      } else {
        stateContent = createInitialState(projectName);
        llmInstructions = createLLMInstructions();
      }
    }

    // Create state.md
    saveState(projectRoot, stateContent);

    // Create LLM.md
    const llmFile = getMemsyncPath(projectRoot, LLM_FILE);
    writeFile(llmFile, llmInstructions);

    // Create memsync.toml
    const config = createDefaultConfig();
    saveConfig(projectRoot, config);

    // Setup Claude Code integration
    const claudeSetup = setupClaudeIntegration(projectRoot);

    // Setup OpenCode integration
    const opencodeSetup = setupOpenCodeIntegration(projectRoot);

    outro(
      `✅ MemSync initialized! Created:
  - ${MEMSYNC_DIR}/${STATE_FILE}
  - ${MEMSYNC_DIR}/${LLM_FILE}
  - ${CONFIG_FILE}${claudeSetup.commandsCreated ? "\n  - .claude/commands/memsync.md" : ""}${!claudeSetup.mcp_config_exists ? "\n  - .claude/mcp.json" : ""}${opencodeSetup.commandsCreated ? `\n  - .opencode/command/ (${opencodeSetup.commandCount} commands)` : ""}${opencodeSetup.configCreated ? "\n  - .opencode/opencode.json" : ""}

Next steps:
  1. Review .memsync/state.md and customize for your project
  2. Commit: git add .memsync/ .claude/ .opencode/ && git commit -m "Initialize MemSync"
  3. For Claude Code: Configure .claude/mcp.json in settings
  4. For OpenCode: Run 'opencode' to start the terminal agent
  5. Use slash commands: /memsync-read, /memsync-status, /memsync-update, /memsync-sync
  6. Use CLI: memsync sync`,
    );
  } catch (error) {
    cancel(`Failed to initialize: ${error}`);
    process.exit(1);
  }
}
