'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { EditorialNavBar } from '@/components/landing/EditorialNavBar';
import { CursorEffect } from '@/components/landing/CursorEffect';
import { Footer } from '@/components/landing/Footer';

export interface ChangelogEntry {
  id: string;
  repo: string;
  message: string;
  fullMessage?: string;
  date: string;
  url: string;
  authorName: string;
  authorAvatar?: string;
}

interface ChangelogClientProps {
  commits: ChangelogEntry[];
}

const CommitRow = ({ commit, index }: { commit: ChangelogEntry; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isBot = commit.repo === 'Pegasus Core';
  const hasMoreText = commit.fullMessage && commit.fullMessage.length > 0;

  const dateObj = new Date(commit.date);
  const monthDay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const time = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      layout
      className="flex flex-col md:flex-row gap-4 md:gap-12 w-full group py-8 border-b border-white/5 last:border-0 relative"
    >
      {/* Date Column (Sticky on Desktop) */}
      <div className="md:w-32 flex-shrink-0 pt-1">
        <div className="sticky top-32 text-neutral-500 font-mono text-sm">
          <div className="text-white font-medium mb-1">{monthDay}</div>
          <div className="text-xs">{time}</div>
        </div>
      </div>

      {/* Content Column */}
      <div className="flex-1 w-full relative">
        <div 
          onClick={() => hasMoreText && setIsExpanded(!isExpanded)}
          className={`w-full transition-all duration-300 ${hasMoreText ? 'cursor-pointer' : ''}`}
        >
          {/* Header Row */}
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest font-bold ${isBot ? 'bg-[#B026FF]/10 text-[#B026FF] border border-[#B026FF]/20' : 'bg-[#00E599]/10 text-[#00E599] border border-[#00E599]/20'}`}>
              {commit.repo}
            </span>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
              {commit.authorAvatar ? (
                <img src={commit.authorAvatar} alt={commit.authorName} className="w-4 h-4 rounded-full" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[8px] text-white">
                  {commit.authorName.charAt(0)}
                </div>
              )}
              {commit.authorName}
            </div>
            <a 
              href={commit.url} 
              target="_blank" 
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-neutral-600 hover:text-white transition-colors flex items-center gap-1 text-xs font-mono ml-auto"
            >
              {commit.id.substring(0, 7)}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Message Title */}
          <motion.h3 
            layout 
            className={`text-xl md:text-2xl font-light leading-snug text-white ${hasMoreText ? 'group-hover:text-[#B026FF] transition-colors duration-300' : ''}`}
          >
            {commit.message}
          </motion.h3>

          {/* Expandable Details */}
          <AnimatePresence>
            {isExpanded && hasMoreText && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-white/5 text-sm text-neutral-400 font-mono whitespace-pre-wrap leading-relaxed bg-[#0a0a0a] p-4 rounded-lg">
                  {commit.fullMessage}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Read More Trigger */}
          {hasMoreText && (
            <motion.div layout className="mt-4 flex items-center gap-1.5 text-xs font-mono text-neutral-500 group-hover:text-[#B026FF] transition-colors duration-300">
              {isExpanded ? (
                <><ChevronUp className="w-3 h-3" /> Show less</>
              ) : (
                <><ChevronDown className="w-3 h-3" /> Read full context</>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const ChangelogClient = ({ commits }: ChangelogClientProps) => {
  const [activeTab, setActiveTab] = useState<'all' | 'Pegasus Core' | 'Dashboard'>('all');

  const filteredCommits = commits.filter(c => activeTab === 'all' || c.repo === activeTab);

  return (
    <div className="w-full min-h-screen bg-[#050505] selection:bg-[#B026FF] selection:text-[#050505] font-sans overflow-x-hidden flex flex-col">
      <EditorialNavBar />
      <CursorEffect />
      
      <main className="flex-grow flex flex-col items-center pt-40 pb-32 px-6 relative z-10 w-full max-w-4xl mx-auto">
        
        {/* Minimal ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#B026FF]/5 to-transparent blur-[100px] pointer-events-none -z-10" />

        <div className="w-full text-left mb-16 border-b border-white/10 pb-12">
          <h1 className="text-5xl md:text-6xl font-light tracking-tight text-white leading-[1.1] mb-6">
            Changelog
          </h1>
          <p className="text-lg text-neutral-400 font-light leading-relaxed max-w-xl">
            A chronological timeline of structural updates to the Pegasus infrastructure. Directly synced from source control.
          </p>
        </div>

        {/* Tab Switcher (Linear style) */}
        <div className="w-full flex gap-6 mb-12 border-b border-white/5">
          {['all', 'Pegasus Core', 'Dashboard'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 text-sm font-medium transition-all duration-300 relative ${
                activeTab === tab 
                  ? 'text-white' 
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {tab === 'all' ? 'All Updates' : tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                />
              )}
            </button>
          ))}
        </div>

        {commits.length === 0 ? (
          <div className="w-full text-neutral-500 font-mono text-sm border border-white/5 p-8 rounded-xl bg-white/5">
            Unable to establish connection to the repository. The system might be rate-limited by the GitHub API. Check back later.
          </div>
        ) : (
          <div className="w-full relative">
            <motion.div layout className="flex flex-col w-full relative z-10">
              <AnimatePresence mode="popLayout">
                {filteredCommits.map((commit, i) => (
                  <CommitRow key={commit.id} commit={commit} index={i} />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};
