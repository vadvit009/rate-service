export const globalSymbols = {
  coingecko: {
    bitcoin: 'BTC',
    ethereum: 'ETH',
    litecoin: 'LTC',
  },
  coinmarketcap: {
    BTC: 'BTC',
    ETH: 'ETH',
  },
  binance: {
    BTCUSDT: 'BTC',
    ETHUSDT: 'ETH',
  },
};

export const coingeckoSymbols = Object.keys(globalSymbols.coingecko);
export const coinMarketCapSymbols = Object.keys(globalSymbols.coinmarketcap);
export const binanceSymbols = Object.keys(globalSymbols.binance);

console.log({ coingeckoSymbols, coinMarketCapSymbols, binanceSymbols });
