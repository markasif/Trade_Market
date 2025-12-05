import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import Link from "next/link";

const flaggedSuppliers = [
    { id: "sup-003", name: "Tech Solutions Inc.", date: "2023-10-25", reason: "Potential Duplicate" },
    { id: "sup-004", name: "Global Imports LLC", date: "2023-10-26", reason: "Document Unclear" },
    { id: "sup-005", name: "Crafty Goods Co.", date: "2023-10-25", reason: "Address Mismatch" },
]

export default function AdminSupplierReviewPage() {
    return (
        <div className="flex flex-col max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold tracking-tight">Flagged Suppliers</h1>
                    <p className="text-muted-foreground">Manual Review Required</p>
                </div>
            </div>

            <div className="mb-6">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Search suppliers..." className="pl-10 h-12 text-base" />
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Supplier Name</TableHead>
                                <TableHead>Date Submitted</TableHead>
                                <TableHead>AI Flag Reason</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {flaggedSuppliers.map(supplier => (
                                <TableRow key={supplier.name}>
                                    <TableCell className="font-medium">{supplier.name}</TableCell>
                                    <TableCell>{supplier.date}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">{supplier.reason}</Badge>
                                    </TableCell>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Button asChild>
                                            <Link href={`/admin/suppliers/review/${supplier.id}`}>
                                                Review Application
                                            </Link>
                                        </Button>
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
