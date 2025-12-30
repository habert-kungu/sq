<script setup lang="ts">
import { IconFileText, IconDownload, IconShare } from '@tabler/icons-vue'
import { Button } from '@/components/ui/button'

export interface DocumentContent {
  id: string
  title: string
  sections: {
    id: string
    heading: string
    content: string
  }[]
}

interface Props {
  document: DocumentContent
  activeSectionId?: string
}

const props = withDefaults(defineProps<Props>(), {
  activeSectionId: ''
})

const emit = defineEmits<{
  download: []
  share: []
}>()

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(`section-${sectionId}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Watch for active section changes
import { watch } from 'vue'
watch(() => props.activeSectionId, (newId) => {
  if (newId) scrollToSection(newId)
})
</script>

<template>
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
            {{ document.title.toUpperCase().replace(/\s+Q\d+\s+\d+$/i, '') }}
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
                {{ section.heading }}
              </h3>
              <div class="text-sm leading-relaxed text-muted-foreground">
                {{ section.content }}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
