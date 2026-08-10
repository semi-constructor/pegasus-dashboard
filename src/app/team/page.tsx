import React from 'react';
import { MarketingLayout } from '@/components/MarketingLayout';
import { Mail, Globe } from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

async function getDiscordUser(userId: string) {
  try {
    const res = await fetch(`https://discord.com/api/v10/users/${userId}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error(`Failed to fetch Discord user ${userId}:`, error);
  }
  return null;
}

export const metadata = {
  title: 'Team | Pegasus',
  description: 'Meet the team behind Pegasus Discord Bot.',
};

const teamMembers = [
  {
    username: 'semiconstructor',
    name: 'Tony',
    email: 'hello@semiconstructor.com',
    website: 'https://semiconstructor.com',
    discordId: '931870926797160538',
    role: 'Core Developer',
  },
  {
    username: 'u.meloncrafter',
    name: 'Lasse',
    email: null,
    website: 'https://links.umserver.de/',
    discordId: '585530166932013060',
    role: 'System Administrator',
  }
];

export default async function TeamPage() {
  // Fetch Discord data for all team members
  const membersWithDiscordData = await Promise.all(
    teamMembers.map(async (member) => {
      const discordData = await getDiscordUser(member.discordId);
      
      let avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${member.name}`;
      
      if (discordData && discordData.avatar) {
        const format = discordData.avatar.startsWith('a_') ? 'gif' : 'png';
        avatarUrl = `https://cdn.discordapp.com/avatars/${member.discordId}/${discordData.avatar}.${format}?size=512`;
      } else if (discordData) {
        const defaultAvatarNumber = parseInt(discordData.discriminator || "0") % 5;
        avatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
      }

      return {
        ...member,
        avatarUrl
      };
    })
  );

  const t = await getTranslations('team');

  return (
    <MarketingLayout>
      <div className="min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              {t('title')}
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              {t('description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {membersWithDiscordData.map((member) => (
              <div 
                key={member.username} 
                className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-32 h-32 mb-6 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/50 transition-colors">
                    <img
                      src={member.avatarUrl}
                      alt={`${member.name}'s avatar`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                  <div className="text-primary font-medium mb-4">{member.role}</div>
                  
                  <p className="text-white/50 text-sm mb-6">
                    @{member.username}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-auto">
                    {member.email && (
                      <a 
                        href={`mailto:${member.email}`}
                        className="p-3 rounded-full bg-white/5 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
                        title="Email"
                      >
                        <Mail className="w-5 h-5" />
                      </a>
                    )}
                    
                    {member.website && (
                      <a 
                        href={member.website.startsWith('http') ? member.website : `https://${member.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-full bg-white/5 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
                        title="Website"
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
