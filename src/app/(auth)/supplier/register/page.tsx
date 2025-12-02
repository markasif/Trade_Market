"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CloudUpload } from "lucide-react";

function FileUploadZone() {
    return (
        <div className="relative flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-background py-10 text-center transition-colors hover:border-primary/50">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <CloudUpload className="h-10 w-10" />
                <p className="text-sm font-medium">
                    Drag & drop files here or <span className="font-bold text-primary">browse</span>
                </p>
                <p className="text-xs text-muted-foreground/80">PDF, JPG, PNG up to 10MB</p>
            </div>
            <Input type="file" className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
        </div>
    )
}

export default function SupplierRegistrationPage() {

  return (
    <Card className="w-full">
        <CardHeader className="border-b">
            <CardTitle className="text-4xl font-black tracking-tighter">Supplier Registration</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
            <Tabs defaultValue="company-info" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-auto">
                    <TabsTrigger value="company-info" className="py-2">1. Company Information</TabsTrigger>
                    <TabsTrigger value="documents" className="py-2">2. Document Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="company-info" className="mt-8">
                     <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="company-name">Full Name / Company Name</Label>
                            <Input id="company-name" placeholder="Enter your full name or company name"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Business Email</Label>
                            <Input id="email" type="email" placeholder="e.g. contact@yourcompany.com"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Contact Number</Label>
                            <Input id="phone" type="tel" placeholder="e.g. +1 234 567 890"/>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="documents" className="mt-8">
                     <div className="space-y-6">
                        <div className="space-y-2">
                            <Label>Business License</Label>
                            <FileUploadZone />
                        </div>
                         <div className="space-y-2">
                            <Label>Tax / GST ID Document</Label>
                            <FileUploadZone />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 p-8">
            <Button variant="outline">Back</Button>
            <Button>Submit for AI Vetting</Button>
        </CardFooter>
    </Card>
  );
}
