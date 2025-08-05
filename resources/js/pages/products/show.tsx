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
    description: string;
    price: number;
    stock: number;
    images: string[];
    rating: number;
    total_reviews: number;
    sold_count: number;
    category: {
        id: number;
        name: string;
        slug: string;
    };
    reviews: Review[];
}

interface Review {
    id: number;
    rating: number;
    comment: string;
    created_at: string;
    user: {
        name: string;
    };
}

interface RelatedProduct {
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
    };
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Props {
    product: Product;
    relatedProducts: RelatedProduct[];
    auth?: {
        user?: User;
    };
    [key: string]: unknown;
}

export default function ProductShow({ product, relatedProducts, auth }: Props) {
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

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
            day: 'numeric'
        });
    };

    const handleAddToCart = () => {
        if (!auth?.user) {
            router.visit('/login');
            return;
        }

        router.post('/cart', {
            product_id: product.id,
            quantity: quantity
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Reset quantity after successful add
                setQuantity(1);
            }
        });
    };

    const handleAddToWishlist = () => {
        if (!auth?.user) {
            router.visit('/login');
            return;
        }

        router.post('/wishlist', {
            product_id: product.id
        }, {
            preserveScroll: true
        });
    };

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={i} className="text-yellow-400">⭐</span>);
        }
        
        if (hasHalfStar) {
            stars.push(<span key="half" className="text-yellow-400">⭐</span>);
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<span key={`empty-${i}`} className="text-gray-300">⭐</span>);
        }

        return stars;
    };

    return (
        <AppShell user={auth?.user}>
            <Head title={`${product.name} - Gudang Sayur`} />
            
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <nav className="text-sm">
                        <Link href="/" className="text-green-600 hover:underline">Beranda</Link>
                        <span className="mx-2">/</span>
                        <Link href="/products" className="text-green-600 hover:underline">Produk</Link>
                        <span className="mx-2">/</span>
                        <Link href={`/products?category=${product.category.id}`} className="text-green-600 hover:underline">
                            {product.category.name}
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-600">{product.name}</span>
                    </nav>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                    {/* Product Images */}
                    <div>
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                            <img 
                                src={product.images[selectedImage] || '/images/placeholder.jpg'} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        
                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                                            selectedImage === index ? 'border-green-500' : 'border-transparent'
                                        }`}
                                    >
                                        <img 
                                            src={image} 
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="mb-4">
                            <Badge variant="secondary" className="mb-2">
                                {product.category.name}
                            </Badge>
                            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                            
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center">
                                    {renderStars(product.rating)}
                                    <span className="ml-2 text-gray-600">
                                        {product.rating} ({product.total_reviews} ulasan)
                                    </span>
                                </div>
                                <div className="text-gray-600">
                                    {product.sold_count} terjual
                                </div>
                            </div>

                            <div className="text-3xl font-bold text-orange-600 mb-4">
                                {formatPrice(product.price)}
                            </div>

                            <div className="mb-6">
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                    product.stock > 0 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    {product.stock > 0 ? `Stok tersedia: ${product.stock}` : 'Stok habis'}
                                </span>
                            </div>
                        </div>

                        {/* Quantity and Actions */}
                        {product.stock > 0 && (
                            <div className="border-t pt-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <label className="font-medium">Kuantitas:</label>
                                    <div className="flex items-center border rounded-lg">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={quantity <= 1}
                                        >
                                            -
                                        </Button>
                                        <Input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                                            className="w-20 text-center border-0 focus-visible:ring-0"
                                            min="1"
                                            max={product.stock}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            disabled={quantity >= product.stock}
                                        >
                                            +
                                        </Button>
                                    </div>
                                    <span className="text-gray-600">
                                        Total: {formatPrice(product.price * quantity)}
                                    </span>
                                </div>

                                <div className="flex gap-4">
                                    <Button 
                                        onClick={handleAddToCart}
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                        size="lg"
                                    >
                                        🛒 Tambah ke Keranjang
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        onClick={handleAddToWishlist}
                                        size="lg"
                                    >
                                        ❤️ Wishlist
                                    </Button>
                                </div>
                            </div>
                        )}

                        {product.stock === 0 && (
                            <div className="border-t pt-6">
                                <Button disabled size="lg" className="w-full">
                                    Stok Habis
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Description */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">📋 Deskripsi Produk</h2>
                    <div className="bg-gray-50 rounded-lg p-6">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {product.description}
                        </p>
                    </div>
                </div>

                {/* Reviews */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">⭐ Ulasan Pelanggan ({product.total_reviews})</h2>
                    
                    {product.reviews.length > 0 ? (
                        <div className="space-y-4">
                            {product.reviews.map((review) => (
                                <Card key={review.id}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <div className="font-semibold">{review.user.name}</div>
                                                <div className="flex items-center">
                                                    {renderStars(review.rating)}
                                                    <span className="ml-2 text-gray-600 text-sm">
                                                        {formatDate(review.created_at)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {review.comment && (
                                            <p className="text-gray-700 mt-2">{review.comment}</p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            Belum ada ulasan untuk produk ini.
                        </div>
                    )}
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">🔗 Produk Terkait</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {relatedProducts.map((relatedProduct) => (
                                <Card key={relatedProduct.id} className="group hover:shadow-lg transition-shadow duration-200">
                                    <CardContent className="p-0">
                                        <Link href={`/products/${relatedProduct.slug}`}>
                                            <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                                                <img 
                                                    src={relatedProduct.images[0] || '/images/placeholder.jpg'} 
                                                    alt={relatedProduct.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-medium text-sm mb-2 line-clamp-2">{relatedProduct.name}</h3>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-orange-600 font-bold text-sm">
                                                        {formatPrice(relatedProduct.price)}
                                                    </span>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {relatedProduct.category.name}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-gray-600">
                                                    <span>⭐ {relatedProduct.rating}</span>
                                                    <span>{relatedProduct.sold_count} terjual</span>
                                                </div>
                                                <div className="mt-2">
                                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                                        relatedProduct.stock > 0 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {relatedProduct.stock > 0 ? `Stok ${relatedProduct.stock}` : 'Habis'}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppShell>
    );
}