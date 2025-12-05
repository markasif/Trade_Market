"use client";

import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CloudUpload, Loader2, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const pricingTierSchema = z.object({
  minQuantity: z.coerce.number().min(1, "Min quantity is required"),
  price: z.coerce.number().min(0.01, "Price is required"),
});

const formSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  images: z.array(z.instanceof(File)).min(1, "At least one image is required").max(5, "You can upload a maximum of 5 images"),
  pricingTiers: z.array(pricingTierSchema).min(1, "At least one pricing tier is required"),
  moq: z.coerce.number().min(1, "MOQ is required"),
  availableStock: z.coerce.number().min(0, "Stock can't be negative"),
});

type FormValues = z.infer<typeof formSchema>;

function MultiFileUpload({ field, error }: { field: any; error?: string }) {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const currentFiles = field.value || [];
      const combinedFiles = [...currentFiles, ...files].slice(0, 5);
      field.onChange(combinedFiles);

      const newPreviews = combinedFiles.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const removeImage = (index: number) => {
    const currentFiles = [...field.value];
    currentFiles.splice(index, 1);
    field.onChange(currentFiles);

    const newPreviews = currentFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  }

  return (
    <div className="space-y-2">
      <Label>Product Images (up to 5)</Label>
       <div className="relative flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-background py-10 text-center transition-colors hover:border-primary/50">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <CloudUpload className="h-10 w-10" />
              <p className="text-sm font-medium">
                  Drag & drop files here or <span className="font-bold text-primary">browse</span>
              </p>
              <p className="text-xs text-muted-foreground/80">JPG, PNG up to 10MB each</p>
          </div>
          <Input 
              type="file" 
              multiple
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0" 
              onChange={handleFileChange}
              accept="image/png, image/jpeg"
              disabled={field.value?.length >= 5}
          />
      </div>
      {previews.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
              {previews.map((src, index) => (
                  <div key={index} className="relative aspect-square">
                      <Image src={src} alt={`Preview ${index}`} fill className="object-cover rounded-md" />
                      <Button type="button" size="icon" variant="destructive" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeImage(index)}>
                          <Trash className="h-3 w-3"/>
                      </Button>
                  </div>
              ))}
          </div>
      )}
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
}

export default function NewProductPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      images: [],
      pricingTiers: [{ minQuantity: 1, price: 0 }],
    },
    mode: "onTouched",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "pricingTiers",
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    // Placeholder for actual submission logic
    console.log("Product Data:", data);
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({
      title: "Product Published!",
      description: `${data.name} is now live on the marketplace.`,
    });
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center gap-4 mb-6">
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Add New Product
          </h1>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Button variant="outline" type="button">Discard</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Publish Product
            </Button>
          </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>Fill in the basic information about the product.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" placeholder="e.g. Handmade Ceramic Mug" {...register("name")} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Provide a detailed description of your product." {...register("description")} />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                control={control}
                name="images"
                render={({ field }) => (
                  <MultiFileUpload field={field} error={errors.images?.message} />
                )}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Multi-tier Pricing</CardTitle>
              <CardDescription>Offer discounts for bulk purchases.</CardDescription>
            </CardHeader>
            <CardContent>
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] items-end gap-2 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor={`tier-min-qty-${index}`}>Min. Quantity</Label>
                    <Input id={`tier-min-qty-${index}`} type="number" placeholder="e.g. 10" {...register(`pricingTiers.${index}.minQuantity`)} />
                    {errors.pricingTiers?.[index]?.minQuantity && <p className="text-sm text-destructive">{errors.pricingTiers[index]?.minQuantity?.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`tier-price-${index}`}>Price per Unit</Label>
                    <Input id={`tier-price-${index}`} type="number" step="0.01" placeholder="e.g. 15.00" {...register(`pricingTiers.${index}.price`)} />
                    {errors.pricingTiers?.[index]?.price && <p className="text-sm text-destructive">{errors.pricingTiers[index]?.price?.message}</p>}
                  </div>
                  <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
               {errors.pricingTiers && typeof errors.pricingTiers.message === 'string' && <p className="text-sm text-destructive mt-2">{errors.pricingTiers.message}</p>}
              <Button type="button" variant="outline" size="sm" onClick={() => append({ minQuantity: 0, price: 0 })}>
                Add Tier
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paintings">Paintings</SelectItem>
                      <SelectItem value="sculptures">Sculptures</SelectItem>
                      <SelectItem value="prints">Prints</SelectItem>
                      <SelectItem value="crafts">Crafts</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <p className="text-sm text-destructive mt-2">{errors.category.message}</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="moq">Minimum Order Quantity (MOQ)</Label>
                <Input id="moq" type="number" placeholder="e.g. 10" {...register("moq")} />
                {errors.moq && <p className="text-sm text-destructive">{errors.moq.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Available Stock</Label>
                <Input id="stock" type="number" placeholder="e.g. 500" {...register("availableStock")} />
                {errors.availableStock && <p className="text-sm text-destructive">{errors.availableStock.message}</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 md:hidden mt-6">
          <Button variant="outline" type="button">Discard</Button>
          <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Publish Product
            </Button>
      </div>
    </form>
  );
}
