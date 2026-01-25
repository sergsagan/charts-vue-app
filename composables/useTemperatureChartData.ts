import { ref, computed } from 'vue'
import type { ChartData } from 'chart.js'

type MonthlyAverages = Record<number, Record<string, number>>

const years = [2023, 2024, 2025]
const colors = ['#c82834', '#42A5F5', '#4CAF50']

const getLastDayOfMonth = (year: number, month: number): string => {
    const date = new Date(year, month, 0)
    return String(date.getDate()).padStart(2, '0')
}

const getUrlForYear = (year: number): string => {
    const endMonth = 12
    const lastDay = getLastDayOfMonth(year, endMonth)
    const month = String(endMonth).padStart(2, '0')
    return `https://historical-forecast-api.open-meteo.com/v1/forecast?latitude=43.5089&longitude=16.4392&start_date=${year}-01-01&end_date=${year}-${month}-${lastDay}&hourly=temperature_2m`
}

export function useTemperatureChartData() {
    const isLoading = ref(true)
    const monthlyAverages = ref<MonthlyAverages>({})

    const processYearData = async (year: number) => {
        const res = await fetch(getUrlForYear(year))
        const data = await res.json()

        const tempsByMonth: Record<string, number[]> = {}
        data.hourly.time.forEach((timestamp: string, i: number) => {
            const date = new Date(timestamp)
            const month = date.toLocaleString('en-US', { month: 'long' })
            if (!tempsByMonth[month]) tempsByMonth[month] = []
            tempsByMonth[month].push(data.hourly.temperature_2m[i])
        })

        monthlyAverages.value[year] = {}
        for (const [month, temps] of Object.entries(tempsByMonth)) {
            const avg = temps.reduce((a, b) => a + b, 0) / temps.length
            monthlyAverages.value[year][month] = parseFloat(avg.toFixed(2))
        }
    }

    Promise.all(years.map(processYearData))
        .then(() => {
            isLoading.value = false
        })
        .catch(console.error)

    const chartData = computed<ChartData<'line'>>(() => {
        const labels = Object.keys(monthlyAverages.value[2023] || {})

        return {
            labels,
            datasets: years.map((year, i) => ({
                label: `${year}`,
                backgroundColor: colors[i],
                borderColor: colors[i],
                data: labels.map(month => monthlyAverages.value[year]?.[month] ?? null),
                tension: 0.3,
                fill: false
            }))
        }
    })

    return {
        chartData,
        isLoading,
        years
    }
}
