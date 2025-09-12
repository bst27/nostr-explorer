import type {Filter, NostrEvent} from 'nostr-tools'

export type ConnectionState = 'connected' | 'disconnected' | 'error'

export type RelayURL = `ws://${string}` | `wss://${string}`
export type EventId = string
export type SubscriptionFilterId = string

export type RelayDetails = {
    url: RelayURL,
    selected: boolean, // todo: rename to connectionDesired
}

export type RelayStatus = {
    url: RelayURL,
    connection: ConnectionState,
}

export type SubscriptionFilter = {
    id: SubscriptionFilterId,
    active: boolean,
    filters: Filter,
    created_at: number,
}

export type AppState = {
    relays: Record<RelayURL, RelayDetails>
    relayStatus: Record<RelayURL, RelayStatus>
    subscriptionFilters: Record<SubscriptionFilterId, SubscriptionFilter>
    events: Record<EventId, NostrEvent>
}