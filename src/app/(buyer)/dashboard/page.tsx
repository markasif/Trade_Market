'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddShoppingCart, BarChart, Bell, Chat, ChevronRight, CreditCard, HelpCircle, Inventory2, LocalShipping, Print, Replay, Search } from "@mui/icons-material";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { AddShoppingCart as AddShoppingCartIcon, BarChart2, BellIcon, ChevronDown, CreditCardIcon, HelpCircleIcon, LogOut, MessageCircle, Package, Printer, Receipt, RotateCw, SearchIcon, Settings, SettingsIcon, ShoppingCart, Truck, Users } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

const stats = [
    { label: "Open Orders", value: "5" },
    { label: "Pending Payments", value: "2" },
    { label: "Unread Messages", value: "3" },
];

const orders = [
    { id: "#OD-7362", date: "2023-10-26", supplier: "Global Imports", total: "$1,450.00", status: "Shipped", statusVariant: "default", products: [
        { name: "Premium Running Shoes", qty: 10, price: "$899.90", image: PlaceHolderImages.find(i => i.id === 'product-running-shoes')},
        { name: "Noise-Cancelling Headphones", qty: 5, price: "$550.10", image: PlaceHolderImages.find(i => i.id === 'product-headphones')},
    ] },
    { id: "#OD-7361", date: "2023-10-25", supplier: "Craft Supplies Co.", total: "$820.50", status: "Delivered", statusVariant: "success" },
    { id: "#OD-7360", date: "2023-10-24", supplier: "Tech Solutions", total: "$3,200.00", status: "Processing", statusVariant: "warning" },
    { id: "#OD-7359", date: "2023-10-22", supplier: "Global Imports", total: "$980.00", status: "Cancelled", statusVariant: "destructive" },
];

const favoriteProducts = [
    { name: "Premium Running Shoes", price: "$89.99 / unit", image: PlaceHolderImages.find(i => i.id === 'product-running-shoes') },
    { name: "Classic Chronograph Watch", price: "$150.00 / unit", image: PlaceHolderImages.find(i => i.id === 'product-chrono-watch') },
    { name: "Noise-Cancelling Headphones", price: "$125.50 / unit", image: PlaceHolderImages.find(i => i.id === 'product-headphones') },
];

const notifications = [
    { icon: <Truck className="h-5 w-5 text-green-600 dark:text-green-300" />, text: "Your order #OD-7362 has been shipped.", time: "2 hours ago", color: "bg-green-100 dark:bg-green-900" },
    { icon: <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-300" />, text: "New message from 'Global Imports'.", time: "1 day ago", color: "bg-blue-100 dark:bg-blue-900" },
    { icon: <CreditCardIcon className="h-5 w-5 text-red-600 dark:text-red-300" />, text: "Payment for invoice #INV-1234 is due.", time: "3 days ago", color: "bg-red-100 dark:bg-red-900" },
    { icon: <Package className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />, text: "'Running Shoes' are back in stock.", time: "4 days ago", color: "bg-yellow-100 dark:bg-yellow-900" },
];


export default function BuyerDashboardPage() {
    const [expandedOrder, setExpandedOrder] = useState<string | null>("#OD-7362");

    const toggleOrder = (id: string) => {
        setExpandedOrder(expandedOrder === id ? null : id);
    }

    return (
        <div className="flex flex-col w-full max-w-7xl flex-1 gap-8 px-4 sm:px-6 md:px-10">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-col gap-1">
                    <p className="text-3xl font-bold tracking-tight">Welcome, Alex!</p>
                    <p className="text-muted-foreground">Here's a summary of your recent activity.</p>
                </div>
                <Button>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Start a New Order
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map(stat => (
                    <Card key={stat.label}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent Orders</CardTitle>
                            <Button variant="link" asChild><Link href="#">View All Orders</Link></Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Supplier</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map(order => (
                                        <>
                                            <TableRow key={order.id} onClick={() => toggleOrder(order.id)} className="cursor-pointer">
                                                <TableCell className="font-medium text-primary">{order.id}</TableCell>
                                                <TableCell>{order.date}</TableCell>
                                                <TableCell>{order.supplier}</TableCell>
                                                <TableCell>{order.total}</TableCell>
                                                <TableCell>
                                                    <Badge variant={order.status === "Shipped" ? "default" : order.status === "Delivered" ? "secondary" : order.status === "Processing" ? "outline" : "destructive"}>{order.status}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {order.products && <ChevronDown className={cn("transition-transform", expandedOrder === order.id && "rotate-180")} />}
                                                </TableCell>
                                            </TableRow>
                                            {expandedOrder === order.id && order.products && (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="p-0">
                                                        <div className="p-5 flex flex-col gap-6 bg-muted/50">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                                {order.products.map(p => (
                                                                    <div key={p.name} className="flex items-center gap-4">
                                                                        <div className="w-16 h-16 rounded-lg bg-background overflow-hidden flex-shrink-0">
                                                                            {p.image && <Image alt={p.name} className="w-full h-full object-cover" src={p.image.imageUrl} width={64} height={64} data-ai-hint={p.image.imageHint}/>}
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm font-semibold">{p.name}</p>
                                                                            <p className="text-xs text-muted-foreground">Qty: {p.qty}</p>
                                                                            <p className="text-xs text-muted-foreground">{p.price}</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
                                                                <div className="flex items-center gap-4 sm:gap-6">
                                                                    <Button variant="link" className="p-0 h-auto"><Printer className="mr-2 h-4 w-4"/>Print Invoice</Button>
                                                                    <Button variant="link" className="p-0 h-auto"><Truck className="mr-2 h-4 w-4"/>Track Order</Button>
                                                                </div>
                                                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                                                    <Button variant="ghost" asChild><Link href="#">View Details</Link></Button>
                                                                    <Button><RotateCw className="mr-2 h-4 w-4"/>Reorder</Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Favorite Products</CardTitle>
                            <Button variant="link" asChild><Link href="#">View All Favorites</Link></Button>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {favoriteProducts.map((product) => (
                                <div key={product.name} className="group relative flex flex-col gap-2">
                                    <div className="aspect-square w-full bg-muted rounded-lg overflow-hidden">
                                        {product.image && <Image className="object-cover w-full h-full" alt={product.name} src={product.image.imageUrl} width={200} height={200} data-ai-hint={product.image.imageHint} />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">{product.name}</p>
                                        <p className="text-xs text-muted-foreground">{product.price}</p>
                                    </div>
                                    <Button variant="outline" size="sm" className="mt-1"><AddShoppingCartIcon className="mr-2 h-4 w-4"/>Quick Add</Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
                <Card className="lg:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Notifications</CardTitle>
                        <Button variant="link" asChild><Link href="#">View All</Link></Button>
                    </CardHeader>
                    <CardContent>
                        <ul className="flex flex-col gap-4">
                            {notifications.map((notification, index) => (
                                <li key={index} className="flex items-start gap-4">
                                    <div className={cn("mt-1 flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center", notification.color)}>
                                        {notification.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{notification.text}</p>
                                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
