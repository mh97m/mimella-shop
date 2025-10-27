<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\CartFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

final class Cart extends Model
{
    /** @use HasFactory<CartFactory> */
    use HasFactory;
}
