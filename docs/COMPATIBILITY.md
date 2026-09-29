# Compatibility

This package is a local MCP server using the standard stdio transport.

## Works with

It can be used with MCP clients that support launching local stdio servers and passing environment variables to them.

Typical examples include:

- Claude Desktop
- Cursor
- coding agents and IDEs with stdio MCP support
- custom applications built with an MCP client SDK

ChatGPT or other hosted clients can use an MCP integration only when their product supports the relevant MCP/app connection method. A local stdio process is not automatically reachable from a hosted web client.

## Claude Desktop style configuration

```json
{
  "mcpServers": {
    "erlc": {
      "command": "node",
      "args": ["/absolute/path/to/erlc-mcp/dist/index.js"],
      "env": {
        "ERLC_SERVER_KEY": "your-private-server-key"
      }
    }
  }
}
```

## Cursor style configuration

Use the same command, arguments and environment variables in Cursor's MCP configuration.

## Windows

Use an absolute Windows path to `dist/index.js`. JSON backslashes must be escaped:

```json
{
  "mcpServers": {
    "erlc": {
      "command": "node",
      "args": ["C:\\Tools\\erlc-mcp\\dist\\index.js"],
      "env": {
        "ERLC_SERVER_KEY": "your-private-server-key"
      }
    }
  }
}
```

## Linux, macOS and Raspberry Pi

Node.js 20 or newer is required. The project does not depend on a GUI and can run on a headless machine.

## Containers and VPSs

The MCP itself works normally in a container or VPS. Remote ER:LC commands additionally require the public outbound IP to be trusted in the ER:LC Server Owner Dashboard.

Shared-IP hosting can be problematic for the ER:LC API. ER:LC specifically states that BotGhost and similar shared-IP services are not supported.

## ER:LC documentation MCP

ER:LC also provides an official hosted MCP endpoint for its documentation:

```text
https://apidocs.erlc.gg/mcp
```

That service is useful for searching and reading the ER:LC API documentation. It does not replace this project's private-server tools.
