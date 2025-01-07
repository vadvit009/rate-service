import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

import { Rate } from './entities/rate.entity';
import { RateHistory } from './entities/rate-history.entity';

import { RateFetcherService } from './services/rate-fetcher.service';
import { RateService } from './rate.service';
import { RateSchedulerService } from './services/rate-scheduler.service';
import { RateController } from './rate.controller';
import { RateAlertService } from './services/rate-alert.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rate, RateHistory]),
    ScheduleModule.forRoot(),
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const store = (await redisStore({
          socket: {
            host: config.get('REDIS_HOST'),
            port: config.get('REDIS_PORT'),
          },
        })) as unknown as CacheStore;
        return { store };
      },
    }),
  ],
  controllers: [RateController],
  providers: [
    RateFetcherService,
    RateService,
    RateSchedulerService,
    RateAlertService,
  ],
  exports: [RateService],
})
export class RateModule {}
