import React, { useEffect, useState } from 'react'
import '../app/globals.css'
import { useTheme } from 'next-themes'

export interface Feature {
  title: string
  text: string
}

const FeatureCard: React.FC<Feature> = ({ title, text }) => {
  const [style, setStyle] = useState({ background: '' })
  const { theme } = useTheme()

  useEffect(() => {
    // Set random location of the gradient circle between min and max %
    const min = 40
    const max = 60
    const randomNumberX = Math.floor(Math.random() * (max - min + 1)) + min
    const randomNumberY = Math.floor(Math.random() * (max - min + 1)) + min

    setStyle({
      background: `radial-gradient(circle at ${randomNumberX}% ${randomNumberY}%,
						rgba(30, 144, 231, ${theme === 'light' ? '0.1' : '0.2'}) 0%,
						rgba(56, 113, 209, ${theme === 'light' ? '0.1' : '0.2'}) 22.9%,
						rgba(38, 76, 140, ${theme === 'light' ? '0.01' : '0.1'}) 76.7%,
						rgba(31, 63, 116, ${theme === 'light' ? '0.01' : '0.1'}) 100.2%)`
    })
  }, [theme])

  return (
    <div style={style} className='rounded-3xl feature-card bg-white p-2 sm:p-4 space-y-2 md:space-y-4 lg:space-y-6 cursor-pointer hover:translate-y-[-2px] bg-transparent shadow-md hover:shadow-lg transition duration-300 ease-in-out'>
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
