
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

const orders = [
    { id: "ORD-2024-12345", date: "2024-08-15", status: "Awaiting Payment", total: "$5,430.00" },
    { id: "ORD-2024-12344", date: "2024-08-14", status: "Shipped", total: "$1,250.00" },
    { id: "ORD-2024-12343", date: "2024-08-12", status: "Delivered", total: "$8,900.50" },
    { id: "ORD-2024-12342", date: "2024-08-15", status: "Processing", total: "$750.00" },
]

export default function BuyerOrdersPage() {
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
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono">{order.id}</TableCell>
                                    <TableCell>{order.date}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                order.status === "Delivered" ? "default" :
                                                order.status === "Awaiting Payment" ? "outline" : "secondary"
                                            }
                                            className={
                                                order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'Awaiting Payment' ? 'bg-yellow-100 text-yellow-800' : ''
                                            }
                                        >
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{order.total}</TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href="#">View Order</Link>
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
