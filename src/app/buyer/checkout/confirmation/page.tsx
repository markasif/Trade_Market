import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter as TableFoot, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload } from "lucide-react";
import Link from "next/link";

const orderItems = [
    { name: "Premium Grade Industrial Widgets", quantity: 100, price: 15.00, total: 1500.00 },
    { name: "Heavy-Duty Alloy Flanges", quantity: 50, price: 25.50, total: 1275.00 },
];

const subtotal = orderItems.reduce((acc, item) => acc + item.total, 0);
const taxes = subtotal * 0.05;
const shipping = 50.00;
const grandTotal = subtotal + taxes + shipping;

export default function CheckoutConfirmationPage() {
    return (
        <div className="flex flex-col w-full max-w-4xl flex-1 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col mb-6">
                <div className="flex flex-wrap justify-between gap-3">
                    <div className="flex min-w-72 flex-col gap-2">
                        <h1 className="text-4xl font-black leading-tight tracking-tighter">Order Placed Successfully!</h1>
                        <p className="text-muted-foreground">Your order has been placed. Please complete the payment to finalize your order.</p>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground pt-5">
                    Order ID: #123-4567890 | Date: 15 August 2024 | Status: <span className="font-medium text-primary/80">Awaiting Payment</span>
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product Name</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead className="text-right">Unit Price</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orderItems.map(item => (
                                <TableRow key={item.name}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFoot>
                            <TableRow>
                                <TableCell colSpan={3} className="text-right">Subtotal</TableCell>
                                <TableCell className="text-right">${subtotal.toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={3} className="text-right">Taxes</TableCell>
                                <TableCell className="text-right">${taxes.toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={3} className="text-right">Shipping</TableCell>
                                <TableCell className="text-right">${shipping.toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={3} className="text-right font-bold text-lg">Grand Total</TableCell>
                                <TableCell className="text-right font-bold text-lg">${grandTotal.toFixed(2)}</TableCell>
                            </TableRow>
                        </TableFoot>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground leading-relaxed">
                        <p>John Doe</p>
                        <p>123 Industrial Way, Suite 456</p>
                        <p>Metropolis, ST 12345</p>
                        <p>United States</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Billing Address</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground leading-relaxed">
                        <p>John Doe</p>p>
                        <p>123 Industrial Way, Suite 456</p>
                        <p>Metropolis, ST 12345</p>
                        <p>United States</p>
                    </CardContent>
                </Card>
            </div>
            
            <Card className="mt-6 bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="text-xl md:text-2xl">Manual Payment Instructions</CardTitle>
                    <CardContent className="p-0 pt-4 text-muted-foreground">Please complete the payment using one of the methods below and upload the receipt to finalize your order.</CardContent>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="font-bold mb-3">Bank Transfer Details</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex"><span className="w-32 text-muted-foreground">Account Name:</span><span className="font-medium">WholesaleMarket Inc.</span></div>
                            <div className="flex"><span className="w-32 text-muted-foreground">Account Number:</span><span className="font-medium">123456789012</span></div>
                            <div className="flex"><span className="w-32 text-muted-foreground">Bank Name:</span><span className="font-medium">Global Commerce Bank</span></div>
                            <div className="flex"><span className="w-32 text-muted-foreground">IFSC Code:</span><span className="font-medium">GCB0001234</span></div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold mb-3">UPI Details</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center"><span className="w-32 text-muted-foreground">UPI ID:</span><span className="font-medium">payments@wholesalemarket</span></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            <div className="mt-8 text-center flex flex-col items-center">
                <Button size="lg" className="w-full max-w-sm">
                    <Upload className="mr-2 h-5 w-5"/>
                    Upload Proof of Payment
                </Button>
                <Button variant="link" asChild className="mt-4"><Link href="/buyer/orders">Back to My Orders</Link></Button>
            </div>
        </div>
    )
}
