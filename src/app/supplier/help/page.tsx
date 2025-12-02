import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export default function SupplierHelpPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Help & Support</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Help Center</CardTitle>
                    <CardDescription>Find answers to your questions and get support.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-12 border-2 border-dashed rounded-lg">
                        <HelpCircle className="h-16 w-16 mb-4"/>
                        <h3 className="text-xl font-semibold mb-2">Help Center Coming Soon</h3>
                        <p>FAQs, guides, and support contact information will be available here.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
