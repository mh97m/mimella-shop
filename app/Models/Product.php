<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

final class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;
}
