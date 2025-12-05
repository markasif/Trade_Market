'use client';

import { Footer } from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, HelpCircle, Package, Receipt, ShoppingBag, LogOut } from "lucide-react";
import { Logo3 } from "@/components/icons";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useSupabase } from "@/components/supabase-provider";
import { useRouter } from "next/navigation";

const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar-2');

const navLinks = [
    { href: "/buyer-dashboard", label: "Dashboard", icon: <Package className="h-5 w-5" /> },
    { href: "/buyer/orders", label: "Orders", icon: <Receipt className="h-5 w-5" /> },
    { href: "/products", label: "Products", icon: <ShoppingBag className="h-5 w-5" /> },
];

function BuyerHeader() {
    const { supabase, session, isLoading } = useSupabase();
    const router = useRouter();

    const handleLogout = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        router.push('/');
    };

    if (isLoading) {
        return <header className="flex w-full items-center justify-center border-b bg-card h-16" />;
    }

    if (!session) {
        router.push('/auth/login');
        return null;
    }

    const user = session.user;

    return (
        <header className="flex w-full items-center justify-center border-b bg-card">
            <div className="flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-8 text-foreground">
                    <Link href="/buyer-dashboard" className="flex items-center gap-4">
                      <Logo3 className="h-6 w-6 text-primary" />
                      <h2 className="hidden sm:block text-lg font-bold tracking-tight">Marketplace</h2>
                    </Link>
                    <nav className="hidden items-center gap-6 md:flex">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground">
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon">
                        <Bell className="h-5 w-5" />
                        <span className="sr-only">Notifications</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                        <HelpCircle className="h-5 w-5" />
                        <span className="sr-only">Help</span>
                    </Button>
                    <Avatar className="h-10 w-10">
                        {userAvatar && <AvatarImage src={user.user_metadata.avatar_url || userAvatar.imageUrl} alt="User avatar" />}
                        <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                     <Button variant="ghost" size="icon" onClick={handleLogout}>
                        <LogOut className="h-5 w-5" />
                        <span className="sr-only">Log Out</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}


export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col">
        <BuyerHeader />
        <main className="flex flex-1 justify-center py-8 sm:py-12 md:py-16">
            {children}
        </main>
        <Footer />
    </div>
  );
}
