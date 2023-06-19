import React from 'react'
import { type TickerHintI } from './StockInput'

interface Props {
  tickerHint: TickerHintI
  setSelectedTicker: (selectedTicker: string) => void
  setTickerHints: (tickerHints: TickerHintI[]) => void
  setFetchTickers: (fetchTickers: boolean) => void
}

const TickerHint: React.FC<Props> = ({
  tickerHint,
  setSelectedTicker,
  setTickerHints,
  setFetchTickers
}) => {
  function handleTickerSelect () {
    setSelectedTicker(tickerHint.symbol)
    setTickerHints([])
    setFetchTickers(false)
  }

  return (
    <div
      className='z-10 px-2 py-0 w-full flex flex-col bg-gray-50 hover:bg-gray-100 border-b border-b-gray-300 cursor-pointer'
      onClick={handleTickerSelect}
    >
      <div className='font-bold'>{tickerHint.symbol}</div>
      <div className='text-start'>{tickerHint.name}</div>
    </div>
  )
}

export default TickerHint
