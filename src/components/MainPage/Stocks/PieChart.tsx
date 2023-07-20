import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import { useTheme } from 'next-themes'
import { type StockInterface } from '@/types/api/stock'

interface Props {
  stocks: StockInterface[]
}

const PieChart: React.FC<Props> = ({ stocks }) => {
  const { theme } = useTheme()

  const chartRef = useRef(null)

  const darkThemeChartColor = '#9ca3af'
  const lightThemeChartColor = '#374151'

  useEffect(() => {
    const chartCanvas = chartRef.current

    if (chartCanvas === null) return

    let netWorth = 0

    for (let i = 0; i < stocks.length; i++) {
      const stock = stocks[i]

      netWorth += stock.prevClose * stock.amount
    }

    const chartInstance = new Chart(chartCanvas, {
      type: 'pie',
      data: {
        labels: stocks.map(stock => stock.ticker),
        datasets: [
          {
            data: stocks.map(stock => stock.prevClose * stock.amount),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        animation: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: theme === 'dark' ? darkThemeChartColor : lightThemeChartColor
            }
          },
          title: {
            display: false,
            text: 'Net Worth'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                const label = context.label || ''
                if (label.includes('(')) return label
                const value = context.dataset.data[context.dataIndex]
                const percentage = ((value / netWorth) * 100).toFixed(2)
                return `${label} (${percentage}%)`
              }
            }
          }
        }
      }
    })

    return () => {
      // Cleanup the chart instance when the component unmounts
      chartInstance.destroy()
    }
  }, [stocks, theme])

  return (
    <div className='w-9/12 h-9/12 flex justify-center items-center pb-2'>
      <canvas ref={chartRef} />
    </div>
  )
}

export default PieChart
