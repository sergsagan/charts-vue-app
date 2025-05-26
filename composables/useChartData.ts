import type { Ref } from 'vue'
import { computed } from 'vue'
import type {
    ChartData,
    ChartTypeRegistry
} from 'chart.js'

type ElectricityValue = {
    month: string
    amount: number
}

export function useChartData<T extends keyof ChartTypeRegistry>(
    electricity: Ref<Record<string, ElectricityValue[]>>,
    type: T
) {
    return computed(() => {
        const years = Object.keys(electricity.value)
        if (!years.length) {
            return {
                labels: [],
                datasets: []
            } as ChartData<T>
        }

        const labels = electricity.value[years[0]].map(item => item.month)
        const colors = ['#c82834', '#42A5F5', '#4CAF50']

        const datasets = years.map((year, index) => {
            const dataset: {
                label: string
                backgroundColor: string
                borderColor: string
                data: number[]
                tension?: number
                fill?: boolean
            } = {
                label: year,
                backgroundColor: colors[index % colors.length],
                borderColor: colors[index % colors.length],
                data: electricity.value[year].map(item => item.amount)
            }

            if (type === 'line') {
                dataset.tension = 0.3
                dataset.fill = false
            }

            return dataset
        })

        return {
            labels,
            datasets
        } as unknown as ChartData<T, number[], string>
    })
}
