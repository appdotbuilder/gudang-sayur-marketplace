<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WishlistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $wishlistItems = Wishlist::with('product.category')
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('wishlist/index', [
            'wishlistItems' => $wishlistItems,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $existingWishlist = Wishlist::where('user_id', auth()->id())
            ->where('product_id', $request->product_id)
            ->first();

        if ($existingWishlist) {
            return back()->with('info', 'Produk sudah ada di wishlist Anda');
        }

        Wishlist::create([
            'user_id' => auth()->id(),
            'product_id' => $request->product_id,
        ]);

        return back()->with('success', 'Produk berhasil ditambahkan ke wishlist');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Wishlist $wishlist)
    {
        if ($wishlist->user_id !== auth()->id()) {
            abort(403);
        }

        $wishlist->delete();

        return back()->with('success', 'Produk berhasil dihapus dari wishlist');
    }
}