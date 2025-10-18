// src/App.tsx
import { useState, useCallback, useEffect, useRef } from "react";
import type { WatchedStock } from "./types";
import {
  StockForm,
  StockCardsContainer,
  StockGraph,
  ConnectionStatusIndicator,
} from "./components";
import { FINNHUB_API_KEY, FINNHUB_API_URL } from "./constants";
import "./App.css";
import { useStockSocket } from "./hooks/useStockSocket";
import { createTradeMap } from "./utils";

const updateStockIfTradeExists = (
  stock: WatchedStock,
  tradesBySymbol: Map<string, { price: number; time: number }>
) => {
  const MAX_HISTORY_POINTS = 100;
  const trade = tradesBySymbol.get(stock.symbol);

  if (!trade) {
    return stock;
  }

  const newHistoryPoint = {
    time: trade.time,
    price: trade.price,
  };

  const updatedHistory = [...stock.history, newHistoryPoint].slice(
    -MAX_HISTORY_POINTS
  );

  return {
    ...stock,
    currentPrice: trade.price,
    history: updatedHistory,
  };
};

function App() {
  const [watchedStocks, setWatchedStocks] = useState<WatchedStock[]>([]);
  // We use a ref to access the most recent list of actions
  // from the useEffect without having to add it as a dependency.
  const watchedStocksRef = useRef(watchedStocks);
  watchedStocksRef.current = watchedStocks;

  const updateStockPrices = useCallback(
    (trades: { s: string; p: number; t: number }[]) => {
      // console.log(trades);
      setWatchedStocks((currentStocks) => {
        const tradesBySymbol = createTradeMap(trades);
        return currentStocks.map((stock) =>
          updateStockIfTradeExists(stock, tradesBySymbol)
        );
      });
    },
    []
  );

  const { subscribe, unsubscribe, isConnected, socketRef } = useStockSocket({
    onTrade: updateStockPrices,
  });

  // This useEffect handles subscriptions when the socket is opened
  useEffect(() => {
    if (isConnected) {
      console.log("Socket is open, subscribing to stocks...");
      watchedStocksRef.current.forEach((stock, index) => {
        setTimeout(() => {
          subscribe(stock.symbol);
        }, index * 100); // Delay to avoid saturating the API
      });
    }
  }, [isConnected, subscribe]);

  const handleAddStock = useCallback(
    async (symbol: string, alertPrice: number) => {
      try {
        const quotePromise = fetch(
          `${FINNHUB_API_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
        );
        const profilePromise = fetch(
          `${FINNHUB_API_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`
        );

        const [quoteRes, profileRes] = await Promise.all([
          quotePromise,
          profilePromise,
        ]);

        const [quoteData, profileData] = await Promise.all([
          quoteRes.json(),
          profileRes.json(),
        ]);

        if (!profileData.name) {
          alert("The stock doesn't exists");
          return;
        }

        const newStock: WatchedStock = {
          symbol: symbol,
          name: profileData.name,
          alertPrice: alertPrice,
          currentPrice: quoteData.c,
          changePercent: quoteData.dp,
          history: [{ time: Date.now(), price: quoteData.c }],
        };

        setWatchedStocks((currentStocks) => {
          if (currentStocks.find((s) => s.symbol === symbol)) {
            alert(`${symbol} is already on your list.`);
            return currentStocks;
          }
          return [...currentStocks, newStock];
        });

        subscribe(symbol);
      } catch (error) {
        console.error("Error adding stock:", error);
        alert("An error occurred while adding the stock. Please try again.");
      }
    },
    [subscribe]
  );

  const handleRemoveStock = useCallback(
    (symbol: string) => {
      unsubscribe(symbol);
      setWatchedStocks((currentStocks) =>
        currentStocks.filter((stock) => stock.symbol !== symbol)
      );
    },
    [unsubscribe]
  );

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800 max-w-6xl mx-auto border  ">
      <aside className="basis-1/4 bg-white p-5 border-r border-gray-200 flex flex-col">
        <StockForm onAddStock={handleAddStock} />
        <ConnectionStatusIndicator isConnected={isConnected} />
      </aside>
      <main className="flex-grow p-5 flex flex-col">
        {" "}
        <StockCardsContainer
          stocks={watchedStocks}
          onRemoveStock={handleRemoveStock}
        />
        {watchedStocks.length === 0 && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">📈</div>
              <h2 className="text-3xl font-bold text-foreground">
                Start Tracking Stocks
              </h2>
              <p className="text-muted-foreground text-lg max-w-md">
                Select a stock from the left panel and set a price alert to
                begin real-time monitoring
              </p>
            </div>
          </div>
        )}
        {watchedStocks.length > 0 && (
          <div className="flex-grow bg-white p-5 rounded-lg shadow-md min-h-[400px]">
            <StockGraph stocks={watchedStocks} />
          </div>
        )}
      </main>
      {/* // (just in dev): */}
      {import.meta.env.DEV && (
        <button
          onClick={() => socketRef.current?.close(3000, "Manual disconnect")}
          className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          🔌 Force Disconnect
        </button>
      )}
    </div>
  );
}

export default App;
