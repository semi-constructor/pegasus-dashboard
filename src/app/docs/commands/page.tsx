import { parseCommandsDocs } from "@/lib/docs";
import CommandBrowser from "@/components/docs/CommandBrowser";
import { TerminalSquare } from "lucide-react";
import { getTranslations, getLocale } from 'next-intl/server';

export const metadata = {
  title: "Commands - Pegasus Bot",
  description: "Browse all commands available for Pegasus Bot",
};

export default async function CommandsDocPage() {
  const locale = await getLocale();
  const categories = parseCommandsDocs(locale);
  const t = await getTranslations('docs');
  
  return (
    <div className="w-full">
      <div className="mb-24">
        <div className="inline-flex items-center text-foreground/30 text-xs tracking-[0.3em] uppercase mb-8 border border-border px-4 py-2">
          <TerminalSquare className="w-4 h-4 mr-3 text-foreground/50" />
          // {t('commandsReference') || 'COMMAND REFERENCE'}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter text-foreground mb-6 uppercase leading-tight">
          {t('commands') || 'COMMANDS'}
        </h1>
        <p className="text-foreground/40 tracking-[0.1em] text-sm uppercase max-w-2xl leading-relaxed">
          {t('subtitle') || 'Browse all commands available for Pegasus Bot'}
        </p>
      </div>

      <div className="w-full h-px bg-foreground/10 mb-16" />

      {/* Browser */}
      <div className="border border-border bg-card p-2 w-full">
        <div className="border border-border p-2 md:p-4 w-full bg-background">
          <CommandBrowser categories={categories} />
        </div>
      </div>
    </div>
  );
}
