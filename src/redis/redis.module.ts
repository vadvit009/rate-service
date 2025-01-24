import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisModule as RedisModuleLib } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RedisModuleLib.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'single',
        options: {
          port: config.get('REDIS_PORT'),
          host: config.get('REDIS_HOST'),
        },
      }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
