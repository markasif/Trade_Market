import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const businessLicenseImage = PlaceHolderImages.find(p => p.id === 'payment-proof'); // Placeholder
const gstCertificateImage = PlaceHolderImages.find(p => p.id === 'payment-proof'); // Placeholder

const supplierDetails = [
    { label: "Company Name", value: "Tech Solutions Inc." },
    { label: "Contact Email", value: "contact@techsolutions.com" },
    { label: "Phone Number", value: "+1 456 789 1230" },
    { label: "Business Address", value: "789 Tech Park, Silicon Valley, CA 94001" },
    { label: "GST Number", value: "22AAAAA0000A1Z5" },
]

export default function AdminSupplierReviewDetailPage({ params }: { params: { id: string } }) {
    return (
        <div className="max-w-6xl mx-auto">
            <header className="mb-8">
                <h1 className="text-4xl font-black leading-tight tracking-tight">Supplier Application Review</h1>
                <p className="text-muted-foreground mt-2">Review the details and documents for supplier ID: {params.id}</p>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Supplier Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {supplierDetails.map(detail => (
                                <div key={detail.label} className="grid grid-cols-[180px_1fr] items-start pb-4 border-b">
                                    <p className="text-sm text-muted-foreground">{detail.label}</p>
                                    <p className="text-sm font-medium">{detail.value}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    <Card>
                         <CardHeader>
                            <CardTitle>Uploaded Documents</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-medium mb-2">Business License</h3>
                                <div className="w-full aspect-video rounded-lg overflow-hidden border bg-muted">
                                    {businessLicenseImage && (
                                        <Image 
                                            src={businessLicenseImage.imageUrl} 
                                            alt="Business License"
                                            width={500}
                                            height={300}
                                            className="w-full h-full object-contain"
                                        />
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">GST Certificate</h3>
                                <div className="w-full aspect-video rounded-lg overflow-hidden border bg-muted">
                                    {gstCertificateImage && (
                                        <Image 
                                            src={gstCertificateImage.imageUrl} 
                                            alt="GST Certificate"
                                            width={500}
                                            height={300}
                                            className="w-full h-full object-contain"
                                        />
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Alert variant="destructive">
                        <AlertTitle className="font-bold flex items-center gap-2">
                           <Badge variant="destructive">AI Flag</Badge> Potential Duplicate
                        </AlertTitle>
                        <AlertDescription className="mt-2">
                            The AI system detected that the GST number might already be associated with another account. Please verify manually.
                        </AlertDescription>
                    </Alert>

                     <Card>
                        <CardHeader>
                            <CardTitle>Decision</CardTitle>
                            <CardDescription>Approve or reject this application.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea placeholder="Enter rejection reason (required if rejecting)..."/>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3">
                            <Button className="w-full bg-green-600 hover:bg-green-700">Approve Supplier</Button>
                            <Button variant="destructive" className="w-full">Reject Supplier</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
