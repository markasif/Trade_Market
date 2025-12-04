import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo2 } from "@/components/icons";
import { Footer } from "@/components/footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border px-6 md:px-10 py-4 bg-card">
        <Link href="/" className="flex items-center gap-4 text-foreground">
          <Logo2 className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-bold leading-tight tracking-tight">
            Wholesale Marketplace
          </h2>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild><Link href="/auth/login">Log In</Link></Button>
          <Button asChild><Link href="/auth/buyer/register">Sign Up</Link></Button>
        </div>
      </header>
      <main className="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md flex-1">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
