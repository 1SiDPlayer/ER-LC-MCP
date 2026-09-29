# MCP tools

## v2 tools

### `erlc_server`

Fetches `GET /v2/server`.

Arguments are optional booleans:

```json
{
  "players": false,
  "staff": false,
  "joinLogs": false,
  "queue": false,
  "killLogs": false,
  "commandLogs": false,
  "modCalls": false,
  "emergencyCalls": false,
  "vehicles": false
}
```

### `erlc_players`

Returns the v2 `Players` collection. ER:LC can provide team, player identity, callsign, permission, wanted stars and location fields.

### `erlc_vehicles`

Returns the v2 `Vehicles` collection. v2 can provide fields including name, owner, plate, texture and color.

### `erlc_staff`

Returns the v2 `Staff` object.

### `erlc_queue`

Returns the v2 `Queue` collection.

### `erlc_logs`

Select one or more collections:

```json
{
  "join": true,
  "kills": true,
  "commands": true,
  "modCalls": true,
  "emergencyCalls": true
}
```

### `erlc_command`

Runs a command as Virtual Server Management.

```json
{
  "command": ":h Hello",
  "version": "v2"
}
```

`version` may be `v1` or `v2`. It defaults to `v2`.

Remote commands require the source IP to be trusted by the server owner.

## v1 tools

The following are direct wrappers around their corresponding v1 GET routes:

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

They take no arguments.

## Errors

HTTP errors are returned as MCP tool errors. When ER:LC supplies a `Retry-After` header for a 429 response, the value is included as `retryAfter`.

Do not repeatedly retry `403` or `429` responses. A regenerated/invalid key or ignored rate limits can result in an IP block.
