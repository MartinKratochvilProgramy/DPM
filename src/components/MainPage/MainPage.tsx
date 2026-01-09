import React, { useState, useEffect, type ReactNode, useContext } from 'react';
import Container from '../Container';
import NetWortHistory from './NetWortHistory';
import { StockInput } from './Stocks/StockInput';
import { Stocks } from './Stocks';
import PieChart from './Stocks/PieChart';
import { handleErrors } from '@/utils/client/handleErrors';
import { formatStocks } from '@/utils/client/formatStocks';
import { sortStocks } from '@/utils/client/sortStocks';
import { type TimeScaleInterface } from '@/types/client/timeScale';
import { LoadingSpinner } from '../LoadingSpinner';
import RelativeChangeHistory from './RelativeChangeHistory';
import TotalInvestedHistory from './TotalInvestedHistory';
import { Modal } from '@mui/material';
import { CurrencySelect } from '@/components/MainPage/Stocks/CurrencySelect';
import { CurrencyContext } from '@/pages/_app';
import './MainPage.css';
import '../LandingPage/Hero.css';
import { calculateTimeScale } from '@/utils/client/calculateTimeScale';
import { updatePrices } from '@/utils/client/updatePrices';
import { type StockInterface } from '@/types/client/stock';
import { useSession } from 'next-auth/react';
import NetGainHistory from './NetGainHistory';
import Card from './Card';
import { TimeSeries } from '@/types/client/timeSeries';
import { DateRange } from '@/types/client/dateRange';

interface Props {
  demo: boolean;
}

