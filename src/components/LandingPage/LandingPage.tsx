import React from 'react'
import Hero from './Hero'
import Features from './Features'
import Container from '../Container'

const LandingPage = () => {
  return (
    <Container className='flex flex-wrap'>
      <Hero />
      <Features />
    </Container>
  )
}

export default LandingPage
