'use client';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { Product, WithId } from "@/lib/types";

export default function ProductsPage() {
    const firestore = useFirestore();
    const productsQuery = useMemoFirebase(() => collection(firestore, 'products'), [firestore]);
    const { data: products, isLoading } = useCollection<Product>(productsQuery);

    return (
      <div className="relative flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex-1 py-8 sm:py-12 md:py-16">
            <div className="w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 mx-auto">
              <div className="flex flex-col mb-8">
                  <h1 className="text-4xl font-black leading-tight tracking-tighter">Products</h1>
                  <p className="text-muted-foreground text-lg mt-2">Browse our curated selection of wholesale products.</p>
              </div>

              <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
                  <div className="relative w-full max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input placeholder="Search products..." className="pl-10 h-12 text-base" />
                  </div>
                  <div className="flex items-center gap-4">
                      <Select>
                          <SelectTrigger className="w-[180px] h-12 text-base">
                              <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="featured">Featured</SelectItem>
                              <SelectItem value="newest">Newest</SelectItem>
                              <SelectItem value="price-asc">Price: Low to High</SelectItem>
                              <SelectItem value="price-desc">Price: High to Low</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {isLoading && Array.from({ length: 8 }).map((_, i) => (
                      <Card key={i} className="overflow-hidden group">
                          <CardHeader className="p-0">
                               <div className="w-full bg-muted aspect-[4/3]"></div>
                          </CardHeader>
                          <CardContent className="p-4">
                              <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                              <div className="h-4 bg-muted rounded w-1/2"></div>
                          </CardContent>
                          <CardFooter className="p-4 flex justify-between items-center">
                              <div className="h-8 bg-muted rounded w-20"></div>
                              <div className="h-10 bg-muted rounded w-16"></div>
                          </CardFooter>
                      </Card>
                  ))}
                  {products?.map((product: WithId<Product>) => {
                      const firstTierPrice = product.pricingTiers?.length > 0 ? product.pricingTiers[0].price : 0;
                      return (
                          <Card key={product.id} className="overflow-hidden group">
                              <CardHeader className="p-0">
                                  <Link href={`/products/${product.id}`}>
                                      <Image 
                                          src={product.imageUrls[0] || "/placeholder.svg"} 
                                          alt={product.name}
                                          width={400}
                                          height={300}
                                          className="w-full h-auto aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-300"
                                      />
                                  </Link>
                              </CardHeader>
                              <CardContent className="p-4">
                                  <CardTitle className="text-lg mb-2">
                                      <Link href={`/products/${product.id}`}>{product.name}</Link>
                                  </CardTitle>
                                  <CardDescription>
                                      Min. Order: {product.moq} units
                                  </CardDescription>
                              </CardContent>
                              <CardFooter className="p-4 flex justify-between items-center">
                                  <p className="text-lg font-bold">${firstTierPrice.toFixed(2)}</p>
                                  <Button asChild>
                                      <Link href={`/products/${product.id}`}>View</Link>
                                  </Button>
                              </CardFooter>
                          </Card>
                      )
                  })}
              </div>
            </div>
        </main>
        <Footer/>
      </div>
    );
}
