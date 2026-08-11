"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Terminal, ChevronRight, Hash, Command as CommandIcon } from "lucide-react";
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

  // Auto-select first command when category changes if no active command is set
  // or if the active command is not in the current category
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
    <div className="w-full max-w-[1600px] mx-auto border border-white/10 bg-[#020202] flex flex-col md:flex-row h-[800px] overflow-hidden">
      
      {/* LEFT PANE: Categories */}
      <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 flex flex-col bg-[#050505] flex-shrink-0">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50 flex items-center gap-2">
            <Hash className="w-3 h-3" />
            MODULES
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-px">
          {categories.map((cat, index) => (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`w-full text-left px-4 py-3 text-xs font-medium transition-all duration-300 uppercase tracking-widest flex items-center justify-between group ${
                activeCategory === cat.name
                  ? "bg-white text-black"
                  : "text-white/40 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              {cat.name}
              {activeCategory === cat.name && <ChevronRight className="w-3 h-3" />}
            </motion.button>
          ))}
        </div>
      </div>

      {/* MIDDLE PANE: Command List */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-white/10 flex flex-col bg-[#050505] flex-shrink-0">
        <div className="p-4 border-b border-white/10 flex items-center gap-3 relative focus-within:bg-white/[0.02] transition-colors">
          <Search className="w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder={t('searchPlaceholder') || "SEARCH..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-white text-xs font-mono focus:outline-none focus:ring-0 placeholder:text-white/20 uppercase tracking-widest py-2"
          />
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-px">
          <AnimatePresence mode="wait">
            {activeCategoryData?.commands.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 text-center text-[10px] uppercase tracking-widest text-white/30"
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
                  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
                }}
              >
                {activeCategoryData?.commands.map((cmd) => (
                  <motion.button
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }
                    }}
                    key={cmd.name}
                    onClick={() => setActiveCommand(cmd)}
                    className={`w-full text-left p-4 transition-all duration-300 group border border-transparent ${
                      activeCommand?.name === cmd.name
                        ? "bg-white/[0.05] border-white/10"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Terminal className={`w-3 h-3 ${activeCommand?.name === cmd.name ? "text-white" : "text-white/30 group-hover:text-white"}`} />
                      <span className={`text-sm font-medium tracking-widest uppercase ${activeCommand?.name === cmd.name ? "text-white" : "text-white/60 group-hover:text-white"}`}>
                        /{cmd.name}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/30 line-clamp-2 uppercase tracking-widest leading-relaxed">
                      {cmd.description}
                    </p>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT PANE: Command Details */}
      <div className="flex-1 flex flex-col bg-black relative overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeCommand ? (
            <motion.div 
              key={activeCommand.name}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="p-8 md:p-12 lg:p-16 max-w-4xl"
            >
              <div className="mb-16">
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                  className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/30 mb-8 border border-white/10 px-3 py-1 overflow-hidden whitespace-nowrap"
                >
                  <CommandIcon className="w-3 h-3" />
                  COMMAND REFERENCE
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-white uppercase mb-6 flex items-center gap-4">
                  <span className="text-white/20">/</span>{activeCommand.name}
                </h2>
                <p className="text-base text-white/40 tracking-widest font-light leading-relaxed max-w-2xl">
                  {activeCommand.description}
                </p>
              </div>

              {/* Base Command Params */}
              {activeCommand.params && activeCommand.params.length > 0 && (
                <div className="mb-16">
                  <h3 className="text-[10px] font-medium text-white/30 uppercase tracking-[0.2em] mb-6 border-b border-white/10 pb-4">
                    // BASE ARGUMENTS
                  </h3>
                  <div className="space-y-px bg-white/10">
                    {activeCommand.params.map((param, i) => (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + (i * 0.1), duration: 0.5, ease: "easeOut" }}
                        key={param.name}
                      >
                        <ParamRow param={param} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subcommands */}
              {activeCommand.subcommands && activeCommand.subcommands.length > 0 && (
                <div className="space-y-12">
                  <h3 className="text-[10px] font-medium text-white/30 uppercase tracking-[0.2em] border-b border-white/10 pb-4">
                    // SUBCOMMANDS
                  </h3>
                  {activeCommand.subcommands.map((sub, i) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + (i * 0.1), duration: 0.6, ease: "easeOut" }}
                      key={sub.name} 
                      className="border border-white/10 p-8 hover:bg-white/[0.01] transition-colors"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <h4 className="text-lg text-white font-medium tracking-widest uppercase flex items-center gap-2">
                          <span className="text-white/30">/{activeCommand.name}</span> {sub.name}
                        </h4>
                        {sub.isGroup && (
                          <span className="text-[9px] uppercase tracking-[0.2em] text-white/50 border border-white/20 px-2 py-0.5">
                            GROUP
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-light text-white/40 mb-8 max-w-2xl">
                        {sub.description}
                      </p>

                      {/* Subcommand Params */}
                      {sub.params && sub.params.length > 0 && (
                        <div className="mb-8">
                          <h5 className="text-[9px] font-medium text-white/30 uppercase tracking-[0.2em] mb-4">// OPTIONS</h5>
                          <div className="space-y-px bg-white/10">
                            {sub.params.map(param => (
                              <ParamRow key={param.name} param={param} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sub-subcommands (Groups) */}
                      {sub.subcommands && sub.subcommands.length > 0 && (
                        <div className="mt-8 pt-8 border-t border-white/10 space-y-8">
                          {sub.subcommands.map(subsub => (
                            <div key={subsub.name} className="pl-6 border-l border-white/20">
                              <h5 className="text-sm text-white font-medium tracking-widest uppercase mb-4 flex items-center gap-2">
                                <span className="text-white/30">/{activeCommand.name} {sub.name}</span> {subsub.name}
                              </h5>
                              <p className="text-xs font-light text-white/40 mb-6">
                                {subsub.description}
                              </p>
                              
                              {subsub.params && subsub.params.length > 0 && (
                                <div className="space-y-px bg-white/10">
                                  {subsub.params.map(p => (
                                    <ParamRow key={p.name} param={p} />
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
              
              <div className="mt-32 pt-16 border-t border-white/10 flex items-center justify-between text-[10px] uppercase tracking-widest text-white/30">
                <span>Pegasus Terminal</span>
                <span>v1.0</span>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col items-center justify-center text-white/20"
            >
              <CommandIcon className="w-12 h-12 mb-6 opacity-20" />
              <p className="text-[10px] uppercase tracking-[0.3em]">Awaiting Command Selection</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ParamRow({ param }: { param: CommandParam }) {
  const t = useTranslations('docs');
  return (
    <div className="flex flex-col xl:flex-row xl:items-center gap-4 text-sm bg-black p-4 md:p-6 hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center gap-4 min-w-[240px]">
        <span className="text-white font-mono text-xs uppercase tracking-widest">{param.name}</span>
        {param.required ? (
          <span className="text-[9px] text-white/70 px-1.5 py-0.5 border border-white/30 uppercase tracking-[0.2em]">REQ</span>
        ) : (
          <span className="text-[9px] text-white/30 px-1.5 py-0.5 border border-white/10 uppercase tracking-[0.2em]">OPT</span>
        )}
      </div>
      <div className="text-white/50 font-mono text-[10px] w-24 tracking-widest uppercase">{param.type}</div>
      <div className="text-white/40 font-light flex-1 text-xs md:text-sm leading-relaxed tracking-wide">{param.description}</div>
    </div>
  );
}
