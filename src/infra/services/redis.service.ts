import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    public client: Redis.Redis;

    async onModuleInit() {
        if (process.env.DISABLE_REDIS === 'true') {
            // Desabilita o Redis configurando um cliente fictício
            this.client = {
                get: async () => null,
                set: async () => {},
                del: async () => 0,
                quit: () => {},
            } as any;
            return;
        }
        if (process.env.REDIS_URL) {
            // A URL deve ter o formato: redis://[username:password@]host:port/db
            this.client = new Redis.default(process.env.REDIS_URL);
        } else {
            this.client = new Redis.default({
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT),
                db: parseInt(process.env.REDIS_DB),
                password: process.env.REDIS_PASSWORD,
                username: process.env.REDIS_USERNAME,
            });
        }
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
        if (typeof ttlSeconds === 'number' && Number.isInteger(ttlSeconds) && ttlSeconds > 0) {
            await this.client.set(key, data, 'EX', ttlSeconds);
        } else {
            await this.client.set(key, data);
        }
    }

    async del(key: string): Promise<number> {
        return await this.client.del(key);
    }
}
