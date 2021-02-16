import { JobsOptions } from '../interfaces';
import { QueueBase, QueueEvents } from './';
export interface JobJson {
    id: string;
    name: string;
    data: string;
    opts: string;
    progress: number | object;
    attemptsMade: number;
    finishedOn?: number;
    processedOn?: number;
    timestamp: number;
    failedReason: string;
    stacktrace: string;
    returnvalue: string;
}
export declare class Job<T = any, R = any, N extends string = string> {
    private queue;
    name: N;
    data: T;
    opts: JobsOptions;
    id?: string;
    progress: number | object;
    returnvalue: R;
    stacktrace: string[];
    timestamp: number;
    attemptsMade: number;
    failedReason: string;
    finishedOn?: number;
    processedOn?: number;
    private toKey;
    private discarded;
    constructor(queue: QueueBase, name: N, data: T, opts?: JobsOptions, id?: string);
    static create<T = any, R = any, N extends string = string>(queue: QueueBase, name: N, data: T, opts?: JobsOptions): Promise<Job<T, R, N>>;
    static createBulk<T = any, R = any, N extends string = string>(queue: QueueBase, jobs: {
        name: N;
        data: T;
        opts?: JobsOptions;
    }[]): Promise<Job<T, R, N>[]>;
    static fromJSON(queue: QueueBase, json: any, jobId?: string): Job<any, any, any>;
    static fromId(queue: QueueBase, jobId: string): Promise<Job | undefined>;
    toJSON(): Pick<this, Exclude<keyof this, "queue">>;
    asJSON(): JobJson;
    update(data: T): Promise<void>;
    updateProgress(progress: number | object): Promise<void>;
    /**
     * Logs one row of log data.
     *
     * @params logRow: string String with log data to be logged.
     *
     */
    log(logRow: string): Promise<number>;
    remove(): Promise<void>;
    /**
     * Extend the lock for this job.
     *
     * @param token unique token for the lock
     * @param duration lock duration in milliseconds
     */
    extendLock(token: string, duration: number): Promise<any>;
    /**
     * Moves a job to the completed queue.
     * Returned job to be used with Queue.prototype.nextJobFromJobData.
     * @param returnValue {string} The jobs success message.
     * @param fetchNext {boolean} True when wanting to fetch the next job
     * @returns {Promise} Returns the jobData of the next job in the waiting queue.
     */
    moveToCompleted(returnValue: R, token: string, fetchNext?: boolean): Promise<[JobJson, string] | []>;
    /**
     * Moves a job to the failed queue.
     * @param err {Error} The jobs error message.
     * @param token {string} Token to check job is locked by current worker
     * @param fetchNext {boolean} True when wanting to fetch the next job
     * @returns void
     */
    moveToFailed(err: Error, token: string, fetchNext?: boolean): Promise<void>;
    isCompleted(): Promise<boolean>;
    isFailed(): Promise<boolean>;
    isDelayed(): Promise<boolean>;
    isActive(): Promise<boolean>;
    isWaiting(): Promise<boolean>;
    getState(): Promise<"active" | "delayed" | "completed" | "failed" | "waiting" | "unknown">;
    /**
     * Returns a promise the resolves when the job has finished. (completed or failed).
     */
    waitUntilFinished(queueEvents: QueueEvents, ttl?: number): Promise<any>;
    moveToDelayed(timestamp: number): Promise<void>;
    promote(): Promise<void>;
    /**
     * Attempts to retry the job. Only a job that has failed can be retried.
     *
     * @return {Promise} If resolved and return code is 1, then the queue emits a waiting event
     * otherwise the operation was not a success and throw the corresponding error. If the promise
     * rejects, it indicates that the script failed to execute
     */
    retry(state?: 'completed' | 'failed'): Promise<void>;
    discard(): void;
    private isInZSet;
    private isInList;
    private addJob;
    private saveAttempt;
}
