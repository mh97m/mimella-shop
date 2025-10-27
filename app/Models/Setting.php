<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\SettingFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

final class Setting extends Model
{
    /** @use HasFactory<SettingFactory> */
    use HasFactory;
}
