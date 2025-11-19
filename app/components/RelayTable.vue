<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

export type RelayRow = { url: string; state: ConnectionState }

const props = defineProps<{ relays: RelayRow[] }>()
const emit = defineEmits<{
  (e: 'connect', url: string): void
  (e: 'disconnect', url: string): void
  (e: 'delete', url: string): void
}>()

function statusBadge(row: RelayRow) {
  const color = row.state === 'connected' ? 'success'
      : row.state === 'error' ? 'error'
          : 'neutral'
  const text = row.state === 'connected' ? 'Connected'
      : row.state === 'error' ? 'Error'
          : 'Disconnected'

  return h(UBadge as any, {
    variant: 'subtle',
    color, class: 'capitalize transition-all duration-200'
  }, () => text)
}

function getRowItems(row: Row<RelayRow>) {
  const r = row.original
  return [
    { type: 'label', label: 'Actions' },
    r.state === 'connected'
        ? { label: 'Disconnect', onSelect: () => emit('disconnect', r.url) }
        : { label: 'Connect',    onSelect: () => emit('connect', r.url), 'data-testid': 'relay-connect', },
    { type: 'separator' },
    { label: 'Delete', onSelect: () => emit('delete', r.url) },
  ]
}

const columns: TableColumn<RelayRow>[] = [
  {
    accessorKey: 'url',
    header: 'Relay',
    meta: {
      class: {
        th: 'w-3/4'
      }
    },
    cell: ({ row }) => h('div', {}, row.getValue('url')),
  },
  {
    accessorKey: 'state',
    id: 'status',
    header: 'Status',
    cell: ({ row }) => h('div', {}, statusBadge(row.original)),
  },
  {
    id: 'actions',
    header: () => h('div', {
      class: 'text-right'
    }, 'Actions'),
    cell: ({ row }) =>
        h('div', {
              class: 'text-right'
            },
            h(UDropdownMenu as any,
                {
                  content: {
                    align: 'end'
                  },
                  items: getRowItems(row),
                  'aria-label': 'Actions dropdown'
                },
                () => h(UButton as any, {
                  icon: 'i-lucide-ellipsis-vertical',
                  color: 'neutral',
                  variant: 'ghost',
                  class: 'ml-auto',
                  'data-testid': 'relay-actions',
                })
            )
        ),
  },
]
</script>

<template>
  <UTable :data="props.relays" :columns="columns" />
</template>
