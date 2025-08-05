import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface WishlistItem {
    id: number;
    product: {
        id: number;
        name: string;
        slug: string;
        price: number;
        stock: number;
        images: string[];
        rating: number;
        sold_count: number;
        category: {
            name: string;
        };
    };
    created_at: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Props {
    wishlistItems: WishlistItem[];
    auth: {
        user: User;
    };
    [key: string]: unknown;
}

export default function WishlistIndex({ wishlistItems, auth }: Props) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const removeFromWishlist = (wishlistId: number) => {
        router.delete(`/wishlist/${wishlistId}`, {
            preserveScroll: true
        });
    };

    const addToCart = (productId: number) => {
        router.post('/cart', {
            product_id: productId,
            quantity: 1
        }, {
            preserveScroll: true
        });
    };

    if (wishlistItems.length === 0) {
        return (
            <AppShell user={auth.user}>
                <Head title="Wishlist - Gudang Sayur" />
                
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-16">
                        <div className="text-8xl mb-6">💝</div>
                        <h1 className="text-3xl font-bold mb-4">Wishlist Kosong</h1>
                        <p className="text-gray-600 mb-8">
                            Belum ada produk favorit Anda. Yuk simpan produk yang menarik!
                        </p>
                        <Link href="/products">
                            <Button size="lg" className="bg-green-600 hover:bg-green-700">
                                🛍️ Jelajahi Produk
                            </Button>
                        </Link>
                    </div>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell user={auth.user}>
            <Head title="Wishlist - Gudang Sayur" />
            
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">💝 Wishlist Saya</h1>
                    <p className="text-gray-600">
                        {wishlistItems.length} produk favorit Anda
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {wishlistItems.map((item) => (
                        <Card key={item.id} className="group hover:shadow-lg transition-shadow duration-200">
                            <CardContent className="p-0">
                                <div className="relative">
                                    <Link href={`/products/${item.product.slug}`}>
                                        <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                                            <img 
                                                src={item.product.images[0] || '/images/placeholder.jpg'} 
                                                alt={item.product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                            />
                                        </div>
                                    </Link>
                                    
                                    {/* Remove from wishlist button */}
                                    <button
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors"
                                    >
                                        <span className="text-red-500">❤️</span>
                                    </button>
                                </div>
                                
                                <div className="p-4">
                                    <Link href={`/products/${item.product.slug}`}>
                                        <h3 className="font-medium text-sm mb-2 line-clamp-2 hover:text-green-600">
                                            {item.product.name}
                                        </h3>
                                    </Link>
                                    
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-orange-600 font-bold text-sm">
                                            {formatPrice(item.product.price)}
                                        </span>
                                        <Badge variant="secondary" className="text-xs">
                                            {item.product.category.name}
                                        </Badge>
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                                        <span>⭐ {item.product.rating}</span>
                                        <span>{item.product.sold_count} terjual</span>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            item.product.stock > 0 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                            {item.product.stock > 0 ? `Stok ${item.product.stock}` : 'Habis'}
                                        </span>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        {item.product.stock > 0 ? (
                                            <Button 
                                                size="sm" 
                                                className="flex-1 bg-green-600 hover:bg-green-700"
                                                onClick={() => addToCart(item.product.id)}
                                            >
                                                🛒
                                            </Button>
                                        ) : (
                                            <Button size="sm" disabled className="flex-1">
                                                Habis
                                            </Button>
                                        )}
                                        
                                        <Button 
                                            size="sm" 
                                            variant="outline"
                                            onClick={() => removeFromWishlist(item.id)}
                                        >
                                            🗑️
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-12 text-center">
                    <div className="bg-green-50 rounded-lg p-8 max-w-2xl mx-auto">
                        <h2 className="text-xl font-bold mb-4">🎯 Tips Belanja Cerdas</h2>
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                            <div>
                                <span className="font-medium">💡 Pantau Stok:</span> 
                                <p>Produk favorit bisa habis kapan saja</p>
                            </div>
                            <div>
                                <span className="font-medium">🔔 Set Reminder:</span> 
                                <p>Aktifkan notifikasi untuk promo spesial</p>
                            </div>
                            <div>
                                <span className="font-medium">🛒 Keranjang Cepat:</span> 
                                <p>Tambah langsung ke keranjang dari wishlist</p>
                            </div>
                            <div>
                                <span className="font-medium">📱 Share Wishlist:</span> 
                                <p>Bagikan ke keluarga dan teman</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Actions */}
                <div className="mt-8 flex justify-center gap-4">
                    <Link href="/products">
                        <Button variant="outline">
                            🔍 Cari Produk Lain
                        </Button>
                    </Link>
                    <Link href="/cart">
                        <Button className="bg-green-600 hover:bg-green-700">
                            🛒 Lihat Keranjang
                        </Button>
                    </Link>
                </div>
            </div>
        </AppShell>
    );
}