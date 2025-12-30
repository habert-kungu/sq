<script setup lang="ts">
import { ref, computed } from 'vue'
import { IconSearch, IconFileText } from '@tabler/icons-vue'
import { Input } from '@/components/ui/input'

export interface DocumentSection {
  id: string
  title: string
  page: number
}

interface Props {
  sections: DocumentSection[]
  activeSection?: string
}

const props = withDefaults(defineProps<Props>(), {
  activeSection: ''
})

const emit = defineEmits<{
  select: [sectionId: string]
}>()

const searchQuery = ref('')

const filteredSections = computed(() => {
  if (!searchQuery.value.trim()) return props.sections
  const query = searchQuery.value.toLowerCase()
  return props.sections.filter(s => 
    s.title.toLowerCase().includes(query)
  )
})
</script>

<template>
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
          @click="emit('select', section.id)"
        >
          <span class="truncate text-sm">{{ section.title }}</span>
          <span class="text-xs text-muted-foreground/60">p.{{ section.page }}</span>
        </button>
      </div>
      
      <!-- Empty State -->
      <div v-if="filteredSections.length === 0" class="flex flex-col items-center px-4 py-8 text-center">
        <IconFileText class="mb-2 size-8 text-muted-foreground/40" />
        <p class="text-sm text-muted-foreground">No sections found</p>
      </div>
    </div>
  </div>
</template>
