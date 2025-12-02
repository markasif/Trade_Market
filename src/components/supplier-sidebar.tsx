"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { BarChart, HelpCircle, LayoutDashboard, Megaphone, Package, Receipt, Settings } from "lucide-react";

const companyLogo = PlaceHolderImages.find(img => img.id === 'company-logo-1');

const mainNavLinks = [
    { href: "/supplier/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/supplier/products", label: "Products", icon: <Package className="h-5 w-5" /> },
    { href: "/supplier/orders", label: "Orders", icon: <Receipt className="h-5 w-5" /> },
    { href: "/supplier/marketing-tools", label: "Marketing", icon: <Megaphone className="h-5 w-5" /> },
    { href: "/supplier/analytics", label: "Analytics", icon: <BarChart className="h-5 w-5" /> },
]

const bottomNavLinks = [
    { href: "/supplier/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
    { href: "/supplier/help", label: "Help", icon: <HelpCircle className="h-5 w-5" /> },
]

export function SupplierSidebar() {
    const pathname = usePathname();
    return (
        <aside className="flex h-screen w-64 flex-col border-r bg-card p-4">
            <div className="flex h-full flex-col justify-between">
                <div className="flex flex-col gap-4">
                    <div className="flex gap-3 items-center px-3 py-2">
                        <Avatar className="h-10 w-10">
                            {companyLogo && <AvatarImage src={companyLogo.imageUrl} alt="Company logo" />}
                            <AvatarFallback>SI</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <h1 className="text-base font-medium">Supplier Inc.</h1>
                            <p className="text-sm text-muted-foreground">supplier.inc@email.com</p>
                        </div>
                    </div>
                    <nav className="flex flex-col gap-2 mt-4">
                        {mainNavLinks.map(link => (
                            <Link key={link.href} href={link.href}>
                                <Button
                                    variant={pathname.startsWith(link.href) ? "secondary" : "ghost"}
                                    className="w-full justify-start gap-3"
                                >
                                    {link.icon}
                                    {link.label}
                                </Button>
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="flex flex-col gap-1">
                    {bottomNavLinks.map(link => (
                        <Link key={link.href} href={link.href}>
                            <Button
                                variant={pathname.startsWith(link.href) ? "secondary" : "ghost"}
                                className="w-full justify-start gap-3"
                            >
                                {link.icon}
                                {link.label}
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    )
}
