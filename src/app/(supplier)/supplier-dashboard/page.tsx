import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SupplierDashboardPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Welcome, Supplier!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>This is your main dashboard. Select an option from the sidebar to manage your store.</p>
                </CardContent>
            </Card>
        </div>
    )
}
