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
import { type StockInterface } from '@/types/client/stock'
import { LoadingSpinner } from '../LoadingSpinner'
import { handleErrors } from '@/utils/client/handleErrors'
import { useTheme } from 'next-themes'

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
  netWorthDates: Date[]
  setNetWorthDates: (netWorthDates: Date[]) => void
  netWorthValues: number[]
  setNetWorthValues: (netWorthValues: number[]) => void
}

const NetWortHistory: React.FC<Props> = ({
  stocks,
  netWorthDates,
  setNetWorthDates,
  netWorthValues,
  setNetWorthValues
}) => {
  const [loadingData, setLoadingData] = useState(false)
  const { theme } = useTheme()
  const { user } = useUser()
  const chartGridColor = (theme === 'light' ? 'black' : 'white')
  // setChartOptions to change chart UI on active theme change
  const [chartOptions, setChartOptions] = useState({
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
          unit: 'second'
        },
        display: true,
        title: {
          display: true
        },
        grid: {
          color: chartGridColor
        },
        ticks: {
          color: chartGridColor,
          font: {
            color: chartGridColor
          }
        }
      },
      y: {
        display: true,
        title: {
          display: false,
          text: 'Net Worth'
        },
        grid: {
          color: chartGridColor
        },
        ticks: {
          color: chartGridColor,
          font: {
            color: chartGridColor
          }
        }
      }
    }
  })

  useEffect(() => {
    const newColor = (theme === 'light' ? 'black' : 'white')

    setChartOptions(prevState => ({
      ...prevState,
      scales: {
        ...prevState.scales,
        x: {
          ...prevState.scales.x,
          grid: {
            ...prevState.scales.x.grid,
            color: newColor
          },
          ticks: {
            ...prevState.scales.x.ticks,
            color: newColor,
            font: {
              ...prevState.scales.x.ticks.font,
              color: newColor
            }
          }
        },
        y: {
          ...prevState.scales.y,
          grid: {
            ...prevState.scales.y.grid,
            color: newColor
          },
          ticks: {
            ...prevState.scales.y.ticks,
            color: newColor,
            font: {
              ...prevState.scales.y.ticks.font,
              color: newColor
            }
          }
        }
      }
    }))
  }, [theme])

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
        const values: number[] = history.values
        const dates: Date[] = history.dates

        setNetWorthValues(values)
        setNetWorthDates(dates)

        // difference between first and last writes
        const timeDiff = new Date(dates[dates.length - 1]).getTime() - new Date(dates[0]).getTime()
        const hour = 3.6e+6

        let timeScale: string
        if (timeDiff < 2 * hour) {
          timeScale = 'second'
        } else if (timeDiff < 24 * hour) {
          timeScale = 'hour'
        } else if (24 * hour <= timeDiff && timeDiff < 4 * 30 * 24 * hour) {
          timeScale = 'day'
        } else {
          timeScale = 'month'
        }

        // update scale on x-axis on data change
        setChartOptions(prevState => ({
          ...prevState,
          scales: {
            ...prevState.scales,
            x: {
              ...prevState.scales.x,
              time: {
                ...prevState.scales.x.time,
                unit: timeScale
              }
            }
          }
        }))

        setLoadingData(false)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  return (
    <div className='w-full h-full flex px-2 justify-center items-center'>
      {loadingData
        ? <LoadingSpinner size={36} />
        : <Line
          data={{
            labels: netWorthDates,
            datasets: [
              {
                label: 'Total Net Worth',
                data: netWorthValues,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                fill: true
              }
            ]
          }}
          options={chartOptions}
        />
      }
    </div>
  )
}

export default NetWortHistory
