/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import React, {useState} from 'react';

export const CredentialsContext = React.createContext<any>(null);
export const ThemeContext = React.createContext<any>('light');
export const CurrencyContext = React.createContext<any>('USD');

type Props = {
	children: React.ReactNode;
};

export const ContextProvider: React.FC<Props> = ({children}) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const user: string | undefined = JSON.parse(localStorage.getItem('user') ?? 'null');
	const [credentialsState, setCredentialsState] = useState(user);

	const theme = localStorage.getItem('color-theme') || 'light';
	const [themeState, setThemeState] = useState(theme || 'light');

	const currency = localStorage.getItem('currency') || 'USD';
	const [currencyState, setCurrencyState] = useState(currency);

	return (
		<CredentialsContext.Provider value={{credentials: credentialsState, setCredentials: setCredentialsState}}>
			<ThemeContext.Provider value={{theme: themeState, setTheme: setThemeState}}>
				<CurrencyContext.Provider value={{currency: currencyState, setCurrency: setCurrencyState}}>
					{children}
				</CurrencyContext.Provider>
			</ThemeContext.Provider>
		</CredentialsContext.Provider>
	);
};
