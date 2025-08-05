<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PromoCode;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::with('items.product')
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('orders/index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $cartItems = Cart::with('product.category')
            ->where('user_id', auth()->id())
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')
                ->with('error', 'Keranjang Anda kosong');
        }

        $subtotal = $cartItems->sum(function ($item) {
            return $item->quantity * $item->product->price;
        });

        return Inertia::render('orders/create', [
            'cartItems' => $cartItems,
            'subtotal' => $subtotal,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|string',
            'notes' => 'nullable|string',
            'promo_code' => 'nullable|string',
        ]);

        $cartItems = Cart::with('product')
            ->where('user_id', auth()->id())
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')
                ->with('error', 'Keranjang Anda kosong');
        }

        $subtotal = $cartItems->sum(function ($item) {
            return $item->quantity * $item->product->price;
        });

        $discountAmount = 0;
        $promoCode = null;

        // Apply promo code if provided
        if ($request->promo_code) {
            $promoCode = PromoCode::where('code', $request->promo_code)
                ->active()
                ->first();

            if ($promoCode && $subtotal >= $promoCode->minimum_amount) {
                if (!$promoCode->usage_limit || $promoCode->used_count < $promoCode->usage_limit) {
                    if ($promoCode->type === 'percentage') {
                        $discountAmount = $subtotal * ($promoCode->value / 100);
                    } else {
                        $discountAmount = $promoCode->value;
                    }
                    
                    $discountAmount = min($discountAmount, $subtotal);
                }
            }
        }

        $totalAmount = $subtotal - $discountAmount;

        DB::transaction(function () use ($request, $cartItems, $totalAmount, $discountAmount, $promoCode) {
            // Create order
            $order = Order::create([
                'order_number' => 'GS-' . strtoupper(Str::random(8)),
                'user_id' => auth()->id(),
                'status' => 'pending',
                'total_amount' => $totalAmount,
                'discount_amount' => $discountAmount,
                'promo_code' => $promoCode?->code,
                'shipping_address' => $request->shipping_address,
                'notes' => $request->notes,
            ]);

            // Create order items and update stock
            foreach ($cartItems as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->product->price,
                ]);

                // Update product stock and sold count
                $cartItem->product->decrement('stock', $cartItem->quantity);
                $cartItem->product->increment('sold_count', $cartItem->quantity);
            }

            // Update promo code usage
            if ($promoCode && $discountAmount > 0) {
                $promoCode->increment('used_count');
            }

            // Clear cart
            Cart::where('user_id', auth()->id())->delete();
        });

        return redirect()->route('orders.index')
            ->with('success', 'Pesanan berhasil dibuat! Terima kasih telah berbelanja di Gudang Sayur.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        $order->load(['items.product', 'user']);

        return Inertia::render('orders/show', [
            'order' => $order,
        ]);
    }
}