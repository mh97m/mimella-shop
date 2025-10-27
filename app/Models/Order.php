<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

final class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory;
}
