import React from 'react'
import Container from './Container'

const Footer = () => {
  return (
    <footer className='bg-blue-400 flex w-full h-full justify-center items-center'>
      <Container className='flex flex-wrap items-between pb-0 pt-0'>
        <div className='flex w-full h-full justify-center items-center'>
            Footer
        </div>
      </Container>
    </footer>
  )
}

export default Footer
