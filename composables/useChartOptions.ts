import type { ChartOptions, TooltipItem } from 'chart.js'

export function useChartOptions<T extends 'bar' | 'line'>(
    type: T,
    title: string = 'Electricity'
): ChartOptions<T> {
    return {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context: TooltipItem<T>) => {
                        const value = (context.parsed as { y: number }).y
                        return `€ ${Number(value).toFixed(2)}`
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
                    callback: (value: string | number) => `€ ${value}`
                }
            }
        }
    } as unknown as ChartOptions<T>
}
