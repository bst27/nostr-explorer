import { watch } from 'vue'
import {type Filter, type Relay, SimplePool} from 'nostr-tools'

const pool = new SimplePool({ enablePing: true })
const openRelays = reactive(new Map<RelayURL, Relay>())

export function useRelayConnections() {
    const appStore = useAppStore()

    async function connect(url: RelayURL) {
        try {
            const relay = await pool.ensureRelay(url)
            openRelays.set(url, relay)
            appStore.setConnectionState(url, 'connected')
        } catch (err) {
            console.error('failed to connect', err)

            appStore.setConnectionState(url, 'error')
        }
    }

    function disconnect(url: RelayURL) {
        const relay = openRelays.get(url)

        if (!relay) {
            return
        }

        try { relay.close() } catch (err) {
            console.error('failed to disconnect', err)
        }
        openRelays.delete(url)
        appStore.setConnectionState(url, 'disconnected')
    }

    function subscribeForEvents(relays: RelayURL[], filters: Filter[]) {
        if (!relays.length) return
        if (!filters.length) return

        console.debug('subscribing ...', relays, filters)

        const sub = pool.subscribeMany(relays, filters, {
            onevent: ((event) => {
                appStore.setEvent(event)
            }),
            oneose: () => {
                console.debug('on eose', appStore.eventCount)
            }
        })
    }

    function startConnectionManagement() {
        // react to changes of selected relays to connect/disconnect as requested
        watch(
            () => appStore.selectedRelayURLs,
            (next, prev) => {
                const prevSet = new Set(prev ?? [])
                const nextSet = new Set(next)

                const toAdd   = [...nextSet].filter(u => !prevSet.has(u))
                const toClose = [...prevSet].filter(u => !nextSet.has(u))

                console.debug('managing connection changes ...', toAdd, toClose)

                toClose.forEach(disconnect)
                toAdd.forEach(connect)
                subscribeForEvents(toAdd, appStore.activeFilters)
            },
            { immediate: true }
        )

        // react to changes of subscription filters and reconnect relays to apply active filters
        watch(
            () => appStore.activeFilters,
            (next, prev) => {
                const relays = appStore.selectedRelayURLs

                console.debug('managing filter changes ...', relays)

                relays.forEach(disconnect)
                relays.forEach(connect)
                subscribeForEvents(relays, next)
            }
        )
    }

    return { startConnectionManagement}
}
