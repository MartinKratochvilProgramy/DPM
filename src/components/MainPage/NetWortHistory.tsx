import React, { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  TimeScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import 'chartjs-adapter-moment'
import { Line } from 'react-chartjs-2'
import { useUser } from '@auth0/nextjs-auth0/client'
import { formatDate } from '@/utils/client/formatDate'
import { type StockInterface } from '@/types/client/stock'
import { LoadingSpinner } from '../LoadingSpinner'
import { handleErrors } from '@/utils/client/handleErrors'

ChartJS.register(
  TimeScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface Props {
  stocks: StockInterface
}

const NetWortHistory: React.FC<Props> = ({ stocks }) => {
  const [chartData, setChartData] = useState<any>({
    datasets: []
  })
  const [chartOptions, setChartOptions] = useState({})
  const [loadingData, setLoadingData] = useState(false)

  const { user } = useUser()

  useEffect(() => {
    setLoadingData(true)
    fetch('api/net_worth_history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: user?.email
      })
    })
      .then(handleErrors)
      .then(response => response.json())
      .then((history) => {
        console.log(history)

        const values = history.values
        const dates: Date[] = history.dates

        // for (const date of history.dates) {
        //   dates.push(formatDate(date))
        // }

        console.log(dates)

        // difference between first and last writes
        const timeDiff = new Date(dates[dates.length - 1]).getTime() - new Date(dates[0]).getTime()
        const day = 8.64e+7

        let timeScale
        if (timeDiff < day) {
          timeScale = 'hour'
        } else if (day <= timeDiff && timeDiff < 4 * 30 * day) {
          timeScale = 'day'
        } else {
          timeScale = 'month'
        }

        setChartData({
          dates,
          datasets: [
            {
              label: 'Total Net Worth',
              values,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.1)',
              fill: true
            }
          ]
        })
        setChartOptions({
          responsive: true,
          plugins: {
            legend: {
              display: false,
              position: 'top'
            },
            title: {
              display: false,
              text: 'Total net Worth'
            }
          },
          scales: {
            x: {
              type: 'time',
              time: {
                unit: timeScale
              },
              display: true,
              title: {
                display: true
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Net Worth'
              }
            }
          }
        })
        setLoadingData(false)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [stocks])

  return (
    <div className='w-full h-full flex justify-center items-center'>
      {loadingData
        ? <LoadingSpinner size={36} />
        : <Line data={chartData} options={chartOptions} />
      }
    </div>
  )
}

export default NetWortHistory
