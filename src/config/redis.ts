import { createClient } from 'redis';
import { logger } from '../utils/logger';

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => logger.error('Redis Client Error', err));
client.on('connect', () => logger.info('✅ Redis connected successfully'));

export const connectRedis = async () => {
  try {
    await client.connect();
  } catch (error) {
    logger.error('❌ Redis connection failed:', error);
    throw error;
  }
};

export const redisClient = client;
