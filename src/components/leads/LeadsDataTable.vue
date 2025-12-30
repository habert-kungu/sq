<script lang="ts">
import { z } from "zod"

export const leadSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  email: z.string(),
  service: z.string(),
  stage: z.string(),
  progress: z.number(),
  created: z.string(),
  status: z.string(),
})

export type Lead = z.infer<typeof leadSchema>
</script>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/vue-table"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconLayoutGrid,
  IconLayoutList,
  IconPlus,
  IconSearch,
  IconUsers,
  IconBriefcase,
  IconTrendingUp,
  IconCheck,
  IconUserPlus,
  IconChevronUp,
  IconMail,
  IconEdit,
  IconTrash,
  IconExternalLink,
} from "@tabler/icons-vue"
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table"

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

const router = useRouter()

const navigateToLead = (id: string) => {
  router.push(`/leads/${id}`)
}

// Sample data
const leadsData = ref<Lead[]>([
  {
    id: '1',
    name: 'Skyline Ventures DMCC',
    type: 'Corporate',
    email: 'k.almazrouei@skylineventures.ae',
    service: 'legal',
    stage: 'Open',
    progress: 15,
    created: '10/10/2025',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Greenfield Properties LLC',
    type: 'Corporate',
    email: 'marina@greenfieldprop.ae',
    service: 'legal',
    stage: 'Open',
    progress: 15,
    created: '10/10/2025',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Tech Innovators FZ-LLC',
    type: 'Corporate',
    email: 'rajesh@techinnovators.ae',
    service: 'both',
    stage: 'Open',
    progress: 15,
    created: '10/10/2025',
    status: 'Active',
  },
  {
    id: '4',
    name: 'Dubai Investment Partners',
    type: 'Corporate',
    email: 'sarah@dubaiinvest.ae',
    service: 'tax',
    stage: 'Qualified',
    progress: 45,
    created: '08/10/2025',
    status: 'Active',
  },
  {
    id: '5',
    name: 'Al Reem Holdings',
    type: 'Corporate',
    email: 'ahmed@alreemholdings.ae',
    service: 'legal',
    stage: 'Proposal',
    progress: 70,
    created: '05/10/2025',
    status: 'Active',
  },
  {
    id: '6',
    name: 'Marina Bay Consulting',
    type: 'Corporate',
    email: 'info@marinabay.ae',
    service: 'both',
    stage: 'Negotiation',
    progress: 85,
    created: '01/10/2025',
    status: 'Active',
  },
  {
    id: '7',
    name: 'Emirates Legal Services',
    type: 'Corporate',
    email: 'contact@emirateslegal.ae',
    service: 'legal',
    stage: 'Open',
    progress: 10,
    created: '12/10/2025',
    status: 'Inactive',
  },
  {
    id: '8',
    name: 'Gulf Trade Finance',
    type: 'Corporate',
    email: 'finance@gulftrade.ae',
    service: 'tax',
    stage: 'Closed Won',
    progress: 100,
    created: '20/09/2025',
    status: 'Converted',
  },
  {
    id: '9',
    name: 'Sunrise Real Estate',
    type: 'Individual',
    email: 'john@sunrisere.ae',
    service: 'legal',
    stage: 'Closed Lost',
    progress: 0,
    created: '15/09/2025',
    status: 'Inactive',
  },
  {
    id: '10',
    name: 'Palm Jumeirah Investments',
    type: 'Corporate',
    email: 'invest@palmjumeirah.ae',
    service: 'both',
    stage: 'Qualified',
    progress: 40,
    created: '18/10/2025',
    status: 'Active',
  },
  {
    id: '11',
    name: 'Khalifa Business Hub',
    type: 'Corporate',
    email: 'hub@khalifabusiness.ae',
    service: 'legal',
    stage: 'Open',
    progress: 20,
    created: '19/10/2025',
    status: 'Active',
  },
  {
    id: '12',
    name: 'Zayed Enterprises',
    type: 'Corporate',
    email: 'enterprise@zayed.ae',
    service: 'tax',
    stage: 'Proposal',
    progress: 65,
    created: '22/10/2025',
    status: 'Active',
  },
])

