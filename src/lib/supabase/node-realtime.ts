import ws from "ws";

/**
 * supabase-js constructs a Realtime client eagerly and throws on Node < 22, which has no native
 * WebSocket. We don't use Realtime, but the constructor still needs a transport. Pass this as
 * `realtime` in server-side client options. Safe to delete once the project runs on Node 22+.
 */
export const nodeRealtimeOptions = { transport: ws as unknown as typeof WebSocket };
