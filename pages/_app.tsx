
import React from 'react'
import '../src/app/globals.css'
import { Navbar } from '@/components/Navbar'
import { ThemeProvider } from 'next-themes'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import Head from 'next/head'

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
          <div className='min-h-[110vh]'>
            <Component {...pageProps} />
          </div>
        </ThemeProvider>
      </UserProvider>
    </>
  )
}

export default MyApp
