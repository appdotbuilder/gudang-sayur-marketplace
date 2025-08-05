<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Product;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'order_id' => 'required|exists:orders,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        // Verify order belongs to user and contains the product
        $order = Order::with('items')
            ->where('id', $request->order_id)
            ->where('user_id', auth()->id())
            ->where('status', 'delivered')
            ->first();

        if (!$order) {
            return back()->with('error', 'Pesanan tidak valid');
        }

        $orderHasProduct = $order->items->contains('product_id', $request->product_id);
        if (!$orderHasProduct) {
            return back()->with('error', 'Produk tidak ada dalam pesanan ini');
        }

        // Check if review already exists
        $existingReview = Review::where('user_id', auth()->id())
            ->where('product_id', $request->product_id)
            ->where('order_id', $request->order_id)
            ->first();

        if ($existingReview) {
            return back()->with('error', 'Anda sudah memberikan ulasan untuk produk ini');
        }

        DB::transaction(function () use ($request) {
            // Create review
            Review::create([
                'user_id' => auth()->id(),
                'product_id' => $request->product_id,
                'order_id' => $request->order_id,
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]);

            // Update product rating
            $product = Product::findOrFail($request->product_id);
            $totalReviews = $product->reviews()->count();
            $averageRating = $product->reviews()->avg('rating');

            $product->update([
                'rating' => round($averageRating, 1),
                'total_reviews' => $totalReviews,
            ]);
        });

        return back()->with('success', 'Ulasan berhasil ditambahkan');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Review $review)
    {
        if ($review->user_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        DB::transaction(function () use ($request, $review) {
            $review->update([
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]);

            // Update product rating
            $product = $review->product;
            $averageRating = $product->reviews()->avg('rating');

            $product->update([
                'rating' => round($averageRating, 1),
            ]);
        });

        return back()->with('success', 'Ulasan berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review)
    {
        if ($review->user_id !== auth()->id()) {
            abort(403);
        }

        DB::transaction(function () use ($review) {
            $product = $review->product;
            $review->delete();

            // Recalculate product rating
            $totalReviews = $product->reviews()->count();
            $averageRating = $totalReviews > 0 ? $product->reviews()->avg('rating') : 0;

            $product->update([
                'rating' => round($averageRating, 1),
                'total_reviews' => $totalReviews,
            ]);
        });

        return back()->with('success', 'Ulasan berhasil dihapus');
    }
}