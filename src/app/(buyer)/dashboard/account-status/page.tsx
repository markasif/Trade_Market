import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Hourglass } from "lucide-react";
import Link from "next/link";

export default function AccountStatusPage() {
  return (
    <div className="flex w-full max-w-4xl flex-col px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black leading-tight tracking-tighter">Account Status</h1>
      </div>
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center gap-6 p-8 text-center sm:p-12 md:p-16">
          <div className="flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-medium text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
            <Hourglass className="h-4 w-4" />
            <span>Pending Admin Review</span>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-2xl font-bold tracking-tight">Your Account Verification is Pending</p>
            <p className="max-w-md text-base text-muted-foreground">
              Your documents have been submitted and are currently under review by our team. This process usually takes 1-2 business days.
            </p>
          </div>
          <div className="mt-4 flex flex-col items-center gap-4">
            <Button size="lg" className="h-12 px-6">
              View/Update KYC Documents
            </Button>
            <Button variant="link" asChild>
                <Link href="#">Need Help? Contact Support</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
