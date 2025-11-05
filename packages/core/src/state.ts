/**
 * Project state management
 */

import { MEMSYNC_VERSION } from "./types";
import { getStateFile, writeFile } from "./files";

/**
 * Create initial state.md template
 */
export function createInitialState(projectName: string | symbol): string {
  const timestamp = new Date().toISOString();

  return `---
last_updated: ${timestamp}
project_version: 0.1.0
memsync_version: ${MEMSYNC_VERSION}
---

# Table of Contents

- [Project Overview](#project-overview)
- [Current Status](#current-status)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Constraints](#constraints)
- [Key Decisions](#key-decisions)
- [Notes](#notes)

## Project Overview

### Description

**What:** ${String(projectName)}

**Why:** [Add description of why this project exists]

**Who:** [Add intended users/audience]

### Desired State

- [Add vision statement]
- [Add key goals]
- [Add roadmap items]

## Current Status

### Health

- **Build:** ! Not yet assessed
- **Tests:** ! Not yet assessed
- **Deployment:** ! Not yet assessed

### Active Work

- [Add in-progress items with completion %]

### Recently Completed

- [Add recent completions]

## Architecture

### System Structure

[Add overview of how the system is organized]

### Key Components

- [Component 1: Description]
- [Component 2: Description]

### Data Flow

[Add diagram or description of data flow]

## Tech Stack

### Languages & Frameworks

- [Language/Framework]: [version]

### Key Libraries

- [Library]: [purpose]

### Infrastructure

- [Infrastructure]: [details]

## Constraints

### Performance

- [Performance requirement]

### Compatibility

- [Compatibility requirement]

### Business Rules

- [Business rule]

## Key Decisions

### Decision 1

- **What:** [The decision]
- **Why:** [Rationale]
- **Tradeoffs:** [What we gave up]
- **Future:** [Future considerations]

## Notes

### Gotchas

- [Known gotcha]

### TODOs

- [TODO item]

### Important Reminders

- [Important reminder]
`;
}

/**
 * Create initial LLM.md file
 */
export function createLLMInstructions(): string {
  return `# Instructions for AI Agents Using MemSync

## Overview

This document explains how to use MemSync to work effectively on this project.

## Reading Project State

Always start by reading the project state:

\`\`\`
state = await read_project_state()
\`\`\`

This gives you complete context about:
- Project architecture and design decisions
- Tech stack and constraints
- Current status and recent work
- Known gotchas and important reminders

## Making Changes

When you make code changes:

1. Update relevant sections of \`state.md\`
2. Include what you changed and why
3. Ensure \`Current Status\` reflects new progress

Example:

\`\`\`
await update_project_state({
  "Current Status": "✅ Auth: OAuth fully implemented",
  "Tech Stack": "Added @auth0/nextjs-auth0 for OAuth",
  "Key Decisions": "Added decision about OAuth provider choice"
})
\`\`\`

## Important Rules

- Always read state.md first - don't ask about project details if they're there
- Update state.md when you add dependencies or major features
- Keep descriptions concise and focused
- Include links to relevant files/docs when helpful

## Sync Process

When you're done:

1. Commit your code and state.md updates together
2. Message will confirm sync was successful
3. Next agent can read updated state.md

## Questions?

If something in state.md is unclear or missing:
- Ask the user to update that section
- OR request state.md be regenerated via \`sync\`
`;
}

/**
 * Generate state metadata
 */
export function generateStateMetadata(): object {
  return {
    last_updated: new Date().toISOString(),
    project_version: "0.1.0",
    memsync_version: MEMSYNC_VERSION,
  };
}

/**
 * Save state to file
 */
export function saveState(projectRoot: string, content: string): void {
  const stateFile = getStateFile(projectRoot);
  writeFile(stateFile, content);
}

/**
 * Update state metadata
 */
export function updateStateMetadata(stateContent: string): string {
  const lines = stateContent.split("\n");
  const frontmatterEnd = lines.findIndex((line, i) => i > 0 && line === "---");

  if (frontmatterEnd === -1) {
    // Add frontmatter if missing
    return `---
last_updated: ${new Date().toISOString()}
project_version: 0.1.0
memsync_version: ${MEMSYNC_VERSION}
---

${stateContent}`;
  }

  const newFrontmatter = [
    "---",
    `last_updated: ${new Date().toISOString()}`,
    "project_version: 0.1.0",
    `memsync_version: ${MEMSYNC_VERSION}`,
    "---",
  ];

  return [...newFrontmatter, ...lines.slice(frontmatterEnd + 1)].join("\n");
}
