import React from 'react'
import Container from '../Container'
import Stocks from './Stocks'

const MainPage = () => {
  return (
    <Container className='flex'>
      <div className='w-full grid grid-cols-2 gap-5'>
        <Stocks />
      </div>
    </Container>
  )
}

export default MainPage
