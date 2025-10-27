<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

final class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // $tables = [
        //     'users', 'categories', 'products', 'product_images', 'product_comments',
        //     'product_likes', 'addresses', 'carts', 'cart_items', 'orders',
        //     'order_items', 'wishlists', 'settings'
        // ];

        // foreach ($tables as $table) {
        //     DB::table($table)->truncate();
        // }

        // DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        /**
         * USERS
         */
        $adminId = DB::table('users')->insertGetId([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'is_admin' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $userId = DB::table('users')->insertGetId([
            'name' => 'John Doe',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'is_admin' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $user2Id = DB::table('users')->insertGetId([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'password' => Hash::make('password'),
            'is_admin' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        /**
         * CATEGORIES
         */
        $categories = [
            ['name' => 'Men', 'slug' => 'men'],
            ['name' => 'Women', 'slug' => 'women'],
            ['name' => 'Kids', 'slug' => 'kids'],
            ['name' => 'Accessories', 'slug' => 'accessories'],
            ['name' => 'Shoes', 'slug' => 'shoes'],
        ];

        foreach ($categories as &$cat) {
            $cat['created_at'] = now();
            $cat['updated_at'] = now();
            $cat['parent_id'] = null;
        }

        DB::table('categories')->insert($categories);
        $categoryIds = DB::table('categories')->pluck('id')->toArray();

        /**
         * PRODUCTS
         */
        $products = [];
        for ($i = 1; $i <= 20; $i++) {
            $name = "Product $i";
            $products[] = [
                'category_id' => $categoryIds[array_rand($categoryIds)],
                'name' => $name,
                'slug' => Str::slug($name).'-'.rand(100, 999),
                'description' => "Description for $name - stylish and comfortable clothing item.",
                'price' => rand(15, 200),
                'stock' => rand(5, 50),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('products')->insert($products);
        $productIds = DB::table('products')->pluck('id')->toArray();

        /**
         * PRODUCT IMAGES
         */
        $images = [];
        foreach ($productIds as $pid) {
            $count = rand(1, 3);
            for ($i = 0; $i < $count; $i++) {
                $images[] = [
                    'product_id' => $pid,
                    'path' => "https://via.placeholder.com/400x400.png?text=Product+$pid+Img+$i",
                    'is_main' => $i === 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        DB::table('product_images')->insert($images);

        /**
         * COMMENTS
         */
        $comments = [];
        foreach ($productIds as $pid) {
            $comments[] = [
                'product_id' => $pid,
                'user_id' => $userId,
                'content' => "Really nice product #$pid, great quality!",
                'rating' => rand(3, 5),
                'created_at' => now(),
                'updated_at' => now(),
            ];
            if (rand(0, 1)) {
                $comments[] = [
                    'product_id' => $pid,
                    'user_id' => $user2Id,
                    'content' => 'Good fit and comfortable!',
                    'rating' => rand(4, 5),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        DB::table('product_comments')->insert($comments);

        /**
         * LIKES
         */
        $likes = [];
        foreach ($productIds as $pid) {
            if (rand(0, 1)) {
                $likes[] = ['product_id' => $pid, 'user_id' => $userId, 'created_at' => now(), 'updated_at' => now()];
            }
            if (rand(0, 1)) {
                $likes[] = ['product_id' => $pid, 'user_id' => $user2Id, 'created_at' => now(), 'updated_at' => now()];
            }
        }
        DB::table('product_likes')->insert($likes);

        /**
         * ADDRESSES
         */
        $addressId = DB::table('addresses')->insertGetId([
            'user_id' => $userId,
            'full_name' => 'John Doe',
            'phone' => '+49123456789',
            'city' => 'Berlin',
            'state' => 'Berlin',
            'postal_code' => '10115',
            'street' => 'Alexanderplatz 10',
            'is_default' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        /**
         * CART + ITEMS
         */
        $cartId = DB::table('carts')->insertGetId([
            'user_id' => $userId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $cartItems = [];
        foreach (array_slice($productIds, 0, 3) as $pid) {
            $cartItems[] = [
                'cart_id' => $cartId,
                'product_id' => $pid,
                'quantity' => rand(1, 2),
                'price' => rand(20, 100),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('cart_items')->insert($cartItems);

        /**
         * ORDERS + ITEMS
         */
        $orderId = DB::table('orders')->insertGetId([
            'user_id' => $userId,
            'address_id' => $addressId,
            'status' => 'paid',
            'payment_method' => 'cod',
            'total_amount' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $orderItems = [];
        $total = 0;
        foreach (array_slice($productIds, 0, 3) as $pid) {
            $qty = rand(1, 3);
            $price = rand(20, 100);
            $total += $price * $qty;
            $orderItems[] = [
                'order_id' => $orderId,
                'product_id' => $pid,
                'quantity' => $qty,
                'price' => $price,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('order_items')->insert($orderItems);
        DB::table('orders')->where('id', $orderId)->update(['total_amount' => $total]);

        /**
         * WISHLISTS
         */
        $wishlists = [];
        foreach (array_slice($productIds, 5, 5) as $pid) {
            $wishlists[] = [
                'user_id' => $userId,
                'product_id' => $pid,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('wishlists')->insert($wishlists);

        /**
         * SETTINGS
         */
        $settings = [
            ['key' => 'shop_name', 'value' => 'My Clothing Shop'],
            ['key' => 'currency', 'value' => 'EUR'],
            ['key' => 'support_email', 'value' => 'support@myshop.com'],
            ['key' => 'items_per_page', 'value' => '12'],
        ];
        foreach ($settings as &$s) {
            $s['created_at'] = now();
            $s['updated_at'] = now();
        }
        DB::table('settings')->insert($settings);
    }
}
