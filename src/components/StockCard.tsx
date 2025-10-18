import type { WatchedStock } from "../types";

interface StockCardProps {
  onRemove: (symbol: string) => void;
  stock: WatchedStock;
}

/**
 * A card component that displays real-time information for a single watched stock.
 * It shows the stock's name, symbol, current price, and daily change.
 * The card's border color changes based on whether the current price is above or below the user-defined alert price.
 * @param {StockCardProps} props - The props for the component.
 * @param {WatchedStock} props.stock - The stock data to display.
 * @param {function} props.onRemove - Callback function to remove the stock from the watchlist.
 */
export const StockCard = ({ stock, onRemove }: StockCardProps) => {
  const isAboveAlert = stock.currentPrice > stock.alertPrice;
  const cardColorClass = isAboveAlert
    ? "border-green-600 bg-green-100/70"
    : "border-red-500 bg-red-100/70";

  const changePercent = stock.changePercent.toFixed(2);
  const changeClass =
    stock.changePercent >= 0 ? "text-green-700" : "text-red-500";

  return (
    <div
      className={`basis-[250px] bg-white rounded-lg p-4 relative shadow-md border-2 ${cardColorClass}`}
    >
      <button
        className="absolute top-1 right-2 bg-red-300 text-white rounded-full border-none cursor-pointer p-0 opacity-40  hover:opacity-100 w-[22px] h-[22px] leading-4 text-lg"
        onClick={() => onRemove(stock.symbol)}
      >
        &times;
      </button>
      <h3 className="text-md max-w-[275px] truncate">
        <span className="font-bold text-lg">{stock.symbol}</span> ({stock.name})
      </h3>

      <div className="text-2xl font-bold">${stock.currentPrice.toFixed(2)}</div>

      <div className={`text-sm my-2 ${changeClass}`}>
        {changePercent}% (Today)
      </div>
      <hr className="border-0 border-b border-gray-300" />
      <div className="text-sm mt-2 flex justify-between">
        Alert Price{" "}
        <span className="font-bold">${stock.alertPrice.toFixed(2)}</span>
      </div>
    </div>
  );
};
