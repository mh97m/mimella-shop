<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\WishlistFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

final class Wishlist extends Model
{
    /** @use HasFactory<WishlistFactory> */
    use HasFactory;
}
