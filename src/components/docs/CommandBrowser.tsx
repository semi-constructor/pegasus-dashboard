"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Terminal, Hash, Command as CommandIcon, ArrowRight } from "lucide-react";
import { CommandCategory, CommandItem, CommandParam } from "@/lib/docs";
import { useTranslations } from 'next-intl';

export default function CommandBrowser({ categories }: { categories: CommandCategory[] }) {
  const t = useTranslations('docs');
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.name || "");
  const [activeCommand, setActiveCommand] = useState<CommandItem | null>(null);

  const filteredCategories = categories.map(cat => {
    return {
      ...cat,
      commands: cat.commands.filter(cmd => 
        cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        cmd.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    };
  }).filter(cat => cat.commands.length > 0 || cat.name === activeCategory);

  const activeCategoryData = filteredCategories.find(c => c.name === activeCategory);

  useEffect(() => {
    if (activeCategoryData && activeCategoryData.commands.length > 0) {
      const isCurrentCommandInCategory = activeCategoryData.commands.some(c => c.name === activeCommand?.name);
      if (!isCurrentCommandInCategory) {
        setActiveCommand(activeCategoryData.commands[0]);
      }
    } else {
      setActiveCommand(null);
    }
  }, [activeCategory, activeCategoryData, activeCommand]);

  return (
    <div className="w-full min-h-[600px] flex flex-col md:flex-row relative border-border bg-background">
      
      {/* Categories Sidebar */}
      <div className="w-full md:w-64 bg-muted/30 border-b md:border-b-0 md:border-r border-border flex flex-col flex-shrink-0 z-10">
        <div className="p-6 border-b border-border">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/50 flex items-center gap-3">
            <Hash className="w-4 h-4" />
            {t('categories') || 'Modules'}
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1 scrollbar-none h-[300px] md:h-auto max-h-[40vh] md:max-h-none">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`w-full text-left px-4 py-3 text-sm font-medium transition-all duration-300 uppercase tracking-widest flex items-center justify-between group rounded-sm border border-transparent ${
                activeCategory === cat.name
                  ? "bg-foreground/10 text-foreground border-border/50"
                  : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              {cat.name}
              <ArrowRight className={`w-3 h-3 transition-transform duration-300 ${activeCategory === cat.name ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Commands List */}
      <div className="w-full md:w-72 bg-muted/10 border-b md:border-b-0 md:border-r border-border flex flex-col flex-shrink-0 z-10">
        <div className="p-5 border-b border-border flex items-center gap-3 relative group">
          <Search className="w-4 h-4 text-foreground/40 group-focus-within:text-foreground transition-colors" />
          <input
            type="text"
            placeholder={t('searchPlaceholder') || "SEARCH..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-foreground text-sm font-mono focus:outline-none focus:ring-0 placeholder:text-foreground/30 uppercase tracking-widest"
          />
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1 scrollbar-none h-[300px] md:h-auto max-h-[40vh] md:max-h-none">
          <AnimatePresence mode="wait">
            {activeCategoryData?.commands.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 text-center text-xs uppercase tracking-widest text-foreground/40"
              >
                No results
              </motion.div>
            ) : (
              <motion.div
                key={activeCategory}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.03 } }
                }}
              >
                {activeCategoryData?.commands.map((cmd) => (
                  <motion.button
                    variants={{
                      hidden: { opacity: 0, x: -5 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" } }
                    }}
                    key={cmd.name}
                    onClick={() => setActiveCommand(cmd)}
                    className={`w-full text-left p-4 transition-all duration-300 group rounded-sm border ${
                      activeCommand?.name === cmd.name
                        ? "bg-foreground/5 border-border shadow-sm"
                        : "border-transparent hover:bg-foreground/[0.02]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Terminal className={`w-3 h-3 ${activeCommand?.name === cmd.name ? "text-foreground" : "text-foreground/40 group-hover:text-foreground/70"}`} />
                      <span className={`text-sm font-semibold tracking-wide uppercase ${activeCommand?.name === cmd.name ? "text-foreground" : "text-foreground/70 group-hover:text-foreground"}`}>
                        /{cmd.name}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/50 line-clamp-2 uppercase tracking-wider leading-relaxed">
                      {cmd.description}
                    </p>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Details Pane */}
      <div className="flex-1 flex flex-col bg-background relative overflow-y-auto z-0">
        <AnimatePresence mode="wait">
          {activeCommand ? (
            <motion.div 
              key={activeCommand.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="p-8 md:p-12 lg:p-16 max-w-4xl mx-auto w-full"
            >
              <div className="mb-16">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground/50 mb-6 border border-border/50 px-3 py-1 bg-muted/30">
                  <CommandIcon className="w-3 h-3" />
                  COMMAND REFERENCE
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground uppercase mb-6 flex items-center gap-3">
                  <span className="text-foreground/30 font-light">/</span>{activeCommand.name}
                </h2>
                <p className="text-base md:text-lg text-foreground/60 tracking-wide font-light leading-relaxed max-w-2xl">
                  {activeCommand.description}
                </p>
              </div>

              {activeCommand.params && activeCommand.params.length > 0 && (
                <div className="mb-16">
                  <h3 className="text-sm font-semibold text-foreground/40 uppercase tracking-[0.1em] mb-6 border-b border-border pb-3 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-foreground/30 rounded-full" /> BASE ARGUMENTS
                  </h3>
                  <div className="space-y-3">
                    {activeCommand.params.map((param, i) => (
                      <ParamRow key={param.name} param={param} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {activeCommand.subcommands && activeCommand.subcommands.length > 0 && (
                <div className="space-y-12">
                  <h3 className="text-sm font-semibold text-foreground/40 uppercase tracking-[0.1em] mb-6 border-b border-border pb-3 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-foreground/30 rounded-full" /> SUBCOMMANDS
                  </h3>
                  {activeCommand.subcommands.map((sub, i) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + (i * 0.05), duration: 0.4, ease: "easeOut" }}
                      key={sub.name} 
                      className="bg-card border border-border p-6 md:p-8 rounded-lg shadow-sm"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <h4 className="text-lg md:text-xl text-foreground font-semibold tracking-wide uppercase flex items-center gap-2">
                          <span className="text-foreground/40 font-light">/{activeCommand.name}</span> {sub.name}
                        </h4>
                        {sub.isGroup && (
                          <span className="text-[10px] uppercase tracking-widest text-primary-foreground bg-primary px-2 py-1 rounded-sm font-bold">
                            GROUP
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-light text-foreground/60 mb-8 max-w-2xl leading-relaxed">
                        {sub.description}
                      </p>

                      {sub.params && sub.params.length > 0 && (
                        <div className="mb-8">
                          <h5 className="text-xs font-semibold text-foreground/40 uppercase tracking-[0.1em] mb-4">// OPTIONS</h5>
                          <div className="space-y-3">
                            {sub.params.map((param, idx) => (
                              <ParamRow key={param.name} param={param} index={idx} />
                            ))}
                          </div>
                        </div>
                      )}

                      {sub.subcommands && sub.subcommands.length > 0 && (
                        <div className="mt-8 pt-8 border-t border-border space-y-8">
                          {sub.subcommands.map(subsub => (
                            <div key={subsub.name} className="pl-6 border-l-2 border-border/50">
                              <h5 className="text-base text-foreground font-medium tracking-wide uppercase mb-3 flex items-center gap-2">
                                <span className="text-foreground/40 font-light">/{activeCommand.name} {sub.name}</span> {subsub.name}
                              </h5>
                              <p className="text-sm font-light text-foreground/50 mb-6 max-w-xl leading-relaxed">
                                {subsub.description}
                              </p>
                              
                              {subsub.params && subsub.params.length > 0 && (
                                <div className="space-y-3">
                                  {subsub.params.map((p, idx) => (
                                    <ParamRow key={p.name} param={p} index={idx} />
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
              
            </motion.div>
          ) : (
            <motion.div 
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-foreground/30 p-8"
            >
              <Terminal className="w-12 h-12 mb-6 opacity-20" />
              <p className="text-sm uppercase tracking-widest font-medium text-center">Select a Command</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ParamRow({ param, index }: { param: CommandParam; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="flex flex-col xl:flex-row xl:items-center gap-4 text-sm bg-muted/20 border border-border/50 p-4 rounded-md hover:border-border transition-colors"
    >
      <div className="flex items-center gap-3 min-w-[220px]">
        <span className="text-foreground font-mono text-xs md:text-sm font-medium">{param.name}</span>
        {param.required ? (
          <span className="text-[10px] text-primary-foreground bg-primary px-2 py-0.5 rounded-sm uppercase tracking-wider font-bold">REQ</span>
        ) : (
          <span className="text-[10px] text-muted-foreground border border-border px-2 py-0.5 rounded-sm uppercase tracking-wider">OPT</span>
        )}
      </div>
      <div className="text-foreground/50 font-mono text-xs w-24 tracking-wide">{param.type}</div>
      <div className="text-foreground/60 font-light flex-1 text-xs md:text-sm leading-relaxed">{param.description}</div>
    </motion.div>
  );
}
