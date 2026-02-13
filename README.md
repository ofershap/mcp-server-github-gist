# mcp-server-github-gist

[![npm version](https://img.shields.io/npm/v/mcp-server-github-gist.svg)](https://www.npmjs.com/package/mcp-server-github-gist)
[![CI](https://github.com/ofershap/mcp-server-github-gist/actions/workflows/ci.yml/badge.svg)](https://github.com/ofershap/mcp-server-github-gist/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> MCP server to create, read, update, list, and search GitHub Gists from your IDE. The GitHub MCP server focuses on repos and issues — this one is all about Gists.

<p align="center">
  <img src="assets/demo.gif" alt="mcp-server-github-gist demo" width="600" />
</p>

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

## License

[MIT](LICENSE) &copy; [Ofer Shapira](https://github.com/ofershap)
