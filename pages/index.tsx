import React from 'react'
import LandingPage from '@/components/LandingPage/LandingPage'
import MainPage from '@/components/MainPage/MainPage'
import { useSession } from 'next-auth/react'

const index = () => {
  const { status } = useSession()

  if (status === 'loading') {
    return null
  } else if (status === 'unauthenticated') {
    return <LandingPage />
  } else {
    return <MainPage demo={false} />
  }
}

export default index
