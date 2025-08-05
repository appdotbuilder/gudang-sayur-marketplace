import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CartItem {
    id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        price: number;
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
    subtotal: number;
    auth: {
        user: User;
    };
    [key: string]: unknown;
}

export default function OrderCreate({ cartItems, subtotal, auth }: Props) {
    const [shippingAddress, setShippingAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const applyPromoCode = () => {
        // Simple promo code logic (in real app, this would be server-side)
        let discountAmount = 0;
        const upperPromo = promoCode.toUpperCase();
        
        if (upperPromo === 'WELCOME10' && subtotal >= 50000) {
            discountAmount = subtotal * 0.1;
        } else if (upperPromo === 'SAYUR50K' && subtotal >= 30000) {
            discountAmount = 5000;
        } else if (upperPromo === 'FRESH15' && subtotal >= 75000) {
            discountAmount = subtotal * 0.15;
        }
        
        setDiscount(Math.min(discountAmount, subtotal));
    };

    const total = subtotal - discount;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post('/orders', {
            shipping_address: shippingAddress,
            notes: notes,
            promo_code: promoCode
        }, {
            onFinish: () => setIsSubmitting(false)
        });
    };

    return (
        <AppShell user={auth.user}>
            <Head title="Checkout - Gudang Sayur" />
            
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">🚚 Checkout Pesanan</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Shipping Address */}
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-semibold mb-4">📍 Alamat Pengiriman</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="shipping_address">Alamat Lengkap *</Label>
                                            <Textarea
                                                id="shipping_address"
                                                placeholder="Masukkan alamat lengkap Anda..."
                                                value={shippingAddress}
                                                onChange={(e) => setShippingAddress(e.target.value)}
                                                required
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Order Notes */}
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-semibold mb-4">📝 Catatan Pesanan</h2>
                                    <Textarea
                                        placeholder="Catatan tambahan untuk pesanan (opsional)..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={3}
                                    />
                                </CardContent>
                            </Card>

                            {/* Promo Code */}
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-semibold mb-4">🎟️ Kode Promo</h2>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Masukkan kode promo..."
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                        />
                                        <Button type="button" variant="outline" onClick={applyPromoCode}>
                                            Terapkan
                                        </Button>
                                    </div>
                                    
                                    {discount > 0 && (
                                        <div className="mt-2 text-green-600 font-medium">
                                            ✅ Kode promo berhasil diterapkan! Hemat {formatPrice(discount)}
                                        </div>
                                    )}

                                    <div className="mt-4 text-sm text-gray-600">
                                        <p className="font-medium mb-2">Kode promo yang tersedia:</p>
                                        <ul className="space-y-1">
                                            <li>• <code className="bg-gray-100 px-2 py-1 rounded">WELCOME10</code> - Diskon 10% (min. Rp 50.000)</li>
                                            <li>• <code className="bg-gray-100 px-2 py-1 rounded">SAYUR50K</code> - Potongan Rp 5.000 (min. Rp 30.000)</li>
                                            <li>• <code className="bg-gray-100 px-2 py-1 rounded">FRESH15</code> - Diskon 15% (min. Rp 75.000)</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <Card className="sticky top-4">
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-bold mb-4">📋 Ringkasan Pesanan</h2>
                                    
                                    {/* Items */}
                                    <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex gap-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                                    <img 
                                                        src={item.product.images[0] || '/images/placeholder.jpg'} 
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 text-sm">
                                                    <div className="font-medium line-clamp-2">{item.product.name}</div>
                                                    <div className="text-gray-600">
                                                        {item.quantity}x {formatPrice(item.product.price)}
                                                    </div>
                                                    <div className="text-orange-600 font-semibold">
                                                        {formatPrice(item.product.price * item.quantity)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Totals */}
                                    <div className="space-y-2 border-t pt-4">
                                        <div className="flex justify-between">
                                            <span>Subtotal ({cartItems.length} item)</span>
                                            <span>{formatPrice(subtotal)}</span>
                                        </div>
                                        
                                        {discount > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Diskon ({promoCode})</span>
                                                <span>-{formatPrice(discount)}</span>
                                            </div>
                                        )}
                                        
                                        <div className="flex justify-between">
                                            <span>Ongkos Kirim</span>
                                            <span className="text-green-600">Gratis</span>
                                        </div>
                                        
                                        <hr />
                                        
                                        <div className="flex justify-between font-bold text-lg">
                                            <span>Total Bayar</span>
                                            <span className="text-orange-600">{formatPrice(total)}</span>
                                        </div>
                                    </div>

                                    <Button 
                                        type="submit"
                                        disabled={!shippingAddress || isSubmitting}
                                        className="w-full mt-6 bg-green-600 hover:bg-green-700" 
                                        size="lg"
                                    >
                                        {isSubmitting ? 'Memproses...' : '💳 Buat Pesanan'}
                                    </Button>

                                    <div className="mt-4 text-xs text-gray-500 text-center">
                                        Dengan melanjutkan, Anda menyetujui syarat dan ketentuan yang berlaku.
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppShell>
    );
}