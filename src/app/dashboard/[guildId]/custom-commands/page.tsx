import { getGuildSettings } from '@/app/actions';
import CustomCommandsClient from './CustomCommandsClient';
import { StaggerContainer, StaggerItem } from '@/components/StaggerAnimations';
import { Terminal } from 'lucide-react';

export default async function CustomCommandsPage({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  const settings = await getGuildSettings(guildId);
  
  let initialCommands = [];
  try {
    initialCommands = JSON.parse(settings.customCommands || '[]');
  } catch (e) {
    initialCommands = [];
  }

  return (
    <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-16">
      <StaggerContainer>
        <StaggerItem>
          <div className="border-b border-white/5 pb-8">
            <div className="inline-flex items-center gap-2 border border-white/5 px-3 py-1 bg-white/[0.01] mb-4 text-xs font-mono tracking-wide text-neutral-400">
              <Terminal className="w-3.5 h-3.5 text-[#5E5CE6]" />
              <span>Custom Commands Module</span>
            </div>
            <h1 className="text-4xl font-light tracking-tight text-white mb-2">Manage Custom Commands</h1>
            <p className="text-sm text-neutral-400 font-mono tracking-wide">
              Create and manage server-specific custom commands. Define custom responses, names, and optional prefixes.
            </p>
          </div>
        </StaggerItem>

        <StaggerItem>
          <CustomCommandsClient guildId={guildId} initialCommands={initialCommands} />
        </StaggerItem>
      </StaggerContainer>
    </main>
  );
}
