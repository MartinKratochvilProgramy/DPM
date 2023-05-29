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
  netWorthDates: Date[]
  setNetWorthDates: (netWorthDates: Date[]) => void
  netWorthValues: number[]
  setNetWorthValues: (netWorthValues: number[]) => void
  setError: (error: string) => void
}

type TimeScaleInterface = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'

const NetWortHistory: React.FC<Props> = ({
  netWorthDates,
  setNetWorthDates,
  netWorthValues,
  setNetWorthValues,
  setError
}) => {
  const [loadingData, setLoadingData] = useState(false)
  const { theme } = useTheme()
  const { user } = useUser()
  const [timeScale, setTimeScale] = useState<TimeScaleInterface>('second')

  const darkThemeChartColor = '#9ca3af'
  const lightThemeChartColor = '#374151'

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

        let newTimeScale: TimeScaleInterface
        if (timeDiff < 2 * hour) {
          newTimeScale = 'second'
        } else if (timeDiff < 24 * hour) {
          newTimeScale = 'hour'
        } else if (24 * hour <= timeDiff && timeDiff < 4 * 30 * 24 * hour) {
          newTimeScale = 'day'
        } else if (4 * 30 * 24 * hour <= timeDiff && timeDiff < 2 * 8760 * hour) {
          newTimeScale = 'month'
        } else {
          newTimeScale = 'year'
        }

        setTimeScale(newTimeScale)

        setLoadingData(false)
      })
      .catch((error) => {
        setError(error)
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
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false,
                position: 'top'
              },
              title: {
                display: false,
                text: 'Total Net Worth'
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
                },
                grid: {
                  color: theme === 'light' ? lightThemeChartColor : darkThemeChartColor
                },
                ticks: {
                  color: theme === 'light' ? lightThemeChartColor : darkThemeChartColor
                }
              },
              y: {
                display: true,
                title: {
                  display: false,
                  text: 'Net Worth'
                },
                grid: {
                  color: theme === 'light' ? lightThemeChartColor : darkThemeChartColor
                },
                ticks: {
                  color: theme === 'light' ? lightThemeChartColor : darkThemeChartColor
                }
              }
            }
          }}
        />
      }
    </div>
  )
}

export default NetWortHistory
