<script setup lang="ts">
import BaseChart from '~/components/BaseChart.vue'
import { useElectricityData } from '@/composables/useElectricityData';
import {useChartData} from "~/composables/useChartData";
import {useChartOptions} from "~/composables/useChartOptions";

const { electricity } = useElectricityData();

const chartData = useChartData(electricity, 'line', 'amount', 'month')
const chartOptions = useChartOptions('line', 'Electricity', ' €')
</script>

<template>
  <div class="chart-page">
    <NuxtLink to="/" class="back-link">← Back</NuxtLink>
    <BaseChart v-if="electricity['2024']" type="line" :data="chartData" :options="chartOptions" />
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
