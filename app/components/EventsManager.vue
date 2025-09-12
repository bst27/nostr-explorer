<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between gap-2">
        <h3 class="text-lg font-semibold">Events</h3>
        <div class="flex items-center gap-2">
          <UBadge
              :color="appStore.eventCount > 0 ? 'primary' : 'neutral'"
              class="transition-colors duration-200"
              variant="subtle"
          >{{ appStore.eventCount }} events</UBadge>

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
        <div class="rounded-md border border-muted relative">
          <EventsTable
              :events="tableRows"
              @delete="(eventId) => { removeEvent(eventId) }"
          />
        </div>
      </template>
    </UCollapsible>

  </UCard>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {useLocalStorage} from "@vueuse/core";
import type {EventRow} from "~/components/EventsTable.vue";

const appStore = useAppStore()

const collapsed = useLocalStorage('nostr-explorer.app.events.collapsed',true)

const tableRows = computed<EventRow[]>(() => {
  return Object.values(appStore.events).map(e => {
    return {
      id: e.id,
      created_at: e.created_at,
      event: e,
    }
  }).sort((a, b) => a.created_at - b.created_at)
})

function removeEvent(id: EventId) {
  appStore.deleteEvent(id)
}
</script>
