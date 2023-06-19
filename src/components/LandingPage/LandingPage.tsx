import React from 'react'
import Hero from './Hero'
import Features from './Features'
import Container from '../Container'
import Footer from '../Footer'

const LandingPage = () => {
  return (
    <>
      <Container className='flex flex-wrap items-between'>
        <Hero />
        <Features />
      </Container>
      <Footer />
    </>
  )
}

export default LandingPage
