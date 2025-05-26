<script setup lang="ts">
import BaseChart from '~/components/BaseChart.vue'

type Value = { month: string; amount: number }
const electricity = ref<Record<string, Value[]>>({})

fetch("/api-electricity.json")
    .then(async (res) => electricity.value = await res.json())
    .catch((err) => console.error(err.message))

const chartOptions = useChartOptions('bar')
const chartData = useChartData(electricity, 'bar')
</script>

<template>
  <div class="chart-page">
    <NuxtLink to="/" class="back-link">← Back</NuxtLink>
    <BaseChart v-if="electricity['2024']" type="bar" :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.back-link {
  display: inline-block;
  margin-bottom: 1rem;
  font-weight: 500;
  color: #0070f3;
  text-decoration: none;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: #0050c3;
}

.chart-page {
  padding: 2rem;
}
</style>
