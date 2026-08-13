import { ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getTranslations } from "next-intl/server";

export default async function PrivacyPolicyPage() {
  const t = await getTranslations("legal");
  return (
    <MarketingLayout>
      <div className="relative min-h-screen bg-background pt-48 pb-32 overflow-hidden selection:bg-foreground selection:text-background">
        {/* Architectural background lines */}
        <div className="absolute top-0 left-12 md:left-24 w-px h-full bg-foreground/[0.03]" />
        <div className="absolute top-0 right-12 md:right-24 w-px h-full bg-foreground/[0.03]" />
        
        <div className="max-w-4xl mx-auto px-6 lg:px-24 relative z-10">
          <div className="mb-24">
            <Link href="/" className="group inline-flex items-center text-xs tracking-[0.2em] uppercase text-foreground/40 hover:text-foreground transition-colors mb-16">
              <ArrowRight className="w-4 h-4 mr-4 rotate-180 opacity-50 group-hover:-translate-x-2 transition-transform" />
              {t("backToHome")}
            </Link>
            
            <div className="inline-flex items-center text-foreground/30 text-xs tracking-[0.3em] uppercase mb-8 border border-border px-4 py-2">
              <ShieldCheck className="w-4 h-4 mr-3" />
              // Legal / Document
            </div>
            
            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-foreground mb-6 uppercase">{t("privacy.title")}</h1>
            <p className="text-foreground/40 tracking-[0.1em] text-sm uppercase">{t("privacy.lastUpdated")}</p>
          </div>

          <div className="w-full h-px bg-foreground/10 mb-24" />

          <div className="space-y-32">
            <section>
              <h2 className="text-xl tracking-[0.2em] font-medium text-foreground mb-8 uppercase border-l-2 border-border pl-6">{t("privacy.sections.1.title")}</h2>
              <div className="pl-6 md:pl-12">
                <p className="text-foreground/50 text-lg leading-relaxed font-light mb-8">{t("privacy.sections.1.p1")}</p>
                <ul className="space-y-4">
                  {[
                    t("privacy.sections.1.l1"),
                    t("privacy.sections.1.l2"),
                    t("privacy.sections.1.l3"),
                    t("privacy.sections.1.l4")
                  ].map((item, i) => (
                    <li key={i} className="flex items-start text-foreground/50 text-lg font-light">
                      <span className="w-6 shrink-0 text-foreground/20 mt-1">/</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl tracking-[0.2em] font-medium text-foreground mb-8 uppercase border-l-2 border-border pl-6">{t("privacy.sections.2.title")}</h2>
              <div className="pl-6 md:pl-12">
                <p className="text-foreground/50 text-lg leading-relaxed font-light">{t("privacy.sections.2.p1")}</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl tracking-[0.2em] font-medium text-foreground mb-8 uppercase border-l-2 border-border pl-6">{t("privacy.sections.3.title")}</h2>
              <div className="pl-6 md:pl-12">
                <p className="text-foreground/50 text-lg leading-relaxed font-light">{t("privacy.sections.3.p1")}</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl tracking-[0.2em] font-medium text-foreground mb-8 uppercase border-l-2 border-border pl-6">{t("privacy.sections.4.title")}</h2>
              <div className="pl-6 md:pl-12">
                <p className="text-foreground/50 text-lg leading-relaxed font-light">{t("privacy.sections.4.p1")}</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl tracking-[0.2em] font-medium text-foreground mb-8 uppercase border-l-2 border-border pl-6">{t("privacy.sections.5.title")}</h2>
              <div className="pl-6 md:pl-12">
                <p className="text-foreground/50 text-lg leading-relaxed font-light">{t("privacy.sections.5.p1")}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}