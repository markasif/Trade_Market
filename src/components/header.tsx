
"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingCart, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/icons";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/supplier/register", label: "Suppliers" },
  { href: "/buyer/orders", label: "My Orders" },
  { href: "/about-us", label: "About Us" },
];

const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar-1");

export function Header() {
    const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-border/80 px-4 sm:px-10 py-3 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-3 text-foreground">
          <Logo className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Marketplace</h2>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn("text-sm font-medium text-muted-foreground hover:text-primary", {
                "text-primary": pathname === link.href,
              })}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex flex-1 justify-end items-center gap-4">
        <div className="relative hidden lg:flex items-center min-w-40 max-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-9 bg-gray-100 dark:bg-gray-800 border-none rounded-lg h-10 focus-visible:ring-ring focus-visible:ring-1"
          />
        </div>
        <div className="flex gap-2 items-center">
          <Button>Login</Button>
          <Button variant="ghost" size="icon" className="bg-gray-100 dark:bg-gray-800 text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-700">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Wishlist</span>
          </Button>
          <Button variant="ghost" size="icon" className="bg-gray-100 dark:bg-gray-800 text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-700">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Button>
          <Button variant="ghost" size="icon" className="bg-gray-100 dark:bg-gray-800 text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-700">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
        <Avatar className="hidden h-10 w-10">
            {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User avatar" />}
            <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
