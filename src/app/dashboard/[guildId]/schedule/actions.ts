"use server";

import { requireGuildAdmin } from "@/lib/auth-guard";

export async function createScheduledGiveaway(
  guildId: string,
  data: {
    prize: string;
    description?: string;
    channelId: string;
    duration: number; // in milliseconds
    winnerCount: number;
    startTime: string; // ISO string
  }
) {
  const { session } = await requireGuildAdmin(guildId);
  const apiUrl = process.env.API_URL || "http://localhost:2000";
  const token = process.env.BOT_API_TOKEN;

  if (!token) throw new Error("BOT_API_TOKEN is not defined");

  // Call the Bot API
  const res = await fetch(`${apiUrl}/guilds/${guildId}/giveaways`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...data,
      hostedBy: session.user.id,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Bot API returned error: ${errorBody}`);
  }

  return await res.json();
}

export async function createScheduledTrivia(
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
  const { session } = await requireGuildAdmin(guildId);
  const apiUrl = process.env.API_URL || "http://localhost:2000";
  const token = process.env.BOT_API_TOKEN;

  if (!token) throw new Error("BOT_API_TOKEN is not defined");

  const res = await fetch(`${apiUrl}/guilds/${guildId}/trivia`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Bot API returned error: ${errorBody}`);
  }

  return await res.json();
}
