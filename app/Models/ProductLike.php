<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Database\Factories\ProductLikeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;

final class ProductLike extends Model
{
    /** @use HasFactory<ProductLikeFactory> */
    use HasFactory;
}
