import { Cpu } from "lucide-react";

export const metadata = {
  title: "Economy & Progression - Pegasus Docs",
  description: "Learn how to use the Economy module in Pegasus.",
};

export default function EconomyDocPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-24">
        <div className="inline-flex items-center text-foreground/30 text-xs tracking-[0.3em] uppercase mb-8 border border-border px-4 py-2">
          <Cpu className="w-4 h-4 mr-3 text-foreground/50" />
          // MODULE: ECONOMY
        </div>
        
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter text-foreground mb-6 uppercase leading-tight">Economy & Progression</h1>
        <p className="text-foreground/40 tracking-[0.1em] text-sm uppercase max-w-2xl leading-relaxed">Establish a thriving virtual economy on your server.</p>
      </div>

      <div className="w-full h-px bg-foreground/10 mb-24" />

      <div className="space-y-24 text-foreground/50 font-light leading-relaxed">
        <section>
          <h2 className="text-2xl tracking-[0.2em] font-medium text-foreground mb-8 uppercase border-l-2 border-border pl-6">
            Overview
          </h2>
          <div className="pl-6 md:pl-12">
            <p className="text-lg mb-8">
              The Economy module allows you to create custom currencies, run shop systems, and enable users to trade with each other. It includes deep integration with the leveling system to reward active members automatically.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
