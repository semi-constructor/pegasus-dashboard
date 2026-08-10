import { ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getTranslations } from "next-intl/server";

export default async function PrivacyPolicyPage() {
  const t = await getTranslations("legal");
  return (
    <MarketingLayout>
      <div className="max-w-3xl mx-auto px-8 py-32 space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t("backToHome")}
        </Link>
        
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">{t("privacy.title")}</h1>
          <p className="text-muted-foreground">{t("privacy.lastUpdated")}</p>
        </div>

        <div className="prose prose-invert max-w-none text-muted-foreground">
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">{t("privacy.sections.1.title")}</h2>
          <p className="mb-4">{t("privacy.sections.1.p1")}</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>{t("privacy.sections.1.l1")}</li>
            <li>{t("privacy.sections.1.l2")}</li>
            <li>{t("privacy.sections.1.l3")}</li>
            <li>{t("privacy.sections.1.l4")}</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">{t("privacy.sections.2.title")}</h2>
          <p className="mb-4">{t("privacy.sections.2.p1")}</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">{t("privacy.sections.3.title")}</h2>
          <p className="mb-4">{t("privacy.sections.3.p1")}</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">{t("privacy.sections.4.title")}</h2>
          <p className="mb-4">{t("privacy.sections.4.p1")}</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">{t("privacy.sections.5.title")}</h2>
          <p className="mb-4">{t("privacy.sections.5.p1")}</p>
        </div>
      </div>
    </MarketingLayout>
  );
}