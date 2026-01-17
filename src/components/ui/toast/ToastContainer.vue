<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import ToastItem from './ToastItem.vue'
import { TransitionGroup } from 'vue'

const { toasts } = useToast()
</script>

<template>
  <div class="pointer-events-none fixed bottom-0 right-0 z-50 flex max-h-screen flex-col-reverse gap-2 p-4 sm:bottom-4 sm:right-4">
    <TransitionGroup
      name="toast"
      tag="div"
      class="flex flex-col-reverse gap-2"
    >
      <ToastItem
        v-for="toast in toasts"
        :key="toast.id"
        :toast="toast"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}
</style>
