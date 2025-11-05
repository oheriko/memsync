#!/usr/bin/env node

/**
 * MemSync MCP Server
 *
 * Exposes MemSync project state and update tools to AI agents
 * via the Model Context Protocol (MCP).
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { existsSync, readFileSync } from "fs";
import { getStateFile } from "@memsync/core";
import {
  checkStatus,
  performSync,
  readProjectStateFile,
  updateStateWithChanges,
} from "./utils.js";

// Initialize the MCP server
const server = new Server(
  {
    name: "memsync",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  },
);

// Get project root (can be configured via environment variable)
function getProjectRoot(): string {
  return process.env.MEMSYNC_PROJECT_ROOT || process.cwd();
}

/**
 * List available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "read_project_state",
        description:
          "Read the current project state from .memsync/state.md. Returns the complete project context including architecture, tech stack, constraints, and current status.",
        inputSchema: {
          type: "object" as const,
          properties: {
            sections: {
              type: "array",
              items: { type: "string" },
              description:
                "Optional: specific sections to read (e.g. ['Architecture', 'Tech Stack']). If empty, returns entire state.md",
            },
          },
          required: [],
        },
      },
      {
        name: "check_sync_status",
        description:
          "Check if project state is in sync with actual code. Returns whether state.md is up-to-date or if there are uncommitted code changes that should trigger an update.",
        inputSchema: {
          type: "object" as const,
          properties: {},
          required: [],
        },
      },
      {
        name: "update_project_state",
        description:
          "Update specific sections of the project state. Regenerates the specified sections with new content. Use after making code changes.",
        inputSchema: {
          type: "object" as const,
          properties: {
            updates: {
              type: "object",
              description:
                "Map of section name to new content. Section names should match headers in state.md (e.g. 'Current Status', 'Tech Stack')",
              additionalProperties: { type: "string" },
            },
            commitMessage: {
              type: "string",
              description:
                "Optional: git commit message for the state.md update. If not provided, a default message is used.",
            },
          },
          required: ["updates"],
        },
      },
      {
        name: "sync_project_state",
        description:
          "Run a full project state sync. Analyzes all code changes since last sync and regenerates relevant sections of state.md. Use when drift is detected or at checkpoints.",
        inputSchema: {
          type: "object" as const,
          properties: {
            force: {
              type: "boolean",
              description:
                "Force sync even if state appears up-to-date. Default: false",
            },
          },
          required: [],
        },
      },
    ],
  };
});

/**
 * Handle tool calls
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const projectRoot = getProjectRoot();

  try {
    switch (request.params.name) {
      case "read_project_state": {
        const args = request.params.arguments as {
          sections?: string[];
        };

        try {
          const state = readProjectStateFile(projectRoot, args.sections);
          return {
            content: [
              {
                type: "text",
                text: state,
              },
            ],
          };
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return {
            content: [
              {
                type: "text",
                text: `Error reading project state: ${errorMessage}`,
              },
            ],
            isError: true,
          };
        }
      }

      case "check_sync_status": {
        try {
          const result = checkStatus(projectRoot);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return {
            content: [
              {
                type: "text",
                text: `Error checking sync status: ${errorMessage}`,
              },
            ],
            isError: true,
          };
        }
      }

      case "update_project_state": {
        const args = request.params.arguments as {
          updates: Record<string, string>;
          commitMessage?: string;
        };

        if (!args.updates || Object.keys(args.updates).length === 0) {
          return {
            content: [
              {
                type: "text",
                text: "Error: No updates provided. Include at least one section to update.",
              },
            ],
            isError: true,
          };
        }

        try {
          const result = updateStateWithChanges(
            projectRoot,
            args.updates,
            args.commitMessage,
          );
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
            isError: !result.success,
          };
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return {
            content: [
              {
                type: "text",
                text: `Error updating project state: ${errorMessage}`,
              },
            ],
            isError: true,
          };
        }
      }

      case "sync_project_state": {
        const args = request.params.arguments as {
          force?: boolean;
        };

        try {
          const result = performSync(projectRoot, args.force);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
            isError: !result.success,
          };
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return {
            content: [
              {
                type: "text",
                text: `Error syncing project state: ${errorMessage}`,
              },
            ],
            isError: true,
          };
        }
      }

      default:
        return {
          content: [
            {
              type: "text",
              text: `Unknown tool: ${request.params.name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Error executing tool: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

/**
 * List available resources
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const projectRoot = getProjectRoot();
  const stateFile = getStateFile(projectRoot);

  return {
    resources: [
      {
        uri: "memsync://state.md",
        name: "Project State",
        description:
          "The current project state file (.memsync/state.md) containing all project context",
        mimeType: "text/markdown",
      },
    ],
  };
});

/**
 * Handle resource read requests
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const projectRoot = getProjectRoot();

  if (request.params.uri === "memsync://state.md") {
    try {
      const content = readProjectStateFile(projectRoot);
      return {
        contents: [
          {
            uri: request.params.uri,
            mimeType: "text/markdown",
            text: content,
          },
        ],
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to read state.md",
      );
    }
  }

  throw new Error(`Unknown resource: ${request.params.uri}`);
});

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MemSync MCP Server started");
}

main().catch((error) => {
  console.error("Server startup error:", error);
  process.exit(1);
});
