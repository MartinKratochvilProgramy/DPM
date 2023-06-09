import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Colors } from 'chart.js'
import { type StockInterface } from '@/types/api/stock'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useTheme } from 'next-themes'

ChartJS.register(ArcElement, Tooltip, Legend, Colors)

interface Props {
  stocks: StockInterface[]
  stocksLoaded: boolean
}

const PieChart: React.FC<Props> = ({ stocks, stocksLoaded }) => {
  const { theme } = useTheme()

  const data = {
    labels: stocks.map(stock => stock.ticker), // Assuming each stock has a label property
    datasets: [
      {
        data: stocks.map(stock => stock.amount * stock.prevClose),
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
  }

  const darkThemeChartColor = '#9ca3af'
  const lightThemeChartColor = '#374151'

  return (
    <div className='p-4 flex justify-center items-center w-full h-full'>
      { stocksLoaded
        ? <Pie
          width={'100%'}
          height={'100%'}
          data={data}
          options={{
            plugins: {
              legend: {
                labels: {
                  color: theme === 'dark' ? darkThemeChartColor : lightThemeChartColor
                }
              }
            }
          }}
        />
        : <LoadingSpinner size={70} />

      }
    </div>
  )
}

export default PieChart
