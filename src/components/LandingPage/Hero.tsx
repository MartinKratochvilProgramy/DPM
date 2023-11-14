import React from 'react'
import { signIn } from 'next-auth/react'
import './Hero.css'
import '../../app/globals.css'

const Hero = () => {
  return (
    <div className='min-h-auto lg:min-h-[80vh] pt-8 md:pt-20'>
      <div className='flex items-center w-full lg:w-8/12'>
        <div className='flex flex-col w-full mb-8 mr-6'>
          <h1 className='playfair text-5xl xl:text-6xl tracking-tight text-gray-800 leading-snug lg:leading-tight xl:leading-[66px] dark:text-gray-200'>
						Simple Way to <span className=''> Manage</span> Your <span className='text-blue-600 paint-brush'>Investments</span> Daily
          </h1>
          <p className='py-8 md:py-12 text-xl text-justify leading-normal text-gray-500 lg:text-xl dark:text-gray-300'>
						Manage your investments all in one place for free. Whether you&apos;re a seasoned investor or just starting out,
						Daily Portfolio Management provides you with the tools and insights needed to navigate the world of
						stocks and take control of your financial destiny.
          </p>

          <div className='flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row'>
            <a
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={async () => { await signIn() }}
              rel='noopener noreferrer'
              className='cursor-pointer flex lg:text-xl flex-row px-4 py-2 my-2 mr-1 text-gray-100 rounded border-solid border-blue-600 border-[1px] bg-blue-600 font-medium text-md leading-snug whitespace-nowrap shadow-md hover:bg-blue-700 hover:text-white hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-300 ease-in-out'>
							CREATE A FREE ACCOUNT
            </a>
            <a
              href='/demo'
              rel='noopener noreferrer'
              className='flex lg:text-xl flex-row px-4 py-2 my-2 mr-1 text-blue-600 rounded border-solid border-blue-600 border-[1px] bg-white font-medium dark:bg-transparent dark:hover:text-gray-800 hover:bg-blue-50 dark:hover:bg-gray-100 text-md leading-snug whitespace-nowrap shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-300 ease-in-out'>
							TRY DEMO
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
