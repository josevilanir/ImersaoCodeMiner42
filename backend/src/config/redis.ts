import Redis from 'ioredis';
import { env } from './env';

export const redisConnection = new Redis({
  host: env.redis.host,
  port: env.redis.port,
  password: env.redis.password,
  maxRetriesPerRequest: null,
});

export const redisConfig = {
  connection: redisConnection,
};
