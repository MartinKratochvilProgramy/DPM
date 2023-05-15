/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import React, {useEffect, useState} from 'react';
import '../src/app/globals.css';

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

	useEffect(() => {
		const user: string = JSON.parse(localStorage.getItem('user') || 'null');
		const theme = localStorage.getItem('color-theme') || 'light';
		const currency = localStorage.getItem('currency') || 'USD';

		setCredentialsState(user);
		setThemeState(theme);
		setCurrencyState(currency);
	}, []);

	return (
		<CredentialsContext.Provider value={{credentials: credentialsState, setCredentials: setCredentialsState}}>
			<ThemeContext.Provider value={{theme: themeState, setTheme: setThemeState}}>
				<CurrencyContext.Provider value={{currency: currencyState, setCurrency: setCurrencyState}}>
					<Component {...pageProps} />
				</CurrencyContext.Provider>
			</ThemeContext.Provider>
		</CredentialsContext.Provider>
	);
};

export default MyApp;
