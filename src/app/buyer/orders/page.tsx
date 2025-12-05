'use client'

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import Link from "next/link";
import { Order, WithId } from "@/lib/types";

export default function BuyerOrdersPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const ordersQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(collection(firestore, 'orders'), where('buyerId', '==', user.uid));
    }, [firestore, user]);

    const { data: orders, isLoading } = useCollection<Order>(ordersQuery);

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case 'shipped':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
            case 'processing':
                return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300';
            case 'awaiting-payment':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    }

    const getStatusVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'default';
            case 'awaiting-payment':
                return 'outline';
            default:
                return 'secondary';
        }
    }


    return (
        <div className="w-full max-w-4xl flex-1 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col mb-8">
                <h1 className="text-4xl font-black leading-tight tracking-tighter">My Orders</h1>
                <p className="text-muted-foreground text-lg mt-2">Track your past and current orders.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">Loading orders...</TableCell>
                                </TableRow>
                            )}
                            {!isLoading && orders && orders.length === 0 && (
                                 <TableRow>
                                    <TableCell colSpan={5} className="text-center">You have no orders yet.</TableCell>
                                </TableRow>
                            )}
                            {orders && orders.map((order: WithId<Order>) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono text-xs">{order.id}</TableCell>
                                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={getStatusVariant(order.status)}
                                            className={getStatusBadge(order.status)}
                                        >
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/buyer/orders/${order.id}`}>View Order</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
