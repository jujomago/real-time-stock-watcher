// Predefined list of popular actions
export const POPULAR_STOCKS = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "NVDA",
  "META",
  "TSLA",
  "JPM",
  "JNJ",
  "WMT",
  "V",
  "DIS",
  "NFLX",
  "PYPL",
  "KO",
  "PEP",
];

export const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
export const FINNHUB_WS_URL = `wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`;
export const FINNHUB_API_URL = `https://finnhub.io/api/v1`;
