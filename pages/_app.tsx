
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import '../src/app/globals.css';
import {Navbar} from '@/components/Navbar';
import {ThemeProvider} from 'next-themes';
import {useTheme} from 'next-themes';
import {UserProvider} from '@auth0/nextjs-auth0/client';

type Props = {
	Component: any;
	pageProps: any;
};

export const CredentialsContext = React.createContext<any>(null);
export const ThemeContext = React.createContext<any>('light');
export const CurrencyContext = React.createContext<any>('USD');

export const MyApp: React.FC<Props> = ({Component, pageProps}) => {
	const [credentialsState, setCredentialsState] = useState<null | string>(null);
	const [themeState, setThemeState] = useState('light');
	const [currencyState, setCurrencyState] = useState('USD');
	const {setTheme} = useTheme();

	useEffect(() => {
		const user: string = JSON.parse(localStorage.getItem('user') || 'null');
		const theme = localStorage.getItem('color-theme') || 'light';
		const currency = localStorage.getItem('currency') || 'USD';

		setCredentialsState(user);
		setThemeState(theme);
		setCurrencyState(currency);
	}, []);

	return (
		<>
			<Head>
				<title>Daily Portfolio Management</title>
				<link rel='preconnect' href='https://fonts.googleapis.com' />
				<link rel='preconnect' href='https://fonts.gstatic.com' />
				<link href='https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&display=swap' rel='stylesheet' />
				<link href='https://fonts.googleapis.com/css2?family=Work+Sans&display=swap' rel='stylesheet' />
			</Head>
			<UserProvider>
				<ThemeProvider attribute='class' defaultTheme='light'>
					<CredentialsContext.Provider value={{credentials: credentialsState, setCredentials: setCredentialsState}}>
						<ThemeContext.Provider value={{theme: themeState, setTheme: setThemeState}}>
							<CurrencyContext.Provider value={{currency: currencyState, setCurrency: setCurrencyState}}>
								<Navbar />
								<div className='min-h-[110vh]'>
									<Component {...pageProps} />
								</div>
							</CurrencyContext.Provider>
						</ThemeContext.Provider>
					</CredentialsContext.Provider>
				</ThemeProvider>
			</UserProvider>
		</>
	);
};

export default MyApp;
