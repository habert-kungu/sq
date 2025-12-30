<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import type { ColumnDef, SortingState, ColumnFiltersState, VisibilityState, RowSelectionState } from '@tanstack/vue-table'
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'

import { 
  IconArchive,
  IconBriefcase,
  IconCalendar,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconChevronsLeft,
  IconChevronsRight,
  IconClock,
  IconCopy,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileDescription,
  IconFolder,
  IconLayoutGrid,
  IconLayoutList,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUser,
  IconUsers,
} from '@tabler/icons-vue'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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

// Matter Schema
const matterSchema = z.object({
  id: z.string(),
  matterId: z.string(), // e.g., MAT-2025-001
  title: z.string(),
  type: z.enum(['General', 'Litigation', 'Corporate', 'Tax', 'Real Estate', 'Employment', 'IP', 'Immigration']),
  client: z.string(),
  clientId: z.string(),
  assigned: z.string().nullable(),
  status: z.enum(['Open', 'In Progress', 'On Hold', 'Closed', 'Archived']),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  billedAmount: z.number(),
  budgetAmount: z.number(),
  openDate: z.string(),
  dueDate: z.string().nullable(),
})

type Matter = z.infer<typeof matterSchema>

const router = useRouter()

const navigateToMatter = (matterId: string) => {
  router.push(`/matters/${matterId}`)
}

// Sample Data
const mattersData = ref<Matter[]>([
  {
    id: '1',
    matterId: 'MAT-2025-001',
    title: 'DMCC License Setup - Emirates Digital Solutions',
    type: 'General',
    client: 'Emirates Digital Solutions DMCC',
    clientId: '1',
    assigned: null,
    status: 'Open',
    priority: 'High',
    billedAmount: 0,
    budgetAmount: 15000,
    openDate: 'Dec 15, 2025',
    dueDate: 'Jan 30, 2026',
  },
  {
    id: '2',
    matterId: 'MAT-2025-002',
    title: 'Corporate Restructuring Advisory',
    type: 'Corporate',
    client: 'Skyline Ventures DMCC',
    clientId: '2',
    assigned: 'Sarah Ahmed',
    status: 'In Progress',
    priority: 'High',
    billedAmount: 32000,
    budgetAmount: 45000,
    openDate: 'Nov 20, 2025',
    dueDate: 'Feb 15, 2026',
  },
  {
    id: '3',
    matterId: 'MAT-2025-003',
    title: 'Employment Contract Review',
    type: 'Employment',
    client: 'Skyline Ventures DMCC',
    clientId: '2',
    assigned: 'Ahmed Hassan',
    status: 'In Progress',
    priority: 'Medium',
    billedAmount: 8500,
    budgetAmount: 12000,
    openDate: 'Dec 1, 2025',
    dueDate: 'Dec 31, 2025',
  },
  {
    id: '4',
    matterId: 'MAT-2025-004',
    title: 'Annual Tax Filing 2025',
    type: 'Tax',
    client: 'Al-Rashid Group',
    clientId: '3',
    assigned: 'Mohammed Khalil',
    status: 'In Progress',
    priority: 'Urgent',
    billedAmount: 5200,
    budgetAmount: 8500,
    openDate: 'Dec 10, 2025',
    dueDate: 'Jan 15, 2026',
  },
  {
    id: '5',
    matterId: 'MAT-2025-005',
    title: 'Commercial Lease Agreement',
    type: 'Real Estate',
    client: 'Ahmed Holdings LLC',
    clientId: '4',
    assigned: 'Layla Ibrahim',
    status: 'Open',
    priority: 'Medium',
    billedAmount: 0,
    budgetAmount: 20000,
    openDate: 'Dec 28, 2025',
    dueDate: 'Mar 1, 2026',
  },
  {
    id: '6',
    matterId: 'MAT-2024-089',
    title: 'Trademark Registration - Gulf Tech',
    type: 'IP',
    client: 'Gulf Medical Center LLC',
    clientId: '5',
    assigned: 'Sarah Ahmed',
    status: 'On Hold',
    priority: 'Low',
    billedAmount: 12000,
    budgetAmount: 18000,
    openDate: 'Sep 15, 2024',
    dueDate: null,
  },
  {
    id: '7',
    matterId: 'MAT-2024-078',
    title: 'Visa Processing - Executive Team',
    type: 'Immigration',
    client: 'Ibrahim Tech Solutions',
    clientId: '6',
    assigned: 'Ahmed Hassan',
    status: 'Closed',
    priority: 'Medium',
    billedAmount: 25000,
    budgetAmount: 25000,
    openDate: 'Aug 1, 2024',
    dueDate: 'Oct 30, 2024',
  },
  {
    id: '8',
    matterId: 'MAT-2024-065',
    title: 'Contract Dispute Resolution',
    type: 'Litigation',
    client: 'Rashid Trading Co.',
    clientId: '7',
    assigned: 'Mohammed Khalil',
    status: 'Closed',
    priority: 'High',
    billedAmount: 85000,
    budgetAmount: 90000,
    openDate: 'Jun 10, 2024',
    dueDate: 'Nov 15, 2024',
  },
  {
    id: '9',
    matterId: 'MAT-2025-006',
    title: 'KYC Compliance Review',
    type: 'General',
    client: 'Emirates Foundation',
    clientId: '8',
    assigned: null,
    status: 'Open',
    priority: 'Medium',
    billedAmount: 0,
    budgetAmount: 10000,
    openDate: 'Dec 29, 2025',
    dueDate: 'Feb 28, 2026',
  },
  {
    id: '10',
    matterId: 'MAT-2024-092',
    title: 'Merger Documentation',
    type: 'Corporate',
    client: 'Al-Suwaidi Enterprises',
    clientId: '9',
    assigned: 'Sarah Ahmed',
    status: 'Archived',
    priority: 'Low',
    billedAmount: 45000,
    budgetAmount: 45000,
    openDate: 'Oct 5, 2024',
    dueDate: 'Dec 20, 2024',
  },
])

