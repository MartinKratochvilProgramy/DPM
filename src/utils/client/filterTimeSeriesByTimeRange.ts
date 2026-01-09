import { DateRange } from "@/types/client/dateRange";
import { TimeSeries } from "@/types/client/timeSeries";

// Helper to filter TimeSeries based on dateRange
export function filterTimeSeriesByRange(series: TimeSeries, dateRange: DateRange): TimeSeries {
    if (dateRange === 'ALL') return series;
    if (series.values.length === 0) return series;

    const currentYear = new Date().getFullYear();
    const filtered: TimeSeries = { dates: [], values: [] };

    const dates: Date[] = [];
    const values: number[] = [];

    // filter for current year
    series.dates.forEach((date, i) => {
        if (new Date(date).getFullYear() === currentYear) {
            dates.push(date);
            values.push(series.values[i]);
        }
    });

    return { dates, values };
}

export function normalizeTimeSeries(series: TimeSeries): TimeSeries {
    if (series.values.length === 0) return series;

    const baseValue = series.values[0];

    return {
        dates: [...series.dates],
        values: series.values.map(value => value - baseValue),
    };
}

export function normalizeGeometricTimeSeries(series: TimeSeries): TimeSeries {
    if (series.values.length === 0) return series;

    const baseValue = series.values[0];

    return {
        dates: [...series.dates],
        values: series.values.map(value => value / baseValue),
    };
}
