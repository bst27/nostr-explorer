import { watch } from 'vue'
import {type Relay, SimplePool} from 'nostr-tools'

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
            },
            { immediate: true }
        )
    }

    return { startConnectionManagement}
}
