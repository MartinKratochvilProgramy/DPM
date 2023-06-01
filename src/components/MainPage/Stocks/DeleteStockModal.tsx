import React from 'react'
import { Modal } from '@mui/material'

interface Props {
  showDeleteModal: boolean
  setShowDeleteModal: (showDeleteModal: boolean) => void
  deleteStock: (ticker: string) => void
  deletePurchase: (ticker: string, purchaseId: number) => void
  ticker: string
  currentAmount: number
  amountToDelete: number
  purchaseId: number | null
}

export const DeleteStockModal: React.FC<Props> = ({
  showDeleteModal,
  setShowDeleteModal,
  deleteStock,
  deletePurchase,
  ticker,
  currentAmount,
  amountToDelete,
  purchaseId
}) => {
  function submit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // if no purchaseID or remaining amount is 0, delete stock
    if (purchaseId === null || currentAmount - amountToDelete <= 0) {
      deleteStock(ticker)
    } else {
      deletePurchase(ticker, purchaseId)
    }

    setShowDeleteModal(false)
  }

  function handleModalClose (e: any) {
    e.stopPropagation()
    setShowDeleteModal(false)
  }

  return (
    <Modal
      open={showDeleteModal}
      onClose={(e) => { handleModalClose(e) }}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <form
        onSubmit={(e) => { submit(e) }} >

        <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center">
                  <div className="mx-auto flex flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v3.75m-9.303 3.376C1.83 19.126 2.914 21 4.645 21h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 4.88c-.866-1.501-3.032-1.501-3.898 0L2.697 17.626zM12 17.25h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">Remove {ticker} ({amountToDelete})?</h3>
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
                  onClick={(e) => { handleModalClose(e) }}
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
