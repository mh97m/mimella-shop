<?php

declare(strict_types=1);

function getRealIp($request)
{
    foreach ($request->headers as $key => $value) {
        switch (mb_strtolower($key)) {
            case 'ar-real-ip':
                return $value[0];

            case 'true-client-ip':
                return $value[0];

            case 'x-real-ip':
                $ip = $value[0];

            case 'x-forwarded-for':
                $ip = $value[0];

            default:
                $ip = $request->ip();
        }
    }

    return $ip;
}

function getFakeIp()
{
    $ip = $_SERVER['REMOTE_ADDR'];
    if (filter_var(@$_SERVER['HTTP_FORWARDED'], FILTER_VALIDATE_IP)) {
        $ip = $_SERVER['HTTP_FORWARDED'];
    }
    if (filter_var(@$_SERVER['HTTP_FORWARDED_FOR'], FILTER_VALIDATE_IP)) {
        $ip = $_SERVER['HTTP_FORWARDED_FOR'];
    }
    if (filter_var(@$_SERVER['HTTP_X_FORWARDED_FOR'], FILTER_VALIDATE_IP)) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    }
    if (filter_var(@$_SERVER['HTTP_CLIENT_IP'], FILTER_VALIDATE_IP)) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    }
    if (filter_var(@$_SERVER['HTTP_X_REAL_IP'], FILTER_VALIDATE_IP)) {
        $ip = $_SERVER['HTTP_X_REAL_IP'];
    }
    if (filter_var(@$_SERVER['HTTP_CF_CONNECTING_IP'], FILTER_VALIDATE_IP)) {
        $ip = $_SERVER['HTTP_CF_CONNECTING_IP'];
    }
    if ($ip === '::1') {
        $ip = '127.0.0.1';
    }

    $ipSources = [
        'HTTP_CLIENT_IP',
        'HTTP_X_FORWARDED_FOR',
        'HTTP_X_REAL_IP',
        'HTTP_CF_CONNECTING_IP',
        'HTTP_FORWARDED_FOR',
        'HTTP_FORWARDED',
        'REMOTE_ADDR',
    ];

    foreach ($ipSources as $source) {
        if (! empty($_SERVER[$source])) {
            $ipList = explode(',', $_SERVER[$source]);
            foreach ($ipList as $ip) {
                $ip = mb_trim($ip); // Just in case there's any extra space
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                    return $ip;
                }
            }
        }
    }

    // Fallback to localhost if no valid IP is found
    return '127.0.0.1';
}
