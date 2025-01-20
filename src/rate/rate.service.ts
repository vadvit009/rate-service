import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Rate } from './entities/rate.entity';
import { RateHistory } from './entities/rate-history.entity';
import { CreateRateDto } from './dtos/create-rate.dto';
import { AggregatedRateDto } from './dtos/aggregated-rate.dto';
import { SocketGateway } from '../socket/socket.gateway';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class RateService {
  private readonly ratesKey = 'rates';
  constructor(
    @InjectRepository(Rate)
    private readonly rateRepository: Repository<Rate>,

    @InjectRepository(RateHistory)
    private readonly rateHistoryRepository: Repository<RateHistory>,
    private readonly socketGateway: SocketGateway,
    private readonly redisService: RedisService,
  ) {}

  async getLatest() {
    const data = await this.redisService.getLatest(this.ratesKey);
    return data;
  }

  async updateRates(key: string, value: Record<string, string>) {
    const data = await this.redisService.hSet(key, value);
    return data;
  }

  async getAllRates() {
    const data = await this.redisService.hGetAll(this.ratesKey);
    return data;
  }

  async getLatestRate(field: string) {
    const key = await this.getLatest();
    const data = await this.redisService.hGet(key, field);
    return data;
  }

  async getAllLatestRates() {
    const key = await this.getLatest();
    const data = await this.redisService.hGetAll(key);
    return data;
  }

  async triggerUpdate() {
    const data = await this.getAllLatestRates();
    this.socketGateway.emitAllRates(data);
  }

  async createRate(createRateDto: CreateRateDto): Promise<Rate> {
    try {
      const { symbol, price, key } = createRateDto;

      let rate = await this.rateRepository.findOne({ where: { symbol } });
      if (!rate) {
        rate = this.rateRepository.create({ symbol, price });
      } else {
        rate.price = price;
      }
      await this.rateRepository.save(rate);

      const rateHistory = this.rateHistoryRepository.create({
        symbol,
        price,
      });
      await this.rateHistoryRepository.save(rateHistory);

      const date = new Date();
      await this.updateRates(key, {
        [symbol]: price.toFixed(4),
        timestamp: date.getTime().toString(),
      });

      return rate;
    } catch (error) {
      throw new InternalServerErrorException('Error creating/updating rate');
    }
  }

  async getRate(symbol: string): Promise<number> {
    let price = +(await this.getLatestRate(symbol));

    if (price == null) {
      const key = await this.redisService.setLatest(this.ratesKey);
      const rate = await this.rateRepository.findOne({ where: { symbol } });
      if (!rate) {
        throw new NotFoundException(`Rate for symbol '${symbol}' not found`);
      }
      price = rate.price;

      const date = new Date();
      await this.updateRates(key, {
        [symbol]: price.toFixed(4),
        timestamp: date.getTime().toString(),
      });
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
