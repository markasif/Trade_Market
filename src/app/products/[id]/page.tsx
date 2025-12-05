'use client';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Product } from "@/lib/types";
import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useSupabase } from "@/components/supabase-provider";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    const { supabase } = useSupabase();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        if (!supabase) return;
        const fetchProduct = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', params.id)
                .single();
            
            if (error) {
                console.error("Error fetching product:", error);
                setProduct(null);
            } else {
                setProduct(data as Product);
                if (data.imageUrls && data.imageUrls.length > 0) {
                    setSelectedImage(data.imageUrls[0]);
                }
            }
            setIsLoading(false);
        }
        fetchProduct();
    }, [supabase, params.id]);

    if (isLoading) {
        return (
             <div className="w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
                <div className="h-6 w-1/2 bg-muted rounded mt-6 mb-4"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mt-4">
                    <div className="flex flex-col gap-4">
                        <div className="w-full bg-muted aspect-square rounded-xl"></div>
                        <div className="grid grid-cols-5 gap-4">
                            {Array.from({length: 4}).map((_, i) => <div key={i} className="w-full bg-muted aspect-square rounded-lg"></div>)}
                        </div>
                    </div>
                     <div className="flex flex-col gap-6">
                        <div className="h-10 w-3/4 bg-muted rounded"></div>
                        <div className="h-6 w-1/2 bg-muted rounded"></div>
                        <div className="h-40 w-full bg-muted rounded mt-4"></div>
                        <div className="h-12 w-full bg-muted rounded mt-4"></div>
                     </div>
                </div>
            </div>
        )
    }

    if (!product) {
        return <div className="text-center">Product not found.</div>
    }

    const currentImage = selectedImage || (product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : '/placeholder.svg');
    const sortedPricingTiers = product.pricingTiers.sort((a, b) => a.minQuantity - b.minQuantity);
    
    return (
      <div className="w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 py-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">Products</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mt-4">
          <div className="flex flex-col gap-4">
            <div className="w-full bg-muted aspect-square rounded-xl shadow-sm overflow-hidden">
                <Image src={currentImage} alt={product.name} width={600} height={600} className="w-full h-full object-cover" />
            </div>
            <Carousel opts={{ align: "start", loop: false }} className="w-full">
                <CarouselContent className="-ml-2">
                    {product.imageUrls.map((url, index) => (
                         <CarouselItem key={index} className="basis-1/4 md:basis-1/5 pl-2">
                            <div 
                                className={cn(
                                    "w-full aspect-square rounded-lg overflow-hidden cursor-pointer border-2", 
                                    currentImage === url ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                                )}
                                onClick={() => setSelectedImage(url)}
                            >
                                <Image src={url} alt={`${product.name} thumbnail ${index+1}`} width={100} height={100} className="w-full h-full object-cover" />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                 <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10" />
                <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10" />
            </Carousel>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-black tracking-tight">{product.name}</h1>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
            
            <div className="flex flex-col">
                <h3 className="text-lg font-bold tracking-tight pb-3">Pricing Tiers</h3>
                <div className="overflow-x-auto rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price per Unit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedPricingTiers.map((tier, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">
                                        {tier.minQuantity}{sortedPricingTiers[index+1] ? ` - ${sortedPricingTiers[index+1].minQuantity - 1}` : '+'} Units
                                    </TableCell>
                                    <TableCell>${tier.price.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <div className="flex items-center gap-4">
                    <Input id="quantity" type="number" defaultValue={product.moq} className="w-32"/>
                    <p className="text-sm text-muted-foreground">Minimum Order: {product.moq} Units</p>
                </div>
            </div>
            
            <div className="flex flex-col gap-4 pt-2">
                <Button size="lg" asChild>
                    <Link href="/buyer/checkout/confirmation">Add to Cart</Link>
                </Button>
                <Button size="lg" variant="outline">Add to Wishlist</Button>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4 pt-4">
                <AccordionItem value="item-1" className="border-b">
                    <AccordionTrigger className="font-bold text-base">Specifications</AccordionTrigger>
                    <AccordionContent>
                       <p>SKU: {(params.id as string).slice(0, 8).toUpperCase()}</p>
                       <p>Available Stock: {product.availableStock} Units</p>
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
