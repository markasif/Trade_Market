
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileDown } from "lucide-react";
import Link from "next/link";

const orders = [
    { id: "ORD-2024-12345", buyer: "Global Imports Inc.", status: "Payment Review", total: "$5,430.00", date: "2024-08-15" },
    { id: "ORD-2024-12344", buyer: "Cornerstone Retail", status: "Shipped", total: "$1,250.00", date: "2024-08-14" },
    { id: "ORD-2024-12343", buyer: "The Merchant Co.", status: "Delivered", total: "$8,900.50", date: "2024-08-12" },
    { id: "ORD-2024-12342", buyer: "Main Street Supplies", status: "Processing", total: "$750.00", date: "2024-08-15" },
    { id: "ORD-2024-12341", buyer: "Innovatech Solutions", status: "Delivered", total: "$2,300.00", date: "2024-08-11" },
]

export default function AdminOrdersPage() {
    return (
        <div className="flex flex-col max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                    <p className="text-muted-foreground">Review and manage all marketplace orders.</p>
                </div>
            </div>

            <div className="mb-6 flex justify-between items-center">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Search by Order ID, Buyer..." className="pl-10 h-12 text-base" />
                </div>
                <Button>
                    <FileDown className="mr-2 h-4 w-4" />
                    Export All
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Buyer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map(order => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono text-xs">{order.id}</TableCell>
                                    <TableCell className="font-medium">{order.buyer}</TableCell>
                                    <TableCell>{order.date}</TableCell>
                                    <TableCell>{order.total}</TableCell>
                                    <TableCell>
                                         <Badge variant={order.status === 'Delivered' ? 'default' : order.status === 'Payment Review' ? 'outline' : 'secondary'}
                                            className={
                                                order.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-800' :
                                                order.status === 'Payment Review' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800' : ''
                                            }
                                        >
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <Link href={`/admin/orders/review/${order.id}`}>
                                            <Button variant={order.status === 'Payment Review' ? 'default' : 'outline'} size="sm">
                                                {order.status === 'Payment Review' ? 'Review Payment' : 'View Details'}
                                            </Button>
                                        </Link>
                                    </td>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
