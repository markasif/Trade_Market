import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import Link from "next/link";

const suppliers = [
    { id: "SUP-001", name: "Global Imports LLC", status: "Approved", date: "2023-10-20" },
    { id: "SUP-002", name: "Crafty Goods Co.", status: "Approved", date: "2023-10-18" },
    { id: "SUP-003", name: "Tech Solutions Inc.", status: "Pending", date: "2023-10-22" },
    { id: "SUP-004", name: "Farm Fresh Organics", status: "Rejected", date: "2023-10-15" },
    { id: "SUP-005", name: "Gadget Innovators", status: "Approved", date: "2023-10-19" },
]

export default function AdminSuppliersPage() {
    return (
        <div className="flex flex-col max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
                    <p className="text-muted-foreground">Manage all suppliers on the platform.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/admin/suppliers/review">
                        <Button variant="secondary">Review Flagged Suppliers</Button>
                    </Link>
                    <Button>Add New Supplier</Button>
                </div>
            </div>

            <div className="mb-6">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Search by name or ID..." className="pl-10 h-12 text-base" />
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Supplier ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {suppliers.map(supplier => (
                                <TableRow key={supplier.id}>
                                    <TableCell className="font-mono text-xs">{supplier.id}</TableCell>
                                    <TableCell className="font-medium">{supplier.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={supplier.status === 'Approved' ? 'default' : supplier.status === 'Pending' ? 'outline' : 'destructive'}
                                            className={
                                                supplier.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-800' :
                                                supplier.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800' :
                                                'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-800'
                                            }
                                        >
                                            {supplier.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{supplier.date}</TableCell>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <Button variant="outline" size="sm">View</Button>
                                        <Button variant="destructive" size="sm">Remove</Button>
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
