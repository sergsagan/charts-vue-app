<script setup lang="ts">
import { Bar, Line } from 'vue-chartjs'
import type { ChartData, ChartOptions, ChartComponentLike } from 'chart.js'

const props = defineProps<{
  type: 'bar' | 'line'
  data: ChartData<'bar'> | ChartData<'line'>
  options: ChartOptions<'bar'> | ChartOptions<'line'>
}>()

const ChartComponent = computed((): ChartComponentLike => {
  return props.type === 'bar' ? Bar : Line
})
const castedData = computed(() => {
  return props.data as ChartData<typeof props.type>
})

const castedOptions = computed(() => {
  return props.options as ChartOptions<typeof props.type>
})
</script>
<template>
  <component :is="ChartComponent" :data="castedData" :options="castedOptions" />
</template>
<style scoped>
body {
  padding: 50px;
}
</style>
