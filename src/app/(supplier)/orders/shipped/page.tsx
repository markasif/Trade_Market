
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Truck } from "lucide-react";

const shippedOrders = [
    { id: "#ORD-00120", buyer: "Innovatech Solutions", total: "$5,300.00", status: "Delivered" },
    { id: "#ORD-00119", buyer: "Quantum Goods", total: "$950.00", status: "Shipped" },
    { id: "#ORD-00118", buyer: "Synergy Supplies", total: "$3,150.25", status: "Delivered" },
]

export default function ShippedOrdersPage() {
    return (
        <Card>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Buyer Name</TableHead>
                                <TableHead>Total Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {shippedOrders.map(order => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium text-muted-foreground">{order.id}</TableCell>
                                    <TableCell className="font-medium">{order.buyer}</TableCell>
                                    <TableCell>{order.total}</TableCell>
                                    <TableCell>
                                        <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}
                                            className={order.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-800' : ''}
                                        >
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="link" className="gap-2">
                                            <Truck className="h-4 w-4"/>
                                            View Tracking
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
