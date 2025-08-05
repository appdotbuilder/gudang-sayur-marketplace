import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    product: {
        id: number;
        name: string;
        slug: string;
        images: string[];
    };
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    total_amount: number;
    discount_amount: number;
    promo_code?: string;
    shipping_address: string;
    notes?: string;
    created_at: string;
    delivered_at?: string;
    items: OrderItem[];
    user: {
        name: string;
        email: string;
    };
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Props {
    order: Order;
    auth: {
        user: User;
    };
    [key: string]: unknown;
}

export default function OrderShow({ order, auth }: Props) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { label: 'Menunggu Konfirmasi', variant: 'secondary' as const, emoji: '⏳' },
            confirmed: { label: 'Dikonfirmasi', variant: 'default' as const, emoji: '✅' },
            processing: { label: 'Sedang Diproses', variant: 'default' as const, emoji: '📦' },
            shipped: { label: 'Dalam Pengiriman', variant: 'default' as const, emoji: '🚚' },
            delivered: { label: 'Pesanan Diterima', variant: 'default' as const, emoji: '🏆' },
            cancelled: { label: 'Dibatalkan', variant: 'destructive' as const, emoji: '❌' },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        
        return (
            <Badge variant={config.variant} className="text-base px-3 py-1">
                {config.emoji} {config.label}
            </Badge>
        );
    };

    const getStatusTimeline = (status: string) => {
        const statuses = [
            { key: 'pending', label: 'Pesanan Dibuat', emoji: '📝' },
            { key: 'confirmed', label: 'Dikonfirmasi', emoji: '✅' },
            { key: 'processing', label: 'Sedang Diproses', emoji: '📦' },
            { key: 'shipped', label: 'Dalam Pengiriman', emoji: '🚚' },
            { key: 'delivered', label: 'Diterima', emoji: '🏆' },
        ];

        const currentIndex = statuses.findIndex(s => s.key === status);
        
        return statuses.map((statusItem, index) => ({
            ...statusItem,
            completed: index <= currentIndex,
            active: index === currentIndex
        }));
    };

    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <AppShell user={auth.user}>
            <Head title={`Pesanan #${order.order_number} - Gudang Sayur`} />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Link href="/orders" className="text-green-600 hover:underline">
                            ← Kembali ke Pesanan
                        </Link>
                    </div>
                    
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                Pesanan #{order.order_number}
                            </h1>
                            <p className="text-gray-600">
                                Dipesan pada {formatDate(order.created_at)}
                            </p>
                            {order.delivered_at && (
                                <p className="text-gray-600">
                                    Diterima pada {formatDate(order.delivered_at)}
                                </p>
                            )}
                        </div>
                        <div>
                            {getStatusBadge(order.status)}
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status Timeline */}
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold mb-4">📈 Status Pesanan</h2>
                                <div className="space-y-4">
                                    {getStatusTimeline(order.status).map((statusItem, index) => (
                                        <div key={statusItem.key} className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                                                statusItem.completed 
                                                    ? 'bg-green-500 text-white' 
                                                    : 'bg-gray-200 text-gray-500'
                                            }`}>
                                                {statusItem.completed ? '✓' : index + 1}
                                            </div>
                                            <div className={`flex-1 ${
                                                statusItem.active ? 'font-semibold' : ''
                                            }`}>
                                                <div className="flex items-center gap-2">
                                                    <span>{statusItem.emoji}</span>
                                                    <span>{statusItem.label}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Items */}
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold mb-4">🛒 Item Pesanan</h2>
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
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
                                                <Link 
                                                    href={`/products/${item.product.slug}`}
                                                    className="font-semibold hover:text-green-600"
                                                >
                                                    {item.product.name}
                                                </Link>
                                                <div className="text-gray-600 text-sm mt-1">
                                                    {item.quantity} x {formatPrice(item.price)}
                                                </div>
                                                <div className="text-orange-600 font-semibold mt-1">
                                                    {formatPrice(item.price * item.quantity)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipping Address */}
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold mb-4">📍 Alamat Pengiriman</h2>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="font-medium mb-1">{order.user.name}</p>
                                    <p className="text-gray-700 whitespace-pre-line">
                                        {order.shipping_address}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Notes */}
                        {order.notes && (
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-semibold mb-4">📝 Catatan Pesanan</h2>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-700">{order.notes}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div>
                        <Card className="sticky top-4">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold mb-4">💰 Ringkasan Pembayaran</h2>
                                
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between">
                                        <span>Subtotal ({order.items.length} item)</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>
                                    
                                    {order.discount_amount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>
                                                Diskon
                                                {order.promo_code && ` (${order.promo_code})`}
                                            </span>
                                            <span>-{formatPrice(order.discount_amount)}</span>
                                        </div>
                                    )}
                                    
                                    <div className="flex justify-between">
                                        <span>Ongkos Kirim</span>
                                        <span className="text-green-600">Gratis</span>
                                    </div>
                                    
                                    <hr className="my-2" />
                                    
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span className="text-orange-600">{formatPrice(order.total_amount)}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-2">
                                    {order.status === 'delivered' && (
                                        <>
                                            <Button className="w-full" variant="outline">
                                                ⭐ Beri Ulasan Produk
                                            </Button>
                                            <Button className="w-full bg-green-600 hover:bg-green-700">
                                                🔄 Pesan Lagi
                                            </Button>
                                        </>
                                    )}
                                    
                                    {order.status === 'pending' && (
                                        <Button variant="destructive" className="w-full">
                                            ❌ Batalkan Pesanan
                                        </Button>
                                    )}
                                    
                                    <Button variant="outline" className="w-full">
                                        📧 Hubungi Customer Service
                                    </Button>
                                </div>

                                {/* Order Info */}
                                <div className="mt-6 pt-4 border-t text-sm text-gray-600">
                                    <div className="flex justify-between mb-1">
                                        <span>ID Pesanan:</span>
                                        <span className="font-mono">{order.order_number}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tanggal Pesan:</span>
                                        <span>{formatDate(order.created_at)}</span>
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