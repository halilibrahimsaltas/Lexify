import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly redisClient: Redis;

    constructor(private configService: ConfigService) {
        this.redisClient = new Redis({
            host: this.configService.get('REDIS_HOST', 'localhost'),
            port: this.configService.get('REDIS_PORT', 6379),
        });
    }

    async onModuleInit() {
        try {
            await this.redisClient.ping();
            console.log('Redis bağlantısı başarılı');
        } catch (error) {
            console.error('Redis bağlantı hatası:', error);
        }
    }

    async onModuleDestroy() {
        await this.redisClient.quit();
    }

    async set(key: string, value: any, ttl?: number): Promise<void> {
        const stringValue = JSON.stringify(value);
        if (ttl) {
            await this.redisClient.setex(key, ttl, stringValue);
        } else {
            await this.redisClient.set(key, stringValue);
        }
    }

    async get<T>(key: string): Promise<T | null> {
        const value = await this.redisClient.get(key);
        if (!value) return null;
        return JSON.parse(value) as T;
    }

    async del(key: string): Promise<void> {
        await this.redisClient.del(key);
    }

    async delByPattern(pattern: string): Promise<void> {
        const keys = await this.redisClient.keys(pattern);
        if (keys.length > 0) {
            await this.redisClient.del(...keys);
        }
    }
}
