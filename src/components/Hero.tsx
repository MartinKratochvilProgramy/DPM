import React from 'react';
import Image from 'next/image';
import Container from './Container';
import heroImg from '../../public/img/hero.png';
import './Hero.css';

const Hero = () => (
	<>
		<Container className='flex flex-wrap '>
			<div className='flex items-center w-full lg:w-1/2'>
				<div className='max-w-2xl mb-8'>
					<h1 className='font-inter text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight dark:text-gray-200'>
						Simple Way to <span className=''> Manage</span> Your <span className='text-blue-600 paint-brush'>Investments</span> Daily
					</h1>
					<p className='py-5 text-xl text-justify leading-normal text-gray-500 lg:text-xl dark:text-gray-300'>
						Manage your investments all in one place for free. Daily Portfolio Management is the ultimate app designed to empower
						you in managing your investments and maximizing your returns. Whether you&apos;re a seasoned investor or just starting out,
						Daily Portfolio Management provides you with the tools and insights needed to navigate the world of
						stocks and take control of your financial destiny.
					</p>

					<div className='flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row'>
						<a
							href=''
							rel='noopener noreferrer'
							className='flex flex-row px-2 md:px-4 py-1 md:py-2 my-2 mr-1 text-gray-200 rounded border-solid border-blue-600 border-[1px] bg-blue-600 font-medium text-md leading-snug uppercase whitespace-nowrap shadow-md hover:bg-blue-700 hover:text-white hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-300 ease-in-out'>
							Create a Free Account
						</a>
						<a
							href=''
							rel='noopener noreferrer'
							className='flex flex-row px-2 md:px-4 py-1 md:py-2 my-2 mr-1 text-blue-600 rounded border-solid border-blue-600 border-[1px] bg-white font-medium dark:bg-transparent dark:hover:bg-blue-700 text-md leading-snug uppercase whitespace-nowrap shadow-md hover:bg-blue-700 hover:text-gray-200 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-300 ease-in-out'>
							Try Demo
						</a>
					</div>
				</div>
			</div>
			<div className='hidden items-center justify-center w-full lg:w-1/2 md:flex'>
				<Image
					src={heroImg}
					width='616'
					height='617'
					className={'object-cover'}
					alt='Hero Illustration'
					loading='eager'
					placeholder='blur'
				/>
			</div>
		</Container>
	</>
);

export default Hero;
