'use client';

import { LevelingFeature } from './features/LevelingFeature';
import { EconomyFeature } from './features/EconomyFeature';
import { AutoModFeature } from './features/AutoModFeature';
import { JoinToCreateFeature } from './features/JoinToCreateFeature';
import { TicketsFeature } from './features/TicketsFeature';
import { ModerationFeature } from './features/ModerationFeature';
import { GiveawaysFeature } from './features/GiveawaysFeature';
import { WordFilteringFeature } from './features/WordFilteringFeature';
import { UtilityLanguageFeature } from './features/UtilityLanguageFeature';
import { EmbedsRolesFeature } from './features/EmbedsRolesFeature';
import { ApiFeature } from './features/ApiFeature';

export const FeatureShowcase = () => {
  return (
    <div id="features" className="w-full flex flex-col items-center py-32 bg-[#050505] relative z-20 overflow-hidden">
      
      {/* Timeline connector line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent -translate-x-1/2 hidden lg:block" />

      <div className="w-full flex flex-col gap-24 md:gap-40 relative">
        <ModerationFeature />
        <AutoModFeature />
        <WordFilteringFeature />
        <JoinToCreateFeature />
        <LevelingFeature />
        <EconomyFeature />
        <GiveawaysFeature />
        <TicketsFeature />
        <EmbedsRolesFeature />
        <UtilityLanguageFeature />
        <ApiFeature />
      </div>
    </div>
  );
};
