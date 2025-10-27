<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;

/**
 * @param  string  $cache_key
 */
function redisGet($cache_key = '')
{
    if (! config('cache.enabled')) {
        return null;
    }
    $cache_key = config('cache.prefix')."_{$cache_key}";

    if ($cache_key === '') {
        throw new Exception("Cache key can't be empty for redis getter");
    }

    $cache_result = Redis::get($cache_key);

    return $cache_result ? unserialize($cache_result) : null;
}

/**
 * @param  string  $cache_key
 * @param  string|int|array  $data
 */
function redisSet($cache_key = '', $data = null, $life_time = null)
{
    $cache_key = config('cache.prefix')."_{$cache_key}";

    if (! $life_time) {
        $life_time = env('CACHE_TIME', 0.5) * 24 * 60 * 60;
    }

    if (is_null($data) || $cache_key === '') {
        throw new Exception("Data or cache key can't be null for redis setter");
    }

    Redis::setex($cache_key, $life_time, serialize($data));

    return $data;
}

/**
 * Execute a Redis command and optionally set TTL for write operations.
 *
 * @param  int|null  $life_time  (seconds)
 * @return mixed
 */
function redisCommand(string $command, array $params = [], ?int $life_time = null)
{
    if (empty($command) || empty($params)) {
        throw new Exception('Command and params cannot be empty.');
    }

    // Prefixed cache_key
    $params[0] = config('cache.prefix')."_{$params[0]}";

    // Run the command
    $result = Redis::command(mb_strtoupper($command), $params);

    // Determine key name (always first parameter)
    $redisKey = $params[0] ?? null;

    // Default TTL (seconds)
    if (! $life_time) {
        $life_time = env('CACHE_TIME', 0.5) * 24 * 60 * 60; // 12 hours default
    }

    // Apply TTL if it’s a write command and key exists
    $writeCommands = ['SET', 'SADD', 'HSET', 'LPUSH', 'RPUSH', 'ZADD', 'MSET'];

    if ($redisKey && in_array(mb_strtoupper($command), $writeCommands, true)) {
        Redis::command('EXPIRE', [$redisKey, (int) $life_time]);
    }

    return $result;
}

/**
 * @param  string  $pattern
 */
function redisDel($pattern = '*')
{
    try {
        $pattern = config('cache.prefix')."_{$pattern}";
        $app_prefix = mb_strtolower(env('APP_NAME')).'_database_';

        $cache_keys = Redis::keys($pattern);
        foreach ($cache_keys as $cache_key) {
            Redis::del(str_replace($app_prefix, '', $cache_key));
        }

    } catch (Exception $e) {
        Log::channel('single')
            ->error('Wipe Redis not completed! ----- error message = '.$e?->getMessage().' ----- line = '.$e?->getLine().' ----- file = '.$e?->getFile());
    }
}
