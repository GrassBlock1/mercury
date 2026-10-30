import crypto from 'node:crypto';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export interface FileCacheOptions {
    dir: string;
    extension: string;
    /** age (ms) after which a cached file is ignored */
    ttlMs: number;
    /** number of keys kept in memory, Infinity for no limit */
    memoryLimit: number;
    /** omit to keep memory entries forever */
    memoryTtlMs?: number;
}

export interface CacheHit {
    data: Uint8Array;
    source: 'memory' | 'file';
}

interface MemoryEntry {
    data: Uint8Array;
    timestamp: number;
}

export function createFileCache(options: FileCacheOptions) {
    const memory = new Map<string, MemoryEntry>();

    const filePathFor = (key: string) =>
        join(options.dir, `${crypto.createHash('md5').update(key).digest('hex')}${options.extension}`);

    function remember(key: string, data: Uint8Array) {
        if (memory.size >= options.memoryLimit) {
            const oldestKey = memory.keys().next().value;
            if (oldestKey !== undefined) memory.delete(oldestKey);
        }
        memory.set(key, { data, timestamp: Date.now() });
    }

    async function get(key: string): Promise<CacheHit | null> {
        const cached = memory.get(key);
        if (cached) {
            if (options.memoryTtlMs === undefined || Date.now() - cached.timestamp < options.memoryTtlMs) {
                return { data: cached.data, source: 'memory' };
            }
            memory.delete(key);
        }

        const filePath = filePathFor(key);
        try {
            const stats = await stat(filePath);
            if (Date.now() - stats.mtimeMs > options.ttlMs) {
                return null; // too old
            }
            const data = await readFile(filePath);
            remember(key, data);
            return { data, source: 'file' };
        } catch (error) {
            return null; // missing or unreadable
        }
    }

    async function set(key: string, data: Uint8Array): Promise<boolean> {
        remember(key, data);
        try {
            await mkdir(options.dir, { recursive: true });
            await writeFile(filePathFor(key), data);
            return true;
        } catch (error) {
            console.warn(`Failed to cache ${key}:`, error);
            return false;
        }
    }

    return { get, set };
}
