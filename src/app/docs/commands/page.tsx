import { parseCommandsDocs } from "@/lib/docs";
import CommandBrowser from "@/components/docs/CommandBrowser";
import { Book, ArrowRight } from "lucide-react";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getTranslations, getLocale } from 'next-intl/server';
import Link from "next/link";

export const metadata = {
  title: "Commands - Pegasus Bot",
  description: "Browse all commands available for Pegasus Bot",
};

export default async function CommandsDocPage() {
  const locale = await getLocale();
  const categories = parseCommandsDocs(locale);
  const t = await getTranslations('docs');
  
  return (
    <MarketingLayout>
      <div className="relative min-h-screen bg-black pt-48 pb-32 overflow-hidden selection:bg-white selection:text-black">
        {/* Architectural background lines */}
        <div className="absolute top-0 left-12 md:left-24 w-px h-full bg-white/[0.03]" />
        <div className="absolute top-0 right-12 md:right-24 w-px h-full bg-white/[0.03]" />
        
        <div className="max-w-6xl mx-auto px-6 lg:px-24 relative z-10">
          <div className="mb-24">
            <Link href="/docs" className="group inline-flex items-center text-xs tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors mb-16">
              <ArrowRight className="w-4 h-4 mr-4 rotate-180 opacity-50 group-hover:-translate-x-2 transition-transform" />
              Back to Documentation Index
            </Link>

            <div className="inline-flex items-center text-white/30 text-xs tracking-[0.3em] uppercase mb-8 border border-white/10 px-4 py-2">
              <Book className="w-4 h-4 mr-3 text-white/50" />
              // {t('commandsReference') || 'COMMAND REFERENCE'}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-white mb-6 uppercase leading-[0.9]">
              {t('commandsReference') || 'COMMANDS'}
            </h1>
            <p className="text-white/40 tracking-[0.1em] text-sm uppercase max-w-2xl leading-relaxed">
              {t('subtitle') || 'Browse all commands available for Pegasus Bot'}
            </p>
          </div>

          <div className="w-full h-px bg-white/10 mb-24" />

          {/* Browser */}
          <div className="border border-white/10 bg-[#050505] p-2">
            <div className="border border-white/10 p-6 md:p-12">
              <CommandBrowser categories={categories} />
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
