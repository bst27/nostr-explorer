import {useLocalStorage} from "@vueuse/core";
import type {AppState, SubscriptionFilter, SubscriptionFilterId} from "~/composables/types";
import type {NostrEvent} from "nostr-tools"

const DEFAULT_RELAYS: Record<RelayURL, RelayDetails> = {
    'wss://relay.damus.io':     { url: 'wss://relay.damus.io',     selected: false },
    'wss://nos.lol':            { url: 'wss://nos.lol',            selected: false },
    'wss://relay.snort.social': { url: 'wss://relay.snort.social', selected: false },
}

const DEFAULT_FILTERS: Record<SubscriptionFilterId, SubscriptionFilter> = {
    'profiles': {
        id: 'profiles',
        active: true,
        created_at: Date.now() / 1000,
        filters: { kinds: [0], limit: 5 },
    },
    'notes': {
        id: 'notes',
        active: true,
        created_at: Date.now() / 1000,
        filters: { kinds: [1], limit: 5 },
    },
    'relays': {
        id: 'relays',
        active: true,
        created_at: Date.now() / 1000,
        filters: { kinds: [2], limit: 5 },
    },
}

export const useAppStore = defineStore('appStore', {
    state: (): AppState => ({
        relays: useLocalStorage(
            'nostr-explorer.app.relays',
            DEFAULT_RELAYS,
        ),
        relayStatus: {},
        subscriptionFilters: useLocalStorage(
            'nostr-explorer.app.subscription-filters',
            DEFAULT_FILTERS,
        ),
        events: {},
    }),
    getters: {
        relayCount: (state: AppState) => Object.values(state.relays).length,
        relayConnectedCount: (state: AppState) => Object.values(state.relayStatus)
            .filter(r => r.connection === 'connected').length,
        selectedRelayURLs(state) {
            return Object.values(state.relays)
                .filter(r => r.selected)
                .map(r => r.url)
        },
        filterCount: (state: AppState) => Object.values(state.subscriptionFilters).length,
        activeFilters: (state: AppState) => Object.values(state.subscriptionFilters)
            .filter(f => f.active)
            .map(f => f.filters),
        eventCount: (state: AppState) => Object.values(state.events).length
    },
    actions: {
        setRelay(relay: RelayDetails) {
            this.relays[relay.url] = relay;
        },
        deleteRelay(url: RelayURL) {
            delete this.relays[url]
        },
        setConnectionState(url: RelayURL, state: ConnectionState) {
            this.relayStatus[url] = {
                url: url,
                connection: state
            }
        },
        setSelectedState(url: RelayURL, state: boolean) {
            const relay = this.relays[url]
            if (!relay) { return }
            relay.selected = state
        },
        setSubscriptionFilter(filter: SubscriptionFilter) {
            this.subscriptionFilters[filter.id] = filter
        },
        setSubscriptionFilterActive(id: SubscriptionFilterId, active: boolean) {
            const subscription = this.subscriptionFilters[id]
            if (!subscription) { return }
            subscription.active = active
        },
        deleteSubscriptionFilter(id: SubscriptionFilterId) {
            delete this.subscriptionFilters[id]
        },
        setEvent(event: NostrEvent) {
            this.events[event.id] = event
        },
        deleteEvent(id: EventId) {
            delete this.events[id]
        }
    }
})