import React from 'react';
import Container from './Container';
import './Hero.css';
import '../app/globals.css';

const Hero = () => (
	<div className='min-h-auto lg:min-h-[70vh] pt-20'>
		<Container className='flex flex-wrap'>
			<div className='flex items-center w-full lg:w-10/12'>
				<div className='flex flex-col w-full mb-8 mr-6'>
					<h1 className='playfair text-3xl lg:text-4xl xl:text-6xl font-bold leading-snug tracking-tight text-gray-800 lg:leading-tight xl:leading-tight dark:text-gray-200'>
						Simple Way to <span className=''> Manage</span> Your <span className='text-blue-600 paint-brush'>Investments</span> Daily
					</h1>
					<p className='py-12 text-xl text-justify leading-normal text-gray-500 lg:text-xl dark:text-gray-300'>
						Manage your investments all in one place for free. Whether you&apos;re a seasoned investor or just starting out,
						Daily Portfolio Management provides you with the tools and insights needed to navigate the world of
						stocks and take control of your financial destiny.
					</p>

					<div className='flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row'>
						<a
							href='https://daily-portfolio-management.uk.auth0.com/authorize?response_type=code&client_id=elo1qQEI4scV6b6sK20yCHwEGz56NCb1&redirect_uri=http://localhost:3000/api/auth/callback&scope=openid%20profile%20email&screen_hint=signup'
							rel='noopener noreferrer'
							className='flex lg:text-xl flex-row px-2 md:px-4 py-1 md:py-2 my-2 mr-1 text-gray-100 rounded-lg border-solid border-blue-600 border-[1px] bg-blue-600 font-medium text-md leading-snug uppercase whitespace-nowrap shadow-md hover:bg-blue-700 hover:text-white hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-300 ease-in-out'>
							Create a Free Account
						</a>
						<a
							href=''
							rel='noopener noreferrer'
							className='flex lg:text-xl flex-row px-2 md:px-4 py-1 md:py-2 my-2 mr-1 text-blue-600 rounded-lg border-solid border-blue-600 border-[1px] bg-white font-medium dark:bg-transparent dark:hover:text-gray-800 hover:bg-blue-50 dark:hover:bg-gray-300 text-md leading-snug uppercase whitespace-nowrap shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-300 ease-in-out'>
							Try Demo
						</a>
					</div>
				</div>
			</div>
			{/* <div className='hidden items-center justify-center w-full lg:w-1/2 md:flex'>
				<Image
					src={heroImg}
					width='616'
					height='617'
					className={'object-cover'}
					alt='Hero Illustration'
					loading='eager'
					placeholder='blur'
				/>
			</div> */}
		</Container>
	</div>
);

export default Hero;
