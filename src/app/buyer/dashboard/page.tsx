import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import Link from "next/link";

const status = {
    verified: {
        icon: <CheckCircle className="h-16 w-16 text-green-500" />,
        title: "Your Account is Verified!",
        description: "You have full access to the marketplace. Start browsing products and placing orders.",
        button: <Button asChild size="lg"><Link href="/products">Browse Products</Link></Button>
    },
    pending: {
        icon: <Clock className="h-16 w-16 text-yellow-500" />,
        title: "Verification Pending",
        description: "Your account is currently under review. This usually takes 1-2 business days. We'll notify you once the review is complete.",
        button: <Button asChild size="lg" variant="secondary"><Link href="/contact-support">Contact Support</Link></Button>
    },
    rejected: {
        icon: <XCircle className="h-16 w-16 text-destructive" />,
        title: "Verification Failed",
        description: "We were unable to verify your account with the information provided. Please review your details and resubmit.",
        button: <Button asChild size="lg" variant="destructive"><Link href="/auth/buyer/register">Resubmit Application</Link></Button>
    }
}

export default function BuyerDashboardPage() {
    const currentStatus = status.pending;

    return (
        <div className="w-full max-w-4xl flex-1 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col mb-8">
                <h1 className="text-4xl font-black leading-tight tracking-tighter">Buyer Dashboard</h1>
                <p className="text-muted-foreground text-lg mt-2">Welcome, Jane!</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Account Status</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center gap-6 p-12 border-2 border-dashed rounded-lg">
                    {currentStatus.icon}
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold">{currentStatus.title}</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">{currentStatus.description}</p>
                    </div>
                    <div className="mt-4">
                        {currentStatus.button}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
