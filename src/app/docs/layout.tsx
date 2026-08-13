import { MarketingLayout } from "@/components/MarketingLayout";
import Link from "next/link";
import { Book, Terminal, Settings, ShieldAlert, Cpu, Ticket, Activity, Download, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function DocsLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('docs');

  const navigation = [
    {
      title: t('gettingStarted') || "Getting Started",
      items: [
        { name: t('installation') || "Installation", href: "/docs/installation", icon: <Download className="w-4 h-4" /> },
        { name: t('dashboard') || "Dashboard", href: "/docs/dashboard", icon: <Settings className="w-4 h-4" /> },
      ],
    },
    {
      title: t('commandsReference') || "Commands Reference",
      items: [
        { name: t('commands') || "Commands", href: "/docs/commands", icon: <Terminal className="w-4 h-4" /> },
      ],
    },
    {
      title: t('modules') || "Modules",
      items: [
        { name: t('economy') || "Economy", href: "/docs/modules/economy", icon: <Cpu className="w-4 h-4" /> },
        { name: t('moderation') || "Moderation", href: "/docs/modules/moderation", icon: <ShieldAlert className="w-4 h-4" /> },
        { name: t('leveling') || "Leveling", href: "/docs/modules/leveling", icon: <Activity className="w-4 h-4" /> },
        { name: t('tickets') || "Tickets", href: "/docs/modules/tickets", icon: <Ticket className="w-4 h-4" /> },
      ],
    }
  ];

  return (
    <MarketingLayout>
      <div className="relative min-h-screen bg-background pt-32 pb-32">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row gap-12 relative z-10">
          
          {/* Docs Sidebar */}
          <aside className="md:w-64 flex-shrink-0 hidden md:block border-r border-border/50 pr-8">
            <Link href="/docs" className="flex items-center gap-3 text-foreground mb-12 hover:opacity-80 transition-opacity">
              <Book className="w-5 h-5" />
              <span className="font-medium tracking-widest uppercase text-sm">Documentation</span>
            </Link>

            <nav className="space-y-10">
              {navigation.map((group) => (
                <div key={group.title}>
                  <h4 className="text-[10px] font-semibold text-foreground/40 uppercase tracking-[0.2em] mb-4">
                    {group.title}
                  </h4>
                  <ul className="space-y-2">
                    {group.items.map((item) => (
                      <li key={item.name}>
                        <Link 
                          href={item.href}
                          className="flex items-center gap-3 text-sm text-foreground/60 hover:text-foreground hover:bg-foreground/[0.03] px-3 py-2 rounded-sm transition-colors"
                        >
                          <span className="text-foreground/40">{item.icon}</span>
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </MarketingLayout>
  );
}
