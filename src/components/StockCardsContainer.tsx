import type { WatchedStock } from "../types";
import { StockCard } from "./StockCard";

interface StockCardsContainerProps {
  stocks: WatchedStock[];
  onRemoveStock: (symbol: string) => void;
}

/**
 * A container component that renders a list of `StockCard` components.
 * It maps over the array of watched stocks and passes the necessary props to each card.
 * @param {StockCardsContainerProps} props - The props for the component.
 * @param {WatchedStock[]} props.stocks - An array of stocks to be displayed.
 * @param {function} props.onRemoveStock - The handler function to remove a stock.
 */
export const StockCardsContainer = ({
  stocks,
  onRemoveStock,
}: StockCardsContainerProps) => {
  return (
    <div className="flex flex-wrap gap-4 mb-5">
      {stocks.length === 0 ? (
        <p className="w-full rounded-xl border border-border p-12 text-center text-xl bg-white">
          Add stocks to see the chart
        </p>
      ) : (
        stocks.map((stock) => (
          <StockCard
            key={stock.symbol}
            stock={stock}
            onRemove={onRemoveStock}
          />
        ))
      )}
    </div>
  );
};