// Stats
const stats = computed(() => {
  const active = leadsData.value.filter(l => l.status === 'Active').length
  const forTax = leadsData.value.filter(l => l.service === 'tax').length
  const forLegal = leadsData.value.filter(l => l.service === 'legal').length
  const converted = leadsData.value.filter(l => l.status === 'Converted').length
  const closedWon = leadsData.value.filter(l => l.stage === 'Closed Won').length
  const thisMonth = leadsData.value.filter(l => l.created.includes('/10/')).length
  
  return {
    active,
    forTax,
    forLegal,
    conversion: closedWon > 0 ? ((closedWon / leadsData.value.length) * 100).toFixed(2) : '0.00',
    closedWon,
    thisMonth: 0,
    converted,
  }
})

// View toggle
const viewMode = ref<'list' | 'grid'>('list')
const showDetails = ref(true)

// Table state
const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const globalFilter = ref('')

// Filters
const serviceFilter = ref('all')
const stageFilter = ref('all')
const statusFilter = ref('all')
const typeFilter = ref('all')

// Get initials for avatar
const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

// Get status dot color (subtle approach)
const getStatusDotClass = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-emerald-500'
    case 'Inactive': return 'bg-slate-400'
    case 'Converted': return 'bg-blue-500'
    default: return 'bg-slate-400'
  }
}

// Get stage indicator with visual symbol
const getStageIndicator = (stage: string) => {
  switch (stage) {
    case 'Open': return { symbol: '○', class: 'text-slate-400' }
    case 'Qualified': return { symbol: '◐', class: 'text-blue-500' }
    case 'Proposal': return { symbol: '◑', class: 'text-indigo-500' }
    case 'Negotiation': return { symbol: '◕', class: 'text-purple-500' }
    case 'Closed Won': return { symbol: '●', class: 'text-emerald-500' }
    case 'Closed Lost': return { symbol: '●', class: 'text-red-500' }
    default: return { symbol: '○', class: 'text-slate-400' }
  }
}

// Get progress bar color based on percentage
const getProgressColor = (progress: number) => {
  if (progress >= 76) return 'bg-emerald-500'
  if (progress >= 51) return 'bg-indigo-500'
  if (progress >= 26) return 'bg-blue-500'
  return 'bg-slate-400'
}

// Active filters count
const activeFiltersCount = computed(() => {
  let count = 0
  if (serviceFilter.value !== 'all') count++
  if (stageFilter.value !== 'all') count++
  if (statusFilter.value !== 'all') count++
  if (typeFilter.value !== 'all') count++
  return count
})

// Clear all filters
const clearFilters = () => {
  serviceFilter.value = 'all'
  stageFilter.value = 'all'
  statusFilter.value = 'all'
  typeFilter.value = 'all'
  globalFilter.value = ''
}

// Columns definition
const columns: ColumnDef<Lead>[] = [
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
    accessorKey: "name",
    header: ({ column }) => {
      return h(Button, {
        variant: "ghost",
        class: "-ml-4",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }, () => [
        'Lead',
        column.getIsSorted() === "asc" 
          ? h(IconChevronUp, { class: "ml-1 size-4" })
          : column.getIsSorted() === "desc"
            ? h(IconChevronDown, { class: "ml-1 size-4" })
            : null
      ])
    },
    cell: ({ row }) => {
      const service = row.original.service
      return h('div', { class: 'flex items-center gap-2.5' }, [
        h(Avatar, { class: 'size-8' }, {
          default: () => h(AvatarFallback, { class: 'bg-primary/10 text-primary text-[10px] font-semibold' }, 
            () => getInitials(row.getValue('name') as string))
        }),
        h('div', { class: 'flex flex-col' }, [
          h('span', { class: 'font-medium text-sm text-foreground leading-tight' }, row.getValue('name')),
          h('span', { class: 'text-[11px] text-muted-foreground leading-tight' }, `${row.original.type} · ${service}`),
        ])
      ])
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => h('span', { class: 'text-xs text-muted-foreground' }, row.getValue('email')),
  },
  {
    accessorKey: "stage",
    header: ({ column }) => {
      return h(Button, {
        variant: "ghost",
        class: "-ml-4 font-medium",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }, () => [
        'Stage',
        column.getIsSorted() === "asc" 
          ? h(IconChevronUp, { class: "ml-1 size-3.5" })
          : column.getIsSorted() === "desc"
            ? h(IconChevronDown, { class: "ml-1 size-3.5" })
            : null
      ])
    },
    cell: ({ row }) => {
      const stage = row.getValue('stage') as string
      const indicator = getStageIndicator(stage)
      return h('div', { class: 'flex items-center gap-1.5' }, [
        h('span', { class: `text-sm ${indicator.class}` }, indicator.symbol),
        h('span', { class: 'text-xs' }, stage),
      ])
    },
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => {
      const progress = row.getValue('progress') as number
      return h('div', { class: 'flex items-center gap-2 min-w-[100px]' }, [
        h('div', { class: 'h-1 flex-1 max-w-[60px] rounded-full bg-muted overflow-hidden' }, [
          h('div', { 
            class: `h-full rounded-full transition-all ${getProgressColor(progress)}`,
            style: { width: `${progress}%` }
          })
        ]),
        h('span', { class: 'text-[11px] text-muted-foreground font-mono tabular-nums w-7' }, `${progress}%`),
      ])
    },
  },
  {
    accessorKey: "created",
    header: ({ column }) => {
      return h(Button, {
        variant: "ghost",
        class: "-ml-4 font-medium",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }, () => [
        'Created',
        column.getIsSorted() === "asc" 
          ? h(IconChevronUp, { class: "ml-1 size-3.5" })
          : column.getIsSorted() === "desc"
            ? h(IconChevronDown, { class: "ml-1 size-3.5" })
            : null
      ])
    },
    cell: ({ row }) => h('span', { class: 'text-xs font-mono tabular-nums text-muted-foreground' }, row.getValue('created')),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return h('div', { class: 'flex items-center gap-1.5' }, [
        h('span', { class: `size-1.5 rounded-full ${getStatusDotClass(status)}` }),
        h('span', { class: 'text-xs text-muted-foreground' }, status),
      ])
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => h(DropdownMenu, {}, {
      default: () => [
        h(DropdownMenuTrigger, { asChild: true }, {
          default: () => h(Button, { 
            variant: 'ghost', 
            size: 'icon', 
            class: 'size-8 opacity-0 group-hover:opacity-100 transition-opacity data-[state=open]:opacity-100' 
          }, () => h(IconDotsVertical, { class: 'size-4' }))
        }),
        h(DropdownMenuContent, { align: 'end', class: 'w-48' }, {
          default: () => [
            h(DropdownMenuItem, { class: 'gap-2' }, () => [
              h(IconExternalLink, { class: 'size-4' }),
              'View details'
            ]),
            h(DropdownMenuItem, { class: 'gap-2' }, () => [
              h(IconEdit, { class: 'size-4' }),
              'Edit'
            ]),
            h(DropdownMenuItem, { class: 'gap-2' }, () => [
              h(IconMail, { class: 'size-4' }),
              'Send email'
            ]),
            h(DropdownMenuSeparator),
            h(DropdownMenuItem, { class: 'gap-2' }, () => [
              h(IconCheck, { class: 'size-4' }),
              'Mark as converted'
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
  },
]

// Filtered data
const filteredData = computed(() => {
  return leadsData.value.filter(lead => {
    if (serviceFilter.value !== 'all' && lead.service !== serviceFilter.value) return false
    if (stageFilter.value !== 'all' && lead.stage !== stageFilter.value) return false
    if (statusFilter.value !== 'all' && lead.status !== statusFilter.value) return false
    if (typeFilter.value !== 'all' && lead.type !== typeFilter.value) return false
    if (globalFilter.value) {
      const search = globalFilter.value.toLowerCase()
      return lead.name.toLowerCase().includes(search) || 
             lead.email.toLowerCase().includes(search)
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
          <IconUsers class="size-4 text-primary" />
        </div>
        <div>
          <h1 class="text-base font-semibold leading-tight">Leads</h1>
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
          Add Lead
        </Button>
      </div>
    </div>
    
    <!-- Stats Cards -->
    <div v-if="showDetails" class="flex items-center gap-2 border-b px-6 py-3 overflow-x-auto">
      <div class="flex items-center gap-2.5 rounded-md border bg-card px-3 py-2 min-w-[110px]">
        <div class="flex size-8 items-center justify-center rounded-md bg-emerald-500/10">
          <IconUsers class="size-4 text-emerald-600" />
        </div>
        <div>
          <div class="text-[10px] text-muted-foreground leading-tight">Active</div>
          <div class="text-lg font-bold tabular-nums leading-tight">{{ stats.active }}</div>
        </div>
      </div>
      <div class="flex items-center gap-2.5 rounded-md border bg-card px-3 py-2 min-w-[110px]">
        <div class="flex size-8 items-center justify-center rounded-md bg-amber-500/10">
          <IconBriefcase class="size-4 text-amber-600" />
        </div>
        <div>
          <div class="text-[10px] text-muted-foreground leading-tight">For Tax</div>
          <div class="text-lg font-bold tabular-nums leading-tight">{{ stats.forTax }}</div>
        </div>
      </div>
      <div class="flex items-center gap-2.5 rounded-md border bg-card px-3 py-2 min-w-[110px]">
        <div class="flex size-8 items-center justify-center rounded-md bg-blue-500/10">
          <IconBriefcase class="size-4 text-blue-600" />
        </div>
        <div>
          <div class="text-[10px] text-muted-foreground leading-tight">For Legal</div>
          <div class="text-lg font-bold tabular-nums leading-tight">{{ stats.forLegal }}</div>
        </div>
      </div>
      <div class="flex items-center gap-2.5 rounded-md border bg-card px-3 py-2 min-w-[110px]">
        <div class="flex size-8 items-center justify-center rounded-md bg-purple-500/10">
          <IconTrendingUp class="size-4 text-purple-600" />
        </div>
        <div>
          <div class="text-[10px] text-muted-foreground leading-tight">Conversion</div>
          <div class="text-lg font-bold tabular-nums leading-tight">{{ stats.conversion }}%</div>
        </div>
      </div>
      <div class="flex items-center gap-2.5 rounded-md border bg-card px-3 py-2 min-w-[110px]">
        <div class="flex size-8 items-center justify-center rounded-md bg-emerald-500/10">
          <IconCheck class="size-4 text-emerald-600" />
        </div>
        <div>
          <div class="text-[10px] text-muted-foreground leading-tight">Closed</div>
          <div class="text-lg font-bold tabular-nums leading-tight">{{ stats.closedWon }}</div>
        </div>
      </div>
      <div class="flex items-center gap-2.5 rounded-md border bg-card px-3 py-2 min-w-[110px]">
        <div class="flex size-8 items-center justify-center rounded-md bg-cyan-500/10">
          <IconUserPlus class="size-4 text-cyan-600" />
        </div>
        <div>
          <div class="text-[10px] text-muted-foreground leading-tight">Converted</div>
          <div class="text-lg font-bold tabular-nums leading-tight">{{ stats.converted }}</div>
        </div>
      </div>
    </div>
    
    <!-- Filters -->
    <div class="flex items-center gap-3 border-b px-6 py-2">
      <div class="relative flex-1 max-w-xs">
        <IconSearch class="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input 
          v-model="globalFilter"
          placeholder="Search leads..." 
          class="pl-8 h-8 text-sm"
        />
      </div>
      
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1.5">
          <Label class="text-[11px] text-muted-foreground whitespace-nowrap">Service:</Label>
          <Select v-model="serviceFilter">
            <SelectTrigger class="w-[90px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
              <SelectItem value="tax">Tax</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div class="flex items-center gap-1.5">
          <Label class="text-[11px] text-muted-foreground whitespace-nowrap">Stage:</Label>
          <Select v-model="stageFilter">
            <SelectTrigger class="w-[110px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Qualified">Qualified</SelectItem>
              <SelectItem value="Proposal">Proposal</SelectItem>
              <SelectItem value="Negotiation">Negotiation</SelectItem>
              <SelectItem value="Closed Won">Closed Won</SelectItem>
              <SelectItem value="Closed Lost">Closed Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div class="flex items-center gap-1.5">
          <Label class="text-[11px] text-muted-foreground whitespace-nowrap">Status:</Label>
          <Select v-model="statusFilter">
            <SelectTrigger class="w-[90px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Converted">Converted</SelectItem>
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
        <Button variant="ghost" size="sm" class="h-7 text-xs">Send Email</Button>
        <Button variant="ghost" size="sm" class="h-7 text-xs text-destructive hover:text-destructive">Delete</Button>
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
                @click="navigateToLead(row.original.id)"
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
                  <IconUsers class="size-8 text-muted-foreground/50" />
                  <p class="text-sm text-muted-foreground">No leads found</p>
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
        Showing {{ table.getRowModel().rows.length }} of {{ filteredData.length }} leads
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
