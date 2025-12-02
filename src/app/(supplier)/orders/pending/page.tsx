
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Download, Filter, Search, ArrowUpDown, FileText } from "lucide-react";

const orders = [
    { id: "#ORD-00124", buyer: "Global Imports Ltd.", total: "$1,250.75", status: "Awaiting Shipment" },
    { id: "#ORD-00123", buyer: "Cornerstone Retail", total: "$850.00", status: "Awaiting Shipment" },
    { id: "#ORD-00122", buyer: "The Merchant Co.", total: "$2,400.50", status: "Awaiting Shipment" },
    { id: "#ORD-00121", buyer: "Main Street Supplies", total: "$499.99", status: "Awaiting Shipment" },
]

export default function PendingOrdersPage() {
    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-4xl font-black tracking-tight">Pending Orders</h1>
                <p className="text-base text-muted-foreground mt-2">Manage and fulfill incoming orders.</p>
            </div>
            
            <Card>
                <CardHeader className="p-4 border-b">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="relative w-full max-w-xs">
                                <Search className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search orders..." className="pl-10" />
                            </div>
                            <Button variant="ghost" size="icon"><Filter className="h-5 w-5"/></Button>
                            <Button variant="ghost" size="icon"><ArrowUpDown className="h-5 w-5"/></Button>
                        </div>
                        <Button>
                            <Download className="mr-2 h-4 w-4" />
                            Export CSV
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Buyer Name</TableHead>
                                    <TableHead>Total Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Tracking Info</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map(order => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium text-muted-foreground">{order.id}</TableCell>
                                        <TableCell className="font-medium">{order.buyer}</TableCell>
                                        <TableCell>{order.total}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">{order.status}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Input placeholder="Tracking Number / Carrier" className="min-w-[200px]" />
                                                <Button size="sm" variant="secondary">Submit</Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="link" className="gap-2">
                                                <FileText className="h-4 w-4"/>
                                                Download Invoice/Label
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                <div className="flex items-center justify-center p-4 border-t">
                    <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon"><ChevronLeft className="h-5 w-5"/></Button>
                        <Button variant="outline" size="icon">1</Button>
                        <Button variant="ghost" size="icon">2</Button>
                        <Button variant="ghost" size="icon">3</Button>
                        <span className="px-2">...</span>
                        <Button variant="ghost" size="icon">10</Button>
                        <Button variant="ghost" size="icon"><ChevronRight className="h-5 w-5"/></Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
