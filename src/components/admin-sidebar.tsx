"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { BarChart, Users, Settings, ShoppingCart, LayoutDashboard, Store } from 'lucide-react';

const adminAvatar = PlaceHolderImages.find(img => img.id === 'admin-avatar');

const navLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/admin/suppliers", label: "Suppliers", icon: <Users className="h-5 w-5" /> },
    { href: "/admin/orders", label: "Orders", icon: <ShoppingCart className="h-5 w-5" /> },
    { href: "/admin/reports", label: "Reports", icon: <BarChart className="h-5 w-5" /> },
    { href: "/admin/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
]

export function AdminSidebar() {
    const pathname = usePathname();
    return (
        <aside className="flex h-screen w-64 flex-col border-r bg-card p-4">
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-primary rounded-lg p-2 text-primary-foreground">
                    <Store className="h-6 w-6" />
                </div>
                <h1 className="text-xl font-bold">Marketplace</h1>
            </div>
            <div className="flex flex-col justify-between flex-1">
                <nav className="flex flex-col gap-2">
                    {navLinks.map(link => (
                        <Link key={link.href} href={link.href}>
                             <Button variant={pathname.startsWith(link.href) ? "secondary" : "ghost"} className="w-full justify-start gap-3">
                                {link.icon}
                                {link.label}
                            </Button>
                        </Link>
                    ))}
                </nav>
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        {adminAvatar && <AvatarImage src={adminAvatar.imageUrl} alt="Admin avatar" />}
                        <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <h1 className="text-sm font-medium">Admin Name</h1>
                        <p className="text-xs text-muted-foreground">Administrator</p>
                    </div>
                </div>
            </div>
        </aside>
    )
}
