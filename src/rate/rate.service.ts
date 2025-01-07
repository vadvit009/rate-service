import {
  Injectable,
  Inject,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Rate } from './entities/rate.entity';
import { RateHistory } from './entities/rate-history.entity';
import { CreateRateDto } from './dtos/create-rate.dto';
import { AggregatedRateDto } from './dtos/aggregated-rate.dto';

@Injectable()
export class RateService {
  constructor(
    @InjectRepository(Rate)
    private readonly rateRepository: Repository<Rate>,

    @InjectRepository(RateHistory)
    private readonly rateHistoryRepository: Repository<RateHistory>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async createRate(createRateDto: CreateRateDto): Promise<Rate> {
    try {
      const { symbol, price, from } = createRateDto;
      console.log({ createRateDto });

      let rate = await this.rateRepository.findOne({ where: { symbol } });
      if (!rate) {
        rate = this.rateRepository.create({ symbol, price, from });
      } else {
        rate.price = price;
      }
      await this.rateRepository.save(rate);

      const rateHistory = this.rateHistoryRepository.create({
        symbol,
        price,
        from,
      });
      await this.rateHistoryRepository.save(rateHistory);

      await this.cacheManager.set(`rate:${symbol}`, price, 300); // 5 minutes

      return rate;
    } catch (error) {
      throw new InternalServerErrorException('Error creating/updating rate');
    }
  }

  async getRate(symbol: string): Promise<number> {
    const cacheKey = `rate:${symbol}`;
    let price = await this.cacheManager.get<number>(cacheKey);

    if (price == null) {
      const rate = await this.rateRepository.findOne({ where: { symbol } });
      if (!rate) {
        throw new NotFoundException(`Rate for symbol '${symbol}' not found`);
      }
      price = rate.price;

      await this.cacheManager.set(cacheKey, price, 5 * 60 * 1000); //5min
    }
    return price;
  }

  async getHistory(symbol: string, limit = 100): Promise<RateHistory[]> {
    return await this.rateHistoryRepository.find({
      where: { symbol },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getAggregatedHistory(
    symbol: string,
    timeframe: 'h' | 'd',
    limit = 24,
  ): Promise<AggregatedRateDto[]> {
    try {
      let dateTruncParam: string;
      if (timeframe === 'h') {
        dateTruncParam = 'hour';
      } else {
        dateTruncParam = 'day';
      }

      const rawData = await this.rateHistoryRepository
        .createQueryBuilder('rh')
        .select(
          `to_char(
            DATE_TRUNC('${dateTruncParam}', rh."createdAt"), 
            'YYYY-MM-DD HH24:MI:SS'
          )`,
          'period',
        )
        .addSelect('AVG(rh."price")', 'averagePrice')
        .where({ symbol })
        .groupBy(`DATE_TRUNC('${dateTruncParam}', rh."createdAt")`)
        .orderBy('period', 'DESC')
        .limit(limit)
        .getRawMany<{
          period: Date;
          averagePrice: string;
        }>();

      return rawData.map((item) => ({
        period: item.period,
        averagePrice: parseFloat(item.averagePrice),
      }));
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve aggregated history',
      );
    }
  }
}
