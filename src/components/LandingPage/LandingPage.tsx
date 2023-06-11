import React, { useEffect, useState } from 'react'
import { Transition } from '@headlessui/react'
import Hero from './Hero'
import Features from './Features'
import Container from '../Container'

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(true)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <Container className='flex flex-wrap'>
      <Hero />
      <Transition
        show={isVisible}
        enter='transition duration-1000 ease-in-out transform'
        enterFrom='-translate-y-20 opacity-0'
        enterTo='translate-y-0 opacity-100'
        leave='transition duration-1000 ease-in-out transform'
        leaveFrom='translate-y-0 opacity-100'
        leaveTo='-translate-y-20 opacity-0'
      >
        <Features />
      </Transition>
    </Container>
  )
}

export default LandingPage