// Stats
const stats = computed(() => ({
  total: mattersData.value.length,
  open: mattersData.value.filter(m => m.status === 'Open').length,
  inProgress: mattersData.value.filter(m => m.status === 'In Progress').length,
  onHold: mattersData.value.filter(m => m.status === 'On Hold').length,
  totalBilled: mattersData.value.reduce((sum, m) => sum + m.billedAmount, 0),
  totalBudget: mattersData.value.reduce((sum, m) => sum + m.budgetAmount, 0),
}))

// View/Table state
const showDetails = ref(true)
const viewMode = ref<'grid' | 'list'>('list')
const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref<RowSelectionState>({})

// Filters
const globalFilter = ref('')
const typeFilter = ref('all')
const statusFilter = ref('all')
const assignedFilter = ref('all')

// Helper functions
const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getStatusDotClass = (status: string) => {
  switch (status) {
    case 'Open': return 'bg-blue-500'
    case 'In Progress': return 'bg-emerald-500'
    case 'On Hold': return 'bg-amber-500'
    case 'Closed': return 'bg-slate-400'
    case 'Archived': return 'bg-slate-300'
    default: return 'bg-slate-400'
  }
}

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'Urgent': return 'text-red-600'
    case 'High': return 'text-amber-600'
    case 'Medium': return 'text-blue-600'
    case 'Low': return 'text-slate-500'
    default: return 'text-slate-500'
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Litigation': return IconBriefcase
    case 'Corporate': return IconUsers
    case 'Tax': return IconFileDescription
    case 'Real Estate': return IconFolder
    case 'Employment': return IconUser
    case 'IP': return IconCopy
    case 'Immigration': return IconUsers
    default: return IconFolder
  }
}

// Active filters count
const activeFiltersCount = computed(() => {
  let count = 0
  if (typeFilter.value !== 'all') count++
  if (statusFilter.value !== 'all') count++
  if (assignedFilter.value !== 'all') count++
  return count
})

// Clear all filters
const clearFilters = () => {
  typeFilter.value = 'all'
  statusFilter.value = 'all'
  assignedFilter.value = 'all'
  globalFilter.value = ''
}

// Unique assignees for filter
const uniqueAssignees = computed(() => {
  return [...new Set(mattersData.value.map(m => m.assigned).filter(Boolean))] as string[]
})

