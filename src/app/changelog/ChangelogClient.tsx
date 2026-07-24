"use client";

import { useState } from "react";
import { GitCommit, Tag, GitBranch, ExternalLink } from "lucide-react";

export default function ChangelogClient({ items }: { items: any[] }) {
  const [filter, setFilter] = useState<string>("all");

  const filteredItems = items.filter(item => {
    if (filter === "all") return true;
    return item.repo === filter;
  });

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-wrap justify-center gap-2 mb-8 relative z-10">
        <button 
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
        >
          All Updates
        </button>
        <button 
          onClick={() => setFilter("semi-constructor/pegasus")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === "semi-constructor/pegasus" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
        >
          Pegasus Bot
        </button>
        <button 
          onClick={() => setFilter("semi-constructor/pegasus-dashboard")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === "semi-constructor/pegasus-dashboard" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
        >
          Dashboard
        </button>
      </div>

      <div className="relative border-l-2 border-border/50 ml-6 pl-8 space-y-16">
        {filteredItems.map(item => (
          <div key={item.id} className="relative">
            {/* Timeline dot */}
            <div className="absolute -left-[41px] bg-background border-4 border-background p-1 rounded-full">
              <div className={`w-3 h-3 rounded-full ${item.type === 'release' ? 'bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]' : 'bg-muted-foreground'}`} />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="text-sm font-medium text-muted-foreground">{item.date}</span>
                <a href={`https://github.com/${item.repo}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-muted/50 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <GitBranch className="w-3 h-3" />
                  {item.repo}
                </a>
                {item.labels.map((label: string) => (
                  <span key={label} className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    label === 'major' ? 'bg-purple-500/10 text-purple-400' :
                    label === 'bugfix' ? 'bg-red-500/10 text-red-400' :
                    label === 'feature' ? 'bg-green-500/10 text-green-400' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>
                    {label}
                  </span>
                ))}
              </div>

              {item.type === "release" ? (
                <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-5 h-5 text-primary" />
                    <h2 className="text-2xl font-bold text-foreground">{item.version} - {item.title}</h2>
                  </div>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ) : (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="bg-card/50 border border-border/30 rounded-lg p-4 group hover:border-border/80 transition-colors cursor-pointer block">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <GitCommit className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <h3 className="text-base font-medium text-foreground">{item.title}</h3>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="mt-2 pl-7 font-mono text-xs text-muted-foreground">
                    commit: {item.hash}
                  </div>
                </a>
              )}
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No updates found for this project.
          </div>
        )}
      </div>
    </div>
  );
}
