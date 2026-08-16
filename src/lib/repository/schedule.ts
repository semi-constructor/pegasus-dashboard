import { getGuildContext } from "./guild";

export async function createScheduledGiveawayRepo(
  guildId: string,
  data: {
    prize: string;
    description?: string;
    channelId: string;
    duration: number; // in milliseconds
    winnerCount: number;
    startTime: string; // ISO string
  },
  hostedBy: string
) {
  const context = await getGuildContext(guildId);
  const apiUrl = context.isHosted ? context.apiUrl : (process.env.API_URL || "http://localhost:2000");
  const token = context.isHosted ? context.apiToken : process.env.BOT_API_TOKEN;

  if (!token) throw new Error("API Token is not defined");

  const res = await fetch(`${apiUrl}/guilds/${guildId}/giveaways`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...data,
      hostedBy,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "");
    throw new Error(`Bot API returned error: ${errorBody}`);
  }

  return await res.json();
}

export async function createScheduledTriviaRepo(
  guildId: string,
  data: {
    channelId: string;
    scheduledAt: string;
    rewardXp: number;
    rewardCoins: number;
    type?: "preset" | "custom";
    preset?: "general" | "gaming" | "programming" | "science" | "history" | "movies";
    questionCount?: number;
    questions?: Array<{ question: string; options: string[]; correctIndex: number }>;
  }
) {
  const context = await getGuildContext(guildId);
  const apiUrl = context.isHosted ? context.apiUrl : (process.env.API_URL || "http://localhost:2000");
  const token = context.isHosted ? context.apiToken : process.env.BOT_API_TOKEN;

  if (!token) throw new Error("API Token is not defined");

  const res = await fetch(`${apiUrl}/guilds/${guildId}/trivia`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "");
    throw new Error(`Bot API returned error: ${errorBody}`);
  }

  return await res.json();
}
