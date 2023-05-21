import React, { useState } from 'react'
import { DeleteStockModal } from './DeleteStockModal'
import { OrderDropDown } from './OrderDropdown'
import StockChartModal from './StockChartModal'
import { type StockInterface, type PurchaseInterface } from '@/types/client/stock'

interface Props {
  stock: StockInterface
  deleteStock: (ticker: string, amount: number) => void
}

export const Stock: React.FC<Props> = ({ stock, deleteStock }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [period, setPeriod] = useState('6m')
  const [loadingData, setLoadingData] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [stockHistory, setStockHistory] = useState({ ticker: '', dates: [], values: [] })
  const [stockChartLoadingError, setStockChartLoadingError] = useState('')

  function handleChartDisplay (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation()
    setLoadingData(true)
    setDataLoaded(false)
    setStockChartLoadingError('')

    fetch('api/stock_chart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        period,
        ticker: stock.ticker
      })
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Failed to load data.')
        }
        return await response.json()
      })
      .then((tickerData) => {
        setLoadingData(false)
        setDataLoaded(true)
        setStockHistory(tickerData)
      })
      .catch(error => {
        setLoadingData(false)
        setDataLoaded(true)

        setStockChartLoadingError(error.message)
      })
  }

  function handleDropdownClick (value: string) {
    setPeriod(value)
  }

  function expand () {
    setExpanded(!expanded)
    if (loadingData || dataLoaded) {
      setLoadingData(false)
      setDataLoaded(false)
    }
  }

  return (
    <>
      <div
        className="bg-white dark:border-none border-blue-600 border-solid border-[1px] rounded px-3 sm:px-6 md:px-8 py-3 my-2 text-black font-medium text-xs sm:text-sm leading-snug cursor-pointer uppercase hover:shadow-xl transition duration-150 ease-in-out"
        onClick={() => { expand() }}
      >
        <div className="flex flex-row items-center">

          <div className="w-full h-full flex items-start">
            <div className="w-[52px] xsm:w-24 md:w-[81px] font-bold text-justify">{stock.ticker}</div>
            <div className="w-14 xsm:w-[76px] md:w-24 flex justify-center">{stock.amount}</div>
            <div className="w-14 xsm:w-[76px] md:w-24 flex justify-center">{stock.prevClose.toFixed(2)}</div>
            <div className="w-14 xsm:w-[76px] md:w-24 flex justify-center">
              {stock.avgPercentageChange >= 0
                ? <div className="text-green-600">{`+${stock.avgPercentageChange}%`}</div>
                : <div className="text-red-600">{`${stock.avgPercentageChange}%`}</div>
              }
            </div>
          </div>
          <div onClick={() => { setShowDeleteModal(true) }} id={stock.ticker} className="rounded-full p-1 transition duration-150 hover:bg-red-100 ease-in-out">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </div>
        </div>

        <div>
          {expanded &&
            <div className="flex flex-col items-start justify-start space-y-2">
              <div>
                <hr className="bg-gray-300 w-full h-[1px] mt-1 border-0" />
                <div className="flex flex-row mt-4">
                  <div className="w-[52px] xsm:w-24 md:w-[81px] font-bold text-justify">DATE</div>
                  <div className="w-14 xsm:w-[76px] md:w-24 flex justify-center font-bold">AMOUNT</div>
                  <div className="w-14 xsm:w-[76px] md:w-24 flex justify-center font-bold">PRICE</div>
                  <div className="w-14 xsm:w-[76px] md:w-24 flex justify-center font-bold">CHANGE</div>
                </div>
              </div>

              <div>
                {stock.purchaseHistory.map((purchase: PurchaseInterface, i) => {
                  let [year, month, day] = purchase.date.split('-')
                  if (day.length === 1) day = '0' + day
                  if (month.length === 1) month = '0' + month
                  year = year.substring(2, 4)

                  return (
                    <div key={i} className="flex flex-row">
                      <div className="w-[52px] xsm:w-24 md:w-[81px] flex justify-start tabular-nums">
                        {day}-{month}-{year}
                      </div>
                      <div className="w-14 xsm:w-[76px] md:w-24 flex justify-center">
                        {purchase.amount}
                      </div>
                      <div className="w-14 xsm:w-[76px] md:w-24 flex justify-center">
                        {purchase.currentPrice}
                      </div>
                      <div className="w-14 xsm:w-[76px] md:w-24 flex justify-center">
                        {purchase.relativeChange >= 0
                          ? <div className="text-green-600">{'+' + purchase.relativeChange.toFixed(1) + '%'}</div>
                          : <div className="text-red-600">{purchase.relativeChange.toFixed(1) + '%'}</div>
                        }
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex w-full justify-center items-center gap-2">
                <OrderDropDown values={['6m', '1y', '2y', '5y']} orderDropdownValue={period} setOrderDropdownValue={setPeriod} handleClick={handleDropdownClick} theme={'light'} />
                <button
                  onClick={(e) => { handleChartDisplay(e) }}
                  className="z-10 relative flex flex-row min-w-[105px] xsm:min-w-[124px] justify-center items-center py-1 text-white bg-blue-600 font-medium text-[12px] xsm:text-xs leading-snug uppercase rounded whitespace-nowrap shadow-md hover:bg-blue-700 hover:text-white hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                >
                  Display chart
                </button>
              </div>

              {(loadingData || dataLoaded) &&
                <StockChartModal stockTicker={stock.ticker} stockHistory={stockHistory} purchaseHistory={stock.purchaseHistory} loadingData={loadingData} dataLoaded={dataLoaded} stockChartLoadingError={stockChartLoadingError} />
              }
            </div>
          }

        </div>
      </div>
      <DeleteStockModal showDeleteModal={showDeleteModal} setShowDeleteModal={setShowDeleteModal} deleteStock={deleteStock} stock={stock} />
    </>
  )
}