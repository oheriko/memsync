/**
 * LLM integration for project analysis and content generation
 */

import Anthropic from "@anthropic-ai/sdk";
import { spinner } from "@clack/prompts";
import { readFile } from "./files";

interface ProjectAnalysis {
  description: string;
  purpose: string;
  audience: string;
  techStack: {
    languages: string[];
    frameworks: string[];
    libraries: string[];
  };
  architecture: string;
  constraints: string[];
  keyDecisions: string[];
}

/**
 * Analyze project structure and content using Claude
 */
export async function analyzeProject(
  projectRoot: string,
): Promise<ProjectAnalysis> {
  const client = new Anthropic();

  const s = spinner();
  s.start("Analyzing project with Claude...");

  try {
    // Read key project files
    const packageJson = tryReadFile(projectRoot, "package.json");
    const readmeMd = tryReadFile(projectRoot, "README.md");
    const tsConfigJson = tryReadFile(projectRoot, "tsconfig.json");
    const tsconfigBase = tryReadFile(projectRoot, "tsconfig.base.json");
    const gitIgnore = tryReadFile(projectRoot, ".gitignore");

    const projectInfo = [
      packageJson && `package.json:\n${packageJson}`,
      readmeMd && `README.md:\n${readmeMd}`,
      tsConfigJson && `tsconfig.json:\n${tsConfigJson}`,
      tsconfigBase && `tsconfig.base.json:\n${tsconfigBase}`,
      gitIgnore && `.gitignore:\n${gitIgnore}`,
    ]
      .filter(Boolean)
      .join("\n\n---\n\n");

    const prompt = `You are an expert software architect. Analyze this project and provide insights in JSON format.

Project information:
${projectInfo}

Based on the project files above, provide a JSON object with the following structure:
{
  "description": "A 1-2 sentence description of what this project does",
  "purpose": "Why this project exists and what problem it solves",
  "audience": "Who the intended users/audience are",
  "techStack": {
    "languages": ["list of programming languages used"],
    "frameworks": ["list of frameworks and key tools"],
    "libraries": ["list of important libraries and their purposes"]
  },
  "architecture": "A paragraph describing the system architecture and how it's organized",
  "constraints": ["list of key performance, compatibility, or business constraints"],
  "keyDecisions": ["list of 2-3 important architectural or technical decisions with brief rationale"]
}

Respond with ONLY valid JSON, no other text.`;

    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText =
      response.content[0].type === "text" ? response.content[0].text : "";

    try {
      // Extract JSON from response, handling markdown code blocks
      let jsonText = responseText.trim();

      // Remove markdown code blocks if present
      const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1].trim();
      }

      // Also try to extract JSON object if it's wrapped in extra text
      const objectMatch = jsonText.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        jsonText = objectMatch[0];
      }

      const analysis = JSON.parse(jsonText) as ProjectAnalysis;
      s.stop("✓ Project analysis complete");
      return analysis;
    } catch (error) {
      s.stop("✗ Failed to parse LLM response");
      console.error("Response text:", responseText);
      throw new Error("Invalid JSON response from Claude");
    }
  } catch (error) {
    s.stop("✗ Analysis failed");
    throw error;
  }
}

/**
 * Generate enhanced state.md content using project analysis
 */
export function generateEnhancedState(
  projectName: string | symbol,
  analysis: ProjectAnalysis,
): string {
  const timestamp = new Date().toISOString();

  return `---
last_updated: ${timestamp}
project_version: 0.1.0
memsync_version: 0.1.0
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

**What:** ${projectName}

${analysis.description}

**Why:** ${analysis.purpose}

**Who:** ${analysis.audience}

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

${analysis.architecture}

### Key Components

- [Component 1: Description]
- [Component 2: Description]

### Data Flow

[Add diagram or description of data flow]

## Tech Stack

### Languages & Frameworks

${analysis.techStack.languages.map((lang) => `- ${lang}`).join("\n")}

${analysis.techStack.frameworks.map((fw) => `- ${fw}`).join("\n")}

### Key Libraries

${analysis.techStack.libraries.map((lib) => `- ${lib}`).join("\n")}

### Infrastructure

- [Infrastructure]: [details]

## Constraints

### Performance

${analysis.constraints.map((constraint) => `- ${constraint}`).join("\n")}

### Compatibility

- [Compatibility requirement]

### Business Rules

- [Business rule]

## Key Decisions

${analysis.keyDecisions
  .map(
    (decision, index) => `### Decision ${index + 1}

- **What:** ${decision}
- **Why:** [Add rationale]
- **Tradeoffs:** [What we gave up]
- **Future:** [Future considerations]`,
  )
  .join("\n\n")}

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
 * Generate enhanced LLM.md instructions using project analysis
 */
export function generateEnhancedLLMInstructions(
  analysis: ProjectAnalysis,
): string {
  const techStackSummary = [
    analysis.techStack.languages.length > 0
      ? `Languages: ${analysis.techStack.languages.join(", ")}`
      : "",
    analysis.techStack.frameworks.length > 0
      ? `Frameworks: ${analysis.techStack.frameworks.join(", ")}`
      : "",
  ]
    .filter(Boolean)
    .join(" | ");

  return `# Instructions for AI Agents Using MemSync

## Project Context

This is a **${analysis.description}** project using ${techStackSummary}.

The project is designed to: ${analysis.purpose}

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

## Architecture Context

This project's architecture: ${analysis.architecture}

## Important Rules

- Always read state.md first - don't ask about project details if they're there
- Update state.md when you add dependencies or major features
- Keep descriptions concise and focused
- Include links to relevant files/docs when helpful
- Be mindful of these constraints:
${analysis.constraints.map((constraint) => `  - ${constraint}`).join("\n")}

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
 * Try to read a file, return null if it doesn't exist
 */
function tryReadFile(projectRoot: string, filename: string): string | null {
  try {
    const path = projectRoot.endsWith("/")
      ? `${projectRoot}${filename}`
      : `${projectRoot}/${filename}`;
    return readFile(path);
  } catch {
    return null;
  }
}
