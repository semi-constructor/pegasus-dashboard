import EconomyClient from "@/app/dashboard/[guildId]/economy/_components/economy-client";

export default async function PreviewEconomyPage({ params }: { params: Promise<{ guildId: string }> }) {
  const resolvedParams = await params;
  const guildId = resolvedParams.guildId;
  const transactions = [
    {
      id: "1",
      guildId: guildId,
      userId: "1162064293865463871",
      amount: 100,
      type: "add",
      reason: "Daily Reward",
      createdAt: new Date()
    },
    {
      id: "2",
      guildId: guildId,
      userId: "1162064293865463871",
      amount: 50,
      type: "remove",
      reason: "Store Purchase",
      createdAt: new Date(Date.now() - 3600000)
    },
    {
      id: "3",
      guildId: guildId,
      userId: "987654321098765432",
      amount: 500,
      type: "add",
      reason: "Admin Granted",
      createdAt: new Date(Date.now() - 7200000)
    }
  ];

  const userBalances = [
    {
      id: "1",
      guildId: guildId,
      userId: "1162064293865463871",
      wallet: 1500,
      bank: 5000,
      totalEarned: 6500,
      lastDaily: new Date(),
      lastWeekly: new Date(),
      lastMonthly: new Date()
    },
    {
      id: "2",
      guildId: guildId,
      userId: "987654321098765432",
      wallet: 300,
      bank: 1000,
      totalEarned: 1300,
      lastDaily: new Date(),
      lastWeekly: new Date(),
      lastMonthly: new Date()
    }
  ];

  const settings = {
    guildId: guildId,
    currencyName: "Coins",
    currencySymbol: "🪙",
    dailyMin: 50,
    dailyMax: 100,
    weeklyMin: 200,
    weeklyMax: 500,
    monthlyMin: 1000,
    monthlyMax: 2000,
  };

  return (
    <EconomyClient 
      guildId={guildId || "123456789"}
      initialSettings={settings as any}
      initialShopItems={[]}
      initialUserBalances={userBalances as any}
      initialTransactions={transactions as any}
      roles={[]}
    />
  );
}
