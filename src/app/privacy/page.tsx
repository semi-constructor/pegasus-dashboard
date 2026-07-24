import { ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { MarketingLayout } from "@/components/MarketingLayout";

export default function PrivacyPolicyPage() {
  return (
    <MarketingLayout>
      <div className="max-w-3xl mx-auto px-8 py-32 space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: July 23, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none text-muted-foreground">
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Information We Collect</h2>
          <p className="mb-4">
            When you use Pegasus, we collect and store the following information:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Discord User IDs and Guild IDs for operation and configuration storage.</li>
            <li>Messages logged specifically by the server administrator (only when the Logging module is active).</li>
            <li>Economy and XP balances associated with your User ID.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. How We Use Information</h2>
          <p className="mb-4">
            The information we collect is strictly used to provide the bot's functionality, such as maintaining economy leaderboards, creating moderation logs for your server, and ensuring the stability of the platform. We do not sell your data to third parties.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Data Retention</h2>
          <p className="mb-4">
            We retain your data as long as your Discord server has Pegasus installed. When the bot is removed from a server, all associated configuration data is scheduled for automated deletion within 30 days. Individual user data (XP, Economy) can be wiped upon request.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Your Rights</h2>
          <p className="mb-4">
            You have the right to request an export of all your data or request complete deletion of your data from our systems. You can initiate these requests directly through the Dashboard or by contacting support.
          </p>
        </div>
      </div>
    </MarketingLayout>
  );
}
