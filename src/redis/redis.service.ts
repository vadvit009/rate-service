import Redis from 'ioredis';
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class RedisService {
  private readonly latestKey = 'latest';
  private readonly ttl5Min = 60 * 5;
  public readonly ttl1HourMin = 60 * 60;
  constructor(@InjectRedis() private readonly redis: Redis) {}

  generateKey(key: string) {
    const date = Date.now();
    return { key: `${key}:${date}`, date };
  }

  get(prefix: string, key: string) {
    return this.redis.get(`${prefix}:${key}`);
  }

  set(prefix: string, key: string, value: string, ttl = this.ttl5Min) {
    return this.redis.set(`${prefix}:${key}`, value, 'EX', ttl);
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
    await this.hSet(gKey, { timestamp: date.toString() });
    await this.redis.expire(`${gKey}`, this.ttl5Min);
    return gKey;
  }

  async getLatest(key: string) {
    const data = await this.hGet(this.latestKey, key);
    return data;
  }
}
