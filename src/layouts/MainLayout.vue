<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppSidebar from '@/components/AppSidebar.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'

const route = useRoute()

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    'dashboard': 'Dashboard',
    'ai-assistant': 'AI Assistant',
    'contract-review': 'Contract Review',
    'leads': 'Leads',
  }
  return titles[route.name as string] || 'Dashboard'
})
</script>

<template>
  <SidebarProvider
    :style="{
      '--sidebar-width': 'calc(var(--spacing) * 72)',
      '--header-height': 'calc(var(--spacing) * 12)',
    }"
  >
    <AppSidebar variant="inset" />
    <SidebarInset class="transition-all duration-300 ease-in-out will-change-[margin]">
      <SiteHeader :title="pageTitle" />
      <div class="flex flex-1 flex-col overflow-hidden bg-background transition-all duration-300 ease-in-out will-change-[margin,padding]">
        <RouterView />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
