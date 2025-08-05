<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PromoCode>
 */
class PromoCodeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => strtoupper(fake()->lexify('??????')),
            'name' => fake()->words(2, true),
            'description' => fake()->sentence(),
            'type' => fake()->randomElement(['percentage', 'fixed']),
            'value' => fake()->numberBetween(5, 20),
            'minimum_amount' => fake()->numberBetween(10000, 50000),
            'usage_limit' => fake()->numberBetween(50, 200),
            'used_count' => 0,
            'expires_at' => fake()->dateTimeBetween('now', '+3 months'),
            'is_active' => true,
        ];
    }
}