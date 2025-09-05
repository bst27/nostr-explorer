
export type ConnectionState = 'connected' | 'disconnected' | 'error'

export type RelayURL = `ws://${string}` | `wss://${string}`

export type RelayDetails = {
    url: RelayURL,
    selected: boolean, // todo: rename to connectionDesired
}

export type RelayStatus = {
    url: RelayURL,
    connection: ConnectionState,
}

export type AppState = {
    relays: Record<RelayURL, RelayDetails>
    relayStatus: Record<RelayURL, RelayStatus>
}