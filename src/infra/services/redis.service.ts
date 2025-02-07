import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    public client: Redis.Redis;

    async onModuleInit() {
        this.client = new Redis.Redis({
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT),
            db: parseInt(process.env.REDIS_DB),
            password: process.env.REDIS_PASSWORD,
            username: process.env.REDIS_USERNAME,
            
            // Outras configurações, se necessário.
        });
    }

    onModuleDestroy() {
        if (this.client) {
            this.client.quit();
        }
    }

    async get(key: string): Promise<any> {
        const value = await this.client.get(key);
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }

    async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
        const data = typeof value === 'object' ? JSON.stringify(value) : value;
        if (ttlSeconds) {
            await this.client.set(key, data, 'EX', ttlSeconds);
        } else {
            await this.client.set(key, data);
        }
    }

    async del(key: string): Promise<number> {
        return await this.client.del(key);
    }
}
