# ER:LC MCP

An MCP server for the ER:LC Private Server API.

The project exposes ER:LC API v2 through a small set of convenient tools and also includes the documented v1 endpoints for compatibility.

## Features

- API v2 server status
- players and v2 location data
- staff
- queue
- vehicles and extended v2 vehicle data
- join logs
- kill logs
- command logs
- moderator calls
- emergency calls
- remote server commands
- API v1 compatibility
- v1 bans
- structured API errors and `Retry-After` handling

## Requirements

- Node.js 20+
- an ER:LC private server with the API server pack
- a private server API key

ER:LC requires the API pack before the private server API can be used.

## Setup

```bash
npm install
npm run build
```

Set the key in the environment:

```bash
ERLC_SERVER_KEY="your-key" npm start
```

PowerShell:

```powershell
$env:ERLC_SERVER_KEY="your-key"
npm start
```

Never commit a real server key.

## Authorizing the computer that runs the MCP

Reading data uses the server key. Remote commands have an additional ER:LC safety check: the source IP must be trusted.

1. Open the ER:LC Server Owner API Dashboard.
2. Sign in with Roblox.
3. Select the private server.
4. Open **Settings**.
5. Add the public IP address of the computer or server that will run this MCP to the trusted IP list.
6. Add a comment so the rule is easy to identify later.
7. Save the rule.

After the IP is trusted, that machine can send `POST` command requests. An untrusted source can receive ER:LC error code `4000`.

If the MCP runs on a VPS, Raspberry Pi behind a different internet connection, cloud host, or another machine, authorize the public outbound IP of that machine. Do not enter a local address such as `192.168.x.x`.

For a public application used by many unrelated server owners, ER:LC provides a separate public application/global-key authorization system. Do not register a one-server integration as a public application.

## Tools

### API v2

- `erlc_server`
- `erlc_players`
- `erlc_vehicles`
- `erlc_staff`
- `erlc_queue`
- `erlc_logs`
- `erlc_command`

### API v1 compatibility

- `erlc_v1_server`
- `erlc_v1_players`
- `erlc_v1_staff`
- `erlc_v1_joinlogs`
- `erlc_v1_queue`
- `erlc_v1_killlogs`
- `erlc_v1_commandlogs`
- `erlc_v1_modcalls`
- `erlc_v1_bans`
- `erlc_v1_vehicles`

`erlc_command` accepts `version: "v1"` or `version: "v2"` and defaults to v2.

API v1 is included for compatibility. New integrations should normally use v2 where possible.

## MCP client compatibility

The server uses the standard MCP SDK and stdio transport. It is suitable for MCP clients that can launch a local stdio server, including clients in the Claude Desktop, Cursor and developer-tooling ecosystem.

Other MCP-capable applications can use it when they support local stdio servers and allow environment variables to be passed to the process.

This project is different from ER:LC's official documentation MCP. Their hosted MCP exposes documentation search. This project exposes your private server API as callable tools.

See `docs/COMPATIBILITY.md` for configuration examples and transport notes.

## Rate limits

ER:LC applies rate limits per IP/application and may apply tighter limits to individual routes. Clients should respect `429` responses and wait for the full `Retry-After` period before retrying.

Do not aggressively poll the API. Repeated invalid server keys or ignored rate limits can lead to temporary or longer blocks.

## Documentation

- `docs/TOOLS.md`: every MCP tool
- `docs/AUTHORIZATION.md`: server key, trusted IPs and public applications
- `docs/COMPATIBILITY.md`: MCP client compatibility
- `docs/API-COVERAGE.md`: v1/v2 coverage
- `docs/DEVELOPMENT.md`: development notes

## License

MIT. See `LICENSE`.

ER:LC and Police Roleplay Community are trademarks of their respective owners. This project is unofficial and is not affiliated with Police Roleplay Community.
