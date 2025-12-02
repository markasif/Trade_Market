import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { BarChart } from "lucide-react";

export default function SupplierAnalyticsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Analytics</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Store Analytics</CardTitle>
                    <CardDescription>Insights into your sales, products, and customer behavior.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-12 border-2 border-dashed rounded-lg">
                        <BarChart className="h-16 w-16 mb-4"/>
                        <h3 className="text-xl font-semibold mb-2">Analytics Dashboard Coming Soon</h3>
                        <p>Detailed store analytics will be available here.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
