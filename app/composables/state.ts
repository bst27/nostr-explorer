import {useLocalStorage} from "@vueuse/core";
import type {AppState, SubscriptionFilter} from "~/composables/types";
import type {NostrEvent} from "nostr-tools"

export const useAppStore = defineStore('appStore', {
    state: (): AppState => ({
        relays: useLocalStorage(
            'nostr-explorer.app.relays',
            {}
        ),
        relayStatus: {},
        subscriptionFilters: useLocalStorage(
            'nostr-explorer.app.subscription-filters',
            {}
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