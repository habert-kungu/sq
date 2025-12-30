<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import type { ColumnDef, SortingState, ColumnFiltersState, VisibilityState } from '@tanstack/vue-table'
import { z } from 'zod'

import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCirclePlus,
  IconDotsVertical,
  IconArrowUp,
  IconArrowDown,
  IconArrowRight,
  IconSelector,
  IconSettings2,
  IconCheck,
} from '@tabler/icons-vue'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
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

// Schema
const taskSchema = z.object({
  id: z.string(),
  taskId: z.string(),
  title: z.string(),
  type: z.enum(['Feature', 'Bug', 'Documentation', 'Enhancement', 'Maintenance']),
  status: z.enum(['Todo', 'In Progress', 'Done', 'Backlog', 'Canceled']),
  priority: z.enum(['Low', 'Medium', 'High']),
  assignee: z.string().nullable(),
  matterId: z.string().nullable(),
  matterTitle: z.string().nullable(),
  dueDate: z.string().nullable(),
  createdAt: z.string(),
})

type Task = z.infer<typeof taskSchema>

// Sample data
const data = ref<Task[]>([
  { id: '1', taskId: 'TASK-8782', title: "You can't compress the program without quantifying the open-source SSD panel!", type: 'Documentation', status: 'In Progress', priority: 'Medium', assignee: 'Ahmed Hassan', matterId: '1', matterTitle: 'Employment Contracts', dueDate: 'Jan 5, 2026', createdAt: 'Dec 15, 2025' },
  { id: '2', taskId: 'TASK-7878', title: 'Try to calculate the EXE feed, maybe it will index the multi-byte pixel!', type: 'Documentation', status: 'Backlog', priority: 'Medium', assignee: 'Sarah Ahmed', matterId: '2', matterTitle: 'DMCC License Setup', dueDate: 'Jan 10, 2026', createdAt: 'Dec 16, 2025' },
  { id: '3', taskId: 'TASK-7839', title: 'We need to bypass the neural TCP card!', type: 'Bug', status: 'Todo', priority: 'High', assignee: null, matterId: null, matterTitle: null, dueDate: 'Dec 31, 2025', createdAt: 'Dec 17, 2025' },
  { id: '4', taskId: 'TASK-5562', title: 'The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!', type: 'Feature', status: 'Backlog', priority: 'Medium', assignee: 'Layla Ibrahim', matterId: '3', matterTitle: 'Commercial Lease', dueDate: 'Jan 15, 2026', createdAt: 'Dec 18, 2025' },
  { id: '5', taskId: 'TASK-8686', title: "I'll parse the wireless SSL protocol, that should driver the API panel!", type: 'Feature', status: 'Canceled', priority: 'Medium', assignee: 'Omar Khalil', matterId: '1', matterTitle: 'Employment Contracts', dueDate: null, createdAt: 'Dec 19, 2025' },
  { id: '6', taskId: 'TASK-1280', title: 'Use the digital TLS panel, then you can transmit the haptic system!', type: 'Bug', status: 'Done', priority: 'High', assignee: 'Ahmed Hassan', matterId: '4', matterTitle: 'IP Trademark', dueDate: 'Dec 20, 2025', createdAt: 'Dec 10, 2025' },
  { id: '7', taskId: 'TASK-7262', title: 'The UTF8 application is down, parse the neural bandwidth so we can back up the PNG firewall!', type: 'Feature', status: 'Done', priority: 'High', assignee: 'Sarah Ahmed', matterId: '2', matterTitle: 'DMCC License Setup', dueDate: 'Dec 22, 2025', createdAt: 'Dec 12, 2025' },
  { id: '8', taskId: 'TASK-1138', title: "Generating the driver won't do anything, we need to quantify the 1080p SMTP protocol!", type: 'Feature', status: 'In Progress', priority: 'Medium', assignee: 'Layla Ibrahim', matterId: '5', matterTitle: 'Corporate Restructuring', dueDate: 'Jan 8, 2026', createdAt: 'Dec 20, 2025' },
  { id: '9', taskId: 'TASK-7184', title: 'We need to program the back-end THX pixel!', type: 'Feature', status: 'Todo', priority: 'Low', assignee: null, matterId: null, matterTitle: null, dueDate: 'Jan 20, 2026', createdAt: 'Dec 21, 2025' },
  { id: '10', taskId: 'TASK-5160', title: "Calculating the bus won't do anything, we need to navigate the back-end JSON protocol!", type: 'Documentation', status: 'In Progress', priority: 'High', assignee: 'Omar Khalil', matterId: '3', matterTitle: 'Commercial Lease', dueDate: 'Jan 3, 2026', createdAt: 'Dec 22, 2025' },
])

