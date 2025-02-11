import { Module } from '@nestjs/common';
import {
  CoingeckoService,
  CryptoComService,
  BinanceService,
  CoinMarketCapService,
} from './services';
import { AxiosErrorHelper } from './helpers/axios-error.helper';

@Module({
  providers: [
    CoingeckoService,
    CryptoComService,
    BinanceService,
    CoinMarketCapService,
    AxiosErrorHelper,
  ],
  exports: [
    BinanceService,
    CoingeckoService,
    CryptoComService,
    CoinMarketCapService,
  ],
})
export class ProvidersModule {}
