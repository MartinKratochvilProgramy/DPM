import React, { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const ChartComponent = () => {
  const chartRef = useRef(null)
  const chartInstanceRef = useRef(null)

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d')

    // Define your chart data and options
    const chartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [
        {
          label: 'Sample Dataset',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    }

    const chartOptions = {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }

    // Create the chart instance
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: chartOptions
    })

    // Cleanup function
    return () => {
      // Destroy the chart instance when the component unmounts
      chartInstanceRef.current.destroy()
    }
  }, [])

  return (
    <div className='w-full h-full p-12'>
      <h2>Chart Example</h2>
      <canvas ref={chartRef} style={{ width: '10%', height: '10%' }}></canvas>
    </div>
  )
}

export default ChartComponent