const router = useRouter()

// Table state
const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const globalFilter = ref('')

// Filter values
const statusFilter = ref<string>('')
const priorityFilter = ref<string>('')

// Column definitions
const columns: ColumnDef<Task>[] = [
  {
    id: 'select',
    header: ({ table }) => h(Checkbox, {
      'modelValue': table.getIsAllPageRowsSelected(),
      'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value),
      'ariaLabel': 'Select all',
      'class': 'translate-y-0.5',
    }),
    cell: ({ row }) => h(Checkbox, {
      'modelValue': row.getIsSelected(),
      'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
      'ariaLabel': 'Select row',
      'class': 'translate-y-0.5',
    }),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: 'taskId',
    header: 'Task',
    cell: ({ row }) => h('span', { class: 'font-mono text-xs text-muted-foreground' }, row.getValue('taskId')),
    size: 100,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return h('button', {
        class: 'flex items-center gap-1 hover:text-foreground transition-colors',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, [
        'Title',
        h(IconSelector, { class: 'size-3.5' }),
      ])
    },
    cell: ({ row }) => {
      const type = row.original.type
      const typeClass = getTypeClass(type)
      return h('div', { class: 'flex items-center gap-2 max-w-[500px]' }, [
        h(Badge, { variant: 'outline', class: `text-[10px] shrink-0 ${typeClass}` }, () => type),
        h('span', { class: 'truncate text-sm' }, row.getValue('title')),
      ])
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return h('button', {
        class: 'flex items-center gap-1 hover:text-foreground transition-colors',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, [
        'Status',
        h(IconSelector, { class: 'size-3.5' }),
      ])
    },
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const { icon, class: statusClass } = getStatusConfig(status)
      return h('div', { class: `flex items-center gap-1.5 ${statusClass}` }, [
        h(icon, { class: 'size-3.5' }),
        h('span', { class: 'text-sm' }, status),
      ])
    },
    filterFn: (row, id, value) => value === '' || row.getValue(id) === value,
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => {
      const priority = row.getValue('priority') as string
      const { icon, class: priorityClass } = getPriorityConfig(priority)
      return h('div', { class: `flex items-center gap-1.5 ${priorityClass}` }, [
        h(icon, { class: 'size-3.5' }),
        h('span', { class: 'text-sm' }, priority),
      ])
    },
    filterFn: (row, id, value) => value === '' || row.getValue(id) === value,
  },
  {
    id: 'actions',
    cell: ({ row }) => h(DropdownMenu, {}, {
      default: () => [
        h(DropdownMenuTrigger, { asChild: true }, () =>
          h(Button, { variant: 'ghost', size: 'icon', class: 'size-8' }, () =>
            h(IconDotsVertical, { class: 'size-4' })
          )
        ),
        h(DropdownMenuContent, { align: 'end' }, () => [
          h(DropdownMenuItem, { onClick: () => router.push(`/tasks/${row.original.id}`) }, () => 'View details'),
          h(DropdownMenuItem, {}, () => 'Edit task'),
          h(DropdownMenuSeparator),
          h(DropdownMenuItem, { class: 'text-destructive' }, () => 'Delete task'),
        ]),
      ],
    }),
    size: 50,
  },
]

// Helper functions
function getTypeClass(type: string) {
  switch (type) {
    case 'Feature': return 'border-blue-300 bg-blue-100 text-blue-600'
    case 'Bug': return 'border-orange-300 bg-orange-100 text-orange-600'
    case 'Documentation': return 'border-slate-300 bg-slate-100 text-slate-600'
    case 'Enhancement': return 'border-purple-300 bg-purple-100 text-purple-600'
    case 'Maintenance': return 'border-amber-300 bg-amber-100 text-amber-600'
    default: return ''
  }
}

