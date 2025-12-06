"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useSupabase } from "@/components/supabase-provider";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().min(1, "Phone number is required"),
  shippingAddress: z.string().min(1, "Shipping address is required"),
  gstNumber: z.string().min(1, "GST number is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function BuyerRegistrationPage() {
  const { toast } = useToast();
  const { supabase } = useSupabase();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      mode: "onTouched"
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    if (!supabase) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: 'Application is not ready. Please try again in a moment.',
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Step 1: Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Registration failed, user not created.");
      
      // Step 2: Insert the profile into the public.buyers table
      const { error: profileError } = await supabase.from('buyers').insert({
        id: authData.user.id,
        business_name: data.businessName,
        phone: data.phone,
        shipping_address: data.shippingAddress,
        gst_number: data.gstNumber,
        account_status: 'pending', // Default status for manual review
      });

      if (profileError) throw profileError;

      toast({
        title: "Registration Submitted!",
        description: "Please check your email to verify your account, then you can log in.",
      });
      
      // IMPORTANT: Set loading to false BEFORE navigating.
      setIsSubmitting(false);
      // Navigate to login page on success
      router.push('/auth/login');

    } catch (error: any) {
      console.error('Registration Error:', error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
      setIsSubmitting(false);
    }
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
