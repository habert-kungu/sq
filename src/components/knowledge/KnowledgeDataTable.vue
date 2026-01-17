<script setup lang="ts">
import { ref, computed, h, onMounted, watch } from 'vue'
import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from '@tanstack/vue-table'
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconPlus,
  IconSearch,
  IconFileText,
  IconDownload,
  IconTrash,
  IconFolder,
  IconCircleCheckFilled,
  IconLoader,
} from '@tabler/icons-vue'

import { knowledgeAPI, type KnowledgeDocument } from '@/services/knowledgeApi'
import { useToast } from '@/composables/useToast'
import { useWebSocket } from '@/composables/useWebSocket'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import KnowledgeEmptyState from './KnowledgeEmptyState.vue'

const emit = defineEmits<{
  upload: []
}>()

const { success: showSuccess, error: showError } = useToast()

// WebSocket connection
const { isConnected, on } = useWebSocket()

// State
const documents = ref<KnowledgeDocument[]>([])
const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref<string>('all')
const selectedStatus = ref<string>('all')
const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(1)
const totalDocuments = ref(0)

// Categories
const categories = [
  'Contracts',
  'Case Law',
  'Legal Briefs',
  'Court Filings',
  'Legal Opinions',
  'Regulations',
  'Statutes',
  'Legal Research',
  'Client Documents',
  'Other',
]

// Status options
const statusOptions = ['pending', 'processing', 'completed', 'failed']

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Format date
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Columns
const columns: ColumnDef<KnowledgeDocument>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(Checkbox, {
        checked: table.getIsAllPageRowsSelected(),
        'onUpdate:checked': (value: boolean) => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: 'Select all',
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: row.getIsSelected(),
        'onUpdate:checked': (value: boolean) => row.toggleSelected(!!value),
        ariaLabel: 'Select row',
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      return h('div', { class: 'flex flex-col gap-0.5' }, [
        h('span', { class: 'text-sm font-medium' }, row.getValue('title')),
        h('span', { class: 'text-[11px] text-muted-foreground' }, row.original.fileName),
      ])
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      return h('span', { class: 'text-sm' }, row.getValue('category'))
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return h('div', { class: 'flex items-center gap-2' }, [
        status === 'completed'
          ? h(IconCircleCheckFilled, { class: 'h-4 w-4 text-emerald-500' })
          : h(IconLoader, { class: 'h-4 w-4 animate-spin text-muted-foreground' }),
        h('span', {}, status),
      ])
    },
  },
  {
    accessorKey: 'fileSize',
    header: 'Size',
    cell: ({ row }) => h('span', { class: 'text-sm tabular-nums' }, formatFileSize(row.getValue('fileSize'))),
  },
  {
    accessorKey: 'views',
    header: 'Views',
    cell: ({ row }) => h('span', { class: 'text-sm tabular-nums' }, row.getValue('views')),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => h('span', { class: 'text-sm' }, formatDate(row.getValue('createdAt'))),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h(
        DropdownMenu,
        {},
        {
          default: () => [
            h(
              DropdownMenuTrigger,
              { asChild: true },
              {
                default: () =>
                  h(
                    Button,
                    { variant: 'ghost', class: 'size-8 p-0' },
                    {
                      default: () => [
                        h('span', { class: 'sr-only' }, 'Open menu'),
                        h(IconDotsVertical, { class: 'size-4' }),
                      ],
                    },
                  ),
              },
            ),
            h(
              DropdownMenuContent,
              { align: 'end' },
              {
                default: () => [
                  h(
                    DropdownMenuItem,
                    {
                      onClick: () => handleDownload(row.original._id),
                      class: 'gap-2',
                    },
                    {
                      default: () => [
                        h(IconDownload, { class: 'size-4' }),
                        'Download',
                      ],
                    },
                  ),
                  h(DropdownMenuSeparator),
                  h(
                    DropdownMenuItem,
                    {
                      onClick: () => handleDelete(row.original._id),
                      class: 'gap-2 text-destructive focus:text-destructive',
                    },
                    {
                      default: () => [
                        h(IconTrash, { class: 'size-4' }),
                        'Delete',
                      ],
                    },
                  ),
                ],
              },
            ),
          ],
        },
      )
    },
  },
]

