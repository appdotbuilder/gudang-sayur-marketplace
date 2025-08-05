import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface CartItem {
    id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        slug: string;
        price: number;
        stock: number;
        images: string[];
        category: {
            name: string;
        };
    };
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Props {
    cartItems: CartItem[];
    total: number;
    auth: {
        user: User;
    };
    [key: string]: unknown;
}

export default function CartIndex({ cartItems, total, auth }: Props) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const updateQuantity = (cartId: number, quantity: number) => {
        router.put(`/cart/${cartId}`, { quantity }, {
            preserveScroll: true
        });
    };

    const removeItem = (cartId: number) => {
        router.delete(`/cart/${cartId}`, {
            preserveScroll: true
        });
    };

    const proceedToCheckout = () => {
        router.get('/orders/create');
    };

    if (cartItems.length === 0) {
        return (
            <AppShell user={auth.user}>
                <Head title="Keranjang Belanja - Gudang Sayur" />
                
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-16">
                        <div className="text-8xl mb-6">🛒</div>
                        <h1 className="text-3xl font-bold mb-4">Keranjang Belanja Kosong</h1>
                        <p className="text-gray-600 mb-8">
                            Belum ada produk di keranjang Anda. Yuk mulai berbelanja sayur segar!
                        </p>
                        <Link href="/products">
                            <Button size="lg" className="bg-green-600 hover:bg-green-700">
                                🛍️ Mulai Belanja
                            </Button>
                        </Link>
                    </div>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell user={auth.user}>
            <Head title="Keranjang Belanja - Gudang Sayur" />
            
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">🛒 Keranjang Belanja</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <Card key={item.id}>
                                    <CardContent className="p-6">
                                        <div className="flex gap-4">
                                            <Link href={`/products/${item.product.slug}`}>
                                                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img 
                                                        src={item.product.images[0] || '/images/placeholder.jpg'} 
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </Link>
                                            
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <Link 
                                                            href={`/products/${item.product.slug}`}
                                                            className="font-semibold hover:text-green-600"
                                                        >
                                                            {item.product.name}
                                                        </Link>
                                                        <Badge variant="secondary" className="ml-2 text-xs">
                                                            {item.product.category.name}
                                                        </Badge>
                                                    </div>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        🗑️
                                                    </Button>
                                                </div>
                                                
                                                <div className="flex items-center justify-between">
                                                    <div className="text-lg font-bold text-orange-600">
                                                        {formatPrice(item.product.price)}
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-gray-600">Qty:</span>
                                                        <div className="flex items-center border rounded-lg">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                -
                                                            </Button>
                                                            <Input
                                                                type="number"
                                                                value={item.quantity}
                                                                onChange={(e) => updateQuantity(item.id, Math.max(1, Math.min(item.product.stock, parseInt(e.target.value) || 1)))}
                                                                className="w-16 text-center border-0 focus-visible:ring-0"
                                                                min="1"
                                                                max={item.product.stock}
                                                            />
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => updateQuantity(item.id, Math.min(item.product.stock, item.quantity + 1))}
                                                                disabled={item.quantity >= item.product.stock}
                                                            >
                                                                +
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-2 text-right">
                                                    <span className="text-sm text-gray-600">Subtotal: </span>
                                                    <span className="font-semibold">
                                                        {formatPrice(item.product.price * item.quantity)}
                                                    </span>
                                                </div>
                                                
                                                {item.product.stock < 10 && (
                                                    <div className="mt-2">
                                                        <Badge variant="destructive" className="text-xs">
                                                            Stok terbatas: {item.product.stock} tersisa
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <Card className="sticky top-4">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold mb-4">📋 Ringkasan Pesanan</h2>
                                
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between">
                                        <span>Subtotal ({cartItems.length} item)</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Ongkos Kirim</span>
                                        <span className="text-green-600">Gratis</span>
                                    </div>
                                    <hr className="my-2" />
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span className="text-orange-600">{formatPrice(total)}</span>
                                    </div>
                                </div>

                                <Button 
                                    onClick={proceedToCheckout}
                                    className="w-full bg-green-600 hover:bg-green-700" 
                                    size="lg"
                                >
                                    🚚 Lanjut ke Checkout
                                </Button>

                                <div className="mt-4 text-center">
                                    <Link href="/products">
                                        <Button variant="outline" className="w-full">
                                            ← Lanjut Belanja
                                        </Button>
                                    </Link>
                                </div>

                                {/* Promo Info */}
                                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                                    <h3 className="font-semibold mb-2">🎉 Promo Tersedia!</h3>
                                    <div className="text-sm space-y-1">
                                        <div>• WELCOME10 - Diskon 10%</div>
                                        <div>• SAYUR50K - Potongan Rp 5.000</div>
                                        <div>• FRESH15 - Diskon 15%</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}