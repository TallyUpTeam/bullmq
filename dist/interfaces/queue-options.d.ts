import { JobsOptions } from '../interfaces';
import { Redis } from 'ioredis';
import { ConnectionOptions } from './redis-options';
export declare enum ClientType {
    blocking = "blocking",
    normal = "normal"
}
export interface QueueBaseOptions {
    connection?: ConnectionOptions;
    client?: Redis;
    /**
     * Prefix for all queue keys.
     */
    prefix?: string;
}
export interface QueueOptions extends QueueBaseOptions {
    defaultJobOptions?: JobsOptions;
    limiter?: {
        groupKey: string;
    };
    streams?: {
        events: {
            /**
             * Max aproximated length for streams
             */
            maxLen: number;
        };
    };
}
export interface QueueEventsOptions extends QueueBaseOptions {
    lastEventId?: string;
    blockingTimeout?: number;
}
