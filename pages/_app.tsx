
import React, { useEffect, useState } from 'react'
import '../src/app/globals.css'
import { Navbar } from '@/components/Navbar'
import { ThemeProvider } from 'next-themes'

import { UserProvider } from '@auth0/nextjs-auth0/client'

interface Props {
  Component: any
  pageProps: any
}

export const CredentialsContext = React.createContext<any>(null)
export const ThemeContext = React.createContext<any>('light')
export const CurrencyContext = React.createContext<any>('USD')

export const MyApp: React.FC<Props> = ({ Component, pageProps }) => {
  const [currencyState, setCurrencyState] = useState('USD')

  useEffect(() => {
    const currency = localStorage.getItem('currency')

    setCurrencyState(currency == null ? 'USD' : currency)
  }, [])

  return (
    <>
      <UserProvider>
        <ThemeProvider attribute='class' defaultTheme='light'>
          <CurrencyContext.Provider value={{ currency: currencyState, setCurrency: setCurrencyState }}>
            <Navbar />
            <div className='min-h-[110vh]'>
              <Component {...pageProps} />
            </div>
          </CurrencyContext.Provider>
        </ThemeProvider>
      </UserProvider>
    </>
  )
}

export default MyApp
