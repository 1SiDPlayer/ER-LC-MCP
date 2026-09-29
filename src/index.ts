import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { ErlcApiError, getV1, getV2Server, runCommand } from './erlc.js';

const server = new McpServer({ name: 'erlc-api', version: '0.2.0' });

function result(value: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }] };
}

function errorResult(error: unknown) {
  const value = error instanceof ErlcApiError
    ? {
        error: error.message,
        status: error.status,
        details: error.details,
        ...(error.retryAfter !== undefined ? { retryAfter: error.retryAfter } : {})
      }
    : { error: error instanceof Error ? error.message : String(error) };

  return { isError: true, ...result(value) };
}

async function v1(path: string) {
  try { return result(await getV1(path)); }
  catch (error) { return errorResult(error); }
}

server.tool(
  'erlc_server',
  'Get ER:LC API v2 server information. Optional fields can include players, staff, logs, queue, calls and vehicles.',
  {
    players: z.boolean().default(false),
    staff: z.boolean().default(false),
    joinLogs: z.boolean().default(false),
    queue: z.boolean().default(false),
    killLogs: z.boolean().default(false),
    commandLogs: z.boolean().default(false),
    modCalls: z.boolean().default(false),
    emergencyCalls: z.boolean().default(false),
    vehicles: z.boolean().default(false)
  },
  async (o) => {
    try {
      return result(await getV2Server({
        Players:o.players, Staff:o.staff, JoinLogs:o.joinLogs, Queue:o.queue,
        KillLogs:o.killLogs, CommandLogs:o.commandLogs, ModCalls:o.modCalls,
        EmergencyCalls:o.emergencyCalls, Vehicles:o.vehicles
      }));
    } catch (error) { return errorResult(error); }
  }
);

server.tool('erlc_players', 'List connected players using API v2, including location and wanted data when supplied.', {}, async () => {
  try { const x = await getV2Server({ Players:true }) as any; return result(x?.Players ?? []); }
  catch (error) { return errorResult(error); }
});

server.tool('erlc_vehicles', 'List spawned vehicles using API v2, including extended vehicle data when supplied.', {}, async () => {
  try { const x = await getV2Server({ Vehicles:true }) as any; return result(x?.Vehicles ?? []); }
  catch (error) { return errorResult(error); }
});

server.tool('erlc_staff', 'Get current server staff using API v2.', {}, async () => {
  try { const x = await getV2Server({ Staff:true }) as any; return result(x?.Staff ?? {}); }
  catch (error) { return errorResult(error); }
});

server.tool('erlc_queue', 'Get the current queue using API v2.', {}, async () => {
  try { const x = await getV2Server({ Queue:true }) as any; return result(x?.Queue ?? []); }
  catch (error) { return errorResult(error); }
});

server.tool(
  'erlc_logs',
  'Get selected API v2 log and call collections.',
  {
    join: z.boolean().default(false),
    kills: z.boolean().default(false),
    commands: z.boolean().default(false),
    modCalls: z.boolean().default(false),
    emergencyCalls: z.boolean().default(false)
  },
  async (o) => {
    try {
      const x = await getV2Server({
        JoinLogs:o.join, KillLogs:o.kills, CommandLogs:o.commands,
        ModCalls:o.modCalls, EmergencyCalls:o.emergencyCalls
      }) as any;

      return result({
        ...(o.join ? { JoinLogs:x?.JoinLogs ?? [] } : {}),
        ...(o.kills ? { KillLogs:x?.KillLogs ?? [] } : {}),
        ...(o.commands ? { CommandLogs:x?.CommandLogs ?? [] } : {}),
        ...(o.modCalls ? { ModCalls:x?.ModCalls ?? [] } : {}),
        ...(o.emergencyCalls ? { EmergencyCalls:x?.EmergencyCalls ?? [] } : {})
      });
    } catch (error) { return errorResult(error); }
  }
);

server.tool(
  'erlc_command',
  'Run a private server command through Virtual Server Management. Defaults to API v2.',
  {
    command: z.string().min(1).max(500),
    version: z.enum(['v1', 'v2']).default('v2')
  },
  async ({ command, version }) => {
    try { return result(await runCommand(command, version)); }
    catch (error) { return errorResult(error); }
  }
);

// v1 is retained for compatibility and for data that is not exposed as a
// dedicated v2 tool, such as the bans endpoint.
server.tool('erlc_v1_server', 'Get API v1 server status.', {}, () => v1('server'));
server.tool('erlc_v1_players', 'Get API v1 player list.', {}, () => v1('server/players'));
server.tool('erlc_v1_staff', 'Get API v1 staff data. This endpoint is deprecated by ER:LC.', {}, () => v1('server/staff'));
server.tool('erlc_v1_joinlogs', 'Get API v1 join logs.', {}, () => v1('server/joinlogs'));
server.tool('erlc_v1_queue', 'Get API v1 queue.', {}, () => v1('server/queue'));
server.tool('erlc_v1_killlogs', 'Get API v1 kill logs.', {}, () => v1('server/killlogs'));
server.tool('erlc_v1_commandlogs', 'Get API v1 command logs.', {}, () => v1('server/commandlogs'));
server.tool('erlc_v1_modcalls', 'Get API v1 moderator call logs.', {}, () => v1('server/modcalls'));
server.tool('erlc_v1_bans', 'Get the API v1 ban list.', {}, () => v1('server/bans'));
server.tool('erlc_v1_vehicles', 'Get API v1 spawned vehicles.', {}, () => v1('server/vehicles'));

const transport = new StdioServerTransport();
await server.connect(transport);