function getStatusConfig(status: string) {
  switch (status) {
    case 'Todo': return { icon: IconCirclePlus, class: 'text-muted-foreground' }
    case 'In Progress': return { icon: IconArrowRight, class: 'text-blue-500' }
    case 'Done': return { icon: IconCheck, class: 'text-emerald-500' }
    case 'Backlog': return { icon: IconArrowRight, class: 'text-amber-500' }
    case 'Canceled': return { icon: IconCheck, class: 'text-muted-foreground' }
    default: return { icon: IconCirclePlus, class: 'text-muted-foreground' }
  }
}

function getPriorityConfig(priority: string) {
  switch (priority) {
    case 'High': return { icon: IconArrowUp, class: 'text-red-500' }
    case 'Medium': return { icon: IconArrowRight, class: 'text-amber-500' }
    case 'Low': return { icon: IconArrowDown, class: 'text-muted-foreground' }
    default: return { icon: IconArrowRight, class: 'text-muted-foreground' }
  }
}

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

// Computed filtered data
const filteredData = computed(() => {
  let result = data.value
  if (statusFilter.value) {
    result = result.filter(task => task.status === statusFilter.value)
  }
  if (priorityFilter.value) {
    result = result.filter(task => task.priority === priorityFilter.value)
  }
  return result
})

// Table instance
const table = useVueTable({
  get data() { return filteredData.value },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: updaterOrValue => {
    sorting.value = typeof updaterOrValue === 'function' ? updaterOrValue(sorting.value) : updaterOrValue
  },
  onColumnFiltersChange: updaterOrValue => {
    columnFilters.value = typeof updaterOrValue === 'function' ? updaterOrValue(columnFilters.value) : updaterOrValue
  },
  onColumnVisibilityChange: updaterOrValue => {
    columnVisibility.value = typeof updaterOrValue === 'function' ? updaterOrValue(columnVisibility.value) : updaterOrValue
  },
  onRowSelectionChange: updaterOrValue => {
    rowSelection.value = typeof updaterOrValue === 'function' ? updaterOrValue(rowSelection.value) : updaterOrValue
  },
  onGlobalFilterChange: updaterOrValue => {
    globalFilter.value = typeof updaterOrValue === 'function' ? updaterOrValue(globalFilter.value) : updaterOrValue
  },
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
    get globalFilter() { return globalFilter.value },
  },
  initialState: {
    pagination: { pageSize: 10 },
  },
})

const clearFilters = () => {
  statusFilter.value = ''
  priorityFilter.value = ''
  globalFilter.value = ''
}

