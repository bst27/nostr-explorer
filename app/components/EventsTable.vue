<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import type {NostrEvent} from "nostr-tools"
import { getPaginationRowModel } from '@tanstack/vue-table'

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

export type EventRow = {
  id: EventId,
  created_at: string,
  event: NostrEvent,
}

const props = defineProps<{ events: EventRow[] }>()
const emit = defineEmits<{
  (e: 'delete', id: EventId): void
}>()

function getRowActions(row: Row<EventRow>) {
  const r = row.original
  return [
    { type: 'label', label: 'Actions' },
    { type: 'separator' },
    { label: 'Delete', onSelect: () => emit('delete', r.id) },
  ]
}

const table = useTemplateRef('table')
const pagination = ref({
  pageIndex: 0,
  pageSize: 5
})

const columns: TableColumn<EventRow>[] = [
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
    accessorKey: 'id',
    header: 'Event',
    meta: {
      class: {
        th: 'w-3/4'
      }
    },
    cell: ({ row }) => {
      return row.getValue('id').slice(0, 10) + '...'
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
      ref="table"
      :data="props.events"
      :columns="columns"
      v-model:pagination="pagination"
      :pagination-options="{
        getPaginationRowModel: getPaginationRowModel()
      }"
      :ui="{ tr: 'data-[expanded=true]:bg-elevated/50' }"
  >
    <template #expanded="{ row }">
      <pre class="block max-w-xs">{{ row.original.event }}</pre>
    </template>
  </UTable>
  <div class="flex justify-center border-t border-default py-4">
    <UPagination
        :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="table?.tableApi?.getFilteredRowModel().rows.length"
        @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
    />
  </div>
</template>