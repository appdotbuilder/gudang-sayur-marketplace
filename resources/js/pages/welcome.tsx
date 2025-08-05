import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    images: string[];
    rating: number;
    sold_count: number;
    stock: number;
    category: {
        name: string;
        slug: string;
    };
}

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    image: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Props {
    categories: Category[];
    featuredProducts: Product[];
    newProducts: Product[];
    saleProducts: Product[];
    searchResults: Product[];
    searchQuery?: string;
    auth?: {
        user?: User;
    };
    [key: string]: unknown;
}

export default function Welcome({ 
    categories, 
    featuredProducts, 
    newProducts, 
    saleProducts, 
    searchResults,
    searchQuery = '',
    auth 
}: Props) {
    const [search, setSearch] = useState(searchQuery);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/', { search }, { preserveState: true });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const ProductCard = ({ product }: { product: Product }) => (
        <Card className="group hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-0">
                <Link href={`/products/${product.slug}`}>
                    <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                        <img 
                            src={product.images[0] || '/images/placeholder.jpg'} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                    </div>
                    <div className="p-4">
                        <h3 className="font-medium text-sm mb-2 line-clamp-2">{product.name}</h3>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-orange-600 font-bold">
                                {formatPrice(product.price)}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                                {product.category.name}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>⭐ {product.rating}</span>
                            <span>{product.sold_count} terjual</span>
                            <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                                {product.stock > 0 ? `Stok ${product.stock}` : 'Habis'}
                            </span>
                        </div>
                    </div>
                </Link>
            </CardContent>
        </Card>
    );

    return (
        <AppShell user={auth?.user}>
            <Head title="Gudang Sayur - Pasar Sayur Online Terpercaya" />
            
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 text-white">
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            🥬 Gudang Sayur
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 opacity-90">
                            Pasar Sayur Online Terpercaya untuk Keluarga Indonesia
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="text-center">
                                <div className="text-3xl mb-2">🚚</div>
                                <h3 className="font-semibold mb-1">Pengiriman Cepat</h3>
                                <p className="text-sm opacity-80">Sayur segar sampai di rumah dalam 1-2 hari</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl mb-2">🌱</div>
                                <h3 className="font-semibold mb-1">100% Segar</h3>
                                <p className="text-sm opacity-80">Langsung dari petani untuk kualitas terbaik</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl mb-2">💰</div>
                                <h3 className="font-semibold mb-1">Harga Terjangkau</h3>
                                <p className="text-sm opacity-80">Harga langsung dari petani, tanpa markup</p>
                            </div>
                        </div>
                        
                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="Cari sayur segar... (contoh: bayam, kangkung, tomat)"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1 text-gray-900"
                                />
                                <Button type="submit" variant="secondary">
                                    🔍 Cari
                                </Button>
                            </div>
                        </form>

                        {!auth?.user && (
                            <div className="mt-8 flex gap-4 justify-center">
                                <Link href="/login">
                                    <Button variant="secondary" size="lg">
                                        Masuk
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-green-600">
                                        Daftar Sekarang
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Search Results */}
                {searchResults.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">
                            Hasil Pencarian "{searchQuery}" ({searchResults.length} produk)
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                            {searchResults.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        <div className="text-center mt-6">
                            <Link href="/products">
                                <Button variant="outline">
                                    Lihat Semua Produk
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}

                {/* Categories */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">🏪 Kategori Sayuran</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categories.map((category) => (
                            <Link key={category.id} href={`/products?category=${category.id}`}>
                                <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                                    <CardContent className="p-0">
                                        <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-100 rounded-t-lg flex items-center justify-center">
                                            <div className="text-4xl">
                                                {category.slug === 'sayur-daun' && '🥬'}
                                                {category.slug === 'sayur-buah' && '🍅'}
                                                {category.slug === 'umbi-umbian' && '🥕'}
                                                {category.slug === 'bumbu-dapur' && '🧄'}
                                            </div>
                                        </div>
                                        <div className="p-4 text-center">
                                            <h3 className="font-semibold">{category.name}</h3>
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                {category.description}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Featured Products */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">🔥 Produk Terlaris</h2>
                        <Link href="/products?sort=best_selling">
                            <Button variant="outline">Lihat Semua</Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>

                {/* New Products */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">✨ Produk Terbaru</h2>
                        <Link href="/products?sort=newest">
                            <Button variant="outline">Lihat Semua</Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {newProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>

                {/* Sale Products */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">⭐ Produk Berkualitas</h2>
                        <Link href="/products?sort=rating">
                            <Button variant="outline">Lihat Semua</Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {saleProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>

                {/* Promo Codes Info */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-8 mb-12">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">🎉 Promo Khusus untuk Anda!</h2>
                        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="text-orange-600 font-bold text-lg">WELCOME10</div>
                                <p className="text-sm text-gray-600">Diskon 10% untuk member baru</p>
                                <p className="text-xs text-gray-500 mt-1">Min. belanja Rp 50.000</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="text-orange-600 font-bold text-lg">SAYUR50K</div>
                                <p className="text-sm text-gray-600">Potongan Rp 5.000</p>
                                <p className="text-xs text-gray-500 mt-1">Min. belanja Rp 30.000</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="text-orange-600 font-bold text-lg">FRESH15</div>
                                <p className="text-sm text-gray-600">Diskon 15% untuk sayur segar</p>
                                <p className="text-xs text-gray-500 mt-1">Min. belanja Rp 75.000</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center bg-green-50 rounded-lg p-8">
                    <h2 className="text-2xl font-bold mb-4">Siap Berbelanja Sayur Segar? 🛒</h2>
                    <p className="text-gray-600 mb-6">
                        Bergabunglah dengan ribuan keluarga Indonesia yang sudah mempercayai Gudang Sayur
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/products">
                            <Button size="lg" className="bg-green-600 hover:bg-green-700">
                                Mulai Belanja Sekarang
                            </Button>
                        </Link>
                        {!auth?.user && (
                            <Link href="/register">
                                <Button variant="outline" size="lg">
                                    Daftar Gratis
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}