import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Truck } from "lucide-react";

export default function SupplierShippedPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Shipped Orders</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>View all your fulfilled and shipped orders.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-12 border-2 border-dashed rounded-lg">
                        <Truck className="h-16 w-16 mb-4"/>
                        <h3 className="text-xl font-semibold mb-2">Shipped Orders Page Coming Soon</h3>
                        <p>A history of your shipped orders will be displayed here.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
