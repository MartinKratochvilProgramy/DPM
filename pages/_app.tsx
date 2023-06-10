
import React from 'react'
import { Navbar } from '@/components/Navbar'
import { ThemeProvider } from 'next-themes'
import { UserProvider } from '@auth0/nextjs-auth0/client'
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
          <Navbar />
          <Component {...pageProps} />
        </ThemeProvider>
      </UserProvider>
    </>
  )
}

export default MyApp
