import React from 'react'
import LandingPage from '@/components/LandingPage'
import MainPage from '@/components/MainPage/MainPage'
import { useUser } from '@auth0/nextjs-auth0/client'

const index = () => {
  const { user, isLoading } = useUser()

  if (isLoading) return

  if (user === undefined) {
    return (
      <LandingPage />
    )
  } else {
    return (
      <MainPage />
    )
  }
}

export default index
