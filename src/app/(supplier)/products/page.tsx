import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Package } from "lucide-react";

export default function SupplierProductsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Products</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Product Management</CardTitle>
                    <CardDescription>Add, edit, and manage your product listings.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-12 border-2 border-dashed rounded-lg">
                        <Package className="h-16 w-16 mb-4"/>
                        <h3 className="text-xl font-semibold mb-2">Product Management Coming Soon</h3>
                        <p>This is where you will manage your products.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
