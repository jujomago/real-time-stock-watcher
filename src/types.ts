export interface FinnhubStockSymbol {
  description: string; // "APPLE INC"
  displaySymbol: string; // "AAPL"
  symbol: string; // "AAPL"
}

export interface WatchedStock {
  symbol: string;
  name: string;
  alertPrice: number;
  currentPrice: number;
  changePercent: number;
  history: { time: number; price: number }[];
}
