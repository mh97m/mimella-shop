<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\CategoryFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

final class Category extends Model
{
    /** @use HasFactory<CategoryFactory> */
    use HasFactory;
}
