import React, { useState, useEffect } from 'react'
import { type StockInterface } from '@/types/client/stock'
import { Modal } from '@mui/material'

interface Props {
  showDeleteModal: boolean
  setShowDeleteModal: (showDeleteModal: boolean) => void
  deleteStock: (ticker: string, amount: number) => void
  stock: StockInterface
}

export const DeleteStockModal: React.FC<Props> = ({ showDeleteModal, setShowDeleteModal, deleteStock, stock }) => {
  const [amountToRemove, setAmountToRemove] = useState(0)

  useEffect(() => {
    // reset red border from error
    const modalAmountInput = document.getElementById('modal-amount-input')
    if (modalAmountInput === null) return
    modalAmountInput.classList.add('border-gray-300')
    modalAmountInput.classList.remove('border-red-400')
  }, [amountToRemove])

  function submit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (stock.amount - amountToRemove < 0 || amountToRemove < 0) {
      // display red around input and return if invalid amount
      const modalAmountInput = document.getElementById('modal-amount-input')
      if (modalAmountInput === null) return
      modalAmountInput.classList.remove('border-gray-300')
      modalAmountInput.classList.add('border-red-400')
      return
    }
    deleteStock(stock.ticker, stock.amount - amountToRemove)
    setShowDeleteModal(false)
  }

  function handleModalClose () {
    setShowDeleteModal(false)
  }

  return (
    <Modal
      open={showDeleteModal}
      onClose={handleModalClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <form
        className='h-12 w-12'
        onSubmit={(e) => { submit(e) }} >

        <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v3.75m-9.303 3.376C1.83 19.126 2.914 21 4.645 21h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 4.88c-.866-1.501-3.032-1.501-3.898 0L2.697 17.626zM12 17.25h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">Remove {stock.ticker} ?</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Select amount ({stock.amount}) : </p>
                      <input
                        className='border border-gray-300 p-2 my-2 outline-red-300 focus:outline-none'
                        type="number"
                        placeholder='Amount...'
                        id='modal-amount-input'
                        autoFocus
                        onChange={(e) => { setAmountToRemove(parseInt(e.target.value)) }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="submit"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm">
                                    Remove
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => { handleModalClose() }}
                >

                                    Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  )
}
