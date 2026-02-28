import type { ChartData } from 'chart.js'

export function buildChartData<T extends 'bar' | 'line'>(
    years: string[],
    labels: string[],
    dataMap: Record<string, Record<string, number>>,
    type: T
): ChartData<T> {
    const colors = ['#c82834', '#42A5F5', '#4CAF50', '#FF9800']

    return {
        labels,
        datasets: years.map((year, i) => ({
            label: year,
            backgroundColor: colors[i % colors.length],
            borderColor: colors[i % colors.length],
            data: labels.map(label => dataMap[year]?.[label] ?? null),
            ...(type === 'line' ? { tension: 0.3, fill: false } : {})
        }))
    } as unknown as ChartData<T, number[], string>
}
