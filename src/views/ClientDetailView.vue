<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  IconArrowLeft,
  IconMail,
  IconPhone,
  IconChevronDown,
  IconCheck,
  IconPlus,
  IconBuilding,
  IconBriefcase,
} from '@tabler/icons-vue'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const route = useRoute()
const router = useRouter()

const statuses = ['Active', 'Inactive', 'Pending', 'Archived']

const client = ref({
  id: route.params.id as string,
  name: 'Khalid Al-Mazrouei',
  company: 'Skyline Ventures DMCC',
  email: 'k.almazrouei@skylineventures.ae',
  phone: '+971 4 123 4567',
  status: 'Active',
  position: 'Managing Director',
  type: 'Corporate',
  industry: 'Investment & Finance',
  address: 'DMCC Business Centre, JLT, Dubai, UAE',
  website: 'www.skylineventures.ae',
  taxId: 'TRN-100234567890003',
  
  // Financial summary
  totalBilled: 125000,
  outstandingBalance: 15000,
  openMatters: 3,
  closedMatters: 8,
  
  // Key dates
  created: 'Mar 15, 2024',
  lastActivity: 'Dec 28, 2025',
  nextBillingDate: 'Jan 15, 2026',
})

const matters = ref([
  { id: '1', title: 'Corporate Restructuring Advisory', type: 'Advisory', status: 'Active', value: 45000 },
  { id: '2', title: 'Employment Contract Review', type: 'Legal Review', status: 'Active', value: 12000 },
  { id: '3', title: 'Annual Tax Filing 2025', type: 'Tax', status: 'Active', value: 8500 },
])

const activities = ref([
  { id: '1', type: 'invoice', primary: true, title: 'Invoice #INV-2025-0892 sent', meta: 'AED 15,000', date: 'Dec 28' },
  { id: '2', type: 'matter', primary: true, title: 'New matter opened: Employment Contract Review', meta: 'Sarah Ahmed', date: 'Dec 22' },
  { id: '3', type: 'note', primary: false, title: 'Client prefers quarterly billing schedule', meta: 'Ahmed Hassan', date: 'Dec 18' },
  { id: '4', type: 'payment', primary: true, title: 'Payment received', meta: 'AED 45,000', date: 'Dec 10' },
  { id: '5', type: 'system', primary: false, title: 'Client profile updated', meta: 'System', date: 'Nov 25' },
])

const newNote = ref('')
const activeTab = ref<'activity' | 'matters' | 'notes'>('activity')

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
const goBack = () => router.push('/clients')
const changeStatus = (status: string) => { client.value.status = status }

const addNote = () => {
  if (newNote.value.trim()) {
    activities.value.unshift({ id: String(Date.now()), type: 'note', primary: false, title: newNote.value, meta: 'You', date: 'Now' })
    newNote.value = ''
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Active': return 'text-emerald-600'
    case 'Pending': return 'text-amber-600'
    case 'Inactive': return 'text-slate-500'
    case 'Archived': return 'text-slate-400'
    default: return 'text-slate-500'
  }
}

const getMatterStatusDot = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-emerald-500'
    case 'Pending': return 'bg-amber-500'
    case 'Closed': return 'bg-slate-400'
    default: return 'bg-slate-400'
  }
}
</script>

