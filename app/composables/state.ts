import {useLocalStorage} from "@vueuse/core";
import type {AppState} from "~/composables/types";

export const useAppStore = defineStore('appStore', {
    state: (): AppState => ({
        relays: useLocalStorage(
            'nostr-explorer.app.relays',
            {}
        ),
        relayStatus: {},
    }),
    getters: {
        relayCount: (state: AppState) => Object.values(state.relays).length,
        relayConnectedCount: (state: AppState) => Object.values(state.relayStatus)
            .filter(r => r.connection === 'connected').length,
        selectedRelayURLs(state) {
            return Object.values(state.relays)
                .filter(r => r.selected)
                .map(r => r.url)
        }
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
        }
    }
})