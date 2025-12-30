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
  IconBriefcase,
  IconBuilding,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconEdit,
  IconExternalLink,
  IconLayoutGrid,
  IconLayoutList,
  IconMail,
  IconPhone,
  IconPlus,
  IconSearch,
  IconTrash,
  IconTrendingUp,
  IconUserPlus,
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

// Client Schema
const clientSchema = z.object({
  id: z.string(),
  name: z.string(),
  company: z.string(),
  email: z.string(),
  phone: z.string(),
  type: z.enum(['Individual', 'Corporate', 'Government', 'Non-Profit']),
  industry: z.string(),
  status: z.enum(['Active', 'Inactive', 'Pending', 'Archived']),
  openMatters: z.number(),
  totalBilled: z.number(),
  created: z.string(),
})

type Client = z.infer<typeof clientSchema>

const router = useRouter()

const navigateToClient = (clientId: string) => {
  router.push(`/clients/${clientId}`)
}

// Sample Data
const clientsData = ref<Client[]>([
  {
    id: '1',
    name: 'Khalid Al-Mazrouei',
    company: 'Skyline Ventures DMCC',
    email: 'k.almazrouei@skylineventures.ae',
    phone: '+971 4 123 4567',
    type: 'Corporate',
    industry: 'Investment & Finance',
    status: 'Active',
    openMatters: 3,
    totalBilled: 125000,
    created: 'Mar 15, 2024',
  },
  {
    id: '2',
    name: 'Sarah Ahmed',
    company: 'Ahmed Holdings LLC',
    email: 's.ahmed@ahmedholdings.ae',
    phone: '+971 4 234 5678',
    type: 'Corporate',
    industry: 'Real Estate',
    status: 'Active',
    openMatters: 2,
    totalBilled: 89500,
    created: 'Apr 22, 2024',
  },
  {
    id: '3',
    name: 'Mohammed Al-Rashid',
    company: 'Al-Rashid Group',
    email: 'm.rashid@alrashidgroup.ae',
    phone: '+971 4 345 6789',
    type: 'Corporate',
    industry: 'Manufacturing',
    status: 'Active',
    openMatters: 5,
    totalBilled: 210000,
    created: 'Feb 10, 2024',
  },
  {
    id: '4',
    name: 'Fatima Hassan',
    company: 'Hassan Consulting',
    email: 'f.hassan@hassanconsult.ae',
    phone: '+971 4 456 7890',
    type: 'Corporate',
    industry: 'Consulting',
    status: 'Active',
    openMatters: 1,
    totalBilled: 45000,
    created: 'Jun 5, 2024',
  },
  {
    id: '5',
    name: 'Omar Khalil',
    company: '',
    email: 'o.khalil@gmail.com',
    phone: '+971 50 123 4567',
    type: 'Individual',
    industry: 'Personal',
    status: 'Active',
    openMatters: 2,
    totalBilled: 32000,
    created: 'Jul 18, 2024',
  },
  {
    id: '6',
    name: 'Dubai Municipal Authority',
    company: 'Dubai Municipality',
    email: 'legal@dm.gov.ae',
    phone: '+971 4 567 8901',
    type: 'Government',
    industry: 'Government Services',
    status: 'Active',
    openMatters: 4,
    totalBilled: 175000,
    created: 'Jan 8, 2024',
  },
  {
    id: '7',
    name: 'Layla Ibrahim',
    company: 'Ibrahim Tech Solutions',
    email: 'l.ibrahim@ibrahimtech.ae',
    phone: '+971 4 678 9012',
    type: 'Corporate',
    industry: 'Technology',
    status: 'Pending',
    openMatters: 0,
    totalBilled: 0,
    created: 'Nov 25, 2024',
  },
  {
    id: '8',
    name: 'Emirates Foundation',
    company: 'Emirates Foundation',
    email: 'legal@emiratesfoundation.ae',
    phone: '+971 4 789 0123',
    type: 'Non-Profit',
    industry: 'Charitable Organization',
    status: 'Active',
    openMatters: 1,
    totalBilled: 28000,
    created: 'May 12, 2024',
  },
  {
    id: '9',
    name: 'Ahmed Al-Suwaidi',
    company: 'Al-Suwaidi Enterprises',
    email: 'a.suwaidi@suwaidi.ae',
    phone: '+971 4 890 1234',
    type: 'Corporate',
    industry: 'Import/Export',
    status: 'Inactive',
    openMatters: 0,
    totalBilled: 67500,
    created: 'Aug 30, 2023',
  },
  {
    id: '10',
    name: 'Mariam Nasser',
    company: '',
    email: 'm.nasser@outlook.com',
    phone: '+971 55 234 5678',
    type: 'Individual',
    industry: 'Personal',
    status: 'Active',
    openMatters: 1,
    totalBilled: 15000,
    created: 'Oct 3, 2024',
  },
  {
    id: '11',
    name: 'Gulf Medical Center',
    company: 'Gulf Medical Center LLC',
    email: 'admin@gulfmedical.ae',
    phone: '+971 4 901 2345',
    type: 'Corporate',
    industry: 'Healthcare',
    status: 'Active',
    openMatters: 2,
    totalBilled: 95000,
    created: 'Sep 14, 2024',
  },
  {
    id: '12',
    name: 'Rashid Trading Co.',
    company: 'Rashid Trading Co.',
    email: 'info@rashidtrading.ae',
    phone: '+971 4 012 3456',
    type: 'Corporate',
    industry: 'Retail & Trading',
    status: 'Archived',
    openMatters: 0,
    totalBilled: 52000,
    created: 'Dec 20, 2022',
  },
])

