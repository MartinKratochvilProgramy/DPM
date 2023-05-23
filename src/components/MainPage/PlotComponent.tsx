import React from 'react'
import dynamic from 'next/dynamic'
// import { type Data, type Layout } from 'plotly.js'

const PlotlyChart = dynamic(async () => await import('react-plotly.js'), { ssr: false })

interface Props {
  data: any
  layout: any
}

const PlotComponent: React.FC<Props> = ({ data, layout }) => {
  // const data = [
  //   {
  //     x: [1, 2, 3, 4],
  //     y: [10, 15, 13, 17],
  //     type: 'scatter'
  //   }
  // ]

  // const layout = {
  //   title: 'My Plot'
  // }

  return (
    <PlotlyChart className="w-full h-full" data={data} layout={layout} useResizeHandler />
  )
}

export default PlotComponent
