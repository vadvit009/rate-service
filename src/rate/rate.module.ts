import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { Rate } from './entities/rate.entity';
import { RateHistory } from './entities/rate-history.entity';

import { RateFetcherService } from './services/rate-fetcher.service';
import { RateService } from './rate.service';
import { RateSchedulerService } from './services/rate-scheduler.service';
import { RateController } from './rate.controller';
import { SocketModule } from '../socket/socket.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rate, RateHistory]),
    ScheduleModule.forRoot(),
    SocketModule,
    RedisModule,
  ],
  controllers: [RateController],
  providers: [RateFetcherService, RateService, RateSchedulerService],
  exports: [RateFetcherService, RateService, RateSchedulerService],
})
export class RateModule {}
