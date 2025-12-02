import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { BarChart } from "lucide-react";

export default function AdminReportsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Reports</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Analytics & Reports</CardTitle>
                    <CardDescription>View detailed reports on sales, suppliers, and buyers.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-12 border-2 border-dashed rounded-lg">
                        <BarChart className="h-16 w-16 mb-4"/>
                        <h3 className="text-xl font-semibold mb-2">Reporting Dashboard Coming Soon</h3>
                        <p>Detailed analytics and downloadable reports will be available here.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
