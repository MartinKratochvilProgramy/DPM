import React from 'react'
import { type TickerHintI } from './StockInput'

interface Props {
  tickerHint: TickerHintI
}

const TickerHint: React.FC<Props> = ({ tickerHint }) => {
  return (
    <div className='z-10 w-full flex flex-col bg-white'>
      <div>{tickerHint.symbol}</div>
      <div>{tickerHint.name}</div>
    </div>
  )
}

export default TickerHint
