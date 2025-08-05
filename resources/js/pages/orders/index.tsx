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
        name: string;
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
    created_at: string;
    items: OrderItem[];
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Link {
    url?: string;
    label: string;
    active: boolean;
}

interface Props {
    orders: {
        data: Order[];
        links: Link[];
        current_page: number;
        last_page: number;
    };
    auth: {
        user: User;
    };
    [key: string]: unknown;
}

export default function OrderIndex({ orders, auth }: Props) {
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
            pending: { label: 'Menunggu', variant: 'secondary' as const, emoji: '⏳' },
            confirmed: { label: 'Dikonfirmasi', variant: 'default' as const, emoji: '✅' },
            processing: { label: 'Diproses', variant: 'default' as const, emoji: '📦' },
            shipped: { label: 'Dikirim', variant: 'default' as const, emoji: '🚚' },
            delivered: { label: 'Diterima', variant: 'default' as const, emoji: '🏆' },
            cancelled: { label: 'Dibatalkan', variant: 'destructive' as const, emoji: '❌' },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        
        return (
            <Badge variant={config.variant}>
                {config.emoji} {config.label}
            </Badge>
        );
    };

    if (orders.data.length === 0) {
        return (
            <AppShell user={auth.user}>
                <Head title="Pesanan Saya - Gudang Sayur" />
                
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-16">
                        <div className="text-8xl mb-6">📦</div>
                        <h1 className="text-3xl font-bold mb-4">Belum Ada Pesanan</h1>
                        <p className="text-gray-600 mb-8">
                            Anda belum pernah melakukan pemesanan. Yuk mulai berbelanja sayur segar!
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
            <Head title="Pesanan Saya - Gudang Sayur" />
            
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">📦 Pesanan Saya</h1>

                <div className="space-y-6">
                    {orders.data.map((order) => (
                        <Card key={order.id}>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-1">
                                            Pesanan #{order.order_number}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {formatDate(order.created_at)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        {getStatusBadge(order.status)}
                                        <div className="mt-2">
                                            <Link href={`/orders/${order.id}`}>
                                                <Button variant="outline" size="sm">
                                                    Lihat Detail
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items Preview */}
                                <div className="flex gap-2 mb-4 overflow-x-auto">
                                    {order.items.slice(0, 3).map((item, index) => (
                                        <div key={index} className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden">
                                            <img 
                                                src={item.product.images[0] || '/images/placeholder.jpg'} 
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                    {order.items.length > 3 && (
                                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-xs font-medium">
                                            +{order.items.length - 3}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-center border-t pt-4">
                                    <div className="text-sm text-gray-600">
                                        {order.items.length} item • {order.items.reduce((sum, item) => sum + item.quantity, 0)} produk
                                    </div>
                                    <div className="text-right">
                                        {order.discount_amount > 0 && (
                                            <div className="text-sm text-green-600 mb-1">
                                                Hemat {formatPrice(order.discount_amount)}
                                                {order.promo_code && ` (${order.promo_code})`}
                                            </div>
                                        )}
                                        <div className="text-lg font-bold text-orange-600">
                                            Total: {formatPrice(order.total_amount)}
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="flex gap-2 mt-4">
                                    {order.status === 'delivered' && (
                                        <Button variant="outline" size="sm">
                                            ⭐ Beri Ulasan
                                        </Button>
                                    )}
                                    {order.status === 'delivered' && (
                                        <Button variant="outline" size="sm">
                                            🔄 Pesan Lagi
                                        </Button>
                                    )}
                                    {order.status === 'pending' && (
                                        <Button variant="outline" size="sm" className="text-red-600">
                                            ❌ Batalkan
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pagination */}
                {orders.last_page > 1 && (
                    <div className="flex justify-center mt-8">
                        <div className="flex gap-2">
                            {orders.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? "default" : "outline"}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => {
                                        if (link.url) {
                                            window.location.href = link.url;
                                        }
                                    }}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppShell>
    );
}