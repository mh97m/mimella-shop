<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\CartItemFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

final class CartItem extends Model
{
    /** @use HasFactory<CartItemFactory> */
    use HasFactory;
}
