import { Scale, ArrowRight, MapPin, Mail, User, Building2 } from "lucide-react";
import Link from "next/link";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getTranslations } from "next-intl/server";

// Read imprint data server-side from environment variables.
// All IMP_* vars are server-only (no NEXT_PUBLIC_ prefix) — they never reach the client bundle.
function getImprintData() {
  const ustid = process.env.IMP_USTID;
  const hrb = process.env.IMP_HRB;

  return {
    name: process.env.IMP_NAME ?? "Unknown",
    zip: process.env.IMP_ZIP ?? "",
    city: process.env.IMP_CTY ?? "",
    street: process.env.IMP_STREET ?? "",
    streetNumber: process.env.IMP_STRNM ?? "",
    country: process.env.IMP_COUNTRY ?? "",
    email: process.env.IMP_EMAIL ?? "",
    // treat the string "false" or empty as not set
    ustid: ustid && ustid !== "false" && ustid !== "" ? ustid : null,
    hrb: hrb && hrb !== "false" && hrb !== "" ? hrb : null,
  };
}

export default async function ImprintPage() {
  const t = await getTranslations("legal");
  const imp = getImprintData();

  return (
    <MarketingLayout>
      <div className="relative min-h-screen bg-black pt-48 pb-32 overflow-hidden selection:bg-white selection:text-black">
        {/* Architectural background lines */}
        <div className="absolute top-0 left-12 md:left-24 w-px h-full bg-white/[0.03]" />
        <div className="absolute top-0 right-12 md:right-24 w-px h-full bg-white/[0.03]" />

        <div className="max-w-4xl mx-auto px-6 lg:px-24 relative z-10">
          {/* Back link */}
          <div className="mb-24">
            <Link
              href="/"
              className="group inline-flex items-center text-xs tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors mb-16"
            >
              <ArrowRight className="w-4 h-4 mr-4 rotate-180 opacity-50 group-hover:-translate-x-2 transition-transform" />
              {t("backToHome")}
            </Link>

            <div className="inline-flex items-center text-white/30 text-xs tracking-[0.3em] uppercase mb-8 border border-white/10 px-4 py-2">
              <Scale className="w-4 h-4 mr-3" />
              // Legal / Imprint
            </div>

            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-white mb-6 uppercase">
              {t("imprint.title")}
            </h1>
            <p className="text-white/40 tracking-[0.1em] text-sm uppercase">
              {t("imprint.subtitle")}
            </p>
          </div>

          <div className="w-full h-px bg-white/10 mb-24" />

          {/* Content grid */}
          <div className="space-y-20">

            {/* Responsible person + address block */}
            <div className="grid md:grid-cols-2 gap-12">
              {/* Name */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-4 h-4 text-white/30" />
                  <h2 className="text-xs tracking-[0.3em] font-medium text-white/50 uppercase">
                    {t("imprint.responsiblePerson")}
                  </h2>
                </div>
                <div className="border-l border-white/10 pl-6">
                  <p className="text-2xl font-light tracking-tight text-white">{imp.name}</p>
                </div>
              </section>

              {/* Address */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-4 h-4 text-white/30" />
                  <h2 className="text-xs tracking-[0.3em] font-medium text-white/50 uppercase">
                    {t("imprint.address")}
                  </h2>
                </div>
                <div className="border-l border-white/10 pl-6 space-y-1">
                  <p className="text-white/80 font-light">
                    {imp.street} {imp.streetNumber}
                  </p>
                  <p className="text-white/80 font-light">
                    {imp.zip} {imp.city}
                  </p>
                  <p className="text-white/50 text-sm uppercase tracking-widest">
                    {imp.country}
                  </p>
                </div>
              </section>
            </div>

            {/* Contact */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Mail className="w-4 h-4 text-white/30" />
                <h2 className="text-xs tracking-[0.3em] font-medium text-white/50 uppercase">
                  {t("imprint.contact")}
                </h2>
              </div>
              <div className="border-l border-white/10 pl-6">
                <p className="text-white/40 text-xs tracking-[0.2em] uppercase mb-1">
                  {t("imprint.email")}
                </p>
                <a
                  href={`mailto:${imp.email}`}
                  className="text-white hover:text-white/70 transition-colors text-lg font-light tracking-tight"
                >
                  {imp.email}
                </a>
              </div>
            </section>

            <div className="w-full h-px bg-white/10" />

            {/* VAT & HRB — conditionally shown */}
            {(imp.ustid || imp.hrb) && (
              <div className="grid md:grid-cols-2 gap-12">
                {imp.ustid && (
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <Building2 className="w-4 h-4 text-white/30" />
                      <h2 className="text-xs tracking-[0.3em] font-medium text-white/50 uppercase">
                        {t("imprint.vat.title")}
                      </h2>
                    </div>
                    <div className="border-l border-white/10 pl-6">
                      <p className="text-white/80 font-mono">{imp.ustid}</p>
                    </div>
                  </section>
                )}
                {imp.hrb && (
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <Building2 className="w-4 h-4 text-white/30" />
                      <h2 className="text-xs tracking-[0.3em] font-medium text-white/50 uppercase">
                        {t("imprint.hrb.title")}
                      </h2>
                    </div>
                    <div className="border-l border-white/10 pl-6">
                      <p className="text-white/80 font-mono">{imp.hrb}</p>
                    </div>
                  </section>
                )}
              </div>
            )}

            {/* Show "not applicable" notices when both are absent */}
            {!imp.ustid && !imp.hrb && (
              <div className="grid md:grid-cols-2 gap-12">
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <Building2 className="w-4 h-4 text-white/30" />
                    <h2 className="text-xs tracking-[0.3em] font-medium text-white/50 uppercase">
                      {t("imprint.vat.title")}
                    </h2>
                  </div>
                  <div className="border-l border-white/10 pl-6">
                    <p className="text-white/30 text-sm italic">{t("imprint.vat.notApplicable")}</p>
                  </div>
                </section>
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <Building2 className="w-4 h-4 text-white/30" />
                    <h2 className="text-xs tracking-[0.3em] font-medium text-white/50 uppercase">
                      {t("imprint.hrb.title")}
                    </h2>
                  </div>
                  <div className="border-l border-white/10 pl-6">
                    <p className="text-white/30 text-sm italic">{t("imprint.hrb.notApplicable")}</p>
                  </div>
                </section>
              </div>
            )}

            <div className="w-full h-px bg-white/10" />

            {/* Legal disclaimer sections */}
            <div className="space-y-16">
              {/* Liability for content */}
              <section>
                <h2 className="text-xl tracking-[0.2em] font-medium text-white mb-8 uppercase border-l-2 border-white pl-6">
                  {t("imprint.disclaimer.title")}
                </h2>
                <div className="pl-6 md:pl-12 space-y-6">
                  <p className="text-white/50 text-lg leading-relaxed font-light">
                    {t("imprint.disclaimer.p1")}
                  </p>
                  <p className="text-white/50 text-lg leading-relaxed font-light">
                    {t("imprint.disclaimer.p2")}
                  </p>
                </div>
              </section>

              {/* Liability for links */}
              <section>
                <h2 className="text-xl tracking-[0.2em] font-medium text-white mb-8 uppercase border-l-2 border-white pl-6">
                  {t("imprint.linksDisclaimer.title")}
                </h2>
                <div className="pl-6 md:pl-12">
                  <p className="text-white/50 text-lg leading-relaxed font-light">
                    {t("imprint.linksDisclaimer.p1")}
                  </p>
                </div>
              </section>

              {/* Copyright */}
              <section>
                <h2 className="text-xl tracking-[0.2em] font-medium text-white mb-8 uppercase border-l-2 border-white pl-6">
                  {t("imprint.copyright.title")}
                </h2>
                <div className="pl-6 md:pl-12">
                  <p className="text-white/50 text-lg leading-relaxed font-light">
                    {t("imprint.copyright.p1")}
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}