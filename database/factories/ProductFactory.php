<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->words(3, true);
        
        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->paragraph(),
            'price' => fake()->numberBetween(2000, 50000),
            'stock' => fake()->numberBetween(10, 100),
            'images' => ['/images/products/' . Str::slug($name) . '.jpg'],
            'category_id' => Category::factory(),
            'rating' => fake()->randomFloat(1, 3.0, 5.0),
            'total_reviews' => fake()->numberBetween(0, 100),
            'sold_count' => fake()->numberBetween(0, 500),
            'is_active' => true,
        ];
    }
}