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
  Legend
} from 'chart.js'
import 'chartjs-adapter-moment'
import { Line } from 'react-chartjs-2'
import { useUser } from '@auth0/nextjs-auth0/client'
import { formatDate } from '@/utils/client/formatDate'

ChartJS.register(
  TimeScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const BarChart = () => {
  const [chartData, setChartData] = useState({
    datasets: []
  })

  const { user } = useUser()

  const [chartOptions, setChartOptions] = useState({})

  useEffect(() => {
    fetch('api/net_worth_history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: user?.email
      })
    })
      .then(async response => await response.json())
      .then((history) => {
        const labels = []
        const data = []
        for (const item of history) {
          labels.push(formatDate(item.date))
          data.push(item.netWorth)
        }

        // difference between first and last writes
        const timeDiff = new Date(history[history.length - 1].date).getTime() - new Date(history[0].date).getTime()
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
          labels,
          datasets: [
            {
              label: 'Dataset 1',
              data,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)'
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
              display: true,
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
                display: true,
                text: 'Month'
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
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  return (
    <div className='w-full flex bg-white'>
      <Line data={chartData} options={chartOptions} />
    </div>
  )
}

export default BarChart