// Columns definition
const columns: ColumnDef<Matter>[] = [
  {
    id: "select",
    header: ({ table }) => h(Checkbox, {
      "modelValue": table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate"),
      "onUpdate:modelValue": (value: boolean | "indeterminate") => table.toggleAllPageRowsSelected(!!value),
      "aria-label": "Select all",
    }),
    cell: ({ row }) => h(Checkbox, {
      "modelValue": row.getIsSelected(),
      "onUpdate:modelValue": (value: boolean | "indeterminate") => row.toggleSelected(!!value),
      "aria-label": "Select row",
    }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return h(Button, {
        variant: "ghost",
        class: "-ml-4",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }, () => [
        'Matter',
        column.getIsSorted() === "asc" 
          ? h(IconChevronUp, { class: "ml-1 size-4" })
          : column.getIsSorted() === "desc"
            ? h(IconChevronDown, { class: "ml-1 size-4" })
            : null
      ])
    },
    cell: ({ row }) => {
      const matterId = row.original.matterId
      return h('div', { class: 'flex items-center gap-2.5' }, [
        h(Avatar, { class: 'size-8' }, {
          default: () => h(AvatarFallback, { class: 'bg-primary/10 text-primary text-[10px] font-semibold' }, 
            () => getInitials(row.getValue('title') as string))
        }),
        h('div', { class: 'flex flex-col' }, [
          h('span', { class: 'font-medium text-sm text-foreground leading-tight line-clamp-1' }, row.getValue('title')),
          h('span', { class: 'text-[11px] text-muted-foreground leading-tight font-mono' }, matterId),
        ])
      ])
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return h(Button, {
        variant: "ghost",
        class: "-ml-4 font-medium",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }, () => [
        'Type',
        column.getIsSorted() === "asc" 
          ? h(IconChevronUp, { class: "ml-1 size-3.5" })
          : column.getIsSorted() === "desc"
            ? h(IconChevronDown, { class: "ml-1 size-3.5" })
            : null
      ])
    },
    cell: ({ row }) => {
      const type = row.getValue('type') as string
      return h('span', { class: 'text-xs' }, type)
    },
  },
  {
    accessorKey: "client",
    header: ({ column }) => {
      return h(Button, {
        variant: "ghost",
        class: "-ml-4 font-medium",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }, () => [
        'Client',
        column.getIsSorted() === "asc" 
          ? h(IconChevronUp, { class: "ml-1 size-3.5" })
          : column.getIsSorted() === "desc"
            ? h(IconChevronDown, { class: "ml-1 size-3.5" })
            : null
      ])
    },
    cell: ({ row }) => h('span', { class: 'text-xs text-muted-foreground' }, row.getValue('client')),
  },
  {
    accessorKey: "assigned",
    header: ({ column }) => {
      return h(Button, {
        variant: "ghost",
        class: "-ml-4 font-medium",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }, () => [
        'Assigned',
        column.getIsSorted() === "asc" 
          ? h(IconChevronUp, { class: "ml-1 size-3.5" })
          : column.getIsSorted() === "desc"
            ? h(IconChevronDown, { class: "ml-1 size-3.5" })
            : null
      ])
    },
    cell: ({ row }) => {
      const assigned = row.getValue('assigned') as string | null
      if (!assigned) {
        return h('span', { class: 'text-xs text-muted-foreground/50' }, 'N/A')
      }
      return h('div', { class: 'flex items-center gap-1.5' }, [
        h(Avatar, { class: 'size-5' }, {
          default: () => h(AvatarFallback, { class: 'text-[8px] bg-muted' }, () => getInitials(assigned))
        }),
        h('span', { class: 'text-xs' }, assigned),
      ])
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return h(Button, {
        variant: "ghost",
        class: "-ml-4 font-medium",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }, () => [
        'Status',
        column.getIsSorted() === "asc" 
          ? h(IconChevronUp, { class: "ml-1 size-3.5" })
          : column.getIsSorted() === "desc"
            ? h(IconChevronDown, { class: "ml-1 size-3.5" })
            : null
      ])
    },
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return h('div', { class: 'flex items-center gap-1.5' }, [
        h('span', { class: `size-1.5 rounded-full ${getStatusDotClass(status)}` }),
        h('span', { class: 'text-xs' }, status),
      ])
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => h('div', { class: 'flex items-center gap-1' }, [
      h(Button, { 
        variant: 'ghost', 
        size: 'icon', 
        class: 'size-7 opacity-0 group-hover:opacity-100 transition-opacity',
        onClick: (e: Event) => { e.stopPropagation(); navigateToMatter(row.original.id) }
      }, () => h(IconEye, { class: 'size-3.5' })),
      h(Button, { 
        variant: 'ghost', 
        size: 'icon', 
        class: 'size-7 opacity-0 group-hover:opacity-100 transition-opacity',
        onClick: (e: Event) => e.stopPropagation()
      }, () => h(IconEdit, { class: 'size-3.5' })),
      h(DropdownMenu, {}, {
        default: () => [
          h(DropdownMenuTrigger, { asChild: true }, {
            default: () => h(Button, { 
              variant: 'ghost', 
              size: 'icon', 
              class: 'size-7 opacity-0 group-hover:opacity-100 transition-opacity data-[state=open]:opacity-100',
              onClick: (e: Event) => e.stopPropagation()
            }, () => h(IconDotsVertical, { class: 'size-3.5' }))
          }),
          h(DropdownMenuContent, { align: 'end', class: 'w-48' }, {
            default: () => [
              h(DropdownMenuItem, { class: 'gap-2' }, () => [
                h(IconEye, { class: 'size-4' }),
                'View details'
              ]),
              h(DropdownMenuItem, { class: 'gap-2' }, () => [
                h(IconEdit, { class: 'size-4' }),
                'Edit matter'
              ]),
              h(DropdownMenuItem, { class: 'gap-2' }, () => [
                h(IconUser, { class: 'size-4' }),
                'Assign'
              ]),
              h(DropdownMenuSeparator),
              h(DropdownMenuItem, { class: 'gap-2' }, () => [
                h(IconCheck, { class: 'size-4' }),
                'Mark as closed'
              ]),
              h(DropdownMenuItem, { class: 'gap-2' }, () => [
                h(IconArchive, { class: 'size-4' }),
                'Archive'
              ]),
              h(DropdownMenuSeparator),
              h(DropdownMenuItem, { class: 'gap-2 text-destructive focus:text-destructive' }, () => [
                h(IconTrash, { class: 'size-4' }),
                'Delete'
              ]),
            ]
          })
        ]
      }),
    ]),
  },
]

