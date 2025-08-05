import { SidebarProvider } from '@/components/ui/sidebar';
import { ECommerceHeader } from '@/components/e-commerce-header';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
    user?: User;
    cartCount?: number;
    wishlistCount?: number;
}

export function AppShell({ children, variant = 'header', user, cartCount, wishlistCount }: AppShellProps) {
    const isOpen = usePage<SharedData>().props.sidebarOpen;

    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col">
                <ECommerceHeader user={user} cartCount={cartCount} wishlistCount={wishlistCount} />
                <main className="flex-1">
                    {children}
                </main>
                <footer className="bg-gray-50 border-t">
                    <div className="container mx-auto px-4 py-8">
                        <div className="grid md:grid-cols-4 gap-8">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-2xl">🥬</span>
                                    <div className="font-bold text-green-600">Gudang Sayur</div>
                                </div>
                                <p className="text-gray-600 text-sm">
                                    Pasar sayur online terpercaya untuk keluarga Indonesia.
                                    Sayur segar langsung dari petani.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-4">Kategori</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li><a href="/products?category=1" className="hover:text-green-600">Sayur Daun</a></li>
                                    <li><a href="/products?category=2" className="hover:text-green-600">Sayur Buah</a></li>
                                    <li><a href="/products?category=3" className="hover:text-green-600">Umbi-umbian</a></li>
                                    <li><a href="/products?category=4" className="hover:text-green-600">Bumbu Dapur</a></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-4">Layanan</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>🚚 Pengiriman Gratis</li>
                                    <li>📞 Customer Service 24/7</li>
                                    <li>💯 Garansi Kualitas</li>
                                    <li>🔄 Retur Mudah</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-4">Kontak</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>📞 0800-1234-5678</li>
                                    <li>📧 hello@gudangsayur.com</li>
                                    <li>📍 Jakarta, Indonesia</li>
                                    <li>⏰ 24 Jam Setiap Hari</li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
                            <p>&copy; 2024 Gudang Sayur. Semua hak dilindungi undang-undang.</p>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }

    return <SidebarProvider defaultOpen={isOpen}>{children}</SidebarProvider>;
}
