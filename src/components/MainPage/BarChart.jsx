import React, { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useUser } from '@auth0/nextjs-auth0/client'
import { formatDate } from '@/utils/client/formatDate'

ChartJS.register(
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
        console.log(history)
        const labels = []
        const data = []
        for (const item of history) {
          labels.push(formatDate(item.date))
          data.push(item.netWorth)
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
              position: 'top'
            },
            yaxis: {
              title: 'Daily Mean Temperature'
            },
            title: {
              display: true,
              text: 'Total net Worth'
            },
            xaxis: {
              type: 'date',
              title: 'January Weather'
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
