
import React, { useEffect, useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { ThemeProvider } from 'next-themes'
import { UserProvider, useUser } from '@auth0/nextjs-auth0/client'
import { handleErrors } from '@/utils/client/handleErrors'
import Head from 'next/head'
import '../src/app/globals.css'

interface Props {
  Component: any
  pageProps: any
}

export const MyApp: React.FC<Props> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Daily Portfolio Management</title>
      </Head>
      <UserProvider>
        <ThemeProvider attribute='class' defaultTheme='light'>
          <App Component={Component} pageProps={pageProps} />
        </ThemeProvider>
      </UserProvider>
    </>
  )
}

export default MyApp

export const CurrencyContext = React.createContext<any>('')

const App: React.FC<Props> = ({ Component, pageProps }) => {
  // this is necessary because the user has to be known to fetch currency
  // essentially a wrapper for CurrencyContext

  const [currencyState, setCurrencyState] = useState<string | undefined>('')
  const { user } = useUser()

  useEffect(() => {
    if (user?.email === undefined) return
    console.log(user.email)

    fetch('/api/get_currency', {
      method: 'POST',
      body: JSON.stringify({ email: user.email })
    })
      .then(handleErrors)
      .then((response: any) => response.json())
      .then(res => {
        setCurrencyState(res.currency)
      })
      .catch(error => {
        console.error(error)
      }
      )
  }, [user])

  return (
    <CurrencyContext.Provider value={{ currency: currencyState, setCurrency: setCurrencyState }}>
      <Navbar />
      <Component {...pageProps} />
    </CurrencyContext.Provider>
  )
}
