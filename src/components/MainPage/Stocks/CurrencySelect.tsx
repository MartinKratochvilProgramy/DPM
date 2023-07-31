import React, { useContext, useState } from 'react'
import { FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useTheme } from 'next-themes'
import { handleErrors } from '@/utils/client/handleErrors'
import { CurrencyContext } from '@/pages/_app'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useSession } from 'next-auth/react'
import '../../../app/globals.css'

export const CurrencySelect = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('')
  const [loading, setLoading] = useState(false)

  const { data: session } = useSession()
  const { theme } = useTheme()
  const { setCurrency } = useContext(CurrencyContext)

  const selectTheme = createTheme({
    palette: { mode: theme === 'dark' ? 'dark' : 'light' }
  })

  function handleChange (event: SelectChangeEvent<typeof selectedCurrency>) {
    setSelectedCurrency(event.target.value)
  }

  function selectCurrency () {
    if (selectedCurrency === '') return

    setLoading(true)

    fetch('api/user/set_currency', {
      method: 'POST',
      body: JSON.stringify({ email: session?.user?.email, selectedCurrency })
    })
      .then(handleErrors)
      .then((response: any) => response.json())
      .then(res => {
        setCurrency(res.selectedCurrency)
        setLoading(false)
      })
      .catch(error => {
        console.log(error)
        setLoading(false)
      }
      )
  }

  return (
    <div className='flex flex-col items-center fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-y-auto w-auto h-auto px-6 pt-2 pb-5 bg-gray-100 dark:bg-[#1e2836] opacity-[0.96] rounded-xl border-solid border-[1px] border-blue-400 dark:border-gray-500'>
      <label
        htmlFor="currency"
        className='playfair text-center flex w-full justify-center text-3xl'
      >
        Select Currency
      </label>
      <div className='flex flex-col items-center justify-center'>
        <ThemeProvider theme={selectTheme}>
          <FormControl
            sx={{ my: 2, width: 110 }}
            size='small'
          >
            <InputLabel id="open-select-currency">Currency</InputLabel>
            <Select
              labelId="open-select-currency"
              id="open-select-currency"
              label="Currency"
              onChange={handleChange}
              defaultValue=''
            >
              <MenuItem value={'USD'}>USD</MenuItem>
              <MenuItem value={'EUR'}>EUR</MenuItem>
              <MenuItem value={'CZK'}>CZK</MenuItem>
            </Select>
          </FormControl>
        </ThemeProvider>
        {
          loading
            ? <LoadingSpinner size={40} />
            : <button
              onClick={selectCurrency}
              className="flex flex-row justify-center w-full py-3 text-white bg-blue-600 font-medium text-sm leading-snug uppercase rounded-[4px] whitespace-nowrap shadow-md hover:bg-blue-700 hover:text-white hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
                Select
            </button>
        }
      </div>
    </div>
  )
}
