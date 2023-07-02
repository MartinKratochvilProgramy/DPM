import React from 'react'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document () {
  return (
    <Html>
      <Head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' />
        <link href='https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&display=swap' rel='stylesheet' />
        <link href='https://fonts.googleapis.com/css2?family=Work+Sans&display=swap' rel='stylesheet' />
        <link href="https://fonts.googleapis.com/css2?family=Bacasime+Antique&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Raleway&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Lora&display=swap" rel="stylesheet"></link>
        <link href="https://fonts.googleapis.com/css2?family=Neuton&display=swap" rel="stylesheet"></link>
        <link href="https://fonts.googleapis.com/css2?family=Economica&display=swap" rel="stylesheet"></link>
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap" rel="stylesheet"></link>
        <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
