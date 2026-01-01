import React, { useEffect, useState } from 'react'
import { type StockInterface } from '@/types/client/stock'
import { handleErrors } from '@/utils/client/handleErrors'
import { formatStocks } from '@/utils/client/formatStocks'
import { FormControlLabel, FormGroup, Grid, Link, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material'
import PieChart from '../MainPage/Stocks/PieChart'
import { useSession } from 'next-auth/react'

interface PortfolioStockInterface extends StockInterface {
    totalSize: number;
}

function aggregateStocks(
  stocks: StockInterface[],
  quoteType: string
): StockInterface {
  const prevCloseSum = stocks.reduce(
    (sum, s) => sum + s.amount * s.prevClose,
    0
  )

  return {
    amount: 1,
    avgPercentageChange: 0,
    firstPurchase: '',
    lastPurchase: '',
    prevClose: prevCloseSum,
    purchases: [],
    ticker: quoteType,
    trailingPE: 0,
    forwardPE: 0,
    regularMarketChangePercent: 0,
    fiftyTwoWeekChangePercent: 0,
    dividendRatePercent: 0,
    quoteType
  }
}

function transformStocks(
  stocks: StockInterface[]
): [StockInterface, StockInterface] {
  const etfs = stocks.filter(s => s.quoteType === 'ETF')
  const others = stocks.filter(s => s.quoteType !== 'ETF')

  return [
    aggregateStocks(etfs, 'ETF'),
    aggregateStocks(others, 'INDIVIDUAL')
  ]
}

const Portfolio = () => {
    const [includeEtfs, setIncludeEtfs] = useState(false)
    const [stocks, setStocks] = useState<PortfolioStockInterface[]>([])
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const [orderBy, setOrderBy] = useState<string>('')

    const { data: session } = useSession()

    useEffect(() => {
        fetch('/api/portfolio/stocks', {
            method: 'POST',
            body: JSON.stringify({ email: session?.user?.email })
        })
            .then(handleErrors)
            .then((response: any) => response.json())
            .then(returnedStocks => {
                formatStocks(returnedStocks)

                const portfolioStocks: PortfolioStockInterface[] = returnedStocks.map((stock: StockInterface) => {
                    return {
                        ...stock,
                        totalSize: stock.prevClose * stock.amount
                    }
                })

                setStocks(portfolioStocks)
            })
            .catch(error => {
                console.error(error)
            })
    }, [])

    const handleSort = (property: string) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const getFilteredStocks = () => {
        if (includeEtfs) return stocks

        return stocks.filter((stock) => stock.quoteType !== 'ETF')
    }

    const sortedStocks = getFilteredStocks().slice().sort((a, b) => {
        if (orderBy) {
            const aValue = a[orderBy as keyof StockInterface];
            const bValue = b[orderBy as keyof StockInterface];

            if (aValue < bValue) {
                return order === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return order === 'asc' ? 1 : -1;
            }
        }
        return 0;
    });

    const picksVsEtfs = transformStocks(stocks);

    return (
        <Grid>
            <Grid
                container
                display='flex'
                justifyContent='start'
                alignItems='center'
                ml={2}
            >
                <FormGroup>
                    <FormControlLabel
                        control={<Switch checked={includeEtfs} onClick={() => { setIncludeEtfs(!includeEtfs) }} />}
                        label="Include ETFs"
                    />
                </FormGroup>
            </Grid>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'ticker'}
                                    direction={orderBy === 'ticker' ? order : 'asc'}
                                    onClick={() => { handleSort('ticker') }}
                                >
                                    Ticker
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                                <TableSortLabel
                                    active={orderBy === 'amount'}
                                    direction={orderBy === 'amount' ? order : 'asc'}
                                    onClick={() => { handleSort('amount') }}
                                >
                                    Qty
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                                <TableSortLabel
                                    active={orderBy === 'prevClose'}
                                    direction={orderBy === 'prevClose' ? order : 'asc'}
                                    onClick={() => { handleSort('prevClose') }}
                                >
                                    Price
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                                <TableSortLabel
                                    active={orderBy === 'totalSize'}
                                    direction={orderBy === 'totalSize' ? order : 'asc'}
                                    onClick={() => { handleSort('totalSize') }}
                                >
                                    Size
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                                <TableSortLabel
                                    active={orderBy === 'avgPercentageChange'}
                                    direction={orderBy === 'avgPercentageChange' ? order : 'asc'}
                                    onClick={() => { handleSort('avgPercentageChange') }}
                                >
                                    Avg Trade Change
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                                <TableSortLabel
                                    active={orderBy === 'regularMarketChangePercent'}
                                    direction={orderBy === 'regularMarketChangePercent' ? order : 'asc'}
                                    onClick={() => { handleSort('regularMarketChangePercent') }}
                                >
                                    Regular Market Change
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                                <TableSortLabel
                                    active={orderBy === 'fiftyTwoWeekChangePercent'}
                                    direction={orderBy === 'fiftyTwoWeekChangePercent' ? order : 'asc'}
                                    onClick={() => { handleSort('fiftyTwoWeekChangePercent') }}
                                >
                                    1yr Change
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                                <TableSortLabel
                                    active={orderBy === 'trailingPE'}
                                    direction={orderBy === 'trailingPE' ? order : 'asc'}
                                    onClick={() => { handleSort('trailingPE') }}
                                >
                                    Trailing PE
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                                <TableSortLabel
                                    active={orderBy === 'forwardPE'}
                                    direction={orderBy === 'forwardPE' ? order : 'asc'}
                                    onClick={() => { handleSort('forwardPE') }}
                                >
                                    Forward PE
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                                <TableSortLabel
                                    active={orderBy === 'dividendRatePercent'}
                                    direction={orderBy === 'dividendRatePercent' ? order : 'asc'}
                                    onClick={() => { handleSort('dividendRatePercent') }}
                                >
                                    Dividend
                                </TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedStocks.map((stock) => (
                            <TableRow
                                hover
                                key={stock.ticker}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <Link href={`https://finance.yahoo.com/quote/${stock.ticker}`}>
                                        {stock.ticker}
                                    </Link>
                                </TableCell>
                                <TableCell align="center">{stock.amount}</TableCell>
                                <TableCell align="center">{stock.prevClose}</TableCell>
                                <TableCell align="center">{new Intl.NumberFormat('en-US').format(Math.round(stock.totalSize))}</TableCell>
                                <TableCell
                                    align="center"
                                    sx={{
                                        color: stock.avgPercentageChange >= 0 ? 'green' : 'red'
                                    }}
                                >
                                    {stock.avgPercentageChange}%
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{
                                        color: stock.regularMarketChangePercent >= 0 ? 'green' : 'red'
                                    }}
                                >
                                    {Math.round(stock.regularMarketChangePercent * 100) / 100}%
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{
                                        color: stock.fiftyTwoWeekChangePercent >= 0 ? 'green' : 'red'
                                    }}
                                >
                                    {Math.round(stock.fiftyTwoWeekChangePercent * 100) / 100}%
                                </TableCell>
                                <TableCell align="center">{Math.round(stock.trailingPE)}</TableCell>
                                <TableCell align="center">{Math.round(stock.forwardPE)}</TableCell>
                                <TableCell align="center">{Math.round(stock.dividendRatePercent * 100) / 100}%</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid
                display='flex'
                justifyContent='center'
                alignItems='center'
                mx={50}
            >
                <PieChart stocks={sortedStocks} />
                <PieChart stocks={picksVsEtfs} />
            </Grid>
        </Grid>

    )
}

export default Portfolio
