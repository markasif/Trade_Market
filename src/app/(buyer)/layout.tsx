import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, HelpCircle, Package, Receipt, Users } from "lucide-react";
import { Logo3 } from "@/components/icons";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar-2');

const navLinks = [
    { href: "/buyer/dashboard", label: "Dashboard", icon: <Package className="h-5 w-5" /> },
    { href: "/buyer/orders", label: "Orders", icon: <Receipt className="h-5 w-5" /> },
    { href: "/buyer/products", label: "Products", icon: <Users className="h-5 w-5" /> },
];

function BuyerHeader() {
    return (
        <header className="flex w-full items-center justify-center border-b bg-card">
            <div className="flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 text-foreground">
                    <Logo3 className="h-6 w-6 text-primary" />
                    <h2 className="text-lg font-bold tracking-tight">Marketplace</h2>
                </div>
                <nav className="hidden items-center gap-8 md:flex">
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground">
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <div className="flex flex-1 justify-end items-center gap-3">
                    <Button variant="ghost" size="icon">
                        <Bell className="h-5 w-5" />
                        <span className="sr-only">Notifications</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                        <HelpCircle className="h-5 w-5" />
                        <span className="sr-only">Help</span>
                    </Button>
                    <Avatar className="h-10 w-10">
                        {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User avatar" />}
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
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
    </div>
  );
}
