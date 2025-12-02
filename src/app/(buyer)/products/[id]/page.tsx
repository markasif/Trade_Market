import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const mainImage = PlaceHolderImages.find(p => p.id === 'product-widget-main');
const thumbnails = [
    { id: 'product-widget-thumb1', active: true },
    { id: 'product-widget-thumb2', active: false },
    { id: 'product-widget-thumb3', active: false },
    { id: 'product-widget-thumb4', active: false },
].map(t => ({...t, data: PlaceHolderImages.find(p => p.id === t.id)}));

const pricingTiers = [
    { quantity: "20 - 49 Units", price: "$25.00", discount: "-", highlight: false },
    { quantity: "50 - 99 Units", price: "$22.50", discount: "10% Off", highlight: true },
    { quantity: "100+ Units", price: "$20.00", discount: "20% Off", highlight: false },
]

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    return (
      <div className="w-full max-w-7xl flex-1">
        <div className="flex flex-wrap gap-2 py-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">Industrial Supplies</Link>
          <span>/</span>
          <span className="text-foreground">Premium Industrial Widget</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mt-4">
          <div className="flex flex-col gap-4">
            <div className="w-full bg-muted aspect-square rounded-xl shadow-sm overflow-hidden">
                {mainImage && (
                    <Image src={mainImage.imageUrl} alt={mainImage.description} width={600} height={600} className="w-full h-full object-cover" data-ai-hint={mainImage.imageHint} />
                )}
            </div>
            <div className="grid grid-cols-5 gap-4">
                {thumbnails.map(thumb => thumb.data && (
                    <div key={thumb.id} className={cn("w-full aspect-square rounded-lg overflow-hidden cursor-pointer border-2", thumb.active ? "border-primary" : "border-transparent opacity-70 hover:opacity-100")}>
                        <Image src={thumb.data.imageUrl} alt={thumb.data.description} width={100} height={100} className="w-full h-full object-cover" data-ai-hint={thumb.data.imageHint} />
                    </div>
                ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-black tracking-tight">Premium Industrial Widget</h1>
              <p className="text-muted-foreground">High-grade, durable widget for all industrial applications. SKU: WID-12345</p>
            </div>
            
            <div className="flex flex-col">
                <h3 className="text-lg font-bold tracking-tight pb-3">Pricing Tiers</h3>
                <div className="overflow-x-auto rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price per Unit</TableHead>
                                <TableHead>Discount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pricingTiers.map(tier => (
                                <TableRow key={tier.quantity} className={cn(tier.highlight && "bg-primary/10")}>
                                    <TableCell className={cn("font-medium", tier.highlight && "text-primary")}>{tier.quantity}</TableCell>
                                    <TableCell className={cn(tier.highlight && "font-medium text-primary")}>{tier.price}</TableCell>
                                    <TableCell className={cn(tier.highlight && "font-medium text-primary")}>{tier.discount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <div className="flex items-center gap-4">
                    <Input id="quantity" type="number" defaultValue="10" className="w-32 border-destructive focus-visible:ring-destructive"/>
                    <p className="text-sm text-muted-foreground">Minimum Order: 20 Units</p>
                </div>
                <p className="text-sm text-destructive mt-1">Minimum order quantity is 20 units.</p>
            </div>
            
            <div className="flex flex-col gap-4 pt-2">
                <Button size="lg">Add to Cart</Button>
                <Button size="lg" variant="outline">Add to Wishlist</Button>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4 pt-4">
                <AccordionItem value="item-1" className="border-b">
                    <AccordionTrigger className="font-bold text-base">Specifications</AccordionTrigger>
                    <AccordionContent>
                        <p>Material: High-Grade Steel</p>
                        <p>Weight: 2.5 kg</p>
                        <p>Dimensions: 15cm x 10cm x 5cm</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border-b">
                    <AccordionTrigger className="font-bold text-base">Shipping Details</AccordionTrigger>
                    <AccordionContent>
                        Available for worldwide shipping. Costs are calculated at checkout.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border-b">
                    <AccordionTrigger className="font-bold text-base">Vendor Information</AccordionTrigger>
                    <AccordionContent>
                        Sold and shipped by Supplier Inc.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

          </div>
        </div>
      </div>
    );
}
