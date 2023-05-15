// /* eslint-disable @typescript-eslint/restrict-template-expressions */
// /* eslint-disable @typescript-eslint/no-floating-promises */
// /* eslint-disable @typescript-eslint/no-unsafe-return */

// /* eslint-disable @typescript-eslint/no-unsafe-argument */
// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */

// import React, {useState, useEffect, useContext} from 'react';
// import {useRouter} from 'next/router';
// import Cookies from 'universal-cookie';
// import {Navbar} from '../src/components/Navbar';
// import {StockInput} from '../components/StockInput';
// import {StocksDisplay} from '../components/StocksDisplay';
// import {LoadingSpinner} from '../src/components/LoadingSpinner';
// import {formatStocks} from '../utils/formatStocks';
// import {type StockInterface} from '../types/stock';
// import {CredentialsContext} from './_app';

// export const sortStocks = (orderBy: string, stocksInput: StockInterface[]) => {
// 	if (orderBy === 'A-Z') {
// 		stocksInput.sort((a, b) => a.ticker.localeCompare(b.ticker));
// 	} else if (orderBy === 'Z-A') {
// 		stocksInput.sort((a, b) => b.ticker.localeCompare(a.ticker));
// 	} else if (orderBy === 'NEWEST') {
// 		stocksInput.sort((a, b) => new Date(b.lastPurchase).getTime() - new Date(a.lastPurchase).getTime());
// 	} else if (orderBy === 'OLDEST') {
// 		stocksInput.sort((a, b) => new Date(a.firstPurchase).getTime() - new Date(b.firstPurchase).getTime());
// 	} else if (orderBy === 'VALUE HIGH') {
// 		stocksInput.sort((a, b) => ((b.prevClose * b.amount) - (a.prevClose * a.amount)));
// 	} else if (orderBy === 'VALUE LOW') {
// 		stocksInput.sort((a, b) => ((a.prevClose * a.amount) - (b.prevClose * b.amount)));
// 	} else if (orderBy === 'CHANGE HIGH') {
// 		stocksInput.sort((a, b) => b.avgPercentageChange - a.avgPercentageChange);
// 	} else if (orderBy === 'CHANGE LOW') {
// 		stocksInput.sort((a, b) => a.avgPercentageChange - b.avgPercentageChange);
// 	}
// };

// export default function stocks() {
// 	const [stocks, setStocks] = useState<StockInterface[]>([]);
// 	const [stocksLoaded, setStocksLoaded] = useState(false);
// 	const [error, setError] = useState<string | boolean>(false);
// 	const [orderDropdownValue, setOrderDropdownValue] = useState('NEWEST');
// 	const {credentials, setCredentials} = useContext(CredentialsContext);

// 	const router = useRouter();

// 	useEffect(() => {
// 		const cookies = new Cookies();
// 		const token = cookies.get('token');

// 		if (!token) {
// 			setCredentials(null);
// 			localStorage.setItem('user', 'null');
// 			router.push('/');
// 			return;
// 		}

// 		// Get stocks on load
// 		fetch('api/stocks', {
// 			method: 'GET',
// 			headers: {
// 				'Content-Type': 'application/json',
// 				Authorization: `Basic ${credentials}:${token}`,
// 			},
// 		})
// 			.then(async response => response.json())
// 			.then(returnedStocks => {
// 				formatStocks(returnedStocks);

// 				setOrderDropdownValue('NEWEST');
// 				sortStocks('NEWEST', returnedStocks);

// 				setStocks(returnedStocks);
// 				setStocksLoaded(true);
// 			})
// 			.catch(error => {
// 				setStocks([]);
// 				setStocksLoaded(true);
// 			});
// 	}, []);

// 	return (
// 		<div className='bg-white dark:bg-gray-800 pb-8 min-h-screen'>
// 			<Navbar active='stocks' />
// 			<StockInput
// 				setStocks={setStocks}
// 				error={error}
// 				setError={setError}
// 				setOrderDropdownValue={setOrderDropdownValue}
// 				setStocksLoaded={setStocksLoaded}
// 			/>
// 			{stocksLoaded
// 				? stocks.length > 0 && <StocksDisplay
// 					stocks={stocks}
// 					orderDropdownValue={orderDropdownValue}
// 					setOrderDropdownValue={setOrderDropdownValue}
// 					setStocks={setStocks}
// 					setError={setError}
// 					sortStocks={sortStocks}
// 				/>
// 				: <div className='flex justify-center items-center min-h-[260px] md:min-h-[450px]'>
// 					<LoadingSpinner size={70} />
// 				</div>
// 			}
// 		</div>
// 	);
// }
