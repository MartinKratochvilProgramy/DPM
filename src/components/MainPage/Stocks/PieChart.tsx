import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import { useTheme } from 'next-themes'
import { type StockInterface } from '@/types/api/stock'

interface Props {
  stocks: StockInterface[]
  stocksLoaded: boolean
}

const PieChart: React.FC<Props> = ({ stocks, stocksLoaded }) => {
  const { theme } = useTheme()

  const chartRef = useRef(null)

  const darkThemeChartColor = '#9ca3af'
  const lightThemeChartColor = '#374151'

  let firstLoad = true

  useEffect(() => {
    const chartCanvas = chartRef.current

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
        animation: true,
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
          }
        }
      }
    })

    if (firstLoad) firstLoad = false

    return () => {
      // Cleanup the chart instance when the component unmounts
      chartInstance.destroy()
    }
  }, [stocks, theme])

  return (
    <div className='w-8/12 h-8/12 flex justify-center items-center'>
      <canvas ref={chartRef} />
    </div>
  )
}

export default PieChart
