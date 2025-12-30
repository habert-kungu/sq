<script setup lang="ts">
import { ref } from 'vue'
import { IconFileText, IconDownload, IconShare, IconChevronRight, IconAlertTriangle, IconCircleCheck, IconInfoCircle, IconSearch } from '@tabler/icons-vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import type { ContractDocument, AIInsight, DocumentSection } from './types'

interface Props {
  document: ContractDocument
  insights: AIInsight[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  download: []
  share: []
  selectInsight: [insightId: string]
}>()

// Local state
const activeSection = ref<string>('')
const insightsCollapsed = ref(false)
const searchQuery = ref('')

// Computed sections for sidebar
const filteredSections = computed(() => {
  if (!searchQuery.value.trim()) return props.document.sections
  const query = searchQuery.value.toLowerCase()
  return props.document.sections.filter(s => 
    s.title.toLowerCase().includes(query)
  )
})

// Insight helpers
const getInsightIcon = (type: AIInsight['type']) => {
  switch (type) {
    case 'risk': return IconAlertTriangle
    case 'compliance': return IconCircleCheck
    case 'suggestion': return IconAlertTriangle
    default: return IconInfoCircle
  }
}

const getInsightIconColor = (type: AIInsight['type']) => {
  switch (type) {
    case 'risk': return 'text-amber-500'
    case 'compliance': return 'text-emerald-500'
    case 'suggestion': return 'text-amber-500'
    default: return 'text-muted-foreground'
  }
}

const getBadgeClass = (type: AIInsight['type']) => {
  switch (type) {
    case 'risk': return 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100'
    case 'compliance': return 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
    case 'suggestion': return 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100'
    default: return ''
  }
}

const scrollToSection = (sectionId: string) => {
  activeSection.value = sectionId
  const element = document.getElementById(`section-${sectionId}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

import { computed, watch } from 'vue'

watch(activeSection, (newId) => {
  if (newId) {
    const element = document.getElementById(`section-${newId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
})
</script>

<template>
  <div class="flex h-full flex-1">
    <!-- Left: Document Outline Sidebar -->
    <div class="flex h-full w-64 flex-col border-r bg-background">
      <!-- Search -->
      <div class="p-3">
        <div class="relative">
          <IconSearch class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="h-9 pl-9 text-sm"
          />
        </div>
      </div>
      
      <!-- Document Outline Header -->
      <div class="px-4 py-2">
        <span class="text-sm font-medium text-foreground">Document Outline</span>
      </div>
      
      <!-- Sections List -->
      <div class="flex-1 overflow-y-auto px-2 scrollbar-thin">
        <div class="space-y-0">
          <button
            v-for="section in filteredSections"
            :key="section.id"
            class="group flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-colors"
            :class="[
              section.id === activeSection
                ? 'bg-muted font-medium text-foreground'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            ]"
            @click="scrollToSection(section.id)"
          >
            <span class="truncate text-sm">{{ section.title }}</span>
            <span class="text-xs text-muted-foreground/60">p.{{ section.page }}</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Center: Document Viewer -->
    <div class="flex h-full flex-1 flex-col bg-background">
      <!-- Document Header -->
      <header class="flex items-center justify-between border-b px-6 py-4">
        <div class="flex items-center gap-3">
          <div class="flex size-8 items-center justify-center rounded-md bg-muted">
            <IconFileText class="size-4 text-muted-foreground" />
          </div>
          <h1 class="text-base font-medium text-foreground">{{ document.title }}</h1>
        </div>
        <div class="flex items-center gap-2">
          <Button variant="outline" size="sm" @click="emit('download')">
            Download
          </Button>
          <Button variant="outline" size="sm" @click="emit('share')">
            Share
          </Button>
        </div>
      </header>
      
      <!-- Document Content -->
      <div class="flex-1 overflow-y-auto">
        <div class="mx-auto max-w-3xl px-8 py-8">
          <!-- Document Body Card -->
          <div class="rounded-xl border bg-card p-8 shadow-sm">
            <!-- Title -->
            <h2 class="mb-8 text-center text-lg font-semibold uppercase tracking-wide text-foreground">
              TECHNOLOGY ACQUISITION AGREEMENT
            </h2>
            
            <!-- Sections -->
            <div class="space-y-8">
              <section
                v-for="section in document.sections"
                :key="section.id"
                :id="`section-${section.id}`"
                class="scroll-mt-4"
              >
                <h3 class="mb-3 text-base font-semibold text-foreground">
                  {{ section.title }}
                </h3>
                <div class="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                  {{ section.content }}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Right: AI Insights Panel -->
    <div 
      class="flex h-full flex-col border-l bg-background transition-all duration-200"
      :class="insightsCollapsed ? 'w-12' : 'w-72'"
    >
      <!-- Header -->
      <div class="flex items-center justify-between border-b px-4 py-4">
        <span v-if="!insightsCollapsed" class="text-sm font-medium text-foreground">AI Insights</span>
        <button
          class="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          @click="insightsCollapsed = !insightsCollapsed"
        >
          <IconChevronRight 
            class="size-4 transition-transform duration-200" 
            :class="insightsCollapsed ? 'rotate-180' : ''" 
          />
        </button>
      </div>
      
      <!-- Insights List -->
      <div v-if="!insightsCollapsed" class="flex-1 overflow-y-auto p-3 scrollbar-thin">
        <div class="space-y-3">
          <button
            v-for="insight in insights"
            :key="insight.id"
            class="group flex w-full flex-col gap-2 rounded-lg border bg-card p-4 text-left transition-all hover:border-border/80 hover:shadow-sm"
            @click="emit('selectInsight', insight.id)"
          >
            <!-- Header Row -->
            <div class="flex items-start gap-2">
              <component 
                :is="getInsightIcon(insight.type)" 
                class="mt-0.5 size-4 shrink-0" 
                :class="getInsightIconColor(insight.type)"
              />
              <span class="text-sm font-medium leading-tight text-foreground">
                {{ insight.title }}
              </span>
            </div>
            
            <!-- Description -->
            <p class="text-xs leading-relaxed text-muted-foreground">
              {{ insight.description }}
            </p>
            
            <!-- Tag Badge -->
            <Badge
              v-if="insight.tag"
              variant="outline"
              class="w-fit text-[10px] font-medium"
              :class="getBadgeClass(insight.type)"
            >
              {{ insight.tag }}
            </Badge>
          </button>
        </div>
        
        <!-- Empty State -->
        <div v-if="insights.length === 0" class="flex flex-col items-center px-4 py-12 text-center">
          <IconCircleCheck class="mb-3 size-10 text-emerald-500/40" />
          <p class="text-sm font-medium text-foreground">All Clear</p>
          <p class="mt-1 text-xs text-muted-foreground">No issues detected</p>
        </div>
      </div>
      
      <!-- Collapsed State Icons -->
      <div v-else class="flex flex-1 flex-col items-center gap-3 py-4">
        <div
          v-for="insight in insights.slice(0, 5)"
          :key="insight.id"
          class="flex size-8 items-center justify-center rounded-md hover:bg-muted cursor-pointer transition-colors"
          :title="insight.title"
          @click="emit('selectInsight', insight.id)"
        >
          <component 
            :is="getInsightIcon(insight.type)" 
            class="size-4" 
            :class="getInsightIconColor(insight.type)"
          />
        </div>
        <span v-if="insights.length > 5" class="text-xs text-muted-foreground">
          +{{ insights.length - 5 }}
        </span>
      </div>
    </div>
  </div>
</template>
