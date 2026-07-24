"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Terminal, Hash, ChevronDown } from "lucide-react";
import { CommandCategory, CommandItem, CommandParam } from "@/lib/docs";

export default function CommandBrowser({ categories }: { categories: CommandCategory[] }) {
 const [searchQuery, setSearchQuery] = useState("");
 const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.name || "");

 const filteredCategories = categories.map(cat => {
 return {
 ...cat,
 commands: cat.commands.filter(cmd => 
 cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
 cmd.description.toLowerCase().includes(searchQuery.toLowerCase())
 )
 };
 }).filter(cat => cat.commands.length > 0 || cat.name === activeCategory);

 return (
 <div className="flex flex-col md:flex-row gap-8 w-full max-w-7xl mx-auto">
 {/* Sidebar */}
 <div className="w-full md:w-64 flex-shrink-0">
 <div className="sticky top-24 p-4 rounded-xl space-y-4 border border-border bg-card/50 backdrop-blur-md">
 <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
 <Hash className="w-5 h-5 text-primary"/>
 Categories
 </h3>
 <div className="space-y-1">
 {categories.map((cat) => (
 <button
 key={cat.name}
 onClick={() => setActiveCategory(cat.name)}
 className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
 activeCategory === cat.name
 ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.2)]"
 : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
 }`}
 >
 {cat.name}
 </button>
 ))}
 </div>
 </div>
 </div>

 {/* Main Content */}
 <div className="flex-1 space-y-6">
 <div className="p-2 rounded-xl flex items-center gap-3 border border-border bg-card/50 backdrop-blur-md relative overflow-hidden">
 <Search className="w-5 h-5 text-primary ml-2"/>
 <input
 type="text"
 placeholder="Search commands..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="flex-1 bg-transparent border-none text-foreground focus:outline-none focus:ring-0 placeholder:text-muted-foreground py-1"
 />
 </div>

 <div className="space-y-6">
 {filteredCategories.find(c => c.name === activeCategory)?.commands.length === 0 && (
 <div className="text-center py-12 text-muted-foreground rounded-xl border border-border bg-card/50 backdrop-blur-md">
 No commands found matching "{searchQuery}" in {activeCategory}.
 </div>
 )}
 <AnimatePresence mode="popLayout">
 {filteredCategories
 .find(c => c.name === activeCategory)
 ?.commands.map((cmd) => (
 <CommandCard key={cmd.name} command={cmd} />
 ))}
 </AnimatePresence>
 </div>
 </div>
 </div>
 );
}

function CommandCard({ command }: { command: CommandItem }) {
 const [expanded, setExpanded] = useState(false);
 
 return (
 <motion.div
 layout
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95 }}
 className="rounded-xl border border-border overflow-hidden bg-card/50 backdrop-blur-md"
 >
 <div 
 className="p-5 cursor-pointer hover:bg-secondary/50 transition-colors flex items-center justify-between"
 onClick={() => setExpanded(!expanded)}
 >
 <div className="space-y-1">
 <div className="flex items-center gap-2">
 <Terminal className="w-5 h-5 text-primary"/>
 <h4 className="text-xl font-bold text-foreground">/{command.name}</h4>
 </div>
 <p className="text-muted-foreground text-sm">{command.description}</p>
 </div>
 <div className="flex items-center gap-4 text-muted-foreground">
 {(command.subcommands?.length || 0) > 0 && (
 <span className="text-xs bg-secondary px-2 py-1 rounded-full border border-border">
 {command.subcommands?.length} Subcommands
 </span>
 )}
 <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
 <ChevronDown className="w-5 h-5"/>
 </motion.div>
 </div>
 </div>

 <AnimatePresence>
 {expanded && (
 <motion.div
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: "auto", opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 className="border-t border-border bg-background/50"
 >
 <div className="p-5 space-y-6">
 {command.params.length > 0 && (
 <div>
 <h5 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">Options</h5>
 <div className="space-y-2">
 {command.params.map(param => (
 <ParamRow key={param.name} param={param} />
 ))}
 </div>
 </div>
 )}

 {command.subcommands?.map(sub => (
 <div key={sub.name} className="bg-secondary/30 rounded-lg border border-border/50 p-4 space-y-3">
 <div className="flex items-center gap-2">
 <span className="text-primary font-medium">
 /{command.name} {sub.name}
 </span>
 {sub.isGroup && (
 <span className="text-[10px] uppercase tracking-wide bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
 Group
 </span>
 )}
 </div>
 <p className="text-sm text-muted-foreground">{sub.description}</p>
 
 {sub.params && sub.params.length > 0 && (
 <div className="mt-3 pl-4 border-l border-border space-y-2">
 {sub.params.map(param => (
 <ParamRow key={param.name} param={param} />
 ))}
 </div>
 )}

 {sub.subcommands && sub.subcommands.length > 0 && (
 <div className="mt-4 space-y-2">
 {sub.subcommands.map(subsub => (
 <div key={subsub.name} className="pl-4 border-l border-border py-2">
 <div className="text-sm text-primary font-medium mb-1 flex items-center gap-2">
 <span className="opacity-50">/{command.name} {sub.name}</span> {subsub.name}
 </div>
 <p className="text-xs text-muted-foreground mb-2">{subsub.description}</p>
 <div className="space-y-2">
 {subsub.params && subsub.params.map(p => (
 <ParamRow key={p.name} param={p} />
 ))}
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 ))}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </motion.div>
 );
}

function ParamRow({ param }: { param: CommandParam }) {
 return (
 <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm bg-background p-2.5 rounded-md border border-border/50">
 <div className="flex items-center gap-2 min-w-[150px]">
 <span className="text-foreground font-medium">{param.name}</span>
 {param.required ? (
 <span className="text-[10px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded uppercase font-bold tracking-wider border border-destructive/20">Req</span>
 ) : (
 <span className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded uppercase font-bold tracking-wider border border-border/50">Opt</span>
 )}
 </div>
 <div className="text-primary/80 text-xs w-16">{param.type}</div>
 <div className="text-foreground flex-1">{param.description}</div>
 </div>
 );
}
