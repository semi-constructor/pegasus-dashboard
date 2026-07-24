import { parseCommandsDocs } from "@/lib/docs";
import CommandBrowser from "@/components/docs/CommandBrowser";
import { Book } from "lucide-react";
import { MarketingLayout } from "@/components/MarketingLayout";

export const metadata = {
  title: "Commands - Pegasus Bot",
  description: "Browse all commands available for Pegasus Bot",
};

export default async function CommandsDocPage() {
  const categories = parseCommandsDocs();
  
  return (
    <MarketingLayout>
      <div className="relative overflow-hidden pt-20">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
              <Book className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-foreground">Commands Reference</h1>
              <p className="text-xs text-muted-foreground">Pegasus Discord Bot Documentation</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 py-12">
        <CommandBrowser categories={categories} />
      </div>
      </div>
    </MarketingLayout>
  );
}
