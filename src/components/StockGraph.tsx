import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import type { WatchedStock } from "../types";
import { getColorForSymbol } from "../utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface StockGraphProps {
  stocks: WatchedStock[];
}

/**
 * A component that renders a line chart to visualize the price history of watched stocks.
 * It uses Chart.js and the react-chartjs-2 wrapper.
 * @param {StockGraphProps} props - The props for the component.
 * @param {WatchedStock[]} props.stocks - An array of watched stocks containing their price history.
 */
export const StockGraph = ({ stocks }: StockGraphProps) => {
  const data = {
    // Use timestamps as labels
    labels:
      // Take labels from the history of the first stock, assuming all have the same length.
      stocks[0]?.history.map((h) => new Date(h.time).toLocaleTimeString()) ??
      [],
    datasets: stocks.map((stock) => {
      const color = getColorForSymbol(stock.symbol);
      return {
        label: stock.symbol,
        data: stock.history.map((h) => h.price), // The value in dollars
        fill: false,
        borderColor: color,
        backgroundColor: color + "80", // With opacity
        tension: 0.1,
      };
    }),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Real-Time Stock Value (USD)",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Value (USD)",
        },
      },
    },
  };

  return <Line options={options} data={data} />;
};

export default StockGraph;
