# Development

Install dependencies:

```bash
npm install
```

Run the TypeScript server directly:

```bash
npm run dev
```

Type-check without emitting files:

```bash
npm run typecheck
```

Build:

```bash
npm run build
```

The MCP server uses stdio. Keep normal application output off stdout because stdout is reserved for the MCP transport.

## Project layout

```text
src/
  index.ts    MCP tool definitions and stdio transport
  erlc.ts     ER:LC HTTP client

docs/
  TOOLS.md
  DEVELOPMENT.md
```

## Adding a tool

Prefer API v2 where an equivalent endpoint or collection exists.

Keep authentication inside `src/erlc.ts` rather than reading the key from individual tool handlers. Tool descriptions should say what data or action the tool provides without embedding client-specific instructions.
