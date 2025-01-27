import { Module } from '@nestjs/common';
import { ConvertService } from './convert.service';
import { ConvertController } from './convert.controller';
import { RateFetcherService } from '../rate/services/rate-fetcher.service';
import { RateModule } from '../rate/rate.module';
import { AssetsModule } from '../assets/assets.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RateModule, AssetsModule, RedisModule],
  controllers: [ConvertController],
  providers: [ConvertService],
})
export class ConvertModule {}
