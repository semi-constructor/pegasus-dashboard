'use client';

import { motion } from 'framer-motion';
import { Terminal, Cpu, Database, Users } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/StaggerAnimations';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { InteractiveCard } from '@/components/InteractiveElements';
import { CinematicText } from '@/components/InteractiveElements';

interface MetricsSectionProps {
  stats: {
    users: { total: number };
    commands: { total_executed: number };
    guilds: { total: number };
    system: { latency: number };
  };
}

const metrics = [
  {
    key: 'users',
    icon: Users,
    getValue: (stats: MetricsSectionProps['stats']) => stats.users.total,
    label: 'Total Users',
    hoverColor: 'group-hover:text-white',
  },
  {
    key: 'commands',
    icon: Terminal,
    getValue: (stats: MetricsSectionProps['stats']) => stats.commands.total_executed,
    label: 'Commands Executed',
    hoverColor: 'group-hover:text-white',
  },
  {
    key: 'guilds',
    icon: Database,
    getValue: (stats: MetricsSectionProps['stats']) => stats.guilds.total,
    label: 'Active Guilds',
    hoverColor: 'group-hover:text-white',
  },
  {
    key: 'latency',
    icon: Cpu,
    getValue: (stats: MetricsSectionProps['stats']) => stats.system.latency,
    label: 'Heartbeat Ping',
    suffix: 'ms',
    hoverColor: 'group-hover:text-[#5E5CE6]',
  },
] as const;

export function MetricsSection({ stats }: MetricsSectionProps) {
  return (
    <section id="metrics" className="max-w-[1400px] mx-auto py-32 px-6">
      <StaggerContainer>
        {/* Header */}
        <StaggerItem>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8">
            {/* Left: label + title */}
            <div>
              <motion.span
                className="inline-block font-mono text-xs tracking-[0.3em] uppercase text-neutral-500 mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                {'// LIVE STATS'}
              </motion.span>
              <CinematicText
                text="Bot Status"
                className="text-4xl md:text-5xl font-light tracking-tight text-white"
              />
            </div>

            {/* Right: description */}
            <p className="text-neutral-500 text-sm md:text-base max-w-sm md:text-right leading-relaxed">
              Real-time statistics updated automatically from the bot.
            </p>
          </div>
        </StaggerItem>

        {/* Divider */}
        <StaggerItem>
          <div className="relative h-px w-full mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
          </div>
        </StaggerItem>

        {/* Metric cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const value = metric.getValue(stats);

            return (
              <StaggerItem key={metric.key}>
                <InteractiveCard>
                  <div className="p-6 md:p-8 flex flex-col gap-5">
                    {/* Icon */}
                    <Icon
                      className={`w-8 h-8 text-neutral-500 transition-colors duration-300 ${metric.hoverColor}`}
                    />

                    {/* Value */}
                    <div className="text-5xl font-light tracking-tight text-white">
                      <AnimatedCounter
                        value={value}
                        suffix={'suffix' in metric ? metric.suffix : ''}
                      />
                    </div>

                    {/* Label */}
                    <span className="font-mono text-xs uppercase tracking-wider text-neutral-500">
                      {metric.label}
                    </span>
                  </div>
                </InteractiveCard>
              </StaggerItem>
            );
          })}
        </div>
      </StaggerContainer>
    </section>
  );
}
