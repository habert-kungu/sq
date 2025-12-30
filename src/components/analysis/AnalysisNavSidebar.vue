<script setup lang="ts">
import { 
  IconChartBar, 
  IconAlertCircle, 
  IconShieldCheck,
  IconChevronLeft
} from '@tabler/icons-vue'
import type { AnalysisView } from './types'

interface Props {
  activeView: AnalysisView
  collapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false
})

const emit = defineEmits<{
  'update:activeView': [view: AnalysisView]
  'update:collapsed': [collapsed: boolean]
}>()

const navItems = [
  { id: 'insights' as AnalysisView, label: 'Insights', icon: IconChartBar },
  { id: 'risk-analysis' as AnalysisView, label: 'Risk Analysis', icon: IconAlertCircle },
  { id: 'compliance' as AnalysisView, label: 'Compliance', icon: IconShieldCheck },
]
</script>

<template>
  <div 
    class="flex h-full flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-200"
    :class="collapsed ? 'w-14' : 'w-52'"
  >
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-4">
      <span 
        v-if="!collapsed" 
        class="text-xs font-medium uppercase tracking-wider text-sidebar-foreground/60"
      >
        Analysis
      </span>
      <button
        class="flex size-6 items-center justify-center rounded-md text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        @click="emit('update:collapsed', !collapsed)"
      >
        <IconChevronLeft 
          class="size-4 transition-transform duration-200" 
          :class="collapsed ? 'rotate-180' : ''" 
        />
      </button>
    </div>
    
    <!-- Navigation Items -->
    <nav class="flex-1 px-2">
      <ul class="space-y-1">
        <li v-for="item in navItems" :key="item.id">
          <button
            class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors"
            :class="[
              item.id === activeView
                ? 'bg-sidebar-accent text-sidebar-foreground font-medium'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
            ]"
            :title="collapsed ? item.label : undefined"
            @click="emit('update:activeView', item.id)"
          >
            <component :is="item.icon" class="size-5 shrink-0" />
            <span v-if="!collapsed" class="text-sm">{{ item.label }}</span>
          </button>
        </li>
      </ul>
    </nav>
    
    <!-- Collapse Toggle at Bottom (alternative position) -->
    <div class="border-t px-2 py-3">
      <button
        v-if="!collapsed"
        class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
        @click="emit('update:collapsed', true)"
      >
        <IconChevronLeft class="size-5" />
        <span class="text-sm">Collapse</span>
      </button>
    </div>
  </div>
</template>
