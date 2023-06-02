import React, { useState } from 'react'
import { DeleteStockModal } from './DeleteStockModal'
import { OrderDropDown } from './OrderDropdown'
import StockChartModal from './StockChartModal'
import { type StockInterface, type PurchaseInterface } from '@/types/client/stock'
import { formatDate } from '@/utils/client/formatDate'
import { useTheme } from 'next-themes'

interface Props {
  stock: StockInterface
  deleteStock: (ticker: string) => void
  deletePurchase: (ticker: string, purchaseId: number) => void
}

export const Stock: React.FC<Props> = ({
  stock,
  deleteStock,
  deletePurchase
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [period, setPeriod] = useState('6m')
  const [loadingData, setLoadingData] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [stockHistory, setStockHistory] = useState({ ticker: '', dates: [], values: [] })
  const [stockChartLoadingError, setStockChartLoadingError] = useState('')
  const [amountToDelete, setAmountToDelete] = useState(0)
  const [purchaseId, setPurchaseId] = useState<number | null>(null)
  const { theme } = useTheme()

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

  function expand (e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation()
    setExpanded(!expanded)
    if (loadingData || dataLoaded) {
      setLoadingData(false)
      setDataLoaded(false)
    }
  }

  function openDeleteStockModal (e: React.MouseEvent<HTMLDivElement, MouseEvent>, amountToDelete: number, purchaseIdToDelete: number | null) {
    e.stopPropagation()
    setAmountToDelete(amountToDelete)
    setPurchaseId(purchaseIdToDelete)
    setShowDeleteModal(true)
  }

  return (
    <>
      <div
        className="bg-white dark:bg-transparent border-solid border-[1px] border-blue-400 dark:border-gray-500 rounded-md px-2 md:px-4 md:py-1 my-1 text-black dark:text-gray-400 font-medium text-[10px] sm:text-sm leading-snug cursor-pointer uppercase hover:shadow-lg transition duration-150 ease-in-out"
        onClick={(e) => { expand(e) }}
      >
        <div className="flex flex-row w-full items-center justify-between mb-1">
          <div className='flex flex-row justify-start sm:justify-start w-full max-w-[400px] px-1 dark:text-gray-100'>
            <div className="w-[40px] sm:w-[50px] md:w-[60px] xl:w-[64px] 2xl:w-[74px] flex justify-start">{stock.ticker}</div>
            <div className="w-[40px] sm:w-[50px] md:w-[60px] xl:w-[64px] 2xl:w-[74px] flex justify-center">{stock.amount}</div>
            <div className="w-[40px] sm:w-[50px] md:w-[60px] xl:w-[64px] 2xl:w-[74px] flex justify-center">{stock.prevClose.toFixed(2)}</div>
            <div className="w-[40px] sm:w-[50px] md:w-[60px] xl:w-[64px] 2xl:w-[74px] flex justify-center">
              {stock.avgPercentageChange >= 0
                ? <div className="text-green-600">{`+${stock.avgPercentageChange}%`}</div>
                : <div className="text-red-600">{`${stock.avgPercentageChange}%`}</div>
              }
            </div>
          </div>
          <div
            onClick={(e) => { openDeleteStockModal(e, stock.amount, null) }}
            id={stock.ticker}
            className="rounded-full p-1 transition duration-150 hover:bg-red-100 dark:hover:bg-red-500 dark:hover:bg-opacity-50 ease-in-out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke={theme === 'light' ? 'black' : 'white'} className="w-4 md:w-6 h-4 md:h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </div>
        </div>

        {expanded &&
            <div className="flex flex-col items-start justify-start border-t-[1px] border-t-gray-300 dark:border-t-gray-500 space-y-2">
              <div className="flex flex-row justify-start sm:justify-start w-full max-w-[400px] mt-4 px-1 dark:text-gray-100">
                <div className="w-[40px] sm:w-[50px] md:w-[60px] xl:w-[64px] 2xl:w-[74px] flex justify-start font-bold">DATE</div>
                <div className="w-[40px] sm:w-[50px] md:w-[60px] xl:w-[64px] 2xl:w-[74px] flex justify-center font-bold">AMOUNT</div>
                <div className="w-[40px] sm:w-[50px] md:w-[60px] xl:w-[64px] 2xl:w-[74px] flex justify-center font-bold">PRICE</div>
                <div className="w-[40px] sm:w-[50px] md:w-[60px] xl:w-[64px] 2xl:w-[74px] flex justify-center font-bold">CHANGE</div>
              </div>

              {stock.purchases.map((purchase: PurchaseInterface, i) => {
                let [day, month, year] = formatDate(purchase.date).split('/')
                if (day.length === 1) day = '0' + day
                if (month.length === 1) month = '0' + month
                year = year.substring(2, 4)

                return (
                  <div key={purchase.id} className="flex flex-row w-full justify-start sm:justify-between items-center rounded-2xl px-1 py-1 hover:bg-gray-100 dark:hover:bg-opacity-5 mr-1">
                    <div className="flex flex-row w-full max-w-[400px] px-1 justify-start sm:justify-start rounded-xl h-full">
                      <div className="w-[40px] sm:w-[50px] md:w-[60px] xl:w-[64px] 2xl:w-[74px] flex items-center justify-start">{day}-{month}-{year}</div>
                      <div className="w-[40px] sm:w-[50px] md:w-[60px] xl:w-[64px] 2xl:w-[74px] flex items-center justify-center">{purchase.amount}</div>
                      <div className="w-[40px] sm:w-[50px] md:w-[60px] xl:w-[64px] 2xl:w-[74px] flex items-center justify-center">{purchase.price}</div>
                      <div className="w-[40px] sm:w-[50px] md:w-[60px] xl:w-[64px] 2xl:w-[74px] flex items-center justify-center">
                        {purchase.relativeChange >= 0
                          ? <div className="text-green-600">{'+' + purchase.relativeChange.toFixed(1) + '%'}</div>
                          : <div className="text-red-600">{purchase.relativeChange.toFixed(1) + '%'}</div>
                        }
                      </div>
                    </div>
                    <div
                      onClick={(e) => { openDeleteStockModal(e, purchase.amount, purchase.id) }}
                      id={stock.ticker}
                      className="rounded-full flex justify-center items-center w-6 h-6 transition duration-150 hover:bg-red-100 dark:hover:bg-red-500 dark:hover:bg-opacity-50 ease-in-out"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke={theme === 'light' ? 'black' : 'white'} className="w-3 md:w-4 h-3 md:h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </div>
                  </div>

                )
              })}

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
                <StockChartModal
                  stockTicker={stock.ticker}
                  stockHistory={stockHistory}
                  purchaseHistory={stock.purchases}
                  loadingData={loadingData}
                  dataLoaded={dataLoaded}
                  stockChartLoadingError={stockChartLoadingError}
                />
              }
            </div>
        }

      </div>
      <DeleteStockModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        deleteStock={deleteStock}
        deletePurchase={deletePurchase}
        currentAmount={stock.amount}
        amountToDelete={amountToDelete}
        ticker={stock.ticker}
        purchaseId={purchaseId}
      />
    </>
  )
}