// Stats
const stats = computed(() => ({
  total: clientsData.value.length,
  active: clientsData.value.filter(c => c.status === 'Active').length,
  corporate: clientsData.value.filter(c => c.type === 'Corporate').length,
  individual: clientsData.value.filter(c => c.type === 'Individual').length,
  totalBilled: clientsData.value.reduce((sum, c) => sum + c.totalBilled, 0),
  openMatters: clientsData.value.reduce((sum, c) => sum + c.openMatters, 0),
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
const industryFilter = ref('all')

// Helper functions
const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getStatusDotClass = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-emerald-500'
    case 'Pending': return 'bg-amber-500'
    case 'Inactive': return 'bg-slate-400'
    case 'Archived': return 'bg-slate-300'
    default: return 'bg-slate-400'
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Corporate': return IconBuilding
    case 'Individual': return IconUsers
    case 'Government': return IconBriefcase
    case 'Non-Profit': return IconUsers
    default: return IconUsers
  }
}

// Active filters count
const activeFiltersCount = computed(() => {
  let count = 0
  if (typeFilter.value !== 'all') count++
  if (statusFilter.value !== 'all') count++
  if (industryFilter.value !== 'all') count++
  return count
})

// Clear all filters
const clearFilters = () => {
  typeFilter.value = 'all'
  statusFilter.value = 'all'
  industryFilter.value = 'all'
  globalFilter.value = ''
}

// Unique industries for filter
const uniqueIndustries = computed(() => {
  return [...new Set(clientsData.value.map(c => c.industry))].sort()
})

// Columns definition
const columns: ColumnDef<Client>[] = [
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
        'Client',
        column.getIsSorted() === "asc" 
          ? h(IconChevronUp, { class: "ml-1 size-4" })
          : column.getIsSorted() === "desc"
            ? h(IconChevronDown, { class: "ml-1 size-4" })
            : null
      ])
    },
    cell: ({ row }) => {
      const company = row.original.company
      return h('div', { class: 'flex items-center gap-2.5' }, [
        h(Avatar, { class: 'size-8' }, {
          default: () => h(AvatarFallback, { class: 'bg-primary/10 text-primary text-[10px] font-semibold' }, 
            () => getInitials(row.getValue('name') as string))
        }),
        h('div', { class: 'flex flex-col' }, [
          h('span', { class: 'font-medium text-sm text-foreground leading-tight' }, row.getValue('name')),
          h('span', { class: 'text-[11px] text-muted-foreground leading-tight' }, company || row.original.type),
        ])
      ])
    },
  },
  {
    accessorKey: "email",
    header: "Contact",
    cell: ({ row }) => h('div', { class: 'flex flex-col' }, [
      h('span', { class: 'text-xs text-muted-foreground' }, row.getValue('email')),
      h('span', { class: 'text-[11px] text-muted-foreground' }, row.original.phone),
    ]),
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
      const Icon = getTypeIcon(type)
      return h('div', { class: 'flex items-center gap-1.5' }, [
        h(Icon, { class: 'size-3.5 text-muted-foreground' }),
        h('span', { class: 'text-xs' }, type),
      ])
    },
  },
  {
    accessorKey: "industry",
    header: "Industry",
    cell: ({ row }) => h('span', { class: 'text-xs text-muted-foreground' }, row.getValue('industry')),
  },
  {
    accessorKey: "openMatters",
    header: ({ column }) => {
      return h(Button, {
        variant: "ghost",
        class: "-ml-4 font-medium",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }, () => [
        'Matters',
        column.getIsSorted() === "asc" 
          ? h(IconChevronUp, { class: "ml-1 size-3.5" })
          : column.getIsSorted() === "desc"
            ? h(IconChevronDown, { class: "ml-1 size-3.5" })
            : null
      ])
    },
    cell: ({ row }) => {
      const matters = row.getValue('openMatters') as number
      return h('span', { 
        class: `text-xs font-mono tabular-nums ${matters > 0 ? 'text-foreground' : 'text-muted-foreground'}` 
      }, matters)
    },
  },
  {
    accessorKey: "totalBilled",
    header: ({ column }) => {
      return h(Button, {
        variant: "ghost",
        class: "-ml-4 font-medium",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }, () => [
        'Billed',
        column.getIsSorted() === "asc" 
          ? h(IconChevronUp, { class: "ml-1 size-3.5" })
          : column.getIsSorted() === "desc"
            ? h(IconChevronDown, { class: "ml-1 size-3.5" })
            : null
      ])
    },
    cell: ({ row }) => {
      const billed = row.getValue('totalBilled') as number
      return h('span', { class: 'text-xs font-mono tabular-nums text-muted-foreground' }, 
        `AED ${billed.toLocaleString()}`)
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
            h(DropdownMenuItem, { class: 'gap-2' }, () => [
              h(IconPhone, { class: 'size-4' }),
              'Call'
            ]),
            h(DropdownMenuSeparator),
            h(DropdownMenuItem, { class: 'gap-2 text-destructive focus:text-destructive' }, () => [
              h(IconTrash, { class: 'size-4' }),
              'Archive'
            ]),
          ]
        })
      ]
    }),
  },
]

// Filtered data
const filteredData = computed(() => {
  return clientsData.value.filter(client => {
    if (typeFilter.value !== 'all' && client.type !== typeFilter.value) return false
    if (statusFilter.value !== 'all' && client.status !== statusFilter.value) return false
    if (industryFilter.value !== 'all' && client.industry !== industryFilter.value) return false
    if (globalFilter.value) {
      const search = globalFilter.value.toLowerCase()
      return client.name.toLowerCase().includes(search) || 
             client.email.toLowerCase().includes(search) ||
             client.company.toLowerCase().includes(search)
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
          <IconBriefcase class="size-4 text-primary" />
        </div>
        <div>
          <h1 class="text-base font-semibold leading-tight">Clients</h1>
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
          Add Client
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
        <div class="flex size-8 items-center justify-center rounded-md bg-blue-500/10">
          <IconBuilding class="size-4 text-blue-600" />
        </div>
        <div>
          <div class="text-[10px] text-muted-foreground leading-tight">Corporate</div>
          <div class="text-lg font-bold tabular-nums leading-tight">{{ stats.corporate }}</div>
        </div>
      </div>
      <div class="flex items-center gap-2.5 rounded-md border bg-card px-3 py-2 min-w-[110px]">
        <div class="flex size-8 items-center justify-center rounded-md bg-purple-500/10">
          <IconUsers class="size-4 text-purple-600" />
        </div>
        <div>
          <div class="text-[10px] text-muted-foreground leading-tight">Individual</div>
          <div class="text-lg font-bold tabular-nums leading-tight">{{ stats.individual }}</div>
        </div>
      </div>
      <div class="flex items-center gap-2.5 rounded-md border bg-card px-3 py-2 min-w-[110px]">
        <div class="flex size-8 items-center justify-center rounded-md bg-amber-500/10">
          <IconBriefcase class="size-4 text-amber-600" />
        </div>
        <div>
          <div class="text-[10px] text-muted-foreground leading-tight">Matters</div>
          <div class="text-lg font-bold tabular-nums leading-tight">{{ stats.openMatters }}</div>
        </div>
      </div>
      <div class="flex items-center gap-2.5 rounded-md border bg-card px-3 py-2 min-w-[130px]">
        <div class="flex size-8 items-center justify-center rounded-md bg-cyan-500/10">
          <IconTrendingUp class="size-4 text-cyan-600" />
        </div>
        <div>
          <div class="text-[10px] text-muted-foreground leading-tight">Total Billed</div>
          <div class="text-base font-bold tabular-nums leading-tight">{{ (stats.totalBilled / 1000).toFixed(0) }}K</div>
        </div>
      </div>
    </div>
    
    <!-- Filters -->
    <div class="flex items-center gap-3 border-b px-6 py-2">
      <div class="relative flex-1 max-w-xs">
        <IconSearch class="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input 
          v-model="globalFilter"
          placeholder="Search clients..." 
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
              <SelectItem value="Corporate">Corporate</SelectItem>
              <SelectItem value="Individual">Individual</SelectItem>
              <SelectItem value="Government">Government</SelectItem>
              <SelectItem value="Non-Profit">Non-Profit</SelectItem>
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
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div class="flex items-center gap-1.5">
          <Label class="text-[11px] text-muted-foreground whitespace-nowrap">Industry:</Label>
          <Select v-model="industryFilter">
            <SelectTrigger class="w-[130px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem v-for="industry in uniqueIndustries" :key="industry" :value="industry">
                {{ industry }}
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
        <Button variant="ghost" size="sm" class="h-7 text-xs">Send Email</Button>
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
                @click="navigateToClient(row.original.id)"
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
                  <IconBriefcase class="size-8 text-muted-foreground/50" />
                  <p class="text-sm text-muted-foreground">No clients found</p>
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
        Showing {{ table.getRowModel().rows.length }} of {{ filteredData.length }} clients
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
