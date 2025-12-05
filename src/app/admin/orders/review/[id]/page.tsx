import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";

const paymentProofImage = PlaceHolderImages.find(p => p.id === 'payment-proof');

const orderDetails = [
    { label: "Order ID", value: "ORD-2024-12345" },
    { label: "Buyer Name/Company", value: "Global Imports Inc." },
    { label: "Buyer Tax ID", value: "GSTIN123456789XYZ" },
    { label: "Order Date", value: "August 15, 2024" },
    { label: "Order Total", value: "$5,430.00" },
]

export default function AdminPaymentReviewPage({ params }: { params: { id: string } }) {
    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-4xl font-black leading-tight tracking-tight">Payment & Compliance Review</h1>
                <p className="text-muted-foreground mt-2">Review the payment proof uploaded by the buyer to confirm the order.</p>
            </header>
            
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl">Order Details</CardTitle>
                            <CardDescription>Order ID: {params.id}</CardDescription>
                        </div>
                        <Badge variant="outline" className="text-base bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">
                            Payment Review
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="grid gap-y-5">
                        {orderDetails.map(detail => (
                            <div key={detail.label} className="grid grid-cols-[160px_1fr] items-center pb-5 border-b">
                                <p className="text-sm text-muted-foreground">{detail.label}</p>
                                <p className="text-sm font-medium">{detail.value}</p>
                            </div>
                        ))}
                    </div>

                    <h3 className="text-lg font-bold tracking-tight pt-8 pb-4">Uploaded Proof of Payment</h3>
                    <div className="w-full aspect-[16/9] rounded-lg overflow-hidden border bg-muted">
                        {paymentProofImage && (
                            <Image 
                                src={paymentProofImage.imageUrl} 
                                alt={paymentProofImage.description}
                                width={800}
                                height={450}
                                className="w-full h-full object-contain"
                                data-ai-hint={paymentProofImage.imageHint}
                            />
                        )}
                    </div>
                </CardContent>
                <CardFooter className="justify-end gap-3 p-6">
                    <Button variant="destructive">Reject / Notify Buyer</Button>
                    <Button className="bg-green-600 hover:bg-green-700">Confirm Payment & Approve Order</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
