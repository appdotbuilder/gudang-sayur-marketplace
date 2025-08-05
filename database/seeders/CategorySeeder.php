<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Sayur Daun',
                'slug' => 'sayur-daun',
                'description' => 'Berbagai macam sayuran hijau segar seperti bayam, kangkung, selada, dan lainnya.',
                'image' => '/images/categories/sayur-daun.jpg',
            ],
            [
                'name' => 'Sayur Buah',
                'slug' => 'sayur-buah',
                'description' => 'Sayuran yang berupa buah seperti tomat, terong, cabai, timun, dan lainnya.',
                'image' => '/images/categories/sayur-buah.jpg',
            ],
            [
                'name' => 'Umbi-umbian',
                'slug' => 'umbi-umbian',
                'description' => 'Berbagai jenis umbi-umbian seperti kentang, wortel, bawang, dan lainnya.',
                'image' => '/images/categories/umbi-umbian.jpg',
            ],
            [
                'name' => 'Bumbu Dapur',
                'slug' => 'bumbu-dapur',
                'description' => 'Bumbu dan rempah segar untuk melengkapi masakan Anda.',
                'image' => '/images/categories/bumbu-dapur.jpg',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}