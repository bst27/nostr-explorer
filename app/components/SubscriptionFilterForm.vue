<template>
  <div class="flex gap-2 mb-5">
  <UFormField class="w-full" label="Subscription filter" help="Setup a subscription filter to receive Nostr events.">
    <UButtonGroup class="w-full">
      <USelectMenu
          v-model="filterKey"
          :value-key="'value'"
          :search-input="false"
          :items="selectItems"
          :content="{
            align: 'start',
            side: 'right'
          }"
          class="w-48"
      />
      <UInput class="w-full"
        v-model="filterValue"
        :type="inputType"
        :maxlength="64"
        @keyup.enter="addFilter"
        placeholder="Enter filter value ..." />

      <UButton icon="i-heroicons-plus" :disabled="!filterValue" @click="addFilter">Add</UButton>
      <UButton icon="i-heroicons-bolt" :disabled="!filterApplyable" @click="applyFilter">Apply</UButton>
    </UButtonGroup>
  </UFormField>
  </div>
  <div>
    <UFormField class="w-full" label="Filter preview">
      <UButtonGroup class="w-full">
        <UTextarea class="w-full text-2xs" :maxrows="10" autoresize color="neutral" variant="subtle" disabled :model-value="filterPreview" />
      </UButtonGroup>
    </UFormField>
  </div>
</template>

<script setup lang="ts">

import {ref} from "vue";

const emit = defineEmits<{
  (e: 'apply', filter: object): void
}>()

const options = {
  kinds: { label: 'kinds', value: 'kinds', collection: true, type: 'number' },
  ids: { label: 'ids', value: 'ids', collection: true, type: 'text' },
  authors: { label: 'authors', value: 'authors', collection: true, type: 'text' },
  since: { label: 'since', value: 'since', collection: false, type: 'number' },
  until: { label: 'until', value: 'until', collection: false, type: 'number' },
  limit: { label: 'limit', value: 'limit', collection: false, type: 'number' }
}

const filterKey = ref('kinds')
const filterValue = ref('')
const nostrFilter = ref({})
const selectItems = computed(() => {
  return Object.values(options)
    .sort((a, b) => a.label.localeCompare(b.label))
    .map(o => { return { label: o.label, value: o.value } })
})
const filterPreview = computed(() => {
  return JSON.stringify(nostrFilter.value, null, 2)
})
const filterApplyable = computed(() => {
  return Object.keys(nostrFilter.value).length > 0
})
const inputType = computed(() => {
  return options[filterKey.value] ? options[filterKey.value].type : 'text'
})

watch(inputType, (pre, post) => {
  filterValue.value = ''
})

function addFilter() {
  if (!filterValue.value) return

  if (options[filterKey.value].collection) {
    const values = Array.isArray(nostrFilter.value[filterKey.value])
      ? [...nostrFilter.value[filterKey.value], filterValue.value]
      : [filterValue.value]

    nostrFilter.value[filterKey.value] = [...new Set(values)]
  } else {
    nostrFilter.value[filterKey.value] = filterValue.value
  }

  filterValue.value = ''
}

function applyFilter() {
  emit('apply', JSON.parse(JSON.stringify(nostrFilter.value)))

  filterValue.value = ''
  nostrFilter.value = {}
}

</script>