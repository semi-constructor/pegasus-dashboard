import { ReactNode } from"react";
export default async function GuildLayout({
 children,
 params,
}: {
 children: ReactNode;
 params: Promise<{ guildId: string }>;
}) {
 const resolvedParams = await params;
 return (
 <div className="flex-1 w-full h-full">
 {children}
 </div>
 );
}
