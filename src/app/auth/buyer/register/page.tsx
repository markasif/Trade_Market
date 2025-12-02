"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export default function BuyerRegistrationPage() {
  const [step, setStep] = useState(1);
  const progress = (step / 3) * 100;

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-6 p-4 text-center">
        <h1 className="text-4xl font-black leading-tight tracking-tighter">
          Create Your Wholesale Account
        </h1>
        <p className="text-muted-foreground text-base">
          Complete the steps below to get your business verified.
        </p>
      </div>

      <div className="flex flex-col gap-3 py-6 px-4">
        <div className="flex gap-6 justify-between items-center">
          <p className="font-medium">Step {step} of 3: Business Details</p>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} />
      </div>

      <Card className="w-full">
        <form>
          <CardHeader>
            <CardTitle className="text-xl">Tell us about your business</CardTitle>
            <CardDescription>
              This information should match your official business registration.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="business-name">Business Name</Label>
                <Input id="business-name" placeholder="Enter your registered business name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing-address">Full Billing Address</Label>
                <Textarea id="billing-address" placeholder="Enter street address, P.O. box, city, state, and zip code." className="min-h-32"/>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="same-address" />
                <Label htmlFor="same-address" className="font-medium">Shipping address is the same as billing address</Label>
              </div>
            </div>
            
            <div className="border-t pt-6 grid gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Business Verification</h3>
                <p className="text-sm text-muted-foreground">This is required for wholesale purchasing.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax-id">Tax ID / GST Number</Label>
                <Input id="tax-id" placeholder="e.g., 12-3456789" />
              </div>
            </div>

          </CardContent>
          <CardFooter className="flex justify-end gap-3 pt-6">
            <Button variant="outline" type="button">Back</Button>
            <Button type="submit">Submit for Verification</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
