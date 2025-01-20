import Redis from 'ioredis';
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class RedisService {
  private readonly latestKey = 'latest';
  private readonly ttlSec = 60 * 5;
  constructor(@InjectRedis() private readonly redis: Redis) {}

  generateKey(key: string) {
    const date = Date.now();
    return { key: `${key}:${date}`, date };
  }

  async hGet(key: string, field: string) {
    const data = await this.redis.hget(key, field);
    return data;
  }

  async hGetAll(key: string) {
    const data = await this.redis.hgetall(key);
    return data;
  }

  async hSet(key: string, value: Record<string, string>) {
    const data = await this.redis.hset(key, value);
    return data;
  }

  async setLatest(key: string) {
    const { key: gKey, date } = this.generateKey(key);
    const data = await this.hSet(this.latestKey, { [key]: gKey });
    await this.hSet(gKey, { timestamp: data.toString() });
    await this.redis.expire(`${gKey}`, this.ttlSec);
    return gKey;
  }

  async getLatest(key: string) {
    const data = await this.hGet(this.latestKey, key);
    return data;
  }
}
