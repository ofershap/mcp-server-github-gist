# MCP Server GitHub Gist — Manage Gists from Your AI Assistant

[![npm version](https://img.shields.io/npm/v/mcp-server-github-gist.svg)](https://www.npmjs.com/package/mcp-server-github-gist)
[![npm downloads](https://img.shields.io/npm/dm/mcp-server-github-gist.svg)](https://www.npmjs.com/package/mcp-server-github-gist)
[![CI](https://github.com/ofershap/mcp-server-github-gist/actions/workflows/ci.yml/badge.svg)](https://github.com/ofershap/mcp-server-github-gist/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An MCP server to create, read, update, and search GitHub Gists without leaving your AI assistant. The official GitHub MCP server handles repos and issues — this one fills the Gist gap.

```
You: "Save this code snippet as a gist called 'auth-middleware.ts'"
AI:  ✅ Created secret gist: https://gist.github.com/abc123
```

> Works with Claude Desktop, Cursor, and VS Code Copilot.

![MCP server GitHub Gist demo — creating and listing gists from Claude Desktop](assets/demo.gif)

## Tools

| Tool           | What it does                              |
| -------------- | ----------------------------------------- |
| `gist_list`    | List your gists (paginated)               |
| `gist_get`     | Get a gist by ID (includes file contents) |
| `gist_create`  | Create a new gist (public or secret)      |
| `gist_update`  | Update description or file contents       |
| `gist_delete`  | Delete a gist                             |
| `gist_starred` | List your starred gists                   |
| `gist_star`    | Star a gist                               |
| `gist_unstar`  | Unstar a gist                             |

## Quick Start

### With Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "github-gist": {
      "command": "npx",
      "args": ["-y", "mcp-server-github-gist"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

### With Cursor

Add to your `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "github-gist": {
      "command": "npx",
      "args": ["-y", "mcp-server-github-gist"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

## Authentication

Requires a GitHub personal access token with the `gist` scope.

1. Go to [GitHub Settings > Tokens](https://github.com/settings/tokens)
2. Create a token with the **gist** scope
3. Set it as `GITHUB_TOKEN` or `GITHUB_PERSONAL_ACCESS_TOKEN` environment variable

## Examples

Ask your AI assistant:

- "List my recent gists"
- "Create a gist with this code snippet"
- "Show me gist abc123"
- "Update the description of gist abc123"
- "Delete gist abc123"
- "Star this gist"

## Development

```bash
npm install
npm test
npm run build
```

## Author

[![Made by ofershap](https://gitshow.dev/api/card/ofershap)](https://gitshow.dev/ofershap)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/ofershap)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat&logo=github&logoColor=white)](https://github.com/ofershap)

## License

[MIT](LICENSE) &copy; [Ofer Shapira](https://github.com/ofershap)
