import { Scale, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { MarketingLayout } from "@/components/MarketingLayout";

export default function TermsOfServicePage() {
  return (
    <MarketingLayout>
      <div className="max-w-3xl mx-auto px-8 py-32 space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
            <Scale className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: July 23, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none text-muted-foreground">
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using the Pegasus Discord Bot and Dashboard ("Service"), you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Description of Service</h2>
          <p className="mb-4">
            Pegasus provides enterprise-level Discord server management tools including economy systems, moderation utilities, ticketing, and logging through a Discord bot and web dashboard.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. User Conduct</h2>
          <p className="mb-4">
            You agree to not use the Service to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Violate any Discord Terms of Service or Community Guidelines.</li>
            <li>Abuse the economy or XP systems through automated macros or bots.</li>
            <li>Use the moderation tools to maliciously harm server communities.</li>
            <li>Attempt to bypass rate limits or authentication mechanisms.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Data and Privacy</h2>
          <p className="mb-4">
            Our data collection and use practices are governed by our Privacy Policy. By using the Service, you consent to the collection and use of this information as detailed in the Privacy Policy.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Modifications to Service</h2>
          <p className="mb-4">
            We reserve the right at any time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.
          </p>
        </div>
      </div>
    </MarketingLayout>
  );
}
