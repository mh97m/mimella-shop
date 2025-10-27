<?php

declare(strict_types=1);

use Carbon\Carbon;
use Hekmatinasser\Verta\Verta;

/**
 * @param  $time
 */
function uTCDateTime($date)
{
    try {
        if (
            $date instanceof Carbon
        ) {
            $date = $date;
        } elseif (
            $date instanceof Verta
        ) {
            $date = $date->toCarbon();
        } elseif (is_string($date)) {
            if (
                $date[0] === '2' ||
                $date[1] >= '5'
            ) {
                $date = Carbon::parse($date)->timezone('UTC');
            } else {
                $date = Verta::parse($date)->timezone('UTC')->toCarbon();
            }
        } else {
            return null;
        }

        return $date;
    } catch (Exception $e) {
        return null;
    }
}

function nowUTCDateTime()
{
    return Verta::now()->toCarbon();
}

function firstDayOfNextMonthUTCDateTime()
{
    return Verta::now()->addMonth()->startMonth()->toCarbon();
}

function firstDayOfMonthUTCDateTime()
{
    return Verta::now()->startMonth()->toCarbon();
}

function vertaToCrabon($date)
{
    try {
        $exploded_date = explode('/', $date);

        return Verta::parse(mb_trim($exploded_date[2]).'-'.mb_trim($exploded_date[1]).'-'.mb_trim($exploded_date[0]))->timezone('UTC')->toCarbon()->format('Y/m/d');
    } catch (Exception $e) {
        return $date;
    }
}

function reverseTimeFormat($date)
{
    try {
        $exploded_date = explode('/', $date);

        return mb_trim($exploded_date[2]).'/'.mb_trim($exploded_date[1]).'/'.mb_trim($exploded_date[0]);
    } catch (Exception $e) {
        return $date;
    }
}

function formatJalaliDate($date)
{
    try {
        if (
            $date instanceof Carbon
        ) {
            $date = $date->toJalali();
        } elseif (is_string($date)) {
            if (
                $date[0] === '2' ||
                $date[1] >= '5'
            ) {
                $date = Carbon::parse($date)->timezone('UTC')->toJalali();
            } else {
                $date = Verta::parse($date)->timezone('UTC');
            }
        } else {
            return null;
        }

        return $date->format('d / m / Y');
    } catch (Exception $e) {
        return $date;
    }
}
