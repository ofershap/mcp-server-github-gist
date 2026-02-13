import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  listGists,
  getGist,
  createGist,
  updateGist,
  deleteGist,
  listStarredGists,
  starGist,
  unstarGist,
} from "./github.js";

function getToken(): string {
  const token =
    process.env.GITHUB_TOKEN ?? process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      "Missing GitHub token. Set GITHUB_TOKEN or GITHUB_PERSONAL_ACCESS_TOKEN environment variable.",
    );
  }
  return token;
}

function formatGistSummary(gist: {
  id: string;
  html_url: string;
  description: string | null;
  public: boolean;
  files: Record<string, { filename: string }>;
  created_at: string;
  updated_at: string;
}): string {
  const files = Object.keys(gist.files).join(", ");
  const visibility = gist.public ? "public" : "secret";
  return [
    `ID: ${gist.id}`,
    `URL: ${gist.html_url}`,
    `Description: ${gist.description ?? "(none)"}`,
    `Visibility: ${visibility}`,
    `Files: ${files}`,
    `Created: ${gist.created_at}`,
    `Updated: ${gist.updated_at}`,
  ].join("\n");
}

const server = new McpServer({
  name: "mcp-server-github-gist",
  version: "0.1.0",
});

server.tool(
  "gist_list",
  "List your GitHub Gists",
  {
    perPage: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(10)
      .describe("Number of gists per page"),
    page: z.number().int().min(1).default(1).describe("Page number"),
  },
  async ({ perPage, page }) => {
    const token = getToken();
    const gists = await listGists(token, perPage, page);
    if (gists.length === 0) {
      return { content: [{ type: "text", text: "No gists found." }] };
    }
    const text = gists.map(formatGistSummary).join("\n\n---\n\n");
    return { content: [{ type: "text", text }] };
  },
);

server.tool(
  "gist_get",
  "Get a specific Gist by ID (includes file contents)",
  {
    gistId: z.string().describe("The Gist ID"),
  },
  async ({ gistId }) => {
    const token = getToken();
    const gist = await getGist(token, gistId);
    const fileContents = Object.entries(gist.files)
      .map(([name, file]) => `--- ${name} ---\n${file.content}`)
      .join("\n\n");
    const summary = formatGistSummary(gist);
    return {
      content: [{ type: "text", text: `${summary}\n\n${fileContents}` }],
    };
  },
);

server.tool(
  "gist_create",
  "Create a new GitHub Gist",
  {
    description: z.string().optional().describe("Description of the gist"),
    public: z.boolean().default(false).describe("Whether the gist is public"),
    files: z
      .record(z.string(), z.string())
      .describe("Map of filename to content"),
  },
  async ({ description, public: isPublic, files }) => {
    const token = getToken();
    const fileInput: Record<string, { content: string }> = {};
    for (const [name, content] of Object.entries(files)) {
      fileInput[name] = { content };
    }
    const gist = await createGist(token, {
      description,
      public: isPublic,
      files: fileInput,
    });
    return {
      content: [
        {
          type: "text",
          text: `Gist created!\n\n${formatGistSummary(gist)}`,
        },
      ],
    };
  },
);

server.tool(
  "gist_update",
  "Update an existing Gist (description or file contents)",
  {
    gistId: z.string().describe("The Gist ID to update"),
    description: z.string().optional().describe("New description"),
    files: z
      .record(z.string(), z.string().nullable())
      .optional()
      .describe("Map of filename to new content (null to delete a file)"),
  },
  async ({ gistId, description, files }) => {
    const token = getToken();
    const fileInput: Record<string, { content: string } | null> = {};
    if (files) {
      for (const [name, content] of Object.entries(files)) {
        fileInput[name] = content === null ? null : { content };
      }
    }
    const gist = await updateGist(token, gistId, {
      description,
      files: Object.keys(fileInput).length > 0 ? fileInput : undefined,
    });
    return {
      content: [
        {
          type: "text",
          text: `Gist updated!\n\n${formatGistSummary(gist)}`,
        },
      ],
    };
  },
);

server.tool(
  "gist_delete",
  "Delete a Gist by ID",
  {
    gistId: z.string().describe("The Gist ID to delete"),
  },
  async ({ gistId }) => {
    const token = getToken();
    await deleteGist(token, gistId);
    return {
      content: [{ type: "text", text: `Gist ${gistId} deleted.` }],
    };
  },
);

server.tool(
  "gist_starred",
  "List your starred Gists",
  {
    perPage: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(10)
      .describe("Number of gists per page"),
    page: z.number().int().min(1).default(1).describe("Page number"),
  },
  async ({ perPage, page }) => {
    const token = getToken();
    const gists = await listStarredGists(token, perPage, page);
    if (gists.length === 0) {
      return {
        content: [{ type: "text", text: "No starred gists found." }],
      };
    }
    const text = gists.map(formatGistSummary).join("\n\n---\n\n");
    return { content: [{ type: "text", text }] };
  },
);

server.tool(
  "gist_star",
  "Star a Gist",
  { gistId: z.string().describe("The Gist ID to star") },
  async ({ gistId }) => {
    const token = getToken();
    await starGist(token, gistId);
    return {
      content: [{ type: "text", text: `Gist ${gistId} starred.` }],
    };
  },
);

server.tool(
  "gist_unstar",
  "Unstar a Gist",
  { gistId: z.string().describe("The Gist ID to unstar") },
  async ({ gistId }) => {
    const token = getToken();
    await unstarGist(token, gistId);
    return {
      content: [{ type: "text", text: `Gist ${gistId} unstarred.` }],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
