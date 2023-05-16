import React from 'react';
import '../app/globals.css';
import './FeatureCard.css';

export type Feature = {
	title: string;
	text: string;
};

const FeatureCard: React.FC<Feature> = ({title, text}) => (
	<div className='rounded-3xl bg-white p-2 sm:p-4 space-y-2 cursor-pointer hover:translate-y-[-2px] bg-transparent shadow-md hover:shadow-lg transition duration-300 ease-in-out'>
		<h3 className='playfair flex w-full justify-center text-center text-sm md:text-xl lg:text-2xl'>
			{title}
		</h3>
		<p className='flex w-full justify-center text-center text-gray-400 text-xs md:text-sm lg:text-xl'>
			{text}
		</p>
	</div>
);

export default FeatureCard;
