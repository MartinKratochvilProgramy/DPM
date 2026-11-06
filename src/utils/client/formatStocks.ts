import { type StockInterface } from '@/types/client/stock';

export const formatStocks = (stocks: StockInterface[]) => {
  // adds average percent change to each stock

  for (const stock of stocks) {
    let relativeChanges = 0;
    let amounts = 0;
    let totalPnl = 0;
    stock.avgPercentageChange = 0;
    stock.avgTradePnl = 0;

    // calculate weighted average for gain of each purchase
    for (const purchase of stock.purchases) {
      const relativeChange = (stock.prevClose / purchase.price - 1) * 100;
      const totalRelativeChange = relativeChange * purchase.amount;
      relativeChanges += totalRelativeChange;
      amounts += purchase.amount;
      totalPnl += (stock.prevClose - purchase.price) * purchase.amount;

      // update relative change for each purchase
      purchase.relativeChange = relativeChange;
    }

    stock.avgPercentageChange = parseFloat(
      (relativeChanges / amounts).toFixed(1),
    );
    stock.avgTradePnl = stock.purchases.length
      ? parseFloat((totalPnl / stock.purchases.length).toFixed(2))
      : 0;
  }
};
