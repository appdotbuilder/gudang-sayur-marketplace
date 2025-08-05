<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_number' => 'GS-' . strtoupper(Str::random(8)),
            'user_id' => User::factory(),
            'status' => fake()->randomElement(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
            'total_amount' => fake()->numberBetween(20000, 200000),
            'discount_amount' => fake()->numberBetween(0, 10000),
            'promo_code' => fake()->optional()->lexify('??????'),
            'shipping_address' => fake()->address(),
            'notes' => fake()->optional()->sentence(),
            'delivered_at' => fake()->optional()->dateTimeThisMonth(),
        ];
    }
}