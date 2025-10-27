<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Database\Factories\OrderItemFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;

final class OrderItem extends Model
{
    /** @use HasFactory<OrderItemFactory> */
    use HasFactory;
}
