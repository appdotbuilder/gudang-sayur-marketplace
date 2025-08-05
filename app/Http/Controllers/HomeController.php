<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home page.
     */
    public function index(Request $request)
    {
        // Get categories
        $categories = Category::all();

        // Get featured products (best selling)
        $featuredProducts = Product::with('category')
            ->active()
            ->orderBy('sold_count', 'desc')
            ->take(8)
            ->get();

        // Get new products
        $newProducts = Product::with('category')
            ->active()
            ->orderBy('created_at', 'desc')
            ->take(8)
            ->get();

        // Get products on sale (can be extended later)
        $saleProducts = Product::with('category')
            ->active()
            ->where('stock', '>', 0)
            ->orderBy('rating', 'desc')
            ->take(8)
            ->get();

        // Search functionality
        $searchResults = [];
        if ($request->filled('search')) {
            $searchResults = Product::with('category')
                ->active()
                ->where('name', 'like', '%' . $request->search . '%')
                ->orderBy('sold_count', 'desc')
                ->take(12)
                ->get();
        }

        return Inertia::render('welcome', [
            'categories' => $categories,
            'featuredProducts' => $featuredProducts,
            'newProducts' => $newProducts,
            'saleProducts' => $saleProducts,
            'searchResults' => $searchResults,
            'searchQuery' => $request->search,
        ]);
    }
}