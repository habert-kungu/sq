<script setup lang="ts">
import { IconChevronRight, IconAlertTriangle, IconCircleCheck, IconInfoCircle } from '@tabler/icons-vue'
import { Badge } from '@/components/ui/badge'

export interface Insight {
  id: string
  type: 'risk' | 'compliance' | 'suggestion'
  title: string
  description: string
  tag?: string
}

interface Props {
  insights: Insight[]
  collapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false
})

const emit = defineEmits<{
  toggle: []
  select: [insightId: string]
}>()

const getIcon = (type: Insight['type']) => {
  switch (type) {
    case 'risk': return IconAlertTriangle
    case 'compliance': return IconCircleCheck
    case 'suggestion': return IconAlertTriangle
    default: return IconInfoCircle
  }
}

const getIconColor = (type: Insight['type']) => {
  switch (type) {
    case 'risk': return 'text-amber-500'
    case 'compliance': return 'text-emerald-500'
    case 'suggestion': return 'text-amber-500'
    default: return 'text-muted-foreground'
  }
}

const getBadgeVariant = (type: Insight['type']) => {
  switch (type) {
    case 'risk': return 'destructive'
    case 'compliance': return 'secondary'
    case 'suggestion': return 'outline'
    default: return 'secondary'
  }
}

const getBadgeClass = (type: Insight['type']) => {
  switch (type) {
    case 'risk': return 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100'
    case 'compliance': return 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
    case 'suggestion': return 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100'
    default: return ''
  }
}
</script>

<template>
  <div 
    class="flex h-full flex-col border-l bg-background transition-all duration-200"
    :class="collapsed ? 'w-12' : 'w-72'"
  >
    <!-- Header -->
    <div class="flex items-center justify-between border-b px-4 py-4">
      <span v-if="!collapsed" class="text-sm font-medium text-foreground">AI Insights</span>
      <button
        class="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        @click="emit('toggle')"
      >
        <IconChevronRight 
          class="size-4 transition-transform duration-200" 
          :class="collapsed ? 'rotate-180' : ''" 
        />
      </button>
    </div>
    
    <!-- Insights List -->
    <div v-if="!collapsed" class="flex-1 overflow-y-auto p-3 scrollbar-thin">
      <div class="space-y-3">
        <button
          v-for="insight in insights"
          :key="insight.id"
          class="group flex w-full flex-col gap-2 rounded-lg border bg-card p-4 text-left transition-all hover:border-border/80 hover:shadow-sm"
          @click="emit('select', insight.id)"
        >
          <!-- Header Row -->
          <div class="flex items-start gap-2">
            <component 
              :is="getIcon(insight.type)" 
              class="mt-0.5 size-4 shrink-0" 
              :class="getIconColor(insight.type)"
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
        @click="emit('select', insight.id)"
      >
        <component 
          :is="getIcon(insight.type)" 
          class="size-4" 
          :class="getIconColor(insight.type)"
        />
      </div>
      <span v-if="insights.length > 5" class="text-xs text-muted-foreground">
        +{{ insights.length - 5 }}
      </span>
    </div>
  </div>
</template>
