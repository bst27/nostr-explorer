<template>
  <UContainer class="py-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold">Nostr Explorer</h1>
        <span class="text-sm opacity-70">Web UI for Nostr</span>
      </div>
      <div class="flex items-center gap-2">
        <UButton icon="i-heroicons-book-open" variant="ghost"
           to="https://nostr.com/" target="_blank" rel="nofollow"
        >nostr.com</UButton>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="col-span-3 space-y-6">
        <RelayManager />
        <SubscriptionsManager />
        <EventsManager />
      </div>
    </div>

    <div class="text-xs opacity-70 text-center">
      Made by <a href="https://digitalpush.net" target="_blank">Bastian Roesmann — digitalpush.net</a>
    </div>
  </UContainer>
</template>

<script setup lang="ts">

</script>