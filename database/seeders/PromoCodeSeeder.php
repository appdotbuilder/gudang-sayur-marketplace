<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PromoCode;

class PromoCodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $promoCodes = [
            [
                'code' => 'WELCOME10',
                'name' => 'Selamat Datang',
                'description' => 'Diskon 10% untuk member baru',
                'type' => 'percentage',
                'value' => 10,
                'minimum_amount' => 50000,
                'usage_limit' => 100,
                'used_count' => 0,
                'expires_at' => now()->addMonths(3),
                'is_active' => true,
            ],
            [
                'code' => 'SAYUR50K',
                'name' => 'Diskon Sayur',
                'description' => 'Potongan Rp 5,000 untuk belanja sayur',
                'type' => 'fixed',
                'value' => 5000,
                'minimum_amount' => 30000,
                'usage_limit' => 200,
                'used_count' => 0,
                'expires_at' => now()->addMonths(2),
                'is_active' => true,
            ],
            [
                'code' => 'FRESH15',
                'name' => 'Sayur Segar',
                'description' => 'Diskon 15% untuk sayur segar',
                'type' => 'percentage',
                'value' => 15,
                'minimum_amount' => 75000,
                'usage_limit' => 50,
                'used_count' => 0,
                'expires_at' => now()->addMonths(1),
                'is_active' => true,
            ],
        ];

        foreach ($promoCodes as $promoCode) {
            PromoCode::create($promoCode);
        }
    }
}