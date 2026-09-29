# API coverage

## v2

ER:LC API v2 combines most live server information under:

```text
GET /v2/server
```

Supported optional collections:

| ER:LC collection | MCP access |
| --- | --- |
| Players | `erlc_players` or `erlc_server` |
| Staff | `erlc_staff` or `erlc_server` |
| JoinLogs | `erlc_logs` or `erlc_server` |
| Queue | `erlc_queue` or `erlc_server` |
| KillLogs | `erlc_logs` or `erlc_server` |
| CommandLogs | `erlc_logs` or `erlc_server` |
| ModCalls | `erlc_logs` or `erlc_server` |
| EmergencyCalls | `erlc_logs` or `erlc_server` |
| Vehicles | `erlc_vehicles` or `erlc_server` |

Remote commands use:

```text
POST /v2/server/command
```

## v1

The package also exposes the documented v1 endpoints:

| Endpoint | MCP tool |
| --- | --- |
| `GET /v1/server` | `erlc_v1_server` |
| `GET /v1/server/players` | `erlc_v1_players` |
| `GET /v1/server/staff` | `erlc_v1_staff` |
| `GET /v1/server/joinlogs` | `erlc_v1_joinlogs` |
| `GET /v1/server/queue` | `erlc_v1_queue` |
| `GET /v1/server/killlogs` | `erlc_v1_killlogs` |
| `GET /v1/server/commandlogs` | `erlc_v1_commandlogs` |
| `GET /v1/server/modcalls` | `erlc_v1_modcalls` |
| `GET /v1/server/bans` | `erlc_v1_bans` |
| `GET /v1/server/vehicles` | `erlc_v1_vehicles` |
| `POST /v1/server/command` | `erlc_command` with `version: "v1"` |

The v1 staff endpoint is marked deprecated in ER:LC's OpenAPI specification.

## Why both versions?

v2 should be preferred for new integrations because it exposes newer information such as player location and richer vehicle data. v1 remains useful for compatibility and currently documents a bans endpoint.

The MCP keeps the versions explicit rather than silently translating every v1 response into a v2 shape.
