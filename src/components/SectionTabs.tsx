import Link from 'next/link';
import { ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

export function SectionTabs({ tabs, currentTab }: { tabs: TabItem[], currentTab: string }) {
  return (
    <div className="flex space-x-2 border-b border-white/5 mb-8 pb-px overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {tabs.map(tab => (
        <Link
          key={tab.id}
          href={`?tab=${tab.id}`}
          scroll={false}
          className={`flex items-center gap-2 px-6 py-3 text-xs font-mono tracking-wider uppercase transition-colors border-b-2 whitespace-nowrap ${
            currentTab === tab.id
              ? 'border-[#5E5CE6] text-white bg-[#5E5CE6]/10'
              : 'border-transparent text-neutral-500 hover:text-white hover:bg-white/5 hover:border-white/20'
          }`}
        >
          {tab.icon}
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
