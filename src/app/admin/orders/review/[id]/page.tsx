import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const paymentProofImage = PlaceHolderImages.find(p => p.id === 'payment-proof');

const orderDetails = [
    { label: "Order ID", value: "ORD-2024-12345" },
    { label: "Buyer Name/Company", value: "Global Imports Inc." },
    { label: "Buyer Tax ID", value: "GSTIN123456789XYZ" },
]

export default function AdminPaymentReviewPage({ params }: { params: { id: string } }) {
    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-4xl font-black leading-tight tracking-tight">Payment & Compliance Review</h1>
            </header>
            
            <Card>
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
                <CardFooter className="justify-end gap-3">
                    <Button variant="destructive">Reject / Notify Buyer</Button>
                    <Button className="bg-green-600 hover:bg-green-700">Confirm Payment & Approve Order</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
