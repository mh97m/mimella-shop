<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Database\Factories\ProductCommentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;

final class ProductComment extends Model
{
    /** @use HasFactory<ProductCommentFactory> */
    use HasFactory;
}
