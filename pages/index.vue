<script setup lang="ts">
import { Line } from 'vue-chartjs'
import { useTemperatureChartData } from '~/composables/useTemperatureChartData'
import { useChartOptions } from '~/composables/useChartOptions'

const { isLoading, chartData } = useTemperatureChartData()
const chartOptions = useChartOptions('line', 'Average Monthly Temperature (°C)', '°C')
</script>

<template>
  <div class="home">
    <h1 class="title">📉 Temperature in Split (2023–2026)</h1>

    <nav class="nav-links">
      <span>Electricity:</span>
      <NuxtLink to="/barChart" class="chart-link">📊 Bar Chart</NuxtLink>
      <NuxtLink to="/lineChart" class="chart-link">📈 Line Chart</NuxtLink>
    </nav>

    <div v-if="isLoading" class="loading">Loading...</div>

    <Line
        v-else
        :data="chartData"
        :options="chartOptions"
    />
  </div>
</template>

<style scoped>
.home {
  padding: 2rem;
  text-align: center;
}
.title {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}
.nav-links {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
.chart-link {
  padding: 0.5rem 1rem;
  background-color: #42a5f5;
  color: white;
  text-decoration: none;
  border-radius: 5px;
}
.chart-link:hover {
  background-color: #1e88e5;
}
.loading {
  font-size: 1.2rem;
  color: #888;
  margin-top: 2rem;
}
</style>
