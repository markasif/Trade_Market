"use client";

import { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CloudUpload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { aiSupplierVetting } from "@/ai/flows/ai-supplier-vetting";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

const fileToDataUri = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
});


const formSchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    phone: z.string().min(1, "Contact number is required"),
    gstNumber: z.string().min(1, "GST number is required"),
    address: z.string().min(1, "Business address is required"),
    businessLicense: z.instanceof(File).refine(file => file.size > 0, "Business license is required."),
    taxIdDocument: z.instanceof(File).refine(file => file.size > 0, "Tax ID document is required."),
    bankAccountProof: z.instanceof(File).refine(file => file.size > 0, "Bank account proof is required."),
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


export default function SupplierRegistrationPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [currentTab, setCurrentTab] = useState("company-info");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, trigger, control, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        mode: "onTouched"
    });

    const handleNext = async () => {
        const isValid = await trigger(["companyName", "email", "password", "phone", "gstNumber", "address"]);
        if (isValid) {
            setCurrentTab("documents");
        }
    }
    
    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setIsSubmitting(true);
        try {
            // 1. Create user with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error("Registration failed, user not created.");
            
            const user = authData.user;
            const userId = user.id;

            // 2. Upload files to Supabase Storage
            const bizLicensePath = `${userId}/business_license_${data.businessLicense.name}`;
            const { error: licenseUploadError } = await supabase.storage.from('kyc-documents').upload(bizLicensePath, data.businessLicense);
            if (licenseUploadError) throw licenseUploadError;
            const { data: { publicUrl: businessLicenseUrl } } = supabase.storage.from('kyc-documents').getPublicUrl(bizLicensePath);
            
            const taxIdPath = `${userId}/tax_id_${data.taxIdDocument.name}`;
            const { error: taxIdUploadError } = await supabase.storage.from('kyc-documents').upload(taxIdPath, data.taxIdDocument);
            if (taxIdUploadError) throw taxIdUploadError;
            const { data: { publicUrl: taxIdDocumentUrl } } = supabase.storage.from('kyc-documents').getPublicUrl(taxIdPath);
            
            const bankProofPath = `${userId}/bank_proof_${data.bankAccountProof.name}`;
            const { error: bankProofUploadError } = await supabase.storage.from('kyc-documents').upload(bankProofPath, data.bankAccountProof);
            if (bankProofUploadError) throw bankProofUploadError;
            const { data: { publicUrl: bankAccountProofUrl } } = supabase.storage.from('kyc-documents').getPublicUrl(bankProofPath);

            // 3. AI Vetting
            const businessLicenseDataUri = await fileToDataUri(data.businessLicense);
            const taxIdDocumentDataUri = await fileToDataUri(data.taxIdDocument);
            const vettingResult = await aiSupplierVetting({
                businessName: data.companyName,
                businessLicenseDataUri,
                taxIdDocumentDataUri,
            });

            // 4. Save supplier data to Supabase table
            const accountStatus = vettingResult.isApproved ? 'active' : 'pending';

            const { error: dbError } = await supabase.from('suppliers').insert({
                id: userId,
                user_id: userId,
                company_name: data.companyName,
                business_email: data.email,
                contact_number: data.phone,
                business_address: data.address,
                gst_number: data.gstNumber,
                business_license_url: businessLicenseUrl,
                tax_id_document_url: taxIdDocumentUrl,
                bank_account_proof_url: bankAccountProofUrl,
                account_status: accountStatus,
            });

            if (dbError) throw dbError;

            await supabase.from('users').insert({
                id: userId,
                user_type: 'supplier',
                email: data.email
            });

            toast({
                title: "Registration Submitted!",
                description: vettingResult.isApproved 
                    ? "Your account has been instantly approved! You can now log in." 
                    : "Your application is under review. We'll notify you shortly."
            });
            router.push('/auth/login');

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: error.message || "An unexpected error occurred. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <Card className="w-full">
        <CardHeader className="border-b">
            <CardTitle className="text-4xl font-black tracking-tighter">Supplier Registration</CardTitle>
            <CardDescription>Join our network of trusted suppliers. Complete the steps to get started.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="p-8">
                <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-auto">
                        <TabsTrigger value="company-info" className="py-2">1. Company Information</TabsTrigger>
                        <TabsTrigger value="documents" className="py-2">2. Document Upload</TabsTrigger>
                    </TabsList>
                    <TabsContent value="company-info" className="mt-8">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="company-name">Full Name / Company Name</Label>
                                <Input id="company-name" placeholder="Enter your full name or company name" {...register("companyName")} />
                                {errors.companyName && <p className="text-sm text-destructive">{errors.companyName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Business Email</Label>
                                <Input id="email" type="email" placeholder="e.g. contact@yourcompany.com" {...register("email")} />
                                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" placeholder="Must be at least 8 characters" {...register("password")} />
                                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Contact Number</Label>
                                <Input id="phone" type="tel" placeholder="e.g. +1 234 567 890" {...register("phone")} />
                                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gstNumber">GST Number</Label>
                                <Input id="gstNumber" placeholder="Enter your GST number" {...register("gstNumber")} />
                                {errors.gstNumber && <p className="text-sm text-destructive">{errors.gstNumber.message}</p>}
                            </div>
                             <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address">Business Address</Label>
                                <Textarea id="address" placeholder="Enter your full business address" {...register("address")} />
                                {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="documents" className="mt-8">
                        <div className="space-y-6">
                            <Controller
                                control={control}
                                name="businessLicense"
                                render={({ field }) => (
                                    <FileUploadZone 
                                        label="Business License"
                                        field={field}
                                        error={errors.businessLicense?.message}
                                    />
                                )}
                            />
                             <Controller
                                control={control}
                                name="taxIdDocument"
                                render={({ field }) => (
                                    <FileUploadZone 
                                        label="Tax ID / GST Document"
                                        field={field}
                                        error={errors.taxIdDocument?.message}
                                    />
                                )}
                            />
                             <Controller
                                control={control}
                                name="bankAccountProof"
                                render={({ field }) => (
                                    <FileUploadZone 
                                        label="Bank Account Proof"
                                        field={field}
                                        error={errors.bankAccountProof?.message}
                                    />
                                )}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 p-8">
                {currentTab === "documents" && (
                    <Button type="button" variant="outline" onClick={() => setCurrentTab("company-info")}>Back</Button>
                )}
                {currentTab === "company-info" ? (
                    <Button type="button" onClick={handleNext}>Next</Button>
                ) : (
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit for AI Vetting
                    </Button>
                )}
            </CardFooter>
        </form>
    </Card>
  );
}
