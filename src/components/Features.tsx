import React from 'react'
import Container from './Container'
import FeatureCard from './FeatureCard'
import { type Feature } from './FeatureCard'
import '../app/globals.css'

const Features = () => {
//   const featuresLong: Feature[] = [
//     {
//       title: 'Streamlined Investment Management',
//       text: 'Say goodbye to scattered spreadsheets and complex systems - with Daily Portfolio Management, you can view your holdings, track performance, and make informed decisions all from the palm of your hand.'
//     },
//     {
//       title: 'Real-Time Stock Updates',
//       text: 'Stay informed and seize opportunities with real-time stock updates. Access the latest market data, track trends, and receive personalized alerts, ensuring that you never miss a crucial investment opportunity.'
//     },
//     {
//       title: 'Seamless Stock Addition',
//       text: 'Adding stocks to your portfolio has never been easier. Daily Portfolio Management simplifies the process, enabling you to search, select, and add stocks with just a few clicks. Stay on top of your favorite companies and explore new investment options effortlessly.'
//     },
//     {
//       title: 'Secure and Reliable',
//       text: 'Your financial information is highly sensitive, and we understand the importance of security. We prioritize data protection and employ advanced encryption measures to safeguard your personal and financial data, giving you peace of mind as you manage your investments.'
//     }
//   ]
  const featuresShort: Feature[] = [
    {
      title: 'Investment Management',
      text: 'Say goodbye to scattered spreadsheets and complex systems - with Daily Portfolio Management, you can view your holdings, track performance, and make informed decisions all from the palm of your hand.'
    },
    {
      title: 'Real-Time Stock Updates',
      text: 'Stay informed and seize opportunities with real-time stock updates. Access the latest market data and track trends, so that you never miss a crucial investment opportunity.'
    },
    {
      title: 'Seamless Stock Addition',
      text: 'Adding stocks to your portfolio has never been easier. Daily Portfolio Management simplifies the process, enabling you to search, select, and add stocks with just a few clicks.'
    },
    {
      title: 'Secure and Reliable Data',
      text: 'Your financial information is highly sensitive, and we understand the importance of security. We prioritize data protection and employ advanced encryption measures.'
    }
  ]

  return (

    <Container className='flex flex-wrap justify-center'>
      <div className='flex flex-col items-center w-full space-y-8 lg:space-y-12'>
        <h1 className='playfair flex justify-center w-full font-inter text-center text-2xl lg:text-4xl font-bold leading-snug tracking-tight text-gray-700 lg:leading-tight xl:leading-tight dark:text-gray-200'>
                    Everything you need to keep an eye on your finances
        </h1>
        <div className='grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8' id='feature-cards'>
          {featuresShort.map((feature: Feature) => (
            <FeatureCard title={feature.title} text={feature.text} key={feature.title} />
          ))}
        </div>
      </div>
    </Container>

  )
}

export default Features
