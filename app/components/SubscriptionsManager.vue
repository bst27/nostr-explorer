<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between gap-2">
        <h3 class="text-lg font-semibold">Subscriptions</h3>
        <div class="flex items-center gap-2">
          <UBadge
              :color="appStore.activeFilters.length > 0 ? 'primary' : 'neutral'"
              class="transition-colors duration-200"
              variant="subtle"
          >{{ appStore.activeFilters.length }}/{{ appStore.filterCount }} enabled</UBadge>

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
        <div class="mb-5">

          <SubscriptionFilterForm @apply="(filter) => { applyFilter(filter) }" />

        </div>

        <div class="rounded-md border border-muted relative">
          <SubscriptionsTable
              :subscriptions="tableRows"
              @enable="(id) => { enableSubscription(id) }"
              @disable="(id) => { disableSubscription(id) }"
              @delete="(id) => { removeSubscription(id) }"
          />
        </div>
      </template>
    </UCollapsible>

  </UCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {useLocalStorage} from "@vueuse/core";
import type {SubscriptionRow} from "~/components/SubscriptionsTable.vue"

const appStore = useAppStore()

const collapsed = useLocalStorage('nostr-explorer.app.subscriptions.collapsed',true)

const tableRows = computed<SubscriptionRow[]>(() => {
  return Object.values(appStore.subscriptionFilters).map(f => {
    return {
      id: f.id,
      active: f.active,
      created_at: f.created_at,
      filters: f.filters,
    }
  }).sort((a, b) => b.created_at - a.created_at)
})

function enableSubscription(id: SubscriptionFilterId) {
  appStore.setSubscriptionFilterActive(id, true)
}

function disableSubscription(id: SubscriptionFilterId) {
  appStore.setSubscriptionFilterActive(id, false)
}

function removeSubscription(id: SubscriptionFilterId) {
  appStore.deleteSubscriptionFilter(id)
}

function applyFilter(filter) {
  appStore.setSubscriptionFilter({
    id: '#' + Date.now(),
    active: true,
    created_at: Math.floor(Date.now() / 1000),
    filters: filter
  })
}
</script>
