import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Props {
    user?: User;
    cartCount?: number;
    wishlistCount?: number;
}

export function ECommerceHeader({ user, cartCount = 0, wishlistCount = 0 }: Props) {
    const [search, setSearch] = React.useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            router.get('/', { search });
        }
    };

    return (
        <header className="bg-white border-b sticky top-0 z-50">
            <div className="container mx-auto px-4">
                {/* Top Bar */}
                <div className="py-2 text-sm text-gray-600 border-b">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <span>📞 Bantuan: 0800-1234-5678</span>
                            <span>🚚 Gratis ongkir se-Indonesia</span>
                        </div>
                        <div className="flex items-center gap-4">
                            {!user ? (
                                <>
                                    <Link href="/login" className="hover:text-green-600">
                                        Masuk
                                    </Link>
                                    <Link href="/register" className="hover:text-green-600">
                                        Daftar
                                    </Link>
                                </>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span>Halo, {user.name}!</span>
                                    <Link href="/dashboard" className="hover:text-green-600">
                                        Dashboard
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Header */}
                <div className="py-4">
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="text-2xl">🥬</div>
                            <div>
                                <div className="text-xl font-bold text-green-600">Gudang Sayur</div>
                                <div className="text-xs text-gray-500">Pasar Sayur Online</div>
                            </div>
                        </Link>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
                            <div className="flex">
                                <Input
                                    type="text"
                                    placeholder="Cari sayur segar... (bayam, kangkung, tomat)"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="rounded-r-none"
                                />
                                <Button type="submit" className="rounded-l-none bg-green-600 hover:bg-green-700">
                                    🔍
                                </Button>
                            </div>
                        </form>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            {user && (
                                <>
                                    <Link href="/wishlist">
                                        <Button variant="ghost" className="relative">
                                            <span className="text-lg">💝</span>
                                            {wishlistCount > 0 && (
                                                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                                                    {wishlistCount}
                                                </Badge>
                                            )}
                                        </Button>
                                    </Link>
                                    <Link href="/cart">
                                        <Button variant="ghost" className="relative">
                                            <span className="text-lg">🛒</span>
                                            {cartCount > 0 && (
                                                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                                                    {cartCount}
                                                </Badge>
                                            )}
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="py-2 border-t">
                    <nav className="flex items-center gap-8">
                        <Link 
                            href="/" 
                            className="font-medium hover:text-green-600 transition-colors"
                        >
                            🏠 Beranda
                        </Link>
                        <Link 
                            href="/products" 
                            className="font-medium hover:text-green-600 transition-colors"
                        >
                            🛍️ Semua Produk
                        </Link>
                        <Link 
                            href="/products?category=1" 
                            className="hover:text-green-600 transition-colors"
                        >
                            🥬 Sayur Daun
                        </Link>
                        <Link 
                            href="/products?category=2" 
                            className="hover:text-green-600 transition-colors"
                        >
                            🍅 Sayur Buah
                        </Link>
                        <Link 
                            href="/products?category=3" 
                            className="hover:text-green-600 transition-colors"
                        >
                            🥕 Umbi-umbian
                        </Link>
                        <Link 
                            href="/products?category=4" 
                            className="hover:text-green-600 transition-colors"
                        >
                            🧄 Bumbu Dapur
                        </Link>
                        {user && (
                            <Link 
                                href="/orders" 
                                className="hover:text-green-600 transition-colors"
                            >
                                📦 Pesanan
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}