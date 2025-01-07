import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';

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
    CacheModule.register({
      // store: redisStore,
      // host: 'REDIS_HOST',
      // port: 'REDIS_PORT',
      // isGlobal: true,
      // ttl: 300,
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
