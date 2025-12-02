import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

const socialKitImages = [
    { id: 'social-kit-1' },
    { id: 'social-kit-2' },
    { id: 'social-kit-3' },
].map(img => PlaceHolderImages.find(p => p.id === img.id));

export default function MarketingToolsPage() {
    return (
        <div className="max-w-4xl w-full mx-auto">
            <div className="mb-6">
                <h1 className="text-4xl font-black tracking-tight">Marketing Tools</h1>
            </div>
            
            <Card>
                <div className="grid @xl:grid-cols-[2fr_1fr]">
                    <CardHeader className="p-6">
                        <CardTitle className="text-xl">Marketing Assets</CardTitle>
                        <CardDescription className="mt-1">
                            Create ready-to-use promotional content for your products.
                        </CardDescription>
                        <div className="pt-4">
                            <Button>Generate Social Media Kit</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 @xl:p-4 flex items-center justify-center @xl:border-l">
                         <div className="flex items-center gap-3 flex-wrap">
                            {socialKitImages.map(img => img && (
                                <div key={img.id} className="bg-muted aspect-square rounded-lg size-16 border overflow-hidden">
                                     <Image 
                                        src={img.imageUrl} 
                                        alt={img.description} 
                                        width={64} 
                                        height={64} 
                                        className="w-full h-full object-cover"
                                        data-ai-hint={img.imageHint}
                                    />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </div>
            </Card>
        </div>
    )
}
