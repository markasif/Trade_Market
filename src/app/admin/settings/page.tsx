import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Application Settings</CardTitle>
                    <CardDescription>Manage platform-wide settings and configurations.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-12 border-2 border-dashed rounded-lg">
                        <Settings className="h-16 w-16 mb-4"/>
                        <h3 className="text-xl font-semibold mb-2">Settings Page Coming Soon</h3>
                        <p>Platform configuration options will be available here.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
