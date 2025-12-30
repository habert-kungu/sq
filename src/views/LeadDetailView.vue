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

const stages = ['Open', 'Qualified', 'Proposal', 'Negotiation', 'Won']

const lead = ref({
  id: route.params.id as string,
  name: 'Skyline Ventures DMCC',
  email: 'k.almazrouei@skylineventures.ae',
  phone: '+971 4 123 4567',
  stage: 'Qualified',
  position: 'Managing Director',
  estimatedValue: 75000,
  assignedTo: 'Sarah Ahmed',
  nextFollowUp: 'Jan 2, 2026',
  type: 'Corporate',
  source: 'Website',
  industry: 'Investment & Finance',
  created: 'Oct 10, 2025',
  lastContact: 'Dec 25, 2025',
})

const activities = ref([
  { id: '1', type: 'email', primary: true, title: 'Sent proposal document', meta: 'Sarah Ahmed', date: 'Dec 25' },
  { id: '2', type: 'call', primary: true, title: 'Discovery call completed', meta: 'Sarah Ahmed · 32 min', date: 'Dec 22' },
  { id: '3', type: 'note', primary: false, title: 'Client prefers monthly retainer model', meta: 'Ahmed Hassan', date: 'Dec 20' },
  { id: '4', type: 'system', primary: false, title: 'Stage changed to Qualified', meta: 'System', date: 'Dec 18' },
  { id: '5', type: 'system', primary: false, title: 'Lead created from website form', meta: 'System', date: 'Oct 10' },
])

const newNote = ref('')
const activeTab = ref<'activity' | 'notes'>('activity')

const currentStageIndex = computed(() => stages.indexOf(lead.value.stage))
const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
const goBack = () => router.push('/leads')
const changeStage = (stage: string) => { lead.value.stage = stage }

const addNote = () => {
  if (newNote.value.trim()) {
    activities.value.unshift({ id: String(Date.now()), type: 'note', primary: false, title: newNote.value, meta: 'You', date: 'Now' })
    newNote.value = ''
  }
}
</script>

