import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    products: {
        data: Product[];
        links: Link[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    categories: Category[];
    filters: {
        search?: string;
        category?: string;
        min_price?: string;
        max_price?: string;
        in_stock?: string;
        sort?: string;
    };
    auth?: {
        user?: User;
    };
    [key: string]: unknown;
}

export default function ProductIndex({ products, categories, filters, auth }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');
    const [inStock, setInStock] = useState(filters.in_stock || '');
    const [sort, setSort] = useState(filters.sort || '');

    const handleFilter = () => {
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (category) params.category = category;
        if (minPrice) params.min_price = minPrice;
        if (maxPrice) params.max_price = maxPrice;
        if (inStock) params.in_stock = inStock;
        if (sort) params.sort = sort;

        router.get('/products', params, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch('');
        setCategory('');
        setMinPrice('');
        setMaxPrice('');
        setInStock('');
        setSort('');
        router.get('/products');
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <AppShell user={auth?.user}>
            <Head title="Produk Sayuran - Gudang Sayur" />
            
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">🥬 Semua Produk Sayuran</h1>
                    <p className="text-gray-600">
                        Temukan {products.total} produk sayuran segar berkualitas terbaik
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg border p-6 mb-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Cari Produk</label>
                            <Input
                                placeholder="Nama produk..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Kategori</label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Semua kategori</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Harga Min</label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Harga Max</label>
                            <Input
                                type="number"
                                placeholder="999999"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Stok</label>
                            <Select value={inStock} onValueChange={setInStock}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Semua</SelectItem>
                                    <SelectItem value="1">Tersedia</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Urutkan</label>
                            <Select value={sort} onValueChange={setSort}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Default" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Default</SelectItem>
                                    <SelectItem value="price_asc">Termurah</SelectItem>
                                    <SelectItem value="price_desc">Termahal</SelectItem>
                                    <SelectItem value="newest">Terbaru</SelectItem>
                                    <SelectItem value="best_selling">Terlaris</SelectItem>
                                    <SelectItem value="rating">Rating Tertinggi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleFilter}>
                            🔍 Terapkan Filter
                        </Button>
                        <Button variant="outline" onClick={clearFilters}>
                            🗑️ Bersihkan Filter
                        </Button>
                    </div>
                </div>

                {/* Active Filters */}
                {(search || category || minPrice || maxPrice || inStock || sort) && (
                    <div className="mb-6">
                        <h3 className="text-sm font-medium mb-2">Filter Aktif:</h3>
                        <div className="flex flex-wrap gap-2">
                            {search && (
                                <Badge variant="secondary">
                                    Pencarian: {search}
                                </Badge>
                            )}
                            {category && (
                                <Badge variant="secondary">
                                    Kategori: {categories.find(c => c.id.toString() === category)?.name}
                                </Badge>
                            )}
                            {minPrice && (
                                <Badge variant="secondary">
                                    Min: {formatPrice(parseInt(minPrice))}
                                </Badge>
                            )}
                            {maxPrice && (
                                <Badge variant="secondary">
                                    Max: {formatPrice(parseInt(maxPrice))}
                                </Badge>
                            )}
                            {inStock && (
                                <Badge variant="secondary">
                                    Stok tersedia
                                </Badge>
                            )}
                            {sort && (
                                <Badge variant="secondary">
                                    {sort === 'price_asc' && 'Termurah'}
                                    {sort === 'price_desc' && 'Termahal'}
                                    {sort === 'newest' && 'Terbaru'}
                                    {sort === 'best_selling' && 'Terlaris'}
                                    {sort === 'rating' && 'Rating Tertinggi'}
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                {products.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
                            {products.data.map((product) => (
                                <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200">
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
                                                    <span className="text-orange-600 font-bold text-sm">
                                                        {formatPrice(product.price)}
                                                    </span>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {product.category.name}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-gray-600">
                                                    <span>⭐ {product.rating}</span>
                                                    <span>{product.sold_count} terjual</span>
                                                </div>
                                                <div className="mt-2">
                                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                                        product.stock > 0 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {product.stock > 0 ? `Stok ${product.stock}` : 'Habis'}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {products.last_page > 1 && (
                            <div className="flex justify-center">
                                <div className="flex gap-2">
                                    {products.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? "default" : "outline"}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => {
                                            if (link.url) {
                                                router.get(link.url);
                                            }
                                        }}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold mb-2">Produk Tidak Ditemukan</h3>
                        <p className="text-gray-600 mb-6">
                            Maaf, tidak ada produk yang sesuai dengan filter yang Anda pilih.
                        </p>
                        <Button onClick={clearFilters}>
                            Lihat Semua Produk
                        </Button>
                    </div>
                )}
            </div>
        </AppShell>
    );
}