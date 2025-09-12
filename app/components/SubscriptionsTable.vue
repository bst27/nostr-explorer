<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import type {Filter} from "nostr-tools"

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

export type SubscriptionRow = {
  id: SubscriptionFilterId,
  active: boolean,
  created_at: number,
  filters: Filter,
}

const props = defineProps<{ subscriptions: SubscriptionRow[] }>()
const emit = defineEmits<{
  (e: 'enable', id: SubscriptionFilterId): void
  (e: 'disable', id: SubscriptionFilterId): void
  (e: 'delete', id: SubscriptionFilterId): void
}>()

function getRowActions(row: Row<SubscriptionRow>) {
  const r = row.original
  return [
    { type: 'label', label: 'Actions' },
    row.original.active
      ? { label: 'Disable', onSelect: () => emit('disable', r.id) }
      : { label: 'Enable', onSelect: () => emit('enable', r.id) },
    { type: 'separator' },
    { label: 'Delete', onSelect: () => emit('delete', r.id) },
  ]
}

function statusBadge(row: SubscriptionRow) {
  const color = row.active ? 'success' : 'neutral'
  const text = row.active ? 'Enabled' : 'Disabled'

  return h(UBadge as any, {
    variant: 'subtle',
    color, class: 'capitalize transition-all duration-200'
  }, () => text)
}

const columns: TableColumn<SubscriptionRow>[] = [
  {
    id: 'expand',
    cell: ({ row }) =>
        h(UButton, {
          color: 'neutral',
          variant: 'ghost',
          icon: 'i-lucide-chevron-down',
          square: true,
          'aria-label': 'Expand',
          ui: {
            leadingIcon: [
              'transition-transform',
              row.getIsExpanded() ? 'duration-200 rotate-180' : ''
            ]
          },
          onClick: () => row.toggleExpanded()
        })
  },
  {
    accessorKey: 'state',
    id: 'status',
    header: 'Status',
    cell: ({ row }) => h('div', {}, statusBadge(row.original)),
  },
  {
    accessorKey: 'filters',
    header: 'Filters',
    meta: {
      class: {
        th: 'w-3/4'
      }
    },
    cell: ({ row }) => {
      return Object.keys(row.getValue('filters')).sort().join(', ').slice(0, 30)
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => {
      return new Date(row.getValue('created_at') * 1000)
          .toLocaleString('sv-SE', { hour12: false })
    }
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
                  items: getRowActions(row),
                  'aria-label': 'Actions dropdown'
                },
                () => h(UButton as any, {
                  icon: 'i-lucide-ellipsis-vertical',
                  color: 'neutral',
                  variant: 'ghost',
                  class: 'ml-auto'
                })
            )
        ),
  },
]
</script>

<template>
  <UTable
      :data="props.subscriptions"
      :columns="columns"
      :ui="{ tr: 'data-[expanded=true]:bg-elevated/50' }"
  >
    <template #expanded="{ row }">
      <pre class="block max-w-xs">{{ row.original.filters }}</pre>
    </template>
  </UTable>
</template>