
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";

const products = [
    { 
        id: "prod-1", 
        image: PlaceHolderImages.find(p => p.id === 'product-widget-main'),
        name: "Premium Industrial Widget", 
        status: "Active", 
        stock: 1500, 
        price: "$20.00 - $25.00" 
    },
    { 
        id: "prod-2", 
        image: PlaceHolderImages.find(p => p.id === 'product-running-shoes'),
        name: "Sleek Running Shoes", 
        status: "Archived", 
        stock: 0, 
        price: "$89.99" 
    },
    { 
        id: "prod-3", 
        image: PlaceHolderImages.find(p => p.id === 'product-headphones'),
        name: "Wireless Headphones", 
        status: "Active", 
        stock: 350, 
        price: "$129.99" 
    },
     { 
        id: "prod-4", 
        image: PlaceHolderImages.find(p => p.id === 'product-chrono-watch'),
        name: "Chronograph Watch", 
        status: "Draft", 
        stock: 50, 
        price: "$249.99" 
    },
];

export default function SupplierProductsPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Products</h1>
                <Button asChild>
                    <Link href="/supplier/products/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Product
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Product Management</CardTitle>
                    <CardDescription>Add, edit, and manage your product listings.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="hidden w-[100px] sm:table-cell">
                                    <span className="sr-only">Image</span>
                                </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="hidden md:table-cell">Stock</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="hidden sm:table-cell">
                                        {product.image && (
                                            <Image
                                                alt={product.name}
                                                className="aspect-square rounded-md object-cover"
                                                height="64"
                                                src={product.image.imageUrl}
                                                width="64"
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={product.status === 'Active' ? 'default' : 'outline'}
                                            className={
                                                product.status === 'Active' ? 'bg-green-100 text-green-800' : ''
                                            }
                                        >{product.status}</Badge>
                                    </TableCell>
                                    <TableCell>{product.price}</TableCell>
                                    <TableCell className="hidden md:table-cell">{product.stock}</TableCell>
                                    <TableCell>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                 <CardFooter>
                    <div className="text-xs text-muted-foreground">
                        Showing <strong>1-4</strong> of <strong>{products.length}</strong> products
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
