// Generates a stable color based on the action symbol string.
// This prevents colors from changing on each render.
export const getColorForSymbol = (symbol: string) => {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;

  return `hsl(${h}, 70%, 50%)`;
};

export const createTradeMap = (
  trades: { s: string; p: number; t: number }[]
) => {
  return new Map(trades.map(({ s, p, t }) => [s, { price: p, time: t }]));
};
