import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RateAlertService {
  private readonly logger = new Logger(RateAlertService.name);

  private readonly thresholdMap = {
    bitcoin: { upper: 100_000, lower: 90000 },
    ethereum: { upper: 4000, lower: 3000 },
  };

  checkThreshold(symbol: string, price: number): void {
    const threshold = this.thresholdMap[symbol];
    if (!threshold) return;

    if (price >= threshold.upper) {
      this.logger.warn(
        `${symbol.toUpperCase()} price reached upper threshold!`,
      );
    } else if (price <= threshold.lower) {
      this.logger.warn(
        `${symbol.toUpperCase()} price fell below lower threshold!`,
      );
    }
  }
}