// Filtered data
const filteredData = computed(() => {
  return mattersData.value.filter(matter => {
    if (typeFilter.value !== 'all' && matter.type !== typeFilter.value) return false
    if (statusFilter.value !== 'all' && matter.status !== statusFilter.value) return false
    if (assignedFilter.value !== 'all') {
      if (assignedFilter.value === 'unassigned' && matter.assigned !== null) return false
      if (assignedFilter.value !== 'unassigned' && matter.assigned !== assignedFilter.value) return false
    }
    if (globalFilter.value) {
      const search = globalFilter.value.toLowerCase()
      return matter.title.toLowerCase().includes(search) || 
             matter.matterId.toLowerCase().includes(search) ||
             matter.client.toLowerCase().includes(search)
    }
    return true
  })
})

const table = useVueTable({
  get data() {
    return filteredData.value
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: (updaterOrValue) => {
    sorting.value = typeof updaterOrValue === "function"
      ? updaterOrValue(sorting.value)
      : updaterOrValue
  },
  onColumnFiltersChange: (updaterOrValue) => {
    columnFilters.value = typeof updaterOrValue === "function"
      ? updaterOrValue(columnFilters.value)
      : updaterOrValue
  },
  onColumnVisibilityChange: (updaterOrValue) => {
    columnVisibility.value = typeof updaterOrValue === "function"
      ? updaterOrValue(columnVisibility.value)
      : updaterOrValue
  },
  onRowSelectionChange: (updaterOrValue) => {
    rowSelection.value = typeof updaterOrValue === "function"
      ? updaterOrValue(rowSelection.value)
      : updaterOrValue
  },
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
  },
})
</script>

