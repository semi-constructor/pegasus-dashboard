import { Star, Coins, Ticket, Gift } from "lucide-react";
import { formatCompactNumber } from "@/lib/utils";
import { OverviewUI } from "@/app/dashboard/[guildId]/overview-ui";

export default async function PreviewOverviewPage({ params }: { params: Promise<{ guildId: string }> }) {
  const resolvedParams = await params;
  const guildId = resolvedParams.guildId;
  // Hardcoded preview data that is deterministic
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'serverOverview': 'Server Overview',
      'totalXpCollected': 'TOTAL XP COLLECTED',
      'totalEconomyCollected': 'TOTAL ECONOMY COLLECTED',
      'openTickets': 'OPEN TICKETS',
      'activeGiveaways': 'ACTIVE GIVEAWAYS',
      'welcome': 'Welcome',
      'goodbye': 'Goodbye',
      'logging': 'Logging',
      'xpSystem': 'XP System',
      'levelUpRoles': 'Level Up Roles',
      'security': 'Security',
      'antiRaid': 'Anti-Raid',
      'antiSpam': 'Anti-Spam',
      'active': 'Active',
      'disabled': 'Disabled',
      'moduleStatus': 'Module Status',
      'moduleStatusDesc': 'Overview of currently enabled and disabled features.'
    };
    return translations[key] || key;
  };

  const stats = [
    { label: t('totalXpCollected'), value: formatCompactNumber(6140), icon: <Star className="w-5 h-5 text-foreground" /> },
    { label: t('totalEconomyCollected'), value: formatCompactNumber(117760), icon: <Coins className="w-5 h-5 text-foreground" /> },
    { label: t('openTickets'), value: "2", icon: <Ticket className="w-5 h-5 text-foreground" /> },
    { label: t('activeGiveaways'), value: "0", icon: <Gift className="w-5 h-5 text-foreground" /> },
  ];

  const modules = [
    { name: t('welcome'), enabled: true, path: "settings" },
    { name: t('goodbye'), enabled: true, path: "settings" },
    { name: t('logging'), enabled: true, path: "settings" },
    { name: t('xpSystem'), enabled: true, path: "xp" },
    { name: t('levelUpRoles'), enabled: true, path: "xp" },
    { name: t('security'), enabled: true, path: "settings" },
    { name: t('antiRaid'), enabled: true, path: "settings" },
    { name: t('antiSpam'), enabled: true, path: "settings" },
  ];

  return (
    <OverviewUI 
      guildName="CPTYX SOFTWARE"
      shardId={1}
      stats={stats}
      modules={modules}
      guildId={guildId || "123456789"}
      t={t}
    />
  );
}
