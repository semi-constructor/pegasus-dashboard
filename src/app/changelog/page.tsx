import { Box } from "lucide-react";
import { MarketingLayout } from "@/components/MarketingLayout";
import ChangelogClient from "./ChangelogClient";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Changelog - Pegasus Bot",
  description: "New updates, fixes, and improvements to Pegasus ecosystem.",
};

async function getChangelog() {
  const fetchCommits = async (repo: string) => {
    try {
      const res = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=15`, {
        next: { revalidate: 3600 }
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.map((commit: any) => ({
        id: commit.sha,
        type: 'commit',
        repo: repo,
        date: new Date(commit.commit.author.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timestamp: new Date(commit.commit.author.date).getTime(),
        title: commit.commit.message.split('\n')[0],
        hash: commit.sha.substring(0, 7),
        url: commit.html_url,
        labels: ['update']
      }));
    } catch {
      return [];
    }
  };

  const [pegasusCommits, dashboardCommits] = await Promise.all([
    fetchCommits('semi-constructor/pegasus'),
    fetchCommits('semi-constructor/pegasus-dashboard')
  ]);

  return [...pegasusCommits, ...dashboardCommits].sort((a, b) => b.timestamp - a.timestamp);
}

export default async function ChangelogPage() {
  const t = await getTranslations("changelog");
  const changelogItems = await getChangelog();

  return (
    <MarketingLayout>
      <div className="relative min-h-screen bg-background pt-48 pb-32 overflow-hidden selection:bg-foreground selection:text-background">
        {/* Architectural background lines */}
        <div className="absolute top-0 left-12 md:left-24 w-px h-full bg-foreground/[0.03]" />
        <div className="absolute top-0 right-12 md:right-24 w-px h-full bg-foreground/[0.03]" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-24">
          <div className="mb-24">
            <div className="inline-flex items-center text-foreground/30 text-xs tracking-[0.3em] uppercase mb-8 border border-border px-4 py-2">
              <Box className="w-4 h-4 mr-3" />
              // {t("productUpdates")}
            </div>
            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-foreground mb-6 uppercase">
              {t("title")}
            </h1>
            <p className="text-foreground/40 tracking-[0.1em] text-sm uppercase max-w-2xl">
              {t("subtitle")}
            </p>
          </div>

          <div className="w-full h-px bg-foreground/10 mb-24" />

          <ChangelogClient items={changelogItems} />
        </div>
      </div>
    </MarketingLayout>
  );
}
