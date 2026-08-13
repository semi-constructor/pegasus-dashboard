"use client";

import { useState } from "react";
import { GitCommit, GitBranch, ExternalLink, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

const itemVariants: any = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  },
  exit: { opacity: 0, x: 20 }
};

export default function ChangelogClient({ items }: { items: any[] }) {
  const t = useTranslations("changelog");
  const [filter, setFilter] = useState<string>("all");

  const filteredItems = items.filter(item => {
    if (filter === "all") return true;
    return item.repo === filter;
  });

  return (
    <div className="w-full relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap gap-4 mb-24 relative z-10 border-b border-border pb-6"
      >
        <button 
          onClick={() => setFilter("all")}
          className={`px-6 py-2 text-xs tracking-[0.2em] uppercase transition-colors border ${filter === "all" ? "border-border text-foreground bg-foreground/5" : "border-border text-foreground/30 hover:border-border/30 hover:text-foreground/70"}`}
        >
          {t("allUpdates")}
        </button>
        <button 
          onClick={() => setFilter("semi-constructor/pegasus")}
          className={`px-6 py-2 text-xs tracking-[0.2em] uppercase transition-colors border ${filter === "semi-constructor/pegasus" ? "border-border text-foreground bg-foreground/5" : "border-border text-foreground/30 hover:border-border/30 hover:text-foreground/70"}`}
        >
          {t("pegasusBot")}
        </button>
        <button 
          onClick={() => setFilter("semi-constructor/pegasus-dashboard")}
          className={`px-6 py-2 text-xs tracking-[0.2em] uppercase transition-colors border ${filter === "semi-constructor/pegasus-dashboard" ? "border-border text-foreground bg-foreground/5" : "border-border text-foreground/30 hover:border-border/30 hover:text-foreground/70"}`}
        >
          {t("dashboard")}
        </button>
      </motion.div>

      <div className="relative border-l border-border ml-2 pl-8 md:pl-16 space-y-12">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div 
              key={item.id} 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              className="relative"
            >
              {/* Timeline notch */}
              <div className="absolute -left-[32px] md:-left-[64px] top-4 w-4 border-t border-border/30" />
              <div className="absolute -left-[34px] md:-left-[66px] top-[14px] w-1.5 h-1.5 bg-foreground" />

              <div className="flex flex-col gap-3 group">
                <div className="flex flex-wrap items-center gap-4 mb-2">
                  <span className="text-xs font-mono text-foreground/40 tracking-widest">{item.date}</span>
                  <a href={`https://github.com/${item.repo}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1 border border-border text-[10px] font-mono tracking-widest text-foreground/40 hover:text-foreground transition-colors uppercase">
                    <GitBranch className="w-3 h-3" />
                    {item.repo}
                  </a>
                  {item.labels.map((label: string) => (
                    <span key={label} className="text-[10px] tracking-[0.2em] text-foreground/30 uppercase">
                      / {label}
                    </span>
                  ))}
                </div>

                {item.type === "release" ? (
                  <div className="border border-border p-8 hover:bg-foreground/[0.02] transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <Sparkles className="w-5 h-5 text-foreground/50" />
                      <h2 className="text-2xl font-medium text-foreground tracking-tighter uppercase">{item.version} - {item.title}</h2>
                    </div>
                    <p className="text-foreground/50 font-light text-lg leading-relaxed">{item.description}</p>
                  </div>
                ) : (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="block border border-border p-6 hover:border-border/30 hover:bg-foreground/[0.02] transition-colors group cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <GitCommit className="w-5 h-5 text-foreground/20 group-hover:text-foreground transition-colors" />
                        <h3 className="text-lg font-medium text-foreground/70 group-hover:text-foreground transition-colors tracking-tight uppercase">{item.title}</h3>
                      </div>
                      <ExternalLink className="w-4 h-4 text-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="mt-4 pl-9 font-mono text-xs text-foreground/20 tracking-[0.2em]">
                      COMMIT: <span className="text-foreground/40 group-hover:text-foreground transition-colors">{item.hash}</span>
                    </div>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-foreground/30 text-sm tracking-widest uppercase py-12"
          >
            {t("noUpdates")}
          </motion.div>
        )}
      </div>
    </div>
  );
}
