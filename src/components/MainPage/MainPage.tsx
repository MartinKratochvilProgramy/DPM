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
import { type InflationAdjustedValues } from '@/pages/api/portfolio/relative_change';
import NetGainHistory from './NetGainHistory';
import Card from './Card';

interface Props {
  demo: boolean;
}

const MainPage: React.FC<Props> = ({ demo }) => {
  const [stocksInputLoading, setStocksInputLoading] = useState(false);

  const [stocks, setStocks] = useState<StockInterface[]>([]);
  const [stocksLoaded, setStocksLoaded] = useState(false);
  const [error, setError] = useState<string>('');
  const [orderDropdownValue, setOrderDropdownValue] = useState('NEWEST');
  const [stocksOpen, setStocksOpen] = useState(false);

  const [netWorthDates, setNetWorthDates] = useState<Date[]>([]);
  const [netWorthValues, setNetWorthValues] = useState<number[]>([]);

  const [netWorthLoaded, setNetWorthLoaded] = useState(false);
  const [netWorthTimeScale, setNetWorthTimeScale] =
    useState<TimeScaleInterface>('month');
  const [netWorthHistoryOpen, setNetWorthHistoryOpen] = useState(false);
  const [netGainOpen, setNetGainOpen] = useState(false);
  const [lastNetWorth, setLastNetWorth] = useState(0); // netWorth from previous day to use for today's rel. change calculation

  const [relativeChangeDates, setRelativeChangeDates] = useState<Date[]>([]);
  const [relativeChangeValues, setRelativeChangeValues] = useState<number[]>(
    [],
  );
  const [relativeChangeLoaded, setRelativeChangeLoaded] = useState(false);
  const [relativeChangeTimeScale, setRelativeChangeTimeScale] =
    useState<TimeScaleInterface>('month');
  const [relativeChangeOpen, setRelativeChangeOpen] = useState(false);
  const [todaysRelativeChange, setTodaysRelativeChange] = useState(0);
  const [inflationAdjustedChange, setInflationAdjustedChange] =
    useState<InflationAdjustedValues>({
      dates: [],
      values: [],
    });

  const [pieOpen, setPieOpen] = useState(false);

  const [totalInvestedDates, setTotalInvestedDates] = useState<Date[]>([]);
  const [totalInvestedValues, setTotalInvestedValues] = useState<number[]>([]);
  const [totalInvestedLoaded, setTotalInvestedLoaded] = useState(false);
  const [totalInvestedTimeScale, setTotalInvestedTimeScale] =
    useState<TimeScaleInterface>('month');
  const [totalInvestedOpen, setTotalInvestedOpen] = useState(false);

  const { data: session } = useSession();
  const { currency } = useContext(CurrencyContext);

  useEffect(() => {
    // set interval to refetch stocks
    if (stocks.length === 0) return;

    const INTERVALms = 2000;

    const timeoutId = setTimeout(() => {
      if (!pieOpen) {
        getCurrentStockPrices();
      }
    }, INTERVALms);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [stocks, pieOpen]);

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

        setNetWorthValues(values);
        setNetWorthDates(dates);
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

        setRelativeChangeValues(values);
        setRelativeChangeDates(dates);

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

        setTotalInvestedDates(dates);
        setTotalInvestedValues(values);

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

        let newNetWorth = 0;
        newStocks.forEach((stock) => {
          if (stock.amount > 0) {
            newNetWorth += stock.amount * stock.prevClose;
          }
        });
        newNetWorth = parseFloat(newNetWorth.toFixed(2));

        if (lastNetWorth !== 0) {
          setTodaysRelativeChange(100 * (newNetWorth / lastNetWorth - 1));
        }

        if (netWorthDates.length > 0 && netWorthValues.length > 0) {
          setNetWorthDates([...netWorthDates, new Date()]);
          setNetWorthValues([...netWorthValues, newNetWorth]);
        }

        if (
          relativeChangeDates.length > 0 &&
          relativeChangeValues.length > 0 &&
          netWorthValues.length > 0
        ) {
          const newRelativeChange =
            (relativeChangeValues[relativeChangeValues.length - 1] *
              newNetWorth) /
            netWorthValues[netWorthValues.length - 1];
          setRelativeChangeDates([...relativeChangeDates, new Date()]);
          setRelativeChangeValues([...relativeChangeValues, newRelativeChange]);
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
        setStocksInputLoading={setStocksInputLoading}
        setNetWorthDates={setNetWorthDates}
        setNetWorthValues={setNetWorthValues}
        setTotalInvestedDates={setTotalInvestedDates}
        setTotalInvestedValues={setTotalInvestedValues}
      />
      <div className="w-full flex flex-wrap justify-center gap-5 mt-4">
        <Card
        >
          {stocksLoaded ? (
            <div className="fixed max-w-[600px]">
              <Stocks
                demo={demo}
                stocks={stocks}
                orderDropdownValue={orderDropdownValue}
                setOrderDropdownValue={setOrderDropdownValue}
                setStocks={setStocks}
                setError={setError}
                setStocksInputLoading={setStocksInputLoading}
                setNetWorthDates={setNetWorthDates}
                setNetWorthValues={setNetWorthValues}
                setTotalInvestedDates={setTotalInvestedDates}
                setTotalInvestedValues={setTotalInvestedValues}
              />
            </div>
          ) : (
            <LoadingSpinner size={70} />
          )}
        </Card>
        <Card>
          {netWorthLoaded ? (
            <NetWortHistory
              netWorthDates={netWorthDates}
              netWorthValues={netWorthValues}
              totalInvestedDates={totalInvestedDates}
              totalInvestedValues={totalInvestedValues}
              timeScale={netWorthTimeScale}
            />
          ) : (
            <LoadingSpinner size={70} />
          )}
        </Card>
        <Card>
          {stocksLoaded ? (
            <PieChart stocks={stocks} />
          ) : (
            <LoadingSpinner size={70} />
          )}
        </Card>
        <Card>
          {relativeChangeLoaded ? (
            <RelativeChangeHistory
              todaysRelativeChange={todaysRelativeChange}
              relativeChangeDates={relativeChangeDates}
              relativeChangeValues={relativeChangeValues}
              timeScale={relativeChangeTimeScale}
              inflationAdjustedChange={inflationAdjustedChange}
            />
          ) : (
            <LoadingSpinner size={70} />
          )}
        </Card>
        <Card>
          {totalInvestedLoaded ? (
            <TotalInvestedHistory
              totalInvestedDates={totalInvestedDates}
              totalInvestedValues={totalInvestedValues}
              timeScale={totalInvestedTimeScale}
            />
          ) : (
            <LoadingSpinner size={70} />
          )}
        </Card>
        <Card>
          {netWorthLoaded ? (
            <NetGainHistory
              netWorthDates={netWorthDates}
              netWorthValues={netWorthValues}
              totalInvestedDates={totalInvestedDates}
              totalInvestedValues={totalInvestedValues}
              timeScale={netWorthTimeScale}
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
