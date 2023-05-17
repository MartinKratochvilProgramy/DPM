import React from 'react'
import LandingPage from '@/components/LandingPage'
import MainPage from '@/components/MainPage'
import { useUser } from '@auth0/nextjs-auth0/client'

const index = () => {
  const { user } = useUser()

  if (user === undefined) {
    return (
      <LandingPage />
    )
  }

  return (
    <MainPage />
  )
}

export default index
