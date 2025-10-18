import { useState, useEffect } from "react";
import type { FinnhubStockSymbol } from "../types";
import { FINNHUB_API_KEY, FINNHUB_API_URL, POPULAR_STOCKS } from "../constants";

interface StockFormProps {
  onAddStock: (symbol: string, alertPrice: number) => void;
}

/**
 * A form component that allows users to select a stock from a predefined list,
 * set a price alert, and add it to their watchlist.
 * It fetches the list of available stocks on mount.
 * @param {StockFormProps} props - The props for the component.
 * @param {function} props.onAddStock - Callback function to add a new stock to the watchlist.
 */

export const StockForm = ({ onAddStock }: StockFormProps) => {
  const [allSymbols, setAllSymbols] = useState<FinnhubStockSymbol[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [alertPrice, setAlertPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSymbols = async () => {
      console.log("fetching symbols...");
      try {
        const popularSet = new Set(POPULAR_STOCKS);
        const response = await fetch(
          `${FINNHUB_API_URL}/stock/symbol?exchange=US&token=${FINNHUB_API_KEY}`
        );
        const data: FinnhubStockSymbol[] = await response.json();

        const commonStocks = data.filter((s) => popularSet.has(s.symbol));
        setAllSymbols(commonStocks);
      } catch (error) {
        console.error("Error fetching stock symbols:", error);
      }
    };
    fetchSymbols();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSymbol || !alertPrice || +alertPrice <= 0) {
      alert("Please select a valid stock and alert price.");
      return;
    }

    setIsLoading(true);
    try {
      await onAddStock(selectedSymbol, parseFloat(alertPrice));
      setSelectedSymbol("");
      setAlertPrice("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4">Stock Tracker</h2>

      <div className="mb-4">
        <label htmlFor="stock-symbol" className="block mb-1 font-semibold">
          Select Stock
        </label>
        <select
          id="stock-symbol"
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="" disabled>
            Select a Stock...
          </option>
          {allSymbols.map((s) => (
            <option key={s.symbol} value={s.symbol}>
              {s.description} ({s.symbol})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="alert-price" className="block mb-1 font-semibold">
          Price Alert (USD)
        </label>
        <input
          type="number"
          id="alert-price"
          placeholder="Enter alert price"
          value={alertPrice}
          onChange={(e) => setAlertPrice(e.target.value)}
          step="0.01"
          min="0"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full p-2.5 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? "Adding..." : "Add Stock"}
      </button>
    </form>
  );
};
