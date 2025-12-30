<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  IconArrowLeft,
  IconBriefcase,
  IconBuilding,
  IconCalendar,
  IconCheck,
  IconChevronDown,
  IconClock,
  IconCoin,
  IconCurrencyDirham,
  IconEdit,
  IconFile,
  IconFileDescription,
  IconFolder,
  IconInfoCircle,
  IconMail,
  IconPhone,
  IconPlus,
  IconSettings,
  IconSubtask,
  IconUser,
  IconUsers,
  IconX,
} from '@tabler/icons-vue'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const route = useRoute()
const router = useRouter()

const statuses = ['Open', 'In Progress', 'On Hold', 'Closed', 'Archived']

const matter = ref({
  id: route.params.id as string,
  matterId: 'MAT-2025-001',
  title: 'Employment Contracts - Al Fahad Construction',
  description: 'Preparation of 25 employment contracts for new project team',
  
  // Matter Info
  matterType: 'Employment Matters',
  serviceType: 'Legal',
  billingMethod: 'Hourly',
  currency: 'AED',
  coiRequired: false,
  
  // Status
  status: 'Open',
  priority: 'High',
  
  // Client
  client: 'Al Fahad Construction LLC',
  clientType: 'Corporate',
  clientId: '1',
  clientEmail: 'legal@alfahadconstruction.ae',
  clientPhone: '+971-4-555-1001',
  
  // Team
  primaryAttorney: null as string | null,
  teamMembers: 1,
  
  // Billing / Stats
  timeLogged: '0h',
  billedAmount: 0,
  documentsCount: 0,
  activeTasks: 81,
  
  // Dates
  openDate: '10 Oct, 2025',
  lastActivity: 'Dec 28, 2025',
})

const subMatters = ref([
  { 
    id: '1', 
    title: 'Employment Contract', 
    billingType: 'Flat Fee',
    amount: 2500,
    status: 'active'
  },
])

const activities = ref([
  { id: '1', type: 'system', title: 'Matter created', date: '10 Oct, 2025' },
])

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
const goBack = () => router.push('/matters')
const changeStatus = (status: string) => { matter.value.status = status }

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Open': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    case 'In Progress': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    case 'On Hold': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    case 'Closed': return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    case 'Archived': return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  }
}
</script>

<template>
  <div class="h-full overflow-auto bg-muted/30">
    <!-- Header -->
    <header class="sticky top-0 z-10 h-14 px-6 flex items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="flex items-center gap-4">
        <button @click="goBack" class="text-muted-foreground hover:text-foreground transition-colors">
          <IconArrowLeft class="size-4" stroke-width="1.5" />
        </button>
        <div>
          <h1 class="text-sm font-semibold">{{ matter.title }}</h1>
          <p class="text-xs text-muted-foreground font-mono">{{ matter.matterId }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" size="sm" class="h-8 gap-2">
              <span :class="getStatusClass(matter.status)" class="size-2 rounded-full"></span>
              {{ matter.status }}
              <IconChevronDown class="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              v-for="status in statuses" 
              :key="status" 
              @click="changeStatus(status)"
              class="gap-2"
            >
              <span :class="getStatusClass(status)" class="size-2 rounded-full"></span>
              {{ status }}
              <IconCheck v-if="matter.status === status" class="size-3.5 ml-auto" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="sm" class="h-8 gap-1.5">
          <IconEdit class="size-3.5" />
          Edit
        </Button>
      </div>
    </header>

    <!-- Content -->
    <div class="p-6">
      <div class="grid grid-cols-12 gap-4">
        
        <!-- Left Column - Main Content (8 cols) -->
        <div class="col-span-12 lg:col-span-8 space-y-6">
          
          <!-- Billing Overview Card -->
          <Card>
            <CardHeader class="pb-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="flex size-8 items-center justify-center rounded-md bg-blue-500/10">
                    <IconCoin class="size-4 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle class="text-sm font-semibold">Billing Overview</CardTitle>
                    <CardDescription class="text-xs">Employee rates and billing configuration</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" class="text-xs">Default</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div class="flex flex-col items-center py-8 text-center">
                <div class="flex size-12 items-center justify-center rounded-full bg-blue-500/10 mb-4">
                  <IconInfoCircle class="size-6 text-blue-500" />
                </div>
                <p class="text-sm font-medium">Default Billing Rates</p>
                <p class="text-xs text-muted-foreground mt-1.5 max-w-xs">This matter uses default employee rates from the HRC system.</p>
                <Button variant="default" size="sm" class="mt-5 gap-2.5">
                  <IconEdit class="size-3.5" />
                  Customize Rates
                </Button>
              </div>
            </CardContent>
          </Card>

          <!-- Matter & Client Info Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <!-- Matter Information Card -->
            <Card>
              <CardHeader class="pb-4">
                <div class="flex items-center gap-2">
                  <div class="flex size-8 items-center justify-center rounded-md bg-emerald-500/10">
                    <IconFolder class="size-4 text-emerald-500" />
                  </div>
                  <div>
                    <CardTitle class="text-sm font-semibold">Matter Information</CardTitle>
                    <CardDescription class="text-xs">Core details and configuration</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent class="space-y-4">
                <!-- Info Grid -->
                <div class="grid grid-cols-2 gap-3">
                  <div class="rounded-lg border bg-muted/30 p-3">
                    <p class="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Matter Type</p>
                    <p class="text-sm font-medium">{{ matter.matterType }}</p>
                  </div>
                  <div class="rounded-lg border bg-muted/30 p-3">
                    <p class="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Service Type</p>
                    <p class="text-sm font-medium">{{ matter.serviceType }}</p>
                  </div>
                  <div class="rounded-lg border bg-muted/30 p-3">
                    <div class="flex items-center gap-1.5 mb-1">
                      <IconClock class="size-3 text-muted-foreground" />
                      <p class="text-[10px] text-muted-foreground uppercase tracking-wider">Billing Method</p>
                    </div>
                    <p class="text-sm font-medium">{{ matter.billingMethod }}</p>
                  </div>
                  <div class="rounded-lg border bg-muted/30 p-3">
                    <p class="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Currency</p>
                    <p class="text-sm font-medium">{{ matter.currency }}</p>
                  </div>
                  <div class="rounded-lg border bg-muted/30 p-3">
                    <p class="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">COI Required</p>
                    <Badge 
                      :variant="matter.coiRequired ? 'default' : 'secondary'" 
                      class="text-xs"
                    >
                      {{ matter.coiRequired ? 'Yes' : 'No' }}
                    </Badge>
                  </div>
                  <div class="rounded-lg border bg-muted/30 p-3">
                    <div class="flex items-center gap-1.5 mb-1">
                      <IconFile class="size-3 text-muted-foreground" />
                      <p class="text-[10px] text-muted-foreground uppercase tracking-wider">Documents</p>
                    </div>
                    <p class="text-sm font-medium">{{ matter.documentsCount }} files</p>
                  </div>
                </div>
                
                <!-- Description -->
                <div class="pt-2 border-t">
                  <p class="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Description</p>
                  <p class="text-sm text-muted-foreground">{{ matter.description }}</p>
                </div>
              </CardContent>
            </Card>

            <!-- Client Information Card -->
            <Card>
              <CardHeader class="pb-4">
                <div class="flex items-center gap-2">
                  <div class="flex size-8 items-center justify-center rounded-md bg-cyan-500/10">
                    <IconBuilding class="size-4 text-cyan-500" />
                  </div>
                  <div>
                    <CardTitle class="text-sm font-semibold">Client Information</CardTitle>
                    <CardDescription class="text-xs">Contact details and billing address</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent class="space-y-4">
                <!-- Client Identity -->
                <div class="flex items-center gap-3">
                  <Avatar class="size-10">
                    <AvatarFallback class="bg-cyan-500/10 text-cyan-600 text-sm">
                      {{ getInitials(matter.client) }}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p class="text-sm font-medium">{{ matter.client }}</p>
                    <Badge variant="secondary" class="text-xs mt-0.5">{{ matter.clientType }}</Badge>
                  </div>
                </div>
                
                <!-- Contact Details -->
                <div class="space-y-2 pt-2">
                  <RouterLink 
                    :to="`/clients/${matter.clientId}`"
                    class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <IconMail class="size-4" />
                    {{ matter.clientEmail }}
                  </RouterLink>
                  <a 
                    :href="`tel:${matter.clientPhone}`"
                    class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <IconPhone class="size-4" />
                    {{ matter.clientPhone }}
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Sub-Matters Card -->
          <Card>
            <CardHeader class="pb-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="flex size-8 items-center justify-center rounded-md bg-purple-500/10">
                    <IconSubtask class="size-4 text-purple-500" />
                  </div>
                  <div>
                    <CardTitle class="text-sm font-semibold">Sub-Matters</CardTitle>
                    <CardDescription class="text-xs">{{ subMatters.length }} configured sub-matters</CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm" class="h-8 gap-1.5">
                  <IconPlus class="size-3.5" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div class="space-y-2">
                <div 
                  v-for="sub in subMatters" 
                  :key="sub.id"
                  class="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div>
                    <p class="text-sm font-medium">{{ sub.title }}</p>
                    <p class="text-lg font-semibold text-primary tabular-nums mt-1">
                      AED {{ sub.amount.toLocaleString() }}.00 
                      <span class="text-xs text-muted-foreground font-normal">Total</span>
                    </p>
                  </div>
                  <Badge variant="default" class="text-xs">
                    $ {{ sub.billingType }}
                  </Badge>
                </div>
                
                <!-- Empty state if no sub-matters -->
                <div 
                  v-if="subMatters.length === 0"
                  class="flex flex-col items-center py-8 text-center"
                >
                  <IconSubtask class="size-8 text-muted-foreground/50 mb-2" />
                  <p class="text-sm text-muted-foreground">No sub-matters configured</p>
                  <Button variant="outline" size="sm" class="mt-3 gap-1.5">
                    <IconPlus class="size-3.5" />
                    Add Sub-Matter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Right Column - Sidebar (4 cols) -->
        <div class="col-span-12 lg:col-span-4 space-y-6">
          
          <!-- Team Assignment Card -->
          <Card>
            <CardHeader class="pb-3">
              <div class="flex items-center gap-2">
                <div class="flex size-8 items-center justify-center rounded-md bg-amber-500/10">
                  <IconUsers class="size-4 text-amber-500" />
                </div>
                <div>
                  <CardTitle class="text-sm font-semibold">Team Assignment</CardTitle>
                  <CardDescription class="text-xs">{{ matter.teamMembers }} team members</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div class="rounded-lg border bg-muted/30 p-3">
                <div class="flex items-center gap-3">
                  <Avatar class="size-9">
                    <AvatarFallback class="bg-amber-500/20 text-amber-600 text-xs">
                      {{ matter.primaryAttorney ? getInitials(matter.primaryAttorney) : 'U' }}
                    </AvatarFallback>
                  </Avatar>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium">{{ matter.primaryAttorney || 'Unknown' }}</p>
                    <p class="text-xs text-muted-foreground">Primary Attorney</p>
                  </div>
                  <Badge variant="outline" class="text-[10px] shrink-0">ASSIGNED</Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" class="w-full mt-3 gap-1.5">
                <IconPlus class="size-3.5" />
                Add Team Member
              </Button>
            </CardContent>
          </Card>

          <!-- Quick Stats Card -->
          <Card>
            <CardHeader class="pb-3">
              <div class="flex items-center gap-2">
                <div class="flex size-8 items-center justify-center rounded-md bg-slate-500/10">
                  <IconBriefcase class="size-4 text-slate-500" />
                </div>
                <div>
                  <CardTitle class="text-sm font-semibold">Quick Stats</CardTitle>
                  <CardDescription class="text-xs">Matter activity overview</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-2 gap-2">
                <div class="rounded-lg border bg-muted/30 p-3 text-center">
                  <div class="flex items-center justify-center size-8 rounded-full bg-blue-500/10 mx-auto mb-2">
                    <IconClock class="size-4 text-blue-500" />
                  </div>
                  <p class="text-lg font-bold tabular-nums">{{ matter.timeLogged }}</p>
                  <p class="text-[10px] text-muted-foreground uppercase">Time Logged</p>
                </div>
                <div class="rounded-lg border bg-muted/30 p-3 text-center">
                  <div class="flex items-center justify-center size-8 rounded-full bg-emerald-500/10 mx-auto mb-2">
                    <IconCurrencyDirham class="size-4 text-emerald-500" />
                  </div>
                  <p class="text-lg font-bold tabular-nums">{{ matter.billedAmount.toFixed(2) }}</p>
                  <p class="text-[10px] text-muted-foreground uppercase">AED Billed</p>
                </div>
                <div class="rounded-lg border bg-muted/30 p-3 text-center">
                  <div class="flex items-center justify-center size-8 rounded-full bg-purple-500/10 mx-auto mb-2">
                    <IconFileDescription class="size-4 text-purple-500" />
                  </div>
                  <p class="text-lg font-bold tabular-nums">{{ matter.documentsCount }}</p>
                  <p class="text-[10px] text-muted-foreground uppercase">Documents</p>
                </div>
                <div class="rounded-lg border bg-muted/30 p-3 text-center">
                  <div class="flex items-center justify-center size-8 rounded-full bg-amber-500/10 mx-auto mb-2">
                    <IconSubtask class="size-4 text-amber-500" />
                  </div>
                  <p class="text-lg font-bold tabular-nums">{{ matter.activeTasks }}</p>
                  <p class="text-[10px] text-muted-foreground uppercase">Tasks Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Recent Activity Card -->
          <Card>
            <CardHeader class="pb-3">
              <div class="flex items-center gap-2">
                <div class="flex size-8 items-center justify-center rounded-md bg-cyan-500/10">
                  <IconClock class="size-4 text-cyan-500" />
                </div>
                <div>
                  <CardTitle class="text-sm font-semibold">Recent Activity</CardTitle>
                  <CardDescription class="text-xs">Latest updates and changes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div class="space-y-3">
                <!-- Activity Items -->
                <div 
                  v-for="activity in activities" 
                  :key="activity.id"
                  class="flex items-start gap-3"
                >
                  <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10 mt-0.5">
                    <IconFolder class="size-4 text-blue-500" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium">{{ activity.title }}</p>
                    <p class="text-xs text-muted-foreground">{{ activity.date }}</p>
                  </div>
                </div>

                <!-- No recent time entries -->
                <div class="flex items-start gap-3 opacity-50">
                  <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted mt-0.5">
                    <IconX class="size-4 text-muted-foreground" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm text-muted-foreground italic">No recent time entries</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
