import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const products = [
    { id: 'product-widget-main', name: 'Premium Industrial Widget', price: '$22.50' },
    { id: 'product-running-shoes', name: 'Sleek Running Shoes', price: '$89.99' },
    { id: 'product-headphones', name: 'Wireless Headphones', price: '$129.99' },
    { id: 'product-chrono-watch', name: 'Chronograph Watch', price: '$249.99' },
];

export default function ProductsPage() {
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
                  {products.map(product => {
                      const img = PlaceHolderImages.find(p => p.id === product.id);
                      return (
                          <Card key={product.id} className="overflow-hidden group">
                              <CardHeader className="p-0">
                                  {img && (
                                      <Link href={`/products/${product.id}`}>
                                          <Image 
                                              src={img.imageUrl} 
                                              alt={img.description}
                                              width={400}
                                              height={300}
                                              className="w-full h-auto aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-300"
                                              data-ai-hint={img.imageHint}
                                          />
                                      </Link>
                                  )}
                              </CardHeader>
                              <CardContent className="p-4">
                                  <CardTitle className="text-lg mb-2">
                                      <Link href={`/products/${product.id}`}>{product.name}</Link>
                                  </CardTitle>
                                  <CardDescription>
                                      Min. Order: 20 units
                                  </CardDescription>
                              </CardContent>
                              <CardFooter className="p-4 flex justify-between items-center">
                                  <p className="text-lg font-bold">{product.price}</p>
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
