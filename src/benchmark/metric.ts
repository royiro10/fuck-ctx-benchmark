


export interface BenchmarkRunMetrics {
    total: number;
    average: number;
    median: number;
    min: number;
    max: number;
    stdDev: number;
    percentiles: Array<{ percentile: number, value: number }>
}

export function calcBenchmarkMetric(times: Array<number>): BenchmarkRunMetrics {
    const total = times.reduce((acc, time) => acc + time, 0);
    const average = total / times.length;
    const median = times.sort((a, b) => a - b)[Math.floor(times.length / 2)];
    const min = Math.min(...times);
    const max = Math.max(...times);
    const stdDev = Math.sqrt(times.reduce((acc, time) => acc + Math.pow(time - average, 2), 0) / times.length);

    const percentiles = [90, 95, 99].map(p => {
        const index = Math.ceil(p / 100 * times.length) - 1;
        return { percentile: p, value: times[index] };
    });

    return { total, average, median, min, max, stdDev, percentiles }
}

const DECIMAL_PERCSION = 3
export function formatMetric(metrics: BenchmarkRunMetrics): string {
    const rows = [
        `Average time: ${metrics.average.toFixed(DECIMAL_PERCSION)} ms`,
        `Median time: ${metrics.median.toFixed(DECIMAL_PERCSION)} ms`,
        `Min time: ${metrics.min.toFixed(DECIMAL_PERCSION)} ms`,
        `Max time: ${metrics.max.toFixed(DECIMAL_PERCSION)} ms`,
        `Standard deviation: ${metrics.stdDev.toFixed(DECIMAL_PERCSION)} ms`,
        ...metrics.percentiles.map(p => `${p.percentile}th percentile time: ${p.value.toFixed(DECIMAL_PERCSION)} ms`)
    ]

    return rows.join('\n')
}

