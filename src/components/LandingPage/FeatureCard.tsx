import React from 'react'
import '../../app/globals.css'

export interface Feature {
  title: string
  text: string
}

const FeatureCard: React.FC<Feature> = ({ title, text }) => {
  return (
    <div className='border border-blue-500 dark:border-gray-600 rounded-3xl bg-white bg-opacity-[0.4] dark:bg-transparent p-2 sm:p-4 space-y-2 md:space-y-4 lg:space-y-6 cursor-pointer hover:translate-y-[-2px] shadow-md hover:shadow-lg transition duration-300 ease-in-out'>
      <h3 className='playfair flex w-full justify-center text-center text-sm md:text-xl lg:text-2xl'>
        {title}
      </h3>
      <p className='flex w-full justify-center text-center text-gray-600 dark:text-gray-200 opacity-100 dark:opacity-60 text-xs md:text-sm lg:text-lg'>
        {text}
      </p>
    </div>
  )
}

export default FeatureCard
