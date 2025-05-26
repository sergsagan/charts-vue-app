<script setup lang="ts">
import { Line } from "vue-chartjs";
import type { ChartData, ChartOptions } from "chart.js";
import { ref, computed } from "vue";

const years = [2023, 2024, 2025];
const monthlyAverages = ref<Record<number, Record<string, number>>>({});

const getLastDayOfMonth = (year: number, month: number): string => {
  const date = new Date(year, month, 0);
  return String(date.getDate()).padStart(2, '0');
};

const getUrlForYear = (year: number): string => {
  const endMonth = year === 2025 ? 4 : 12;
  const lastDay = getLastDayOfMonth(year, endMonth);
  const month = String(endMonth).padStart(2, '0');
  return `https://historical-forecast-api.open-meteo.com/v1/forecast?latitude=43.5089&longitude=16.4392&start_date=${year}-01-01&end_date=${year}-${month}-${lastDay}&hourly=temperature_2m`;
};

const processYearData = async (year: number) => {
  const res = await fetch(getUrlForYear(year));
  const data = await res.json();

  const tempsByMonth: Record<string, number[]> = {};
  data.hourly.time.forEach((timestamp: string, i: number) => {
    const date = new Date(timestamp);
    const month = date.toLocaleString("en-US", { month: "long" });
    if (!tempsByMonth[month]) tempsByMonth[month] = [];
    tempsByMonth[month].push(data.hourly.temperature_2m[i]);
  });

  monthlyAverages.value[year] = {};
  for (const [month, temps] of Object.entries(tempsByMonth)) {
    const avg = temps.reduce((a, b) => a + b, 0) / temps.length;
    monthlyAverages.value[year][month] = parseFloat(avg.toFixed(2));
  }
};

Promise.all(years.map(processYearData)).catch(console.error);

const chartData = computed((): ChartData<"line"> => {
  const labels = Object.keys(monthlyAverages.value[2023] || {});
  return {
    labels,
    datasets: years.map((year, i) => ({
      label: `${year}`,
      backgroundColor: ['#c82834', '#42A5F5', '#4CAF50'][i],
      borderColor: ['#c82834', '#42A5F5', '#4CAF50'][i],
      data: labels.map(month => monthlyAverages.value[year]?.[month] ?? null),
      tension: 0.3,
      fill: false
    }))
  };
});
const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Average Monthly Temperature (°C)',
    },
    legend: {
      position: 'top'
    }
  }
};
</script>

<template>
  <div class="home">
    <h1 class="title">📉 Temperature in Split (2023–2025)</h1>

    <nav class="nav-links">
      <span>Electricity:</span>
      <NuxtLink to="/barChart" class="chart-link">📊 Bar Chart</NuxtLink>
      <NuxtLink to="/lineChart" class="chart-link">📈 Line Chart</NuxtLink>
    </nav>

    <Line
        v-if="years.every(year => monthlyAverages[year])"
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
</style>
