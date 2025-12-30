<script setup lang="ts">
import ChartAreaInteractive from '@/components/ChartAreaInteractive.vue'
import DataTable from '@/components/DataTable.vue'
import SectionCards from '@/components/SectionCards.vue'

const data = [
  {
    id: 1,
    header: "Executive Summary",
    type: "Proposal",
    status: "Done",
    target: "2 pages",
    limit: "3 pages",
    reviewer: "Eddie Lake",
  },
  {
    id: 2,
    header: "Technical Approach",
    type: "Technical",
    status: "In Progress",
    target: "10 pages",
    limit: "15 pages",
    reviewer: "Assign reviewer",
  },
  {
    id: 3,
    header: "Management Plan",
    type: "Management",
    status: "In Review",
    target: "5 pages",
    limit: "8 pages",
    reviewer: "Jamik Tashpulatov",
  },
]
</script>

<template>
  <div class="flex flex-1 flex-col overflow-auto">
    <div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      <div class="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable :data="data" />
    </div>
  </div>
</template>
