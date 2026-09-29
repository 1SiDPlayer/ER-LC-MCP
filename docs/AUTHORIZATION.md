# Authentication and trusted IPs

ER:LC uses two related controls for normal private-server integrations.

## Server key

The server key identifies and authenticates the private server.

The server owner can obtain it from the ER:LC private server API settings. This MCP reads it from:

```text
ERLC_SERVER_KEY
```

It is sent in the `server-key` HTTP header.

Treat the key as a secret. Do not put it in source code, screenshots, public logs or a Git repository.

## Trusted IP for remote commands

ER:LC applies an additional safety check to requests that perform remote actions.

To authorize the machine running this MCP:

1. Visit the Server Owner API Dashboard at `https://api.erlc.gg/server-owners`.
2. Continue with Roblox and sign in.
3. Find the private server.
4. Open its **Settings** page.
5. Add the machine's public IP address to the trusted IP list.
6. Give the entry a useful comment, for example `Home MCP` or `VPS`.
7. Save it.

A trusted address can then send POST commands to that server.

If the request comes from an address that is not allowlisted, ER:LC documents error `4000`, indicating that the source is not authorized to perform that action.

### Which IP should be added?

Add the public outbound IP of the machine making the ER:LC HTTP request.

Examples:

- MCP on your PC: your home connection's public IP
- MCP on a Raspberry Pi at home: normally the same home public IP
- MCP on a VPS: the VPS outbound public IP
- MCP in a container/cloud service: the service's stable outbound IP, if it provides one

Addresses such as `127.0.0.1`, `10.x.x.x` and `192.168.x.x` are local/private addresses and are not the public source address ER:LC sees.

If your ISP changes your public IP, the trusted-IP entry may need to be updated.

## Public applications

The trusted-IP approach is intended for custom bots and private integrations.

If an application is publicly distributed and used across many unrelated ER:LC servers, ER:LC provides public applications with a Global API Key and server-owner authorization flow.

A one-server integration should not be registered as a public application solely to avoid the trusted-IP system.

## Server Owner Dashboard

The dashboard requires Roblox login and only exposes private servers available to the signed-in server owner.
