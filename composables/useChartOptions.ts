import type { ChartOptions, TooltipItem } from 'chart.js'

export function useChartOptions<T extends 'bar' | 'line'>(
    type: T,
    title: string,
    unit: string = ''
): ChartOptions<T> {
    return {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context: TooltipItem<T>) => {
                        const value = (context.parsed as { y: number }).y
                        const dataset = context.dataset as { label: string }
                        return `${dataset.label}: ${value.toFixed(1)}${unit}`
                    }
                }
            },
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: title
            }
        },
        scales: {
            y: {
                ticks: {
                    callback: (value: string | number) => `${value}${unit}`
                }
            }
        }
    } as unknown as ChartOptions<T>
}
