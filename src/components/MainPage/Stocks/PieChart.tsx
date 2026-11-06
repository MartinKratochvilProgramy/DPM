import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useTheme } from 'next-themes';
import { type StockInterface } from '@/types/api/stock';

interface Props {
  stocks: StockInterface[];
}

const backgroundColors = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(255, 159, 64, 0.2)',
];

const borderColors = [
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)',
];

const PieChart: React.FC<Props> = ({ stocks }) => {
  const { theme } = useTheme();

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const darkThemeChartColor = '#9ca3af';
  const lightThemeChartColor = '#374151';

  useEffect(() => {
    const chartCanvas = chartRef.current;

    if (chartCanvas === null) return;

    const chartInstance = new Chart(chartCanvas, {
      type: 'pie',
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: darkThemeChartColor,
            },
          },
          title: {
            display: false,
            text: 'Net Worth',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                const label = context.label || '';
                if (label.includes('(')) return label;
                const values = context.dataset.data as number[];
                const total = values.reduce((sum, value) => sum + value, 0);
                const value = values[context.dataIndex];
                const percentage =
                  total === 0 ? '0.00' : ((value / total) * 100).toFixed(2);
                return `${label} (${percentage}%)`;
              },
            },
          },
        },
      },
    });

    chartInstanceRef.current = chartInstance;

    return () => {
      // Cleanup the chart instance when the component unmounts
      chartInstance.destroy();
      chartInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chartInstance = chartInstanceRef.current;
    if (chartInstance === null) return;

    chartInstance.data.labels = stocks.map((stock) => stock.ticker);
    chartInstance.data.datasets[0].data = stocks.map(
      (stock) => stock.prevClose * stock.amount,
    );
    chartInstance.update('none');
  }, [stocks]);

  useEffect(() => {
    const chartInstance = chartInstanceRef.current;
    if (chartInstance === null) return;

    const legend = chartInstance.options.plugins?.legend;
    if (legend?.labels) {
      legend.labels.color =
        theme === 'dark' ? darkThemeChartColor : lightThemeChartColor;
    }
    chartInstance.update('none');
  }, [theme]);

  return (
    <div className="relative w-9/12 h-9/12 flex justify-center items-center pb-2">
      <canvas ref={chartRef} />
    </div>
  );
};

export default PieChart;
