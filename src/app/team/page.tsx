"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { MarketingLayout } from "@/components/MarketingLayout";
import {
  Mail,
  Globe,
  ArrowUpRight,
  Code2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

type Member = {
  username: string;
  name: string;
  email: string | null;
  website: string | null;
  github: string | null;
  discordId: string;
  role: string;
  description: string;
  avatarUrl: string;
};

const initialMembers: Member[] = [
  {
    username: "semiconstructor",
    name: "Tony",
    email: "cptcr@proton.me",
    website: "https://semiconstructor.com",
    github: "https://github.com/semi-constructor",
    discordId: "931870926797160538",
    role: "Core Developer",
    description:
      "Passionate about software, technology, and creating things that didn’t exist before. Most of the time, there’s already another project in the works.",
    avatarUrl: "/usr/tony.png",
  },
  {
    username: "u.meloncrafter",
    name: "Lasse",
    email: null,
    website: "https://links.umserver.de/",
    github: "https://github.com/Ultra-Meloncrafter",
    discordId: "585530166932013060",
    role: "System Administrator",
    description:
      "Passionate about technology and infrastructure, with a natural curiosity for how things work. Enjoys experimenting, tinkering, and discovering new ways to build things.",
    avatarUrl: "/usr/lasse.gif",
  },
];

export default function TeamPage() {
  const t = useTranslations("team");
  const [members, setMembers] = useState<Member[]>(initialMembers);

  useEffect(() => {
    initialMembers.forEach((member, index) => {
      fetch(`/api/discord/user/${member.discordId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch Discord user");
          }

          return res.json();
        })
        .then((data) => {
          if (!data.avatarUrl) return;

          setMembers((prev) => {
            const next = [...prev];

            next[index] = {
              ...next[index],
              avatarUrl: data.avatarUrl,
            };

            return next;
          });
        })
        .catch(() => {
          // Keep fallback avatar.
        });
    });
  }, []);

  return (
    <MarketingLayout>
      <main className="relative min-h-screen overflow-hidden bg-black text-white">
        {/* Minimal background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-0 h-px w-full bg-white/[0.06]" />

          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
              `,
              backgroundSize: "100px 100px",
              maskImage:
                "linear-gradient(to bottom, black, transparent 75%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black, transparent 75%)",
            }}
          />
        </div>

        <div className="container relative z-10 mx-auto px-6 pb-32 pt-32 lg:px-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="mb-24 mt-16 max-w-4xl"
          >
            <div className="mb-8 inline-block border-b border-white/10 pb-4 text-sm uppercase tracking-[0.3em] text-white/30">
              // ARCHITECTS
            </div>

            <h1 className="mb-8 text-6xl font-medium leading-[0.9] tracking-tighter text-white md:text-8xl">
              {t("title")}
            </h1>

            <p className="max-w-2xl text-xl font-light leading-relaxed text-white/40 md:text-3xl">
              {t("description")}
            </p>
          </motion.div>

          {/* Team */}
          <div className="grid grid-cols-1 gap-px border border-white/10 bg-white/10 lg:grid-cols-2">
            {members.map((member, index) => (
              <motion.article
                key={member.username}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.15 + index * 0.1,
                  ease: "easeOut",
                }}
                className="group relative flex min-h-[590px] flex-col justify-between overflow-hidden bg-black p-8 sm:p-12 md:p-16"
              >
                {/* Minimal hover */}
                <div className="pointer-events-none absolute inset-0 bg-white/[0.015] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Top */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-8">
                    {/* Identity */}
                    <div>
                      <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-white/25">
                        @{member.username}
                      </p>

                      <h2 className="text-5xl font-medium tracking-tighter text-white md:text-6xl">
                        {member.name}
                      </h2>

                      <div className="mt-5 inline-block border border-white/15 px-3 py-1.5">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                          {member.role}
                        </span>
                      </div>
                    </div>

                    {/* Avatar */}
                    <div className="avatar-wrapper relative h-28 w-28 shrink-0 sm:h-36 sm:w-36 md:h-40 md:w-40">
                      <div className="pointer-events-none absolute -inset-5 bg-white/[0.04] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                      <div className="relative h-full w-full overflow-hidden border border-white/10 bg-[#090909]">
                        <Image
                          src={member.avatarUrl}
                          alt={member.name}
                          fill
                          sizes="160px"
                          className="avatar-image object-cover"
                          unoptimized={member.avatarUrl.startsWith("http")}
                        />

                        {/* Glitch layers */}
                        <div
                          className="avatar-glitch-red pointer-events-none absolute inset-0 opacity-0"
                          style={{
                            backgroundImage: `url("${member.avatarUrl}")`,
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            mixBlendMode: "screen",
                            filter:
                              "sepia(1) saturate(8) hue-rotate(310deg)",
                          }}
                        />

                        <div
                          className="avatar-glitch-blue pointer-events-none absolute inset-0 opacity-0"
                          style={{
                            backgroundImage: `url("${member.avatarUrl}")`,
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            mixBlendMode: "screen",
                            filter:
                              "sepia(1) saturate(8) hue-rotate(175deg)",
                          }}
                        />

                        <div className="avatar-scanlines pointer-events-none absolute inset-0 opacity-0" />

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    </div>
                  </div>

                  {/* Person description */}
                  <p className="mt-12 max-w-xl text-base font-light leading-relaxed text-white/45 md:text-lg">
                    {member.description}
                  </p>
                </div>

                {/* Bottom */}
                <div className="relative z-10 mt-16">
                  <div className="mb-7 h-px w-full bg-white/[0.08]" />

                  <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="group/link flex items-center text-sm uppercase tracking-widest text-white/35 transition-colors hover:text-white"
                      >
                        <Mail className="mr-3 h-4 w-4" />
                        Email
                        <ArrowUpRight className="ml-2 h-3 w-3 opacity-0 transition-all group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:opacity-100" />
                      </a>
                    )}

                    {member.website && (
                      <a
                        href={member.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link flex items-center text-sm uppercase tracking-widest text-white/35 transition-colors hover:text-white"
                      >
                        <Globe className="mr-3 h-4 w-4" />
                        Website
                        <ArrowUpRight className="ml-2 h-3 w-3 opacity-0 transition-all group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:opacity-100" />
                      </a>
                    )}

                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link flex items-center text-sm uppercase tracking-widest text-white/35 transition-colors hover:text-white"
                      >
                        <Code2 className="mr-3 h-4 w-4" />
                        GitHub
                        <ArrowUpRight className="ml-2 h-3 w-3 opacity-0 transition-all group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:opacity-100" />
                      </a>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <span className="font-mono text-[9px] tracking-[0.2em] text-white/10">
                      {member.discordId}
                    </span>
                  </div>
                </div>

                {/* Bottom hover line */}
                <div className="absolute bottom-0 left-0 h-px w-0 bg-white/30 transition-all duration-700 group-hover:w-full" />
              </motion.article>
            ))}
          </div>
        </div>

        {/* Avatar glitch */}
        <style jsx>{`
          .avatar-wrapper:hover .avatar-image {
            animation: avatar-stutter 420ms steps(7, end) both;
          }

          .avatar-wrapper:hover .avatar-glitch-red {
            animation: glitch-red 420ms steps(5, end) both;
          }

          .avatar-wrapper:hover .avatar-glitch-blue {
            animation: glitch-blue 420ms steps(5, end) both;
          }

          .avatar-wrapper:hover .avatar-scanlines {
            animation: scanlines 420ms steps(8, end) both;
          }

          .avatar-scanlines {
            background: repeating-linear-gradient(
              to bottom,
              transparent 0px,
              transparent 3px,
              rgba(255, 255, 255, 0.08) 4px,
              transparent 5px
            );
          }

          @keyframes avatar-stutter {
            0% {
              transform: translate(0, 0) scale(1);
            }

            12% {
              transform: translate(-3px, 1px) scale(1.015);
            }

            25% {
              transform: translate(4px, -1px) scale(0.995);
            }

            37% {
              transform: translate(-2px, 2px) scale(1.01);
            }

            50% {
              transform: translate(3px, -2px) scale(1);
            }

            62% {
              transform: translate(-4px, 0) scale(1.008);
            }

            75% {
              transform: translate(2px, 1px) scale(0.998);
            }

            87% {
              transform: translate(-1px, -1px) scale(1.005);
            }

            100% {
              transform: translate(0, 0) scale(1);
            }
          }

          @keyframes glitch-red {
            0%,
            100% {
              opacity: 0;
              transform: translateX(0);
            }

            15% {
              opacity: 0.2;
              transform: translateX(-4px);
            }

            30% {
              opacity: 0;
              transform: translateX(2px);
            }

            48% {
              opacity: 0.16;
              transform: translateX(-2px);
            }

            70% {
              opacity: 0;
              transform: translateX(3px);
            }
          }

          @keyframes glitch-blue {
            0%,
            100% {
              opacity: 0;
              transform: translateX(0);
            }

            20% {
              opacity: 0.18;
              transform: translateX(4px);
            }

            35% {
              opacity: 0;
              transform: translateX(-2px);
            }

            55% {
              opacity: 0.18;
              transform: translateX(3px);
            }

            75% {
              opacity: 0;
              transform: translateX(-3px);
            }
          }

          @keyframes scanlines {
            0% {
              opacity: 0;
              transform: translateY(-15%);
            }

            15% {
              opacity: 0.4;
            }

            40% {
              opacity: 0.1;
              transform: translateY(10%);
            }

            65% {
              opacity: 0.35;
              transform: translateY(-5%);
            }

            100% {
              opacity: 0;
              transform: translateY(15%);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .avatar-wrapper:hover .avatar-image,
            .avatar-wrapper:hover .avatar-glitch-red,
            .avatar-wrapper:hover .avatar-glitch-blue,
            .avatar-wrapper:hover .avatar-scanlines {
              animation: none;
            }
          }
        `}</style>
      </main>
    </MarketingLayout>
  );
}