<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Database\Factories\ProductImageFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;

final class ProductImage extends Model
{
    /** @use HasFactory<ProductImageFactory> */
    use HasFactory;
}
