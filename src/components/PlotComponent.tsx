import React from 'react'
import dynamic from 'next/dynamic'

const PlotlyChart = dynamic(async () => await import('react-plotly.js'), { ssr: false })

const PlotComponent: React.FC = () => {
  const data = [
    {
      x: [1, 2, 3, 4, 5],
      y: [1, 2, 4, 8, 16],
      type: 'scatter',
      mode: 'lines+markers',
      marker: { color: 'red' }
    }
  ]

  const layout = {
    title: 'Plotly Graph',
    xaxis: { title: 'X-axis' },
    yaxis: { title: 'Y-axis' }
  }

  return (
    <PlotlyChart className="w-full" data={data} layout={layout} useResizeHandler />
  )
}

export default PlotComponent
