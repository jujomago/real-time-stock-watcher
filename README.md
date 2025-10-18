# Real-Time Stock Watcher

A web application built with React and TypeScript that allows users to monitor stock prices in real-time. It uses WebSockets to receive live trade data from the Finnhub API and displays it through interactive cards and a dynamic chart.

## Features

- **Real-Time Price Updates**: Utilizes WebSockets for live, instantaneous stock price updates.
- **Dynamic Watchlist**: Users can search for and add stocks to a personal watchlist.
- **Price Alerts**: Set a custom price alert for each stock. The card's color changes when the current price crosses the alert threshold.
- **Interactive Chart**: A dynamic line chart visualizes the price history of all watched stocks.
- **Robust Connection Handling**:
  - Features a visual indicator for WebSocket connection status (Connected/Disconnected).
  - Implements an automatic reconnection strategy with exponential backoff if the connection is lost.
  - Uses a ping/pong mechanism to keep the connection alive through proxies and firewalls.
- **Efficient State Management**: Built with modern React hooks, ensuring optimized re-renders and a fluid user experience.
- **Developer-Friendly**: Includes a "Force Disconnect" button in development mode to easily test the reconnection logic.

## Tech Stack

- **Framework**: React 19 (with Hooks)
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Data Visualization**: Chart.js with `react-chartjs-2`
- **API**: Finnhub Stock API for stock symbols and real-time WebSocket trade data.

## Project Structure

The project is organized into a clean, feature-oriented structure to promote scalability and maintainability.

```
real-time-stocks-watcher/
├── public/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ConnectionStatus.tsx
│   │   ├── StockCard.tsx
│   │   ├── StockCardsContainer.tsx
│   │   ├── StockForm.tsx
│   │   ├── StockGraph.tsx
│   │   └── index.ts
│   │
│   ├── hooks/              # Custom React hooks for stateful logic
│   │   └── useStockSocket.ts
│   │
│   ├── utils/              # Helper functions
│   │   ├── createTradeMap.ts
│   │   └── getColorForSymbol.ts
│   │
│   ├── App.css             # Global styles and Tailwind directives
│   ├── App.tsx             # Main application component
│   ├── constants.ts        # Application-wide constants (API keys, URLs)
│   ├── main.tsx            # Application entry point
│   └── types.ts            # TypeScript type definitions
│
├── .eslintrc.cjs
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── tsconfig.json
```

### Key Components & Logic

- **`src/App.tsx`**: The main component that orchestrates the entire application. It manages the `watchedStocks` state and integrates all other components and hooks.

- **`src/hooks/useStockSocket.ts`**: This is the heart of the real-time functionality. This custom hook encapsulates all WebSocket logic:

  - Manages the connection lifecycle (`connecting`, `connected`, `disconnected`).
  - Handles automatic reconnection on unexpected disconnects.
  - Implements a ping/pong heartbeat to prevent timeouts.
  - Exposes `subscribe` and `unsubscribe` methods for the `App` component to use.
  - Exposes an `isConnected` boolean for the UI to react to.

- **`src/components/`**:

  - **`StockForm.tsx`**: Fetches the list of available stocks and provides a form for the user to add a new stock to their watchlist.
  - **`StockCardsContainer.tsx`**: Renders a `StockCard` for each stock in the watchlist.
  - **`StockCard.tsx`**: Displays the real-time data for a single stock, including its name, price, and daily change. Its border color changes based on the price alert.
  - **`StockGraph.tsx`**: Renders a `react-chartjs-2` line chart, plotting the price history of all watched stocks.
  - **`ConnectionStatus.tsx`**: A simple UI component that shows a colored dot (green/red) and text indicating the WebSocket connection status.

- **`src/utils/`**:
  - **`createTradeMap.ts`**: An optimization function that converts an array of incoming trades into a `Map` for efficient price lookups (O(1) average time complexity).
  - **`getColorForSymbol.ts`**: A utility that generates a deterministic, stable color from a stock symbol string, ensuring the graph lines don't change color on each update.

## Getting Started

Follow these steps to get the project running on your local machine.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A free API key from Finnhub

### Installation & Setup

1.  **Clone the repository:**

    ```sh
    git clone <repository-url>
    cd real-time-stocks-watcher
    ```

2.  **Install dependencies:**

    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Finnhub API key:

    ```
    VITE_FINNHUB_API_KEY=your_finnhub_api_key_here
    ```

    _Note: You will need to update `constants.ts` to read this environment variable._

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.
