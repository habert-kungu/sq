<script setup lang="ts">
import { useToast, type Toast } from '@/composables/useToast'
import { IconX, IconCheck, IconAlertCircle, IconInfoCircle } from '@tabler/icons-vue'
import { computed } from 'vue'

defineProps<{
  toast: Toast
}>()

const { dismiss } = useToast()

const variantClasses = computed(() => ({
  default: 'bg-white border-gray-200',
  success: 'bg-green-50 border-green-200',
  error: 'bg-red-50 border-red-200',
  warning: 'bg-yellow-50 border-yellow-200',
}))

const variantIcon = computed(() => ({
  default: IconInfoCircle,
  success: IconCheck,
  error: IconAlertCircle,
  warning: IconAlertCircle,
}))

const variantIconColor = computed(() => ({
  default: 'text-blue-500',
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
}))
</script>

<template>
  <div
    :class="[
      'pointer-events-auto flex w-full max-w-md rounded-lg border p-4 shadow-lg transition-all',
      variantClasses[toast.variant || 'default'],
    ]"
  >
    <component
      :is="variantIcon[toast.variant || 'default']"
      :class="['mr-3 h-5 w-5 flex-shrink-0', variantIconColor[toast.variant || 'default']]"
    />
    <div class="flex-1">
      <p class="text-sm font-semibold text-gray-900">
        {{ toast.title }}
      </p>
      <p v-if="toast.description" class="mt-1 text-sm text-gray-600">
        {{ toast.description }}
      </p>
    </div>
    <button
      type="button"
      @click="dismiss(toast.id)"
      class="ml-4 inline-flex flex-shrink-0 text-gray-400 hover:text-gray-600"
    >
      <IconX class="h-5 w-5" />
    </button>
  </div>
</template>
