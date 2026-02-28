import type { Ref } from 'vue'
import { computed } from 'vue'
import type { ChartData, ChartTypeRegistry } from 'chart.js'

export function useChartData<T extends keyof ChartTypeRegistry, V extends Record<string, any>>(
    source: Ref<Record<string, V[]>>,
    type: T,
    valueField: keyof V,
    labelField: keyof V
) {
    return computed(() => {
        const years = Object.keys(source.value)
        if (!years.length) {
            return {
                labels: [],
                datasets: []
            } as ChartData<T>
        }

        const labels = source.value[years[0]].map(item => item[labelField] as string)
        const colors = ['#c82834', '#42A5F5', '#4CAF50', '#FF9800']

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
                data: source.value[year].map(item => item[valueField])
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
