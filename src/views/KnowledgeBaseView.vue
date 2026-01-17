<script setup lang="ts">
import { ref } from 'vue'
import KnowledgeDataTable from '@/components/knowledge/KnowledgeDataTable.vue'
import KnowledgeUploadDialog from '@/components/knowledge/KnowledgeUploadDialog.vue'

const isUploadDialogOpen = ref(false)

const handleUploadSuccess = () => {
  isUploadDialogOpen.value = false
  // The table will auto-refresh via its own logic
}
</script>

<template>
  <div class="overflow-auto">
    <KnowledgeDataTable @upload="isUploadDialogOpen = true" />

    <!-- Upload Dialog -->
    <KnowledgeUploadDialog
      :open="isUploadDialogOpen"
      @close="isUploadDialogOpen = false"
      @success="handleUploadSuccess"
    />
  </div>
</template>