const hasActiveFilters = computed(() => statusFilter.value || priorityFilter.value || globalFilter.value)
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Header Section -->
    <div class="px-6 pt-6 pb-4">
      <h1 class="text-2xl font-semibold tracking-tight">Welcome back!</h1>
      <p class="text-sm text-muted-foreground mt-1">Here's a list of your tasks for this month.</p>
    </div>

    <!-- Filters -->
    <div class="px-6 pb-4">
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-2 flex-1">
          <Input
            v-model="globalFilter"
            placeholder="Filter tasks..."
            class="h-9 w-[180px] text-sm"
          />
          
          <!-- Status Filter -->
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline" size="sm" class="h-9 gap-1.5 border-dashed">
                <IconCirclePlus class="size-3.5" />
                Status
                <Badge v-if="statusFilter" variant="secondary" class="ml-1 text-xs px-1.5">
                  {{ statusFilter }}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" class="w-40">
              <DropdownMenuItem @click="statusFilter = ''">
                All
                <IconCheck v-if="!statusFilter" class="size-3.5 ml-auto" />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem v-for="s in ['Todo', 'In Progress', 'Done', 'Backlog', 'Canceled']" :key="s" @click="statusFilter = s">
                {{ s }}
                <IconCheck v-if="statusFilter === s" class="size-3.5 ml-auto" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <!-- Priority Filter -->
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline" size="sm" class="h-9 gap-1.5 border-dashed">
                <IconCirclePlus class="size-3.5" />
                Priority
                <Badge v-if="priorityFilter" variant="secondary" class="ml-1 text-xs px-1.5">
                  {{ priorityFilter }}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" class="w-32">
              <DropdownMenuItem @click="priorityFilter = ''">
                All
                <IconCheck v-if="!priorityFilter" class="size-3.5 ml-auto" />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem v-for="p in ['High', 'Medium', 'Low']" :key="p" @click="priorityFilter = p">
                {{ p }}
                <IconCheck v-if="priorityFilter === p" class="size-3.5 ml-auto" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            v-if="hasActiveFilters" 
            variant="ghost" 
            size="sm" 
            class="h-9 text-xs"
            @click="clearFilters"
          >
            Clear filters
          </Button>
        </div>

        <!-- View Options -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" size="sm" class="h-9 gap-1.5">
              <IconSettings2 class="size-3.5" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-44">
            <div class="px-2 py-1.5 text-xs font-medium text-muted-foreground">Toggle columns</div>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              v-for="column in table.getAllColumns().filter(c => c.getCanHide())"
              :key="column.id"
              :model-value="column.getIsVisible()"
              @update:model-value="column.toggleVisibility"
              class="capitalize"
            >
              {{ column.id === 'taskId' ? 'Task' : column.id }}
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <!-- Table with integrated pagination -->
    <div class="flex-1 px-6 pb-6">
      <div class="border rounded-lg flex flex-col h-full">
        <div class="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                <TableHead
                  v-for="header in headerGroup.headers"
                  :key="header.id"
                  :style="{ width: header.getSize() !== 150 ? `${header.getSize()}px` : undefined }"
                  class="h-10 text-xs font-medium"
                >
                  <FlexRender
                    v-if="!header.isPlaceholder"
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-if="table.getRowModel().rows?.length">
                <TableRow
                  v-for="row in table.getRowModel().rows"
                  :key="row.id"
                  :data-state="row.getIsSelected() ? 'selected' : undefined"
                  class="cursor-pointer hover:bg-muted/50"
                  @click="router.push(`/tasks/${row.original.id}`)"
                >
                  <TableCell
                    v-for="cell in row.getVisibleCells()"
                    :key="cell.id"
                    class="py-3"
                    @click.stop="cell.column.id === 'select' || cell.column.id === 'actions' ? undefined : router.push(`/tasks/${row.original.id}`)"
                  >
                    <FlexRender
                      :render="cell.column.columnDef.cell"
                      :props="cell.getContext()"
                    />
                  </TableCell>
                </TableRow>
              </template>
              <template v-else>
                <TableRow>
                  <TableCell :colspan="columns.length" class="h-24 text-center text-muted-foreground">
                    No tasks found.
                  </TableCell>
                </TableRow>
              </template>
            </TableBody>
          </Table>
        </div>

        <!-- Pagination inside table border -->
        <div class="border-t px-4 py-3 bg-muted/30">
          <div class="flex items-center justify-between">
            <p class="text-sm text-muted-foreground">
              {{ Object.keys(rowSelection).length }} of {{ filteredData.length }} row(s) selected.
            </p>
            
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-2">
                <span class="text-sm text-muted-foreground">Rows per page</span>
                <Select
                  :model-value="String(table.getState().pagination.pageSize)"
                  @update:model-value="table.setPageSize(Number($event))"
                >
                  <SelectTrigger class="h-8 w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="size in [10, 20, 30, 50]" :key="size" :value="String(size)">
                      {{ size }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="text-sm text-muted-foreground tabular-nums">
                Page {{ table.getState().pagination.pageIndex + 1 }} of {{ table.getPageCount() }}
              </div>

              <div class="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  class="size-8"
                  :disabled="!table.getCanPreviousPage()"
                  @click="table.setPageIndex(0)"
                >
                  <IconChevronsLeft class="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  class="size-8"
                  :disabled="!table.getCanPreviousPage()"
                  @click="table.previousPage()"
                >
                  <IconChevronLeft class="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  class="size-8"
                  :disabled="!table.getCanNextPage()"
                  @click="table.nextPage()"
                >
                  <IconChevronRight class="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  class="size-8"
                  :disabled="!table.getCanNextPage()"
                  @click="table.setPageIndex(table.getPageCount() - 1)"
                >
                  <IconChevronsRight class="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
