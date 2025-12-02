import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ShieldCheck, Lock, Tag } from 'lucide-react';
import Link from 'next/link';

const heroImage = PlaceHolderImages.find(img => img.id === 'hero-warehouse');
const categoryImages = [
    { id: 'category-electronics', title: 'Electronics', description: 'Latest in consumer and commercial electronics.' },
    { id: 'category-apparel', title: 'Apparel', description: 'Wholesale clothing and textiles for all seasons.' },
    { id: 'category-industrial', title: 'Industrial Supplies', description: 'Heavy-duty equipment and materials.' },
    { id: 'category-office', title: 'Office Goods', description: 'Everything your business needs to stay productive.' },
];

const features = [
    {
        icon: <ShieldCheck className="w-8 h-8 text-primary" />,
        title: 'Vetted Suppliers',
        description: 'We partner with trusted, high-quality suppliers to ensure product excellence and reliability.',
    },
    {
        icon: <Lock className="w-8 h-8 text-primary" />,
        title: 'Secure Payments',
        description: 'Our secure payment gateway protects your transactions every step of the way.',
    },
    {
        icon: <Tag className="w-8 h-8 text-primary" />,
        title: 'Bulk Discounts',
        description: 'Access exclusive pricing and save more when you purchase in larger quantities.',
    },
];

export default function HomePage() {
  return (
    <div className="px-4 sm:px-10 lg:px-20 xl:px-40 py-5">
      <div className="flex flex-col max-w-7xl mx-auto gap-12 sm:gap-16">
        <div className="relative min-h-[480px] w-full flex flex-col items-start justify-end p-6 sm:p-12 rounded-xl overflow-hidden">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover -z-10"
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10 -z-10"></div>
          <div className="flex flex-col gap-4 text-left max-w-2xl">
            <h1 className="text-white text-4xl font-black leading-tight tracking-tighter sm:text-5xl">
              The Premier Wholesale Marketplace for Your Business
            </h1>
            <h2 className="text-white/90 text-sm font-normal leading-normal sm:text-base">
              Streamline your procurement process with vetted suppliers, competitive pricing, and a seamless ordering experience.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button size="lg" className="h-12 px-5 text-base font-bold" asChild>
              <Link href="/products">Browse All Products</Link>
            </Button>
            <Button size="lg" variant="secondary" className="h-12 px-5 text-base font-bold bg-background text-foreground hover:bg-background/90" asChild>
              <Link href="/supplier/register">Become a Supplier</Link>
            </Button>
          </div>
        </div>

        <section>
          <h2 className="text-gray-900 dark:text-white text-2xl font-bold leading-tight tracking-tight px-4 pb-4">
            Featured Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryImages.map(cat => {
              const img = PlaceHolderImages.find(p => p.id === cat.id);
              return (
                <Link href="#" key={cat.id} className="group flex flex-col gap-3 pb-3">
                  {img && (
                    <div className="w-full overflow-hidden rounded-lg">
                      <Image
                        src={img.imageUrl}
                        alt={img.description}
                        width={400}
                        height={300}
                        className="w-full aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={img.imageHint}
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-gray-900 dark:text-white text-base font-medium leading-normal group-hover:text-primary">{cat.title}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal">{cat.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-10 px-4 py-10 bg-white dark:bg-background rounded-xl">
          <div className="flex flex-col gap-4">
            <h1 className="text-gray-900 dark:text-white tracking-tight text-3xl font-bold leading-tight sm:text-4xl sm:font-black max-w-2xl">
              Why Choose Our Marketplace?
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-base font-normal leading-normal max-w-2xl">
              We provide the tools and trust to help your business thrive.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature, index) => (
                <Card key={index} className="flex flex-1 flex-col gap-4 p-6 bg-background dark:bg-gray-900/50">
                    <CardHeader className="p-0">
                        {feature.icon}
                        <CardTitle className="pt-2 text-base font-bold">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