// Create table
const table = useVueTable({
  get data() {
    return documents.value
  },
  get columns() {
    return columns
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: (updaterOrValue) => {
    sorting.value =
      typeof updaterOrValue === 'function' ? updaterOrValue(sorting.value) : updaterOrValue
  },
  onColumnFiltersChange: (updaterOrValue) => {
    columnFilters.value =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(columnFilters.value)
        : updaterOrValue
  },
  onColumnVisibilityChange: (updaterOrValue) => {
    columnVisibility.value =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(columnVisibility.value)
        : updaterOrValue
  },
  onRowSelectionChange: (updaterOrValue) => {
    rowSelection.value =
      typeof updaterOrValue === 'function' ? updaterOrValue(rowSelection.value) : updaterOrValue
  },
  state: {
    get sorting() {
      return sorting.value
    },
    get columnFilters() {
      return columnFilters.value
    },
    get columnVisibility() {
      return columnVisibility.value
    },
    get rowSelection() {
      return rowSelection.value
    },
  },
  manualPagination: true,
  pageCount: totalPages.value,
})

// Fetch documents
const fetchDocuments = async () => {
  try {
    loading.value = true
    const response = await knowledgeAPI.getDocuments({
      page: currentPage.value,
      limit: pageSize.value,
      category: selectedCategory.value !== 'all' ? selectedCategory.value : undefined,
      status: selectedStatus.value !== 'all' ? selectedStatus.value : undefined,
      search: searchQuery.value || undefined,
    })

    documents.value = response.data
    totalPages.value = response.pagination.totalPages
    totalDocuments.value = response.pagination.total
  } catch (error: any) {
    showError('Failed to fetch documents', error.message)
  } finally {
    loading.value = false
  }
}

// Handle download
const handleDownload = async (id: string) => {
  try {
    const url = await knowledgeAPI.getDownloadUrl(id)
    window.open(url, '_blank')
    showSuccess('Download started')
  } catch (error: any) {
    showError('Download failed', error.message)
  }
}

// Handle delete
const handleDelete = async (id: string) => {
  if (!confirm('Are you sure you want to delete this document?')) return

  try {
    await knowledgeAPI.deleteDocument(id)
    showSuccess('Document deleted successfully')
    fetchDocuments()
  } catch (error: any) {
    showError('Delete failed', error.message)
  }
}

// Handle bulk delete
const handleBulkDelete = async () => {
  const selectedRows = table.getSelectedRowModel().rows
  if (selectedRows.length === 0) return

  if (!confirm(`Are you sure you want to delete ${selectedRows.length} document(s)?`)) return

  try {
    const ids = selectedRows.map((row) => row.original._id)
    await knowledgeAPI.bulkDeleteDocuments(ids)
    showSuccess(`Deleted ${selectedRows.length} document(s)`)
    rowSelection.value = {}
    fetchDocuments()
  } catch (error: any) {
    showError('Bulk delete failed', error.message)
  }
}

// Watch for filter changes
watch([searchQuery, selectedCategory, selectedStatus], () => {
  currentPage.value = 1
  fetchDocuments()
})

// Watch for page changes
watch(currentPage, () => {
  fetchDocuments()
})

// Initial fetch
onMounted(() => {
  fetchDocuments()
  
  // Listen for document updates
  on('document_update', (data) => {
    console.log('Document update received:', data)
    const doc = documents.value.find(d => d._id === data.documentId)
    if (doc) {
      doc.status = data.status
      if (data.vectorized !== undefined) {
        doc.vectorized = data.vectorized
      }
    }
    
    // Show toast and refresh when completed or failed
    if (data.status === 'completed') {
      showSuccess('Document processing completed')
      fetchDocuments()
    } else if (data.status === 'failed') {
      showError('Document processing failed', data.error || '')
      fetchDocuments()
    }
  })
  
  // Listen for processing progress
  on('processing_progress', (data) => {
    console.log('Processing progress:', data)
    // Show toast only when processing starts
    if (data.progress === 10) {
      showSuccess(`Started processing document`)
    }
  })
  
  // Listen for errors
  on('document_error', (data) => {
    console.log('Document error:', data)
    showError('Processing failed', data.error)
    fetchDocuments()
  })
})

// Computed
const selectedRowsCount = computed(() => {
  return Object.keys(rowSelection.value).length
})
</script>

<template>
  <div class="flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between border-b px-6 py-3">
      <div class="flex items-center gap-2.5">
        <div class="flex size-8 items-center justify-center rounded-md bg-primary/10">
          <IconFileText class="size-4 text-primary" />
        </div>
        <h1 class="text-base font-semibold">Knowledge Base</h1>
      </div>
      <div class="flex items-center gap-2">
        <Button size="sm" class="gap-1.5 h-8 text-xs" @click="emit('upload')">
          <IconPlus class="size-3.5" />
          Add Document
        </Button>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-3 border-b px-6 py-2">
      <div class="relative flex-1 max-w-xs">
        <IconSearch class="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input 
          v-model="searchQuery"
          placeholder="Search documents by title, category..." 
          class="pl-8 h-8 text-sm"
        />
      </div>
      
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1.5">
          <Label class="text-[11px] text-muted-foreground whitespace-nowrap">Category:</Label>
          <Select v-model="selectedCategory">
            <SelectTrigger class="h-7 text-xs min-w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="flex items-center gap-1.5">
          <Label class="text-[11px] text-muted-foreground whitespace-nowrap">Status:</Label>
          <Select v-model="selectedStatus">
            <SelectTrigger class="h-7 text-xs min-w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem v-for="status in statusOptions" :key="status" :value="status">
                {{ status }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="relative">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id" class="hover:bg-transparent">
            <TableHead v-for="header in headerGroup.headers" :key="header.id" class="h-9 text-xs">
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="loading">
            <TableRow v-for="i in 5" :key="i" class="hover:bg-transparent">
              <TableCell v-for="j in columns.length" :key="j" class="h-12">
                <div class="h-4 bg-muted animate-pulse rounded"></div>
              </TableCell>
            </TableRow>
          </template>
          <template v-else-if="table.getRowModel().rows?.length">
            <TableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() && 'selected'"
              class="cursor-pointer"
            >
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id" class="h-12">
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow class="hover:bg-transparent">
              <TableCell :colspan="columns.length" class="h-[400px] p-0">
                <KnowledgeEmptyState />
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between border-t px-6 py-2">
      <div class="text-xs text-muted-foreground">
        {{ selectedRowsCount }} of {{ totalDocuments }} row(s) selected.
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1.5">
          <Label class="text-xs text-muted-foreground">Rows per page</Label>
          <Select v-model="pageSize">
            <SelectTrigger class="h-7 w-[60px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="text-xs text-muted-foreground">
          Page {{ currentPage }} of {{ totalPages }}
        </div>
        <div class="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            class="size-7"
            @click="currentPage = 1"
            :disabled="currentPage === 1"
          >
            <IconChevronsLeft class="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            class="size-7"
            @click="currentPage--"
            :disabled="currentPage === 1"
          >
            <IconChevronLeft class="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            class="size-7"
            @click="currentPage++"
            :disabled="currentPage === totalPages"
          >
            <IconChevronRight class="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            class="size-7"
            @click="currentPage = totalPages"
            :disabled="currentPage === totalPages"
          >
            <IconChevronsRight class="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
