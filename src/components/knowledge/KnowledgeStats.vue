<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { knowledgeAPI, type Stats } from '@/services/knowledgeApi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  IconFileText,
  IconCheck,
  IconClock,
  IconAlertCircle,
  IconDatabase,
  IconTrendingUp,
  IconArrowUp,
  IconArrowDown,
} from '@tabler/icons-vue'

const stats = ref<Stats | null>(null)
const loading = ref(true)

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
}

// Calculate total storage from stats (mock for now - would come from backend)
const totalStorage = computed(() => {
  if (!stats.value) return '0 B'
  // Mock calculation - in real app this would come from backend
  const estimatedSize = stats.value.total * 1024 * 1024 * 2.5 // Assume avg 2.5MB per doc
  return formatFileSize(estimatedSize)
})

// Calculate documents this month (mock for now)
const documentsThisMonth = computed(() => {
  if (!stats.value) return 0
  // Mock calculation - in real app this would come from backend
  return Math.floor(stats.value.total * 0.3) // Assume 30% uploaded this month
})

const fetchStats = async () => {
  try {
    loading.value = true
    stats.value = await knowledgeAPI.getStats()
  } catch (error) {
    console.error('Failed to fetch stats:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStats()
})

const statCards = computed(() => {
  if (!stats.value) return []

  return [
    {
      title: 'Total Documents',
      value: stats.value.total,
      subtitle: `${documentsThisMonth.value} added this month`,
      icon: IconFileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Completed',
      value: stats.value.byStatus.completed || 0,
      subtitle: 'Ready to search',
      icon: IconCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Processing',
      value: stats.value.byStatus.processing || 0,
      subtitle: 'Being indexed',
      icon: IconClock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      trend: '-2%',
      trendUp: false,
    },
    {
      title: 'Storage Used',
      value: totalStorage.value,
      subtitle: 'Across all documents',
      icon: IconDatabase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: '+15%',
      trendUp: true,
      isStorage: true,
    },
  ]
})
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
    <!-- Loading Skeleton -->
    <template v-if="loading">
      <Card v-for="i in 4" :key="i" class="overflow-hidden">
        <CardContent class="p-6">
          <div class="animate-pulse">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                <div class="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div class="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </template>

    <!-- Stat Cards -->
    <template v-else>
      <Card 
        v-for="(stat, index) in statCards" 
        :key="stat.title"
        class="overflow-hidden hover:shadow-md transition-all duration-200 border-l-4"
        :class="{
          'border-l-blue-500': index === 0,
          'border-l-green-500': index === 1,
          'border-l-yellow-500': index === 2,
          'border-l-purple-500': index === 3,
        }"
      >
        <CardContent class="p-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <!-- Title -->
              <p class="text-sm font-medium text-gray-600 mb-1">{{ stat.title }}</p>
              
              <!-- Value with animation -->
              <p 
                class="text-3xl font-bold text-gray-900 mb-2 transition-all duration-500"
                :class="{ 'animate-pulse': loading }"
              >
                {{ stat.isStorage ? stat.value : stat.value.toLocaleString() }}
              </p>

              <!-- Subtitle and Trend -->
              <div class="flex items-center gap-2">
                <p class="text-xs text-gray-500">{{ stat.subtitle }}</p>
                <div 
                  v-if="stat.trend"
                  class="flex items-center gap-0.5 text-xs font-medium"
                  :class="stat.trendUp ? 'text-green-600' : 'text-red-600'"
                >
                  <component 
                    :is="stat.trendUp ? IconArrowUp : IconArrowDown" 
                    class="h-3 w-3" 
                  />
                  <span>{{ stat.trend }}</span>
                </div>
              </div>
            </div>

            <!-- Icon -->
            <div 
              :class="['rounded-xl p-3 shadow-sm', stat.bgColor]"
              class="transition-transform duration-200 hover:scale-110"
            >
              <component :is="stat.icon" :class="['h-6 w-6', stat.color]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </template>
  </div>
</template>
