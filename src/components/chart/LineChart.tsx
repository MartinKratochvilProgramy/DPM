import React, { useEffect, useRef } from "react";
import { createChart, LineData, ColorType } from "lightweight-charts";
import { chartColor } from "../MainPage/RelativeChangeHistory";

export interface Series {
    data: LineData[]; 
    color: string;
    type: 'area' | 'line';
}

interface LineChartProps {
    series: Series[];  
    width?: number;
    height?: number;
}

const LineChart: React.FC<LineChartProps> = ({ series, width = 600, height = 300 }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    chartRef.current = createChart(chartContainerRef.current, {
      width,
      height,
      layout: {
        background: { type: ColorType.Solid, color: 'rgba(0, 0, 0, 0)' },
        textColor: chartColor,
      },
      grid: {
        vertLines: {
          color: chartColor,
        },
        horzLines: {
          color: chartColor,
        },
      },
      timeScale: {
        fixLeftEdge: true,
        fixRightEdge: true,
        borderVisible: false
      },
      rightPriceScale: {
        borderVisible: false
      }
    });

    chartRef.current.timeScale().fitContent();
    

    // Add data to series
    seriesRef.current = series.map(({ data, color, type }) => {
        if (type === 'area') {
            const areaSeries = chartRef.current!.addAreaSeries({
                lineColor: color, // Color of the line
                topColor: color, // Gradient color near the line
                bottomColor: "rgba(255, 255, 255, 0.28)", // Gradient color at the bottom
                lineWidth: 1, // Line thickness
            });
            areaSeries.setData(data);
            
            return areaSeries;
        } else if (type === 'line') {
            const lineSeries = chartRef.current!.addLineSeries({
                color,
                lineWidth: 1,
              });
              lineSeries.setData(data);
              return lineSeries;
        }
      });

    return () => {
      // Clean up the chart
      chartRef.current?.remove();
    };
  }, [series, width, height]);

  return <div ref={chartContainerRef} />;
};

export default LineChart;