<template>
  <div class="flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between border-b px-6 py-3">
      <div class="flex items-center gap-2.5">
        <div class="flex size-8 items-center justify-center rounded-md bg-primary/10">
          <IconFolder class="size-4 text-primary" />
        </div>
        <div>
          <h1 class="text-base font-semibold leading-tight">Matters</h1>
          <p class="text-[11px] text-muted-foreground leading-tight">{{ filteredData.length }} total</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" class="h-8 text-xs" @click="showDetails = !showDetails">
          <IconChevronUp v-if="showDetails" class="size-3.5" />
          <IconChevronDown v-else class="size-3.5" />
          Stats
        </Button>
        <div class="flex items-center rounded-md border p-0.5">
          <Button 
            :variant="viewMode === 'grid' ? 'secondary' : 'ghost'" 
            size="sm" 
            class="h-6 px-2 gap-1 text-xs"
            @click="viewMode = 'grid'"
          >
            <IconLayoutGrid class="size-3.5" />
            <span class="hidden sm:inline">Grid</span>
          </Button>
          <Button 
            :variant="viewMode === 'list' ? 'secondary' : 'ghost'" 
            size="sm" 
            class="h-6 px-2 gap-1 text-xs"
            @click="viewMode = 'list'"
          >
            <IconLayoutList class="size-3.5" />
            <span class="hidden sm:inline">List</span>
          </Button>
        </div>
        <Button size="sm" class="gap-1.5 h-8 text-xs">
          <IconPlus class="size-3.5" />
          New Matter
        </Button>
      </div>
    </div>
    
    <!-- Stats Cards -->
    <div v-if="showDetails" class="flex items-center gap-2 border-b px-6 py-3 overflow-x-auto">
      <div class="flex items-center gap-2.5 rounded-md border bg-card px-3 py-2 min-w-[100px]">
        <div class="flex size-8 items-center justify-center rounded-md bg-blue-500/10">
          <IconFolder class="size-4 text-blue-600" />
        </div>
        <div>
          <div class="text-[10px] text-muted-foreground leading-tight">Open</div>
          <div class="text-lg font-bold tabular-nums leading-tight">{{ stats.open }}</div>
        </div>
      </div>
      <div class="flex items-center gap-2.5 rounded-md border bg-card px-3 py-2 min-w-[100px]">
        <div class="flex size-8 items-center justify-center rounded-md bg-emerald-500/10">
          <IconClock class="size-4 text-emerald-600" />
        </div>
        <div>
          <div class="text-[10px] text-muted-foreground leading-tight">In Progress</div>
          <div class="text-lg font-bold tabular-nums leading-tight">{{ stats.inProgress }}</div>
        </div>
      </div>
      <div class="flex items-center gap-2.5 rounded-md border bg-card px-3 py-2 min-w-[100px]">
        <div class="flex size-8 items-center justify-center rounded-md bg-amber-500/10">
          <IconCalendar class="size-4 text-amber-600" />
        </div>
        <div>
          <div class="text-[10px] text-muted-foreground leading-tight">On Hold</div>
          <div class="text-lg font-bold tabular-nums leading-tight">{{ stats.onHold }}</div>
        </div>
      </div>
      <div class="flex items-center gap-2.5 rounded-md border bg-card px-3 py-2 min-w-[120px]">
        <div class="flex size-8 items-center justify-center rounded-md bg-purple-500/10">
          <IconFileDescription class="size-4 text-purple-600" />
        </div>
        <div>
          <div class="text-[10px] text-muted-foreground leading-tight">Total Billed</div>
          <div class="text-base font-bold tabular-nums leading-tight">{{ (stats.totalBilled / 1000).toFixed(0) }}K</div>
        </div>
      </div>
      <div class="flex items-center gap-2.5 rounded-md border bg-card px-3 py-2 min-w-[120px]">
        <div class="flex size-8 items-center justify-center rounded-md bg-cyan-500/10">
          <IconBriefcase class="size-4 text-cyan-600" />
        </div>
        <div>
          <div class="text-[10px] text-muted-foreground leading-tight">Total Budget</div>
          <div class="text-base font-bold tabular-nums leading-tight">{{ (stats.totalBudget / 1000).toFixed(0) }}K</div>
        </div>
      </div>
    </div>
    
    <!-- Filters -->
    <div class="flex items-center gap-3 border-b px-6 py-2">
      <div class="relative flex-1 max-w-xs">
        <IconSearch class="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input 
          v-model="globalFilter"
          placeholder="Search matters..." 
          class="pl-8 h-8 text-sm"
        />
      </div>
      
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1.5">
          <Label class="text-[11px] text-muted-foreground whitespace-nowrap">Type:</Label>
          <Select v-model="typeFilter">
            <SelectTrigger class="w-[100px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="General">General</SelectItem>
              <SelectItem value="Litigation">Litigation</SelectItem>
              <SelectItem value="Corporate">Corporate</SelectItem>
              <SelectItem value="Tax">Tax</SelectItem>
              <SelectItem value="Real Estate">Real Estate</SelectItem>
              <SelectItem value="Employment">Employment</SelectItem>
              <SelectItem value="IP">IP</SelectItem>
              <SelectItem value="Immigration">Immigration</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div class="flex items-center gap-1.5">
          <Label class="text-[11px] text-muted-foreground whitespace-nowrap">Status:</Label>
          <Select v-model="statusFilter">
            <SelectTrigger class="w-[100px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div class="flex items-center gap-1.5">
          <Label class="text-[11px] text-muted-foreground whitespace-nowrap">Assigned:</Label>
          <Select v-model="assignedFilter">
            <SelectTrigger class="w-[120px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              <SelectItem v-for="assignee in uniqueAssignees" :key="assignee" :value="assignee">
                {{ assignee }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          v-if="activeFiltersCount > 0"
          variant="ghost" 
          size="sm"
          class="text-xs text-muted-foreground h-8"
          @click="clearFilters"
        >
          Clear ({{ activeFiltersCount }})
        </Button>
      </div>
    </div>
    
    <!-- Bulk Actions Bar -->
    <div 
      v-if="Object.keys(rowSelection).length > 0" 
      class="flex items-center gap-3 border-b bg-primary/5 px-6 py-1.5"
    >
      <span class="text-xs font-medium">
        {{ Object.keys(rowSelection).length }} selected
      </span>
      <div class="flex items-center gap-1">
        <Button variant="ghost" size="sm" class="h-7 text-xs">Export</Button>
        <Button variant="ghost" size="sm" class="h-7 text-xs">Reassign</Button>
        <Button variant="ghost" size="sm" class="h-7 text-xs text-destructive hover:text-destructive">Archive</Button>
      </div>
    </div>
    
    <!-- Table -->
    <div class="overflow-auto">
      <Table>
        <TableHeader class="bg-muted/30 sticky top-0 z-10">
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id" class="hover:bg-muted/30">
            <TableHead 
              v-for="header in headerGroup.headers" 
              :key="header.id" 
              :col-span="header.colSpan"
              class="whitespace-nowrap h-9 text-[11px] font-medium text-muted-foreground"
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
            <template v-if="table.getRowModel().rows.length">
              <TableRow 
                v-for="row in table.getRowModel().rows" 
                :key="row.id"
                :data-state="row.getIsSelected() ? 'selected' : undefined"
                class="group cursor-pointer transition-colors hover:bg-muted/50 data-[state=selected]:bg-primary/5 data-[state=selected]:border-l-2 data-[state=selected]:border-l-primary"
                @click="navigateToMatter(row.original.id)"
              >
                <TableCell 
                  v-for="cell in row.getVisibleCells()" 
                  :key="cell.id"
                  class="py-2.5"
                >
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </TableCell>
              </TableRow>
            </template>
            <TableRow v-else>
              <TableCell :col-span="columns.length" class="h-32 text-center">
                <div class="flex flex-col items-center gap-2">
                  <IconFolder class="size-8 text-muted-foreground/50" />
                  <p class="text-sm text-muted-foreground">No matters found</p>
                  <Button variant="outline" size="sm" @click="clearFilters">Clear filters</Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
    </div>
      
    <!-- Pagination -->
    <div class="flex items-center justify-between border-t px-6 py-2.5 bg-muted/20">
      <div class="text-xs text-muted-foreground">
        Showing {{ table.getRowModel().rows.length }} of {{ filteredData.length }} matters
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <Label class="text-xs text-muted-foreground">Rows:</Label>
          <Select
            :model-value="String(table.getState().pagination.pageSize)"
            @update:model-value="(value) => table.setPageSize(Number(value))"
          >
            <SelectTrigger class="w-[60px] h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="size in [10, 20, 30, 50]" :key="size" :value="String(size)">
                {{ size }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="text-xs text-muted-foreground tabular-nums">
          Page {{ table.getState().pagination.pageIndex + 1 }} of {{ table.getPageCount() || 1 }}
        </div>
        <div class="flex items-center gap-0.5">
          <Button
            variant="outline"
            size="icon"
            class="size-7"
            :disabled="!table.getCanPreviousPage()"
            @click="table.setPageIndex(0)"
          >
            <IconChevronsLeft class="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            class="size-7"
            :disabled="!table.getCanPreviousPage()"
            @click="table.previousPage()"
          >
            <IconChevronLeft class="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            class="size-7"
            :disabled="!table.getCanNextPage()"
            @click="table.nextPage()"
          >
            <IconChevronRight class="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            class="size-7"
            :disabled="!table.getCanNextPage()"
            @click="table.setPageIndex(table.getPageCount() - 1)"
          >
            <IconChevronsRight class="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
