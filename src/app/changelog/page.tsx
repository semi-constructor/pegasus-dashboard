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
      <div className="max-w-4xl mx-auto px-8 py-32 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Box className="w-4 h-4" />
            {t("productUpdates")}
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-foreground">{t("title")}</h1>
          <p className="text-xl text-muted-foreground">{t("subtitle")}</p>
        </div>

        <ChangelogClient items={changelogItems} />
      </div>
    </MarketingLayout>
  );
}