<template>
  <div class="h-full overflow-hidden bg-background flex flex-col">
    
    <!-- 
    ============================================================
    TOP BAR - Navigation only, ultra minimal
    48px height, just back button and minimal actions
    ============================================================
    -->
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

    <section class="px-8 pt-10 pb-8 border-b border-border/40">
      <div class="flex items-start justify-between">
        <!-- Left: Identity + Key Metrics -->
        <div class="flex gap-5">
          <Avatar class="size-14 shrink-0">
            <AvatarFallback class="text-base font-normal bg-muted/60 text-muted-foreground">
              {{ getInitials(lead.name) }}
            </AvatarFallback>
          </Avatar>
          
          <div class="space-y-6">
            <!-- Primary: Name (largest text on page) -->
            <div>
              <h1 class="text-2xl font-medium tracking-tight text-foreground">{{ lead.name }}</h1>
              <p class="text-sm text-muted-foreground mt-1">{{ lead.position }}</p>
            </div>
            
            <!-- Secondary: Key decision data in a scannable row -->
            <!-- Using tabular spacing for quick scanning -->
            <div class="flex items-baseline gap-12 text-sm">
              <div class="space-y-1">
                <p class="text-xs text-muted-foreground">Value</p>
                <p class="font-medium tabular-nums">AED {{ lead.estimatedValue.toLocaleString() }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-xs text-muted-foreground">Owner</p>
                <p>{{ lead.assignedTo }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-xs text-muted-foreground">Follow-up</p>
                <p>{{ lead.nextFollowUp }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Stage (the primary status indicator) -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <button class="flex items-center gap-2 text-sm hover:text-muted-foreground transition-colors">
              <span class="font-medium">{{ lead.stage }}</span>
              <IconChevronDown class="size-3.5 text-muted-foreground" stroke-width="1.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-32">
            <DropdownMenuItem 
              v-for="stage in stages" 
              :key="stage" 
              @click="changeStage(stage)"
              class="text-sm justify-between"
            >
              {{ stage }}
              <IconCheck v-if="lead.stage === stage" class="size-3.5" stroke-width="1.5" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <!-- 
      Stage Progress - Minimal linear indicator
      Just text labels, current stage has normal weight, others muted
      No circles, no fills, no backgrounds
      -->
      <div class="flex items-center gap-8 mt-8 ml-[76px] text-xs">
        <span 
          v-for="(stage, index) in stages" 
          :key="stage"
          class="transition-colors cursor-pointer"
          :class="index <= currentStageIndex ? 'text-foreground' : 'text-muted-foreground/50'"
          @click="changeStage(stage)"
        >
          {{ stage }}
        </span>
      </div>
    </section>

    <!-- 
    ============================================================
    MAIN CONTENT - Two column layout
    Left: Activity stream (primary focus)
    Right: Reference details (secondary, on-demand)
    
    Ratio: ~65% / 35%
    ============================================================
    -->
    <div class="flex-1 overflow-hidden flex">
      
      <!-- 
      LEFT COLUMN - Activity Stream
      The workhorse of daily use. Optimized for scanning.
      
      Design decisions:
      - Primary activities (calls, emails) have normal weight
      - System events are de-emphasized (lighter, smaller)
      - No icons for system events (reduces noise)
      - Date aligned right for quick temporal scanning
      - Generous vertical spacing between items
      -->
      <main class="flex-1 overflow-auto">
        <div class="p-6">
          <!-- Tab-like navigation, ultra minimal -->
          <div class="flex items-center gap-6 mb-6">
            <button 
              @click="activeTab = 'activity'"
              class="text-sm pb-1 border-b transition-colors"
              :class="activeTab === 'activity' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'"
            >
              Activity
            </button>
            <button 
              @click="activeTab = 'notes'"
              class="text-sm pb-1 border-b transition-colors"
              :class="activeTab === 'notes' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'"
            >
              Notes
            </button>
            
            <!-- Log activity - quiet affordance, right-aligned -->
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

          <!-- Notes Tab -->
          <div v-if="activeTab === 'notes'" class="space-y-6">
            <!-- Compose -->
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
            
            <!-- Notes list -->
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

      <!-- 
      RIGHT COLUMN - Details Panel
      Reference information, not primary focus
      
      Design decisions:
      - Narrower width (reduces prominence)
      - Subtle left border (not a heavy divider)
      - Grouped by relevance: Contact first, then attributes
      - Key-value pairs with generous spacing
      - No section headers (reduces visual weight)
      -->
      <aside class="w-72 border-l border-border/40 overflow-auto">
        <div class="p-6 space-y-6">
          
          <!-- Contact - Most actionable, so first -->
          <div class="space-y-3">
            <a 
              :href="`mailto:${lead.email}`" 
              class="block text-sm text-foreground hover:text-muted-foreground transition-colors truncate"
            >
              {{ lead.email }}
            </a>
            <a 
              :href="`tel:${lead.phone}`" 
              class="block text-sm text-foreground hover:text-muted-foreground transition-colors"
            >
              {{ lead.phone }}
            </a>
          </div>

          <!-- Divider - just spacing, no line -->
          <div class="h-px" />

          <!-- Attributes - Key-value pairs -->
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Type</span>
              <span>{{ lead.type }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Source</span>
              <span>{{ lead.source }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Industry</span>
              <span>{{ lead.industry }}</span>
            </div>
          </div>

          <div class="h-px" />

          <!-- Temporal info - least urgent -->
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Created</span>
              <span class="tabular-nums">{{ lead.created }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Last contact</span>
              <span class="tabular-nums">{{ lead.lastContact }}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<!--
============================================================
DESIGN SYSTEM DOCUMENTATION
============================================================

TYPOGRAPHY SCALE (using Tailwind defaults)
------------------------------------------
Page Title (Lead Name):     text-xl (20px) font-medium tracking-tight
Section/Role:               text-sm (14px) text-muted-foreground
Body/Activity:              text-sm (14px)
Meta/Dates:                 text-xs (12px) text-muted-foreground
Stage Labels:               text-xs (12px)

SPACING RULES
------------------------------------------
Page horizontal padding:    24px (px-6)
Hero vertical padding:      32px (py-8)
Content area padding:       24px (p-6)
Between major sections:     24px (space-y-6)
Between list items:         4px (space-y-1) + 12px padding (py-3)
Between key-value pairs:    12px (space-y-3)
Inline label-value gap:     8px (ml-2)
Column gap in metrics:      32px (gap-8)

VISUAL HIERARCHY (no colors)
------------------------------------------
1. Lead name:               Largest text, font-medium
2. Key metrics row:         Labels muted, values normal weight
3. Stage indicator:         Right-aligned, dropdown affordance
4. Activity items:          Primary = full opacity, System = 50% opacity
5. Sidebar:                 Narrower column, subtle border

COLOR USAGE (minimal)
------------------------------------------
- foreground:               Primary text, active states
- muted-foreground:         Secondary text, labels, inactive
- muted-foreground/50:      Tertiary (inactive stages, system events)
- border/40:                Subtle dividers
- muted/60:                 Avatar background only

HOW THIS IMPROVES SPEED & CLARITY
------------------------------------------
1. 3-second scan: Name + Value + Stage visible immediately in hero
2. F-pattern reading: Key info flows left-to-right, top-to-bottom
3. Activity prioritization: Primary actions pop, system events fade
4. Right-aligned dates: Creates scannable temporal column
5. No color decisions: Typography weight carries all hierarchy
6. Quiet actions: Email/Phone/Log always available, never intrusive
7. Reduced density: Generous spacing reduces cognitive load
8. No cards/badges: Information breathes, nothing competes

============================================================
-->

