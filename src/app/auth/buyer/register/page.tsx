"use client";

import { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CloudUpload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().min(1, "Phone number is required"),
  shippingAddress: z.string().min(1, "Shipping address is required"),
  gstNumber: z.string().min(1, "GST number is required"),
  gstCertificate: z.instanceof(File).refine(file => file.size > 0, "GST certificate is required."),
  businessRegistration: z.instanceof(File).refine(file => file.size > 0, "Business registration proof is required."),
});

type FormValues = z.infer<typeof formSchema>;

function FileUploadZone({ field, label, error }: { field: any, label: string, error?: string }) {
    const [fileName, setFileName] = useState<string | null>(field.value?.name || null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            field.onChange(file);
            setFileName(file.name);
        }
    };

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="relative flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-background py-10 text-center transition-colors hover:border-primary/50">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <CloudUpload className="h-10 w-10" />
                    <p className="text-sm font-medium">
                        {fileName ? fileName : <>Drag & drop files here or <span className="font-bold text-primary">browse</span></>}
                    </p>
                    <p className="text-xs text-muted-foreground/80">PDF, JPG, PNG up to 10MB</p>
                </div>
                <Input 
                    type="file" 
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0" 
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, application/pdf"
                />
            </div>
             {error && <p className="text-sm text-destructive mt-1">{error}</p>}
        </div>
    )
}

export default function BuyerRegistrationPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      mode: "onTouched"
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
      setIsSubmitting(true);
      // Placeholder for full flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Buyer Form Data:", data);
      toast({
          title: "Registration Submitted",
          description: "Your account is under review. We'll notify you once it's approved.",
      });
      setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-6 p-4 text-center">
        <h1 className="text-4xl font-black leading-tight tracking-tighter">
          Create Your Wholesale Account
        </h1>
        <p className="text-muted-foreground text-base">
          Complete the form below to get your business verified.
        </p>
      </div>

      <Card className="w-full mt-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-xl">Business & Account Details</CardTitle>
            <CardDescription>
              This information should match your official business registration.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" placeholder="Enter your registered business name" {...register("businessName")} />
                {errors.businessName && <p className="text-sm text-destructive">{errors.businessName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="you@yourcompany.com" {...register("email")} />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Must be at least 8 characters" {...register("password")} />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>
               <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="Enter your contact number" {...register("phone")} />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
              </div>
               <div className="space-y-2">
                <Label htmlFor="gstNumber">GST Number</Label>
                <Input id="gstNumber" placeholder="Enter your business GST number" {...register("gstNumber")} />
                {errors.gstNumber && <p className="text-sm text-destructive">{errors.gstNumber.message}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="shippingAddress">Full Shipping Address</Label>
                <Textarea id="shippingAddress" placeholder="Enter your complete shipping address" {...register("shippingAddress")} className="min-h-24"/>
                {errors.shippingAddress && <p className="text-sm text-destructive">{errors.shippingAddress.message}</p>}
              </div>
            </div>
            
            <div className="border-t pt-6 grid gap-6">
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold">Business Verification Documents</h3>
                    <p className="text-sm text-muted-foreground">Required for wholesale purchasing.</p>
                </div>
                <Controller
                  control={control}
                  name="gstCertificate"
                  render={({ field }) => (
                    <FileUploadZone 
                        label="GST Certificate"
                        field={field}
                        error={errors.gstCertificate?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="businessRegistration"
                  render={({ field }) => (
                    <FileUploadZone 
                        label="Business Registration Proof"
                        field={field}
                        error={errors.businessRegistration?.message}
                    />
                  )}
                />
            </div>

          </CardContent>
          <CardFooter className="flex justify-end gap-3 pt-6">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit for Verification
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