const MainPage: React.FC<Props> = ({ demo }) => {
  const [stocksInputLoading, setStocksInputLoading] = useState(false);

  const [stocks, setStocks] = useState<StockInterface[]>([]);
  const [stocksLoaded, setStocksLoaded] = useState(false);
  const [error, setError] = useState<string>('');
  const [orderDropdownValue, setOrderDropdownValue] = useState('NEWEST');
  const [dateRange, setDateRange] = useState<DateRange>("ALL");

  const [netWorth, setNetWorth] = useState<TimeSeries>({
    dates: [],
    values: []
  })

  const [netWorthLoaded, setNetWorthLoaded] = useState(false);
  const [netWorthTimeScale, setNetWorthTimeScale] =
    useState<TimeScaleInterface>('month');
  const [lastNetWorth, setLastNetWorth] = useState(0); // netWorth from previous day to use for today's rel. change calculation

  const [relativeChange, setRelativeChange] = useState<TimeSeries>({
    dates: [],
    values: []
  })
  const [relativeChangeLoaded, setRelativeChangeLoaded] = useState(false);
  const [relativeChangeTimeScale, setRelativeChangeTimeScale] =
    useState<TimeScaleInterface>('month');
  const [todaysRelativeChange, setTodaysRelativeChange] = useState(0);
  const [inflationAdjustedChange, setInflationAdjustedChange] =
    useState<TimeSeries>({
      dates: [],
      values: [],
    });

  const [totalInvested, setTotalInvested] = useState<TimeSeries>({
    dates: [],
    values: []
  })
  const [totalInvestedLoaded, setTotalInvestedLoaded] = useState(false);
  const [totalInvestedTimeScale, setTotalInvestedTimeScale] =
    useState<TimeScaleInterface>('month');

  const { data: session } = useSession();
  const { currency } = useContext(CurrencyContext);

  useEffect(() => {
    // set interval to refetch stocks
    if (stocks.length === 0) return;

    const INTERVALms = 2000;

    const timeoutId = setTimeout(() => {
      getCurrentStockPrices();
    }, INTERVALms);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [stocks]);

  useEffect(() => {
    fetch('/api/portfolio/stocks', {
      method: 'POST',
      body: JSON.stringify({ email: demo ? 'demo' : session?.user?.email }),
    })
      .then(handleErrors)
      .then((response: any) => response.json())
      .then((returnedStocks) => {
        formatStocks(returnedStocks);

        setOrderDropdownValue('NEWEST');
        sortStocks('NEWEST', returnedStocks);

        setStocks(returnedStocks);
        setStocksLoaded(true);
      })
      .then(() => {
        getCurrentStockPrices();
      })
      .catch((error) => {
        setStocksLoaded(true);
        setError(error);
      });
  }, []);

  useEffect(() => {
    fetch('api/portfolio/net_worth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: demo ? 'demo' : session?.user?.email,
      }),
    })
      .then(handleErrors)
      .then((response) => response.json())
      .then((history) => {
        const values: number[] = history.values;
        const dates: Date[] = history.dates;

        setNetWorth({
          dates: dates,
          values: values,
        })

        if (values.length > 0) setLastNetWorth(values[values.length - 1]);

        const timeScale = calculateTimeScale(dates);
        setNetWorthTimeScale(timeScale);

        setNetWorthLoaded(true);
      })
      .catch((error) => {
        setNetWorthLoaded(true);
        setError(error);
      });
  }, []);

  useEffect(() => {
    fetch('api/portfolio/relative_change', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: demo ? 'demo' : session?.user?.email,
      }),
    })
      .then(handleErrors)
      .then((response) => response.json())
      .then((relativeChange) => {
        let values: number[] = relativeChange.values;
        values = values.map((value) => {
          return value * 100 - 100;
        });
        const dates: Date[] = relativeChange.dates;

        setInflationAdjustedChange(relativeChange.inflationAdjustedValues);

        const timeScale = calculateTimeScale(dates);
        setRelativeChangeTimeScale(timeScale);

        setRelativeChange({
          dates: dates,
          values: values
        })

        setRelativeChangeLoaded(true);
      })
      .catch((error) => {
        setRelativeChangeLoaded(true);
        setError(error);
      });
  }, []);

  useEffect(() => {
    fetch('api/portfolio/total_invested', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: demo ? 'demo' : session?.user?.email,
      }),
    })
      .then(handleErrors)
      .then((response) => response.json())
      .then((totalInvested) => {
        const values: number[] = totalInvested.values;
        const dates: Date[] = totalInvested.dates;

        const timeScale = calculateTimeScale(dates);
        setTotalInvestedTimeScale(timeScale);

        setTotalInvested({
          dates: dates,
          values: values
        })

        setTotalInvestedLoaded(true);
      })
      .catch((error) => {
        setTotalInvestedLoaded(true);
        setError(error);
      });
  }, []);

  function getCurrentStockPrices() {
    if (currency === '' || stocks.length === 0) {
      return;
    }

    fetch('api/get_current_stock_prices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tickers: stocks.map(({ ticker }) => ticker),
        currency,
      }),
    })
      .then(handleErrors)
      .then((response) => response.json())
      .then((res) => {
        let newStocks: StockInterface[] = [...stocks];

        newStocks = updatePrices(newStocks, res);

        formatStocks(newStocks);

        setStocks(newStocks);

        let newNetWorthValue = 0;
        newStocks.forEach((stock) => {
          if (stock.amount > 0) {
            newNetWorthValue += stock.amount * stock.prevClose;
          }
        });
        newNetWorthValue = parseFloat(newNetWorthValue.toFixed(2));

        if (lastNetWorth !== 0) {
          setTodaysRelativeChange(100 * (newNetWorthValue / lastNetWorth - 1));
        }

        if (netWorth.dates.length > 0 && netWorth.values.length > 0) {
          const newNetWorth = netWorth
          newNetWorth.dates.push(new Date())
          newNetWorth.values.push(newNetWorthValue)

          setNetWorth(newNetWorth)
        }

        if (
          relativeChange.dates.length > 0 &&
          relativeChange.values.length > 0 &&
          netWorth.values.length > 0
        ) {
          const newRelativeChangeValue =
            (relativeChange.values[relativeChange.values.length - 1] *
              newNetWorthValue) /
            netWorth.values[netWorth.values.length - 1];

          const newRelativeChange = relativeChange;
          newRelativeChange.values[newRelativeChange.values.length - 1] = newRelativeChangeValue;

          setRelativeChange(newRelativeChange)
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  return (
    <Container className="flex flex-col">
      <StockInput
        demo={demo}
        setStocks={setStocks}
        setOrderDropdownValue={setOrderDropdownValue}
        error={error}
        setError={setError}
        stocksInputLoading={stocksInputLoading}
        setNetWorth={setNetWorth}
        setStocksInputLoading={setStocksInputLoading}
        setTotalInvested={setTotalInvested}
      />
      <div className="w-full flex flex-wrap justify-center gap-5 mt-4">
        <Card
          modalClassName='fixed max-w-[600px] left-1/2 top-[5vh] bottom-[5vh] transform -translate-x-1/2 overflow-y-auto bg-gray-100 dark:bg-[#1e2836] opacity-[0.96] rounded-md w-[90vw] border-solid border-[1px] border-blue-400 dark:border-gray-500'
        >
          {stocksLoaded ? (
            <Stocks
              demo={demo}
              stocks={stocks}
              orderDropdownValue={orderDropdownValue}
              dateRange={dateRange}
              setDateRange={setDateRange}
              setOrderDropdownValue={setOrderDropdownValue}
              setStocks={setStocks}
              setError={setError}
              setStocksInputLoading={setStocksInputLoading}
              setNetWorth={setNetWorth}
              setTotalInvested={setTotalInvested}
            />
          ) : (
            <LoadingSpinner size={70} />
          )}
        </Card>
        <Card
          modalClassName='fixed flex justify-center items-center h-[400px] sm:h-auto transform -translate-y-1/2 sm:-translate-y-0 left-[5vw] right-[5vw] top-1/2 sm:top-[5vh] aspect-auto sm:bottom-[5vh] overflow-y-auto bg-gray-100 dark:bg-[#1e2836] opacity-[0.96] rounded-md border-solid border-[1px] border-blue-400 dark:border-gray-500'
        >
          {netWorthLoaded ? (
            <NetWortHistory
              netWorth={netWorth}
              totalInvested={totalInvested}
              dateRange={dateRange}
            />
          ) : (
            <LoadingSpinner size={70} />
          )}
        </Card>
        <Card
          modalClassName='fixed flex justify-center items-center left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-gray-100 dark:bg-[#1e2836] opacity-[0.96] rounded-md aspect-auto md:aspect-[1.2] w-[90vw] md:w-auto h-[40vh] md:h-[90vh] p-0 md:px-14 border-solid border-[1px] border-blue-400 dark:border-gray-500'
        >
          {stocksLoaded ? (
            <PieChart stocks={stocks} />
          ) : (
            <LoadingSpinner size={70} />
          )}
        </Card>
        <Card
          modalClassName='fixed flex justify-center items-center h-[400px] sm:h-auto transform -translate-y-1/2 sm:-translate-y-0 left-[5vw] right-[5vw] top-1/2 sm:top-[5vh] aspect-auto sm:bottom-[5vh] overflow-y-auto bg-gray-100 dark:bg-[#1e2836] opacity-[0.96] rounded-md border-solid border-[1px] border-blue-400 dark:border-gray-500'
        >
          {relativeChangeLoaded ? (
            <RelativeChangeHistory
              todaysRelativeChange={todaysRelativeChange}
              relativeChange={relativeChange}
              dateRange={dateRange}
              inflationAdjustedChange={inflationAdjustedChange}
            />
          ) : (
            <LoadingSpinner size={70} />
          )}
        </Card>
        <Card
          modalClassName='fixed flex justify-center items-center h-[400px] sm:h-auto transform -translate-y-1/2 sm:-translate-y-0 left-[5vw] right-[5vw] top-1/2 sm:top-[5vh] aspect-auto sm:bottom-[5vh] overflow-y-auto bg-gray-100 dark:bg-[#1e2836] opacity-[0.96] rounded-md border-solid border-[1px] border-blue-400 dark:border-gray-500'
        >
          {totalInvestedLoaded ? (
            <TotalInvestedHistory
              totalInvested={totalInvested}
              dateRange={dateRange}
            />
          ) : (
            <LoadingSpinner size={70} />
          )}
        </Card>
        <Card
          modalClassName='fixed flex justify-center items-center h-[400px] sm:h-auto transform -translate-y-1/2 sm:-translate-y-0 left-[5vw] right-[5vw] top-1/2 sm:top-[5vh] aspect-auto sm:bottom-[5vh] overflow-y-auto bg-gray-100 dark:bg-[#1e2836] opacity-[0.96] rounded-md border-solid border-[1px] border-blue-400 dark:border-gray-500'
        >
          {netWorthLoaded ? (
            <NetGainHistory
              netWorth={netWorth}
              totalInvested={totalInvested}
              dateRange={dateRange}
            />
          ) : (
            <LoadingSpinner size={70} />
          )}
        </Card>
      </div>

      <Modal
        open={currency === undefined}
        onClose={() => { }}
        aria-labelledby="set-currency-modal"
        aria-describedby="show-currency-select-modal"
      >
        <div>
          <CurrencySelect />
        </div>
      </Modal>
    </Container>
  );
};

export default MainPage;
