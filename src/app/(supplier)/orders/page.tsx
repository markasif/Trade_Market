import PendingOrdersPage from "./pending/page";
import ShippedOrdersPage from "./shipped/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SupplierOrdersPage() {
    return (
        <div className="flex flex-col max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                    <p className="text-muted-foreground">Manage and track all customer orders.</p>
                </div>
            </div>

            <Tabs defaultValue="pending">
                <TabsList>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="shipped">Shipped</TabsTrigger>
                </TabsList>
                <TabsContent value="pending" className="mt-6">
                    <PendingOrdersPage />
                </TabsContent>
                <TabsContent value="shipped" className="mt-6">
                    <ShippedOrdersPage />
                </TabsContent>
            </Tabs>
        </div>
    )
}
