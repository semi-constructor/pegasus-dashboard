import { ReactNode } from "react";
import { requireGuildAdmin } from "@/lib/auth-guard";

export default async function GuildLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ guildId: string }>;
}) {
  const resolvedParams = await params;
  await requireGuildAdmin(resolvedParams.guildId);
  return (
    <div className="flex-1 w-full h-full">
      {children}
    </div>
  );
}
