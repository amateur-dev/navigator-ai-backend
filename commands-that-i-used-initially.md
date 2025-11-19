---
# Raindrop CLI — The commands I used (and should use) to build & deploy

This file documents the key Raindrop CLI and AI tool commands you need to go from zero to a deployed application using the Raindrop MCP server.

Notes:
- This assumes you have Node.js / npm installed and are using one of the supported AI tools (e.g., `claude-code` or Gemini CLI).
- Where commands must be run inside the AI tool (e.g., `claude-code`), the command is noted as a "slash command" inside the AI tool UI.

## Quick Start (copy/paste)

```bash
# Install required CLIs
npm install -g @anthropic-ai/claude-code
npm install -g @liquidmetal-ai/raindrop

# Login
raindrop auth login

# Install MCP connector to your AI tool (then run the AI tool and /mcp)
raindrop mcp install-claude

# Initialize, generate, and deploy your app
raindrop build init my-navigator-app
cd my-navigator-app
raindrop build generate
raindrop build deploy --start

# Tail logs while fixing issues
raindrop logs tail --filter "error"
```

## 0) Prerequisites

Install an AI tool (choose one):

```bash
# Claude Code (example)
npm install -g @anthropic-ai/claude-code

# (Optional) Gemini CLI — install per its instructions if you plan to use Gemini
```

Install the Raindrop CLI:

```bash
npm install -g @liquidmetal-ai/raindrop
```

## 1) Authenticate your CLI

```bash
# Login to Raindrop from your terminal — opens a browser for OAuth
raindrop auth login
```

## 2) Configure MCP integration (connect your AI tool to raindrop-mcp)

```bash
# For Claude Code (example)
raindrop mcp install-claude

# For Gemini CLI (if used)
raindrop mcp install-gemini

# Verify MCP integration status
raindrop mcp status
```

After running the `mcp install-*` command you must start your AI CLI (e.g., `claude-code`) and run the `/mcp` command inside the AI tool to select `raindrop-mcp` and authenticate.

## 3) Start a new MCP application session (from inside the AI tool)

In your AI tool (e.g., `claude-code`), you can use the provided slash commands to start a new app workflow, or you can initialize locally with the Raindrop CLI.

Inside AI tool (slash command):

```
/new-raindrop-app
```

This triggers the guided PRD / architecture workflow in the MCP UI. Follow the AI's questions to define requirements.

Examples for resuming or updating sessions in the AI tool:

```
/reattach-raindrop-session <session_id>
/update-raindrop-app [session_id]
/debug-raindrop-app [session_id]
```

## 4) Initialize a local build (optional — but useful if you want a local repo)

```bash
# Initialize a local build that the Raindrop build pipeline can use
raindrop build init my-navigator-app
```

This creates a project scaffold for your app (including a `raindrop.manifest` if the AI generated it).

## 5) Generate source code from the manifest

```bash
# Generate TypeScript service/actor source files from the raindrop.manifest
raindrop build generate
```

This inspects `raindrop.manifest` and populates `src/` with generated code (or updates code when properties change).

## 6) Deploy your application

```bash
# Deploy and start your application
raindrop build deploy --start

# (Alternative) Deploy without starting automatically
raindrop build deploy
```

`--start` will spin up the deployed services so they're live and reachable.

## 7) Check build and deployment status

```bash
# (If available) status or list builds
raindrop build status  # (if supported in your CLI version)
raindrop build list    # lists recent builds
```

If `build status` is not available, use logs and artifacts files (see below) to detect deployment status.

## 8) Debugging and logs

```bash
# Tail your deployed application's logs (follow live)
raindrop logs tail --filter "error"

# Query logs (non-tail):
raindrop logs query --filter "error" --limit 100
```

When a failure is found, you can call `/debug-raindrop-app` from within your AI tool to help the MCP analyze and suggest fixes.

## 9) Object storage (buckets) & uploads

```bash
# Get S3-compatible credentials for a bucket
raindrop bucket get-credential --bucket <bucket-name>

# List credentials configured locally (if any)
raindrop bucket list-credentials

# Upload an object
raindrop object put ./local-file.txt my-key --bucket my-bucket

# Download an object
raindrop object get my-key ./local-copy.txt --bucket my-bucket

# List objects in a bucket
raindrop object list --bucket my-bucket
```

## 10) SmartBucket RAG / query

```bash
# Perform chunk-search (semantic RAG) against SmartBucket
raindrop query chunk-search "Your natural language query here"
```

## 11) DNS, annotations, metadata (optional)

```bash
# Manage DNS zones/records (if needed)
raindrop dns list
raindrop dns create --zone example.com --name api --value 1.2.3.4

# List or manage annotations (metadata)
raindrop annotation list
raindrop annotation create --key "team" --value "backend"
```

## 12) Useful tips / best practices

- Use `raindrop auth login` before any CLI command that interacts with the Raindrop platform.
- If you're using an AI CLI, always run `/mcp` once so the AI tool can connect to the Raindrop MCP; this will allow you to use slash commands (like `/new-raindrop-app`).
- Use `raindrop build generate` between manifest changes and deployments to make sure code is up-to-date.
- If a deployment fails, `raindrop logs tail --filter "error"` will usually show the root cause.
- When uploading files, `raindrop object put ./myfile.txt key --bucket <my-bucket>` is useful to seed test file attachments.

---

## 13) Where to find deployment artifacts and base URL

The MCP workflow stores deployment metadata in the local session directory (created under `~/.raindrop/`). If you used the AI tool to create the session, find the session ID in the AI UI or in `~/.raindrop/` and then inspect `artifacts.json` for deploy URLs and resource IDs:

```bash
# List session directories
ls ~/.raindrop

# Read artifacts.json for your session
cat ~/.raindrop/sess_<your-session-id>/artifacts.json
```

This file typically contains the base URL for your API and other deployment artifacts (e.g., database IDs, bucket names, auth keys).

