<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Home page
Route::get('/', [HomeController::class, 'index'])->name('home');

// Public product routes
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Cart routes
    Route::resource('cart', CartController::class)->except(['create', 'edit', 'show']);
    
    // Order routes
    Route::resource('orders', OrderController::class)->except(['edit', 'update', 'destroy']);
    
    // Wishlist routes
    Route::resource('wishlist', WishlistController::class)->only(['index', 'store', 'destroy']);
    
    // Review routes
    Route::resource('reviews', ReviewController::class)->except(['index', 'create', 'show', 'edit']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