<template>
  <div class="h-full overflow-hidden bg-background flex flex-col">
    
    <!-- TOP BAR -->
    <header class="h-12 px-6 flex items-center justify-between border-b border-border/40">
      <button @click="goBack" class="text-muted-foreground hover:text-foreground transition-colors">
        <IconArrowLeft class="size-4" stroke-width="1.5" />
      </button>
      <div class="flex items-center gap-1">
        <button class="size-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <IconMail class="size-4" stroke-width="1.5" />
        </button>
        <button class="size-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <IconPhone class="size-4" stroke-width="1.5" />
        </button>
      </div>
    </header>

    <!-- HERO SECTION -->
    <section class="px-8 pt-10 pb-8 border-b border-border/40">
      <div class="flex items-start justify-between">
        <!-- Left: Identity + Key Metrics -->
        <div class="flex gap-5">
          <Avatar class="size-14 shrink-0">
            <AvatarFallback class="text-base font-normal bg-muted/60 text-muted-foreground">
              {{ getInitials(client.name) }}
            </AvatarFallback>
          </Avatar>
          
          <div class="space-y-6">
            <!-- Primary: Name -->
            <div>
              <h1 class="text-2xl font-medium tracking-tight text-foreground">{{ client.name }}</h1>
              <div class="flex items-center gap-2 mt-1">
                <p class="text-sm text-muted-foreground">{{ client.position }}</p>
                <span class="text-muted-foreground/40">·</span>
                <p class="text-sm text-muted-foreground">{{ client.company }}</p>
              </div>
            </div>
            
            <!-- Secondary: Key financial data -->
            <div class="flex items-baseline gap-12 text-sm">
              <div class="space-y-1">
                <p class="text-xs text-muted-foreground">Total Billed</p>
                <p class="font-medium tabular-nums">AED {{ client.totalBilled.toLocaleString() }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-xs text-muted-foreground">Outstanding</p>
                <p class="font-medium tabular-nums" :class="client.outstandingBalance > 0 ? 'text-amber-600' : ''">
                  AED {{ client.outstandingBalance.toLocaleString() }}
                </p>
              </div>
              <div class="space-y-1">
                <p class="text-xs text-muted-foreground">Open Matters</p>
                <p class="font-medium tabular-nums">{{ client.openMatters }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Status -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <button class="flex items-center gap-2 text-sm hover:text-muted-foreground transition-colors">
              <span class="font-medium" :class="getStatusClass(client.status)">{{ client.status }}</span>
              <IconChevronDown class="size-3.5 text-muted-foreground" stroke-width="1.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-32">
            <DropdownMenuItem 
              v-for="status in statuses" 
              :key="status" 
              @click="changeStatus(status)"
              class="text-sm justify-between"
            >
              {{ status }}
              <IconCheck v-if="client.status === status" class="size-3.5" stroke-width="1.5" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <!-- Type indicator -->
      <div class="flex items-center gap-8 mt-8 ml-[76px] text-xs">
        <span class="flex items-center gap-1.5">
          <IconBuilding class="size-3.5 text-muted-foreground" stroke-width="1.5" />
          <span class="text-muted-foreground">{{ client.type }}</span>
        </span>
        <span class="text-muted-foreground">{{ client.industry }}</span>
      </div>
    </section>

    <!-- MAIN CONTENT -->
    <div class="flex-1 overflow-hidden flex">
      
      <!-- LEFT COLUMN - Activity/Matters Stream -->
      <main class="flex-1 overflow-auto">
        <div class="p-6">
          <!-- Tabs -->
          <div class="flex items-center gap-6 mb-6">
            <button 
              @click="activeTab = 'activity'"
              class="text-sm pb-1 border-b transition-colors"
              :class="activeTab === 'activity' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'"
            >
              Activity
            </button>
            <button 
              @click="activeTab = 'matters'"
              class="text-sm pb-1 border-b transition-colors"
              :class="activeTab === 'matters' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'"
            >
              Matters ({{ client.openMatters }})
            </button>
            <button 
              @click="activeTab = 'notes'"
              class="text-sm pb-1 border-b transition-colors"
              :class="activeTab === 'notes' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'"
            >
              Notes
            </button>
            
            <button class="ml-auto text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
              <IconPlus class="size-3.5" stroke-width="1.5" />
              <span>Log</span>
            </button>
          </div>

          <!-- Activity List -->
          <div v-if="activeTab === 'activity'" class="space-y-1">
            <div 
              v-for="activity in activities" 
              :key="activity.id"
              class="py-3 flex items-baseline justify-between gap-4"
              :class="activity.primary ? '' : 'opacity-50'"
            >
              <div class="min-w-0">
                <p 
                  class="text-sm truncate"
                  :class="activity.primary ? 'text-foreground' : 'text-muted-foreground'"
                >
                  {{ activity.title }}
                </p>
                <p class="text-xs text-muted-foreground mt-0.5">{{ activity.meta }}</p>
              </div>
              <time class="text-xs text-muted-foreground shrink-0 tabular-nums">
                {{ activity.date }}
              </time>
            </div>
          </div>

          <!-- Matters List -->
          <div v-if="activeTab === 'matters'" class="space-y-2">
            <div 
              v-for="matter in matters" 
              :key="matter.id"
              class="py-3 px-3 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <p class="text-sm font-medium truncate text-foreground">{{ matter.title }}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-xs text-muted-foreground">{{ matter.type }}</span>
                    <span class="text-muted-foreground/40">·</span>
                    <div class="flex items-center gap-1">
                      <span :class="`size-1.5 rounded-full ${getMatterStatusDot(matter.status)}`"></span>
                      <span class="text-xs text-muted-foreground">{{ matter.status }}</span>
                    </div>
                  </div>
                </div>
                <span class="text-xs font-mono tabular-nums text-muted-foreground shrink-0">
                  AED {{ matter.value.toLocaleString() }}
                </span>
              </div>
            </div>
            
            <button class="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1.5 border border-dashed rounded-md mt-4">
              <IconPlus class="size-3.5" stroke-width="1.5" />
              <span>New Matter</span>
            </button>
          </div>

          <!-- Notes Tab -->
          <div v-if="activeTab === 'notes'" class="space-y-6">
            <div>
              <Textarea 
                v-model="newNote" 
                placeholder="Add a note..." 
                class="min-h-[80px] text-sm resize-none border-border/60 focus:border-border"
              />
              <div class="flex justify-end mt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  class="h-7 text-xs text-muted-foreground hover:text-foreground"
                  @click="addNote" 
                  :disabled="!newNote.trim()"
                >
                  Save
                </Button>
              </div>
            </div>
            
            <div class="space-y-4">
              <div 
                v-for="note in activities.filter(a => a.type === 'note')" 
                :key="note.id"
                class="py-3"
              >
                <p class="text-sm text-foreground">{{ note.title }}</p>
                <p class="text-xs text-muted-foreground mt-1">{{ note.meta }} · {{ note.date }}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- RIGHT COLUMN - Details Panel -->
      <aside class="w-72 border-l border-border/40 overflow-auto">
        <div class="p-6 space-y-6">
          
          <!-- Contact -->
          <div class="space-y-3">
            <a 
              :href="`mailto:${client.email}`" 
              class="block text-sm text-foreground hover:text-muted-foreground transition-colors truncate"
            >
              {{ client.email }}
            </a>
            <a 
              :href="`tel:${client.phone}`" 
              class="block text-sm text-foreground hover:text-muted-foreground transition-colors"
            >
              {{ client.phone }}
            </a>
            <a 
              v-if="client.website"
              :href="`https://${client.website}`"
              target="_blank" 
              class="block text-sm text-foreground hover:text-muted-foreground transition-colors"
            >
              {{ client.website }}
            </a>
          </div>

          <div class="h-px" />

          <!-- Company Details -->
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Company</span>
              <span class="text-right max-w-[140px] truncate">{{ client.company }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Type</span>
              <span>{{ client.type }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Industry</span>
              <span class="text-right max-w-[140px] truncate">{{ client.industry }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Tax ID</span>
              <span class="font-mono text-xs">{{ client.taxId }}</span>
            </div>
          </div>

          <div class="h-px" />

          <!-- Financial Summary -->
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Total Billed</span>
              <span class="tabular-nums">AED {{ client.totalBilled.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Outstanding</span>
              <span class="tabular-nums" :class="client.outstandingBalance > 0 ? 'text-amber-600' : ''">
                AED {{ client.outstandingBalance.toLocaleString() }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Next Billing</span>
              <span class="tabular-nums">{{ client.nextBillingDate }}</span>
            </div>
          </div>

          <div class="h-px" />

          <!-- Dates -->
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Client Since</span>
              <span class="tabular-nums">{{ client.created }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Last Activity</span>
              <span class="tabular-nums">{{ client.lastActivity }}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
