<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  IconChevronDown,
  IconShieldCheck,
  IconFileText,
  IconCheck
} from '@tabler/icons-vue'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import type { RiskItem, ContractDocument } from './types'

interface Props {
  document: ContractDocument
  risks: RiskItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  selectRisk: [riskId: string]
  updateRiskStatus: [riskId: string, status: RiskItem['status']]
}>()

// Expanded risks for progressive disclosure
const expandedRisks = ref<Set<string>>(new Set())

const toggleRisk = (riskId: string) => {
  if (expandedRisks.value.has(riskId)) {
    expandedRisks.value.delete(riskId)
  } else {
    expandedRisks.value.add(riskId)
  }
}

// Group by category
const risksByCategory = computed(() => {
  const categories = ['legal', 'financial', 'operational', 'reputational'] as const
  return categories
    .map(cat => ({
      category: cat,
      count: props.risks.filter(r => r.category === cat).length,
      items: props.risks.filter(r => r.category === cat)
    }))
    .filter(cat => cat.count > 0)
})

// Helpers
const getSeverityClass = (severity: RiskItem['severity']) => {
  switch (severity) {
    case 'critical': return 'bg-red-500/15 text-red-600'
    case 'high': return 'bg-orange-500/15 text-orange-600'
    case 'medium': return 'bg-amber-500/15 text-amber-600'
    case 'low': return 'bg-slate-500/10 text-slate-500'
  }
}

const getStatusClass = (status: RiskItem['status']) => {
  switch (status) {
    case 'identified': return 'bg-slate-500/10 text-slate-500'
    case 'mitigating': return 'bg-blue-500/15 text-blue-600'
    case 'accepted': return 'bg-amber-500/15 text-amber-600'
    case 'resolved': return 'bg-emerald-500/15 text-emerald-600'
  }
}

const getCategoryLabel = (category: RiskItem['category']) => {
  return category.charAt(0).toUpperCase() + category.slice(1) + ' Risks'
}
</script>

<template>
  <div class="flex h-full w-full flex-1 flex-col overflow-hidden bg-background">
    <!-- Header -->
    <header class="flex items-center justify-between border-b px-6 py-4">
      <div>
        <h1 class="text-sm font-medium text-foreground">Risk Analysis</h1>
        <p class="text-xs text-muted-foreground">{{ document.title }}</p>
      </div>
    </header>
    
    <!-- Content -->
    <div class="flex-1 overflow-y-auto">
      <div class="px-6 py-6">
        
        <!-- Risk List by Category -->
        <div class="space-y-6">
          <div v-for="cat in risksByCategory" :key="cat.category">
            <!-- Category Header -->
            <div class="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <span>{{ getCategoryLabel(cat.category) }}</span>
              <span class="text-muted-foreground/60">({{ cat.count }})</span>
            </div>
            
            <!-- Risk Rows -->
            <div class="space-y-px">
              <Collapsible
                v-for="risk in cat.items"
                :key="risk.id"
                :open="expandedRisks.has(risk.id)"
                @update:open="toggleRisk(risk.id)"
              >
                <!-- Collapsed Row -->
                <CollapsibleTrigger class="group flex w-full items-center gap-3 rounded px-2 py-2 text-left transition-colors hover:bg-muted/40">
                  <span class="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors">•</span>
                  
                  <span class="flex-1 text-sm text-foreground">
                    {{ risk.title }}
                  </span>
                  
                  <!-- Tags -->
                  <span 
                    class="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium"
                    :class="getSeverityClass(risk.severity)"
                  >
                    {{ risk.severity }}
                  </span>
                  <span 
                    class="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium"
                    :class="getStatusClass(risk.status)"
                  >
                    {{ risk.status }}
                  </span>
                  
                  <IconChevronDown 
                    class="size-3.5 shrink-0 text-muted-foreground/50 transition-transform duration-200"
                    :class="{ 'rotate-180': expandedRisks.has(risk.id) }"
                  />
                </CollapsibleTrigger>
                
                <!-- Expanded Details -->
                <CollapsibleContent>
                  <div class="ml-5 border-l border-border/50 pl-4 pb-3 pt-1">
                    <p class="text-sm text-muted-foreground leading-relaxed">
                      {{ risk.description }}
                    </p>
                    
                    <!-- Actions -->
                    <div class="mt-3 flex items-center gap-4">
                      <button 
                        v-if="risk.sectionRef"
                        class="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        @click.stop="emit('selectRisk', risk.id)"
                      >
                        <IconFileText class="size-3.5" />
                        View in document
                      </button>
                      <button 
                        class="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        @click.stop="emit('updateRiskStatus', risk.id, 'resolved')"
                      >
                        <IconCheck class="size-3.5" />
                        Mark as reviewed
                      </button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="risks.length === 0" class="flex flex-col items-center py-16 text-center">
          <IconShieldCheck class="mb-3 size-8 text-emerald-500/60" />
          <p class="text-sm font-medium text-foreground">No risks identified</p>
          <p class="mt-1 text-xs text-muted-foreground">This contract appears to be low risk</p>
        </div>
        
      </div>
    </div>
  </div>
</template>
