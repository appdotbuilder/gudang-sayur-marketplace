<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::all()->pluck('id', 'slug');

        $products = [
            // Sayur Daun
            [
                'name' => 'Bayam Hijau Segar',
                'slug' => 'bayam-hijau-segar',
                'description' => 'Bayam hijau segar dari petani lokal. Kaya akan zat besi dan vitamin. Cocok untuk sayur bening, tumis, atau lalapan.',
                'price' => 3500,
                'stock' => 50,
                'category_id' => $categories['sayur-daun'],
                'images' => ['/images/products/bayam.jpg'],
                'rating' => 4.5,
                'total_reviews' => 23,
                'sold_count' => 145,
            ],
            [
                'name' => 'Kangkung Darat',
                'slug' => 'kangkung-darat',
                'description' => 'Kangkung darat segar, batang renyah dan daun hijau. Sangat cocok untuk tumis kangkung atau plecing kangkung.',
                'price' => 2500,
                'stock' => 75,
                'category_id' => $categories['sayur-daun'],
                'images' => ['/images/products/kangkung.jpg'],
                'rating' => 4.7,
                'total_reviews' => 34,
                'sold_count' => 200,
            ],
            [
                'name' => 'Selada Hijau',
                'slug' => 'selada-hijau',
                'description' => 'Selada hijau crispy untuk salad atau lalapan. Ditanam secara organik tanpa pestisida berbahaya.',
                'price' => 4000,
                'stock' => 30,
                'category_id' => $categories['sayur-daun'],
                'images' => ['/images/products/selada.jpg'],
                'rating' => 4.3,
                'total_reviews' => 18,
                'sold_count' => 87,
            ],
            [
                'name' => 'Pakcoy Baby',
                'slug' => 'pakcoy-baby',
                'description' => 'Pakcoy baby yang lembut dan manis. Cocok untuk tumis, sup, atau mie ayam. Kaya vitamin C dan K.',
                'price' => 5000,
                'stock' => 40,
                'category_id' => $categories['sayur-daun'],
                'images' => ['/images/products/pakcoy.jpg'],
                'rating' => 4.6,
                'total_reviews' => 29,
                'sold_count' => 112,
            ],

            // Sayur Buah
            [
                'name' => 'Tomat Merah Segar',
                'slug' => 'tomat-merah-segar',
                'description' => 'Tomat merah segar grade A, manis dan berair. Cocok untuk masakan, jus, atau dimakan langsung.',
                'price' => 8000,
                'stock' => 100,
                'category_id' => $categories['sayur-buah'],
                'images' => ['/images/products/tomat.jpg'],
                'rating' => 4.4,
                'total_reviews' => 56,
                'sold_count' => 234,
            ],
            [
                'name' => 'Terong Ungu',
                'slug' => 'terong-ungu',
                'description' => 'Terong ungu segar dengan daging yang lembut. Sangat cocok untuk balado terong, opor, atau gulai.',
                'price' => 6500,
                'stock' => 60,
                'category_id' => $categories['sayur-buah'],
                'images' => ['/images/products/terong.jpg'],
                'rating' => 4.2,
                'total_reviews' => 31,
                'sold_count' => 156,
            ],
            [
                'name' => 'Cabai Rawit Merah',
                'slug' => 'cabai-rawit-merah',
                'description' => 'Cabai rawit merah super pedas untuk menambah cita rasa masakan Anda. Dipetik langsung dari kebun.',
                'price' => 25000,
                'stock' => 25,
                'category_id' => $categories['sayur-buah'],
                'images' => ['/images/products/cabai-rawit.jpg'],
                'rating' => 4.8,
                'total_reviews' => 67,
                'sold_count' => 189,
            ],
            [
                'name' => 'Timun Segar',
                'slug' => 'timun-segar',
                'description' => 'Timun segar dan renyah, cocok untuk lalapan, acar, atau jus. Memiliki kandungan air tinggi dan menyegarkan.',
                'price' => 4500,
                'stock' => 80,
                'category_id' => $categories['sayur-buah'],
                'images' => ['/images/products/timun.jpg'],
                'rating' => 4.1,
                'total_reviews' => 22,
                'sold_count' => 98,
            ],

            // Umbi-umbian
            [
                'name' => 'Kentang Granola',
                'slug' => 'kentang-granola',
                'description' => 'Kentang granola berkualitas tinggi dengan tekstur yang pas untuk berbagai olahan. Cocok untuk kentang goreng atau sup.',
                'price' => 12000,
                'stock' => 90,
                'category_id' => $categories['umbi-umbian'],
                'images' => ['/images/products/kentang.jpg'],
                'rating' => 4.5,
                'total_reviews' => 43,
                'sold_count' => 267,
            ],
            [
                'name' => 'Wortel Orange',
                'slug' => 'wortel-orange',
                'description' => 'Wortel orange segar kaya beta karoten. Manis dan renyah, cocok untuk sup, jus, atau dimakan langsung.',
                'price' => 7000,
                'stock' => 70,
                'category_id' => $categories['umbi-umbian'],
                'images' => ['/images/products/wortel.jpg'],
                'rating' => 4.6,
                'total_reviews' => 38,
                'sold_count' => 198,
            ],
            [
                'name' => 'Bawang Merah',
                'slug' => 'bawang-merah',
                'description' => 'Bawang merah segar dari Brebes dengan aroma yang kuat. Bumbu dasar masakan Indonesia yang wajib ada di dapur.',
                'price' => 35000,
                'stock' => 45,
                'category_id' => $categories['umbi-umbian'],
                'images' => ['/images/products/bawang-merah.jpg'],
                'rating' => 4.7,
                'total_reviews' => 78,
                'sold_count' => 345,
            ],
            [
                'name' => 'Bawang Putih',
                'slug' => 'bawang-putih',
                'description' => 'Bawang putih berkualitas dengan aroma tajam dan rasa yang kuat. Bumbu wajib untuk masakan nusantara.',
                'price' => 30000,
                'stock' => 35,
                'category_id' => $categories['umbi-umbian'],
                'images' => ['/images/products/bawang-putih.jpg'],
                'rating' => 4.8,
                'total_reviews' => 62,
                'sold_count' => 289,
            ],

            // Bumbu Dapur
            [
                'name' => 'Jahe Merah',
                'slug' => 'jahe-merah',
                'description' => 'Jahe merah segar dengan rasa pedas dan hangat. Cocok untuk wedang, jamu, atau bumbu masakan.',
                'price' => 15000,
                'stock' => 40,
                'category_id' => $categories['bumbu-dapur'],
                'images' => ['/images/products/jahe.jpg'],
                'rating' => 4.4,
                'total_reviews' => 25,
                'sold_count' => 134,
            ],
            [
                'name' => 'Lengkuas Segar',
                'slug' => 'lengkuas-segar',
                'description' => 'Lengkuas segar dengan aroma khas untuk bumbu gulai, rendang, atau soto. Menambah cita rasa masakan.',
                'price' => 8000,
                'stock' => 55,
                'category_id' => $categories['bumbu-dapur'],
                'images' => ['/images/products/lengkuas.jpg'],
                'rating' => 4.3,
                'total_reviews' => 19,
                'sold_count' => 89,
            ],
            [
                'name' => 'Serai Wangi',
                'slug' => 'serai-wangi',
                'description' => 'Serai segar dengan aroma wangi yang khas. Cocok untuk bumbu sup, gulai, atau teh serai yang menyegarkan.',
                'price' => 3000,
                'stock' => 65,
                'category_id' => $categories['bumbu-dapur'],
                'images' => ['/images/products/serai.jpg'],
                'rating' => 4.2,
                'total_reviews' => 16,
                'sold_count' => 76,
            ],
            [
                'name' => 'Daun Jeruk Purut',
                'slug' => 'daun-jeruk-purut',
                'description' => 'Daun jeruk purut segar dengan aroma harum. Bumbu wajib untuk gulai, rendang, dan masakan Padang lainnya.',
                'price' => 2000,
                'stock' => 85,
                'category_id' => $categories['bumbu-dapur'],
                'images' => ['/images/products/daun-jeruk.jpg'],
                'rating' => 4.5,
                'total_reviews' => 33,
                'sold_count' => 167,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}