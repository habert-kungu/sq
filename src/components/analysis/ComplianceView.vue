<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  IconCircleCheck, 
  IconCircleX, 
  IconAlertTriangle,
  IconMinus,
  IconFileText,
  IconChevronDown
} from '@tabler/icons-vue'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import type { ComplianceItem, ContractDocument } from './types'

interface Props {
  document: ContractDocument
  compliance: ComplianceItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  selectCompliance: [complianceId: string]
}>()

// Expanded frameworks state
const expandedFrameworks = ref<Set<string>>(new Set(['GDPR', 'SOC 2']))

const toggleFramework = (framework: string) => {
  if (expandedFrameworks.value.has(framework)) {
    expandedFrameworks.value.delete(framework)
  } else {
    expandedFrameworks.value.add(framework)
  }
}

// Summary statistics
const complianceSummary = computed(() => {
  const compliant = props.compliance.filter(c => c.status === 'compliant').length
  const nonCompliant = props.compliance.filter(c => c.status === 'non-compliant').length
  const partial = props.compliance.filter(c => c.status === 'partial').length
  const notApplicable = props.compliance.filter(c => c.status === 'not-applicable').length
  const total = props.compliance.length
  const applicable = total - notApplicable
  const score = applicable > 0 ? Math.round((compliant / applicable) * 100) : 100
  
  return { compliant, nonCompliant, partial, notApplicable, total, applicable, score }
})

// Group by standard
const complianceByStandard = computed(() => {
  const standards = [...new Set(props.compliance.map(c => c.standard))]
  return standards.map(std => {
    const items = props.compliance.filter(c => c.standard === std)
    const applicableItems = items.filter(c => c.status !== 'not-applicable')
    const compliantItems = items.filter(c => c.status === 'compliant')
    return {
      standard: std,
      items,
      compliant: compliantItems.length,
      total: applicableItems.length,
      score: applicableItems.length > 0 ? Math.round((compliantItems.length / applicableItems.length) * 100) : 100
    }
  })
})

// Helpers
const getStatusIcon = (status: ComplianceItem['status']) => {
  switch (status) {
    case 'compliant': return IconCircleCheck
    case 'non-compliant': return IconCircleX
    case 'partial': return IconAlertTriangle
    case 'not-applicable': return IconMinus
  }
}

const getStatusColor = (status: ComplianceItem['status']) => {
  switch (status) {
    case 'compliant': return 'text-emerald-500'
    case 'non-compliant': return 'text-red-500'
    case 'partial': return 'text-amber-500'
    case 'not-applicable': return 'text-slate-300'
  }
}

const getStatusLabel = (status: ComplianceItem['status']) => {
  switch (status) {
    case 'compliant': return 'Compliant'
    case 'non-compliant': return 'Non-compliant'
    case 'partial': return 'Partial'
    case 'not-applicable': return 'N/A'
  }
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-emerald-600'
  if (score >= 60) return 'text-amber-600'
  return 'text-red-500'
}

const getProgressColor = (score: number) => {
  if (score >= 80) return 'bg-emerald-500'
  if (score >= 60) return 'bg-amber-400'
  return 'bg-red-500'
}
</script>

<template>
  <div class="flex h-full w-full flex-1 flex-col overflow-hidden bg-background">
    <!-- Header -->
    <header class="flex items-center justify-between border-b px-6 py-4">
      <div>
        <h1 class="text-sm font-medium text-foreground">Compliance</h1>
        <p class="text-xs text-muted-foreground">{{ document.title }}</p>
      </div>
    </header>
    
    <!-- Content -->
    <div class="flex-1 overflow-y-auto">
      <div class="px-6 py-6">
        
        <!-- Overall Score -->
        <div class="mb-8">
          <div class="flex items-end justify-between mb-3">
            <div>
              <span class="text-sm text-muted-foreground">Overall Score</span>
              <div class="flex items-baseline gap-1">
                <span 
                  class="text-3xl font-semibold tabular-nums"
                  :class="getScoreColor(complianceSummary.score)"
                >
                  {{ complianceSummary.score }}
                </span>
                <span class="text-lg text-muted-foreground">%</span>
              </div>
            </div>
            <div class="flex items-center gap-4 text-xs text-muted-foreground">
              <span>{{ complianceSummary.compliant }} passed</span>
              <span>{{ complianceSummary.partial }} partial</span>
              <span>{{ complianceSummary.nonCompliant }} failed</span>
            </div>
          </div>
          <div class="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div 
              class="h-full transition-all duration-500 rounded-full"
              :class="getProgressColor(complianceSummary.score)"
              :style="{ width: `${complianceSummary.score}%` }"
            />
          </div>
        </div>
        
        <!-- Frameworks (Accordion) -->
        <div class="space-y-2">
          <Collapsible
            v-for="framework in complianceByStandard"
            :key="framework.standard"
            :open="expandedFrameworks.has(framework.standard)"
            @update:open="toggleFramework(framework.standard)"
          >
            <CollapsibleTrigger class="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left hover:bg-muted/50 transition-colors">
              <div class="flex items-center gap-3 min-w-0">
                <span class="text-sm font-medium text-foreground">
                  {{ framework.standard }}
                </span>
                <span class="text-xs text-muted-foreground">
                  {{ framework.compliant }}/{{ framework.total }}
                </span>
              </div>
              <div class="flex items-center gap-3 flex-1 justify-end ml-4">
                <!-- Mini progress -->
                <div class="h-1 w-24 overflow-hidden rounded-full bg-muted">
                  <div 
                    class="h-full rounded-full transition-all"
                    :class="getProgressColor(framework.score)"
                    :style="{ width: `${framework.score}%` }"
                  />
                </div>
                <IconChevronDown 
                  class="size-4 text-muted-foreground transition-transform duration-200"
                  :class="{ 'rotate-180': expandedFrameworks.has(framework.standard) }"
                />
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div class="space-y-0.5 pb-2 pt-1">
                <button
                  v-for="item in framework.items"
                  :key="item.id"
                  class="group flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/30"
                  @click="emit('selectCompliance', item.id)"
                >
                  <!-- Status Icon -->
                  <component 
                    :is="getStatusIcon(item.status)" 
                    class="mt-0.5 size-4 shrink-0" 
                    :class="getStatusColor(item.status)"
                  />
                  
                  <!-- Content -->
                  <div class="flex-1 min-w-0 space-y-0.5">
                    <div class="flex items-start justify-between gap-4">
                      <span class="text-sm text-foreground leading-tight">
                        {{ item.requirement }}
                      </span>
                      <span 
                        class="shrink-0 text-xs"
                        :class="getStatusColor(item.status)"
                      >
                        {{ getStatusLabel(item.status) }}
                      </span>
                    </div>
                    
                    <p v-if="item.notes || item.evidence" class="text-xs text-muted-foreground">
                      {{ item.notes || item.evidence }}
                    </p>
                    
                    <!-- Link to document -->
                    <button 
                      v-if="item.sectionRef"
                      class="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors pt-1"
                    >
                      <IconFileText class="size-3" />
                      View in document
                    </button>
                  </div>
                </button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        
        <!-- Empty State -->
        <div v-if="compliance.length === 0" class="flex flex-col items-center py-16 text-center">
          <IconCircleCheck class="mb-3 size-8 text-emerald-500/60" />
          <p class="text-sm font-medium text-foreground">No requirements defined</p>
          <p class="mt-1 text-xs text-muted-foreground">Add compliance requirements to check</p>
        </div>
        
      </div>
    </div>
  </div>
</template>
