<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between gap-2">
        <h3 class="text-lg font-semibold">Relays</h3>
        <div class="flex items-center gap-2">
          <UBadge
            :color="connected ? 'primary' : 'neutral'"
            class="transition-colors duration-200"
            variant="subtle"
          >{{ connected }}/{{ appStore.relayCount }} connected</UBadge>

          <UButton size="xs" color="neutral" variant="subtle"
             @click="collapsed = !collapsed"
             icon="i-lucide-chevron-down"
             class="transition-transform duration-200"
             :class="collapsed ? 'rotate-180' : ''"
          />
        </div>
      </div>
    </template>

    <UCollapsible v-model:open="collapsed">
      <template #content>
        <div class="flex gap-2 mb-5">
          <UFormField class="w-full" label="Add Relay" help="Enter URL of a Nostr relay you want to add and connect.">
            <UButtonGroup class="w-full">
              <UInput class="w-full" v-model="newRelay" placeholder="wss://relay.example.com" @keyup.enter="addRelay" />

              <UButton icon="i-heroicons-plus" @click="addRelay">Add</UButton>
            </UButtonGroup>
          </UFormField>
        </div>

        <div class="rounded-md border border-muted relative">
          <RelayTable
              :relays="tableRows"
              @connect="(url) => { appStore.setSelectedState(url, true) }"
              @disconnect="(url) => { appStore.setSelectedState(url, false) }"
              @delete="(url) => { removeRelay(url) }"
          />
        </div>
      </template>
    </UCollapsible>

  </UCard>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {useLocalStorage} from "@vueuse/core";

const appStore = useAppStore()
const { startConnectionManagement } = useRelayConnections()

startConnectionManagement()

const newRelay = ref('')
const collapsed = useLocalStorage('nostr-explorer.app.relays.collapsed',true)
const connected = computed(() => appStore.relayConnectedCount)

const tableRows = computed(() => {
  return Object.values(appStore.relays).map(r => {
    return {
      url: r.url,
      state: appStore.relayStatus[r.url]?.connection === 'connected'
          ? 'connected'
          : 'disconnected',
    }
  })
})

function addRelay() {
  const url = newRelay.value.trim() as RelayURL
  if (!url) return
  appStore.setRelay({
    url: url,
    selected: true,
  })
  newRelay.value = ''
}

onMounted(() => {
  [
    'wss://relay.damus.io',
    'wss://nos.lol',
    'wss://sendit.nosflare.com',
    'wss://relay.snort.social',
  ].forEach((v) => {
    return
    appStore.setRelay({
      url: v as RelayURL,
      selected: false,
    })
  })
})

function removeRelay(url: RelayURL) {
  appStore.deleteRelay(url)
}
</script>
