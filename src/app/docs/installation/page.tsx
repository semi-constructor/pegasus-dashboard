import { Server, Terminal, Settings, Download, FileJson } from "lucide-react";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Installation Guide - Pegasus",
  description: "Learn how to self-host and deploy the Pegasus Bot and Dashboard.",
};

export default function InstallationDocPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-24">
        <div className="inline-flex items-center text-foreground/30 text-xs tracking-[0.3em] uppercase mb-8 border border-border px-4 py-2">
          <Download className="w-4 h-4 mr-3 text-foreground/50" />
          // INSTALLATION
        </div>
        
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter text-foreground mb-6 uppercase leading-tight">Installation Guide</h1>
        <p className="text-foreground/40 tracking-[0.1em] text-sm uppercase max-w-2xl leading-relaxed">Self-host Pegasus on your own infrastructure using Docker, Podman, or Pterodactyl.</p>
      </div>

      <div className="w-full h-px bg-foreground/10 mb-24" />

      <div className="space-y-32">
        
        <section>
          <h2 className="text-2xl tracking-[0.2em] font-medium text-foreground mb-8 uppercase border-l-2 border-border pl-6 flex items-center">
            Architecture Overview
          </h2>
          <div className="pl-6 md:pl-12">
            <p className="text-foreground/50 text-lg leading-relaxed font-light">
              Pegasus is split into two primary components: the <strong className="text-foreground font-medium">Discord Bot</strong> and the <strong className="text-foreground font-medium">Next.js Dashboard</strong>. Both components share a PostgreSQL database but can be run completely independently if desired.
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-8 border-l-2 border-border pl-6">
            <h2 className="text-2xl tracking-[0.2em] font-medium text-foreground uppercase">
              The One-Command Installer
            </h2>
            <span className="text-[10px] tracking-widest uppercase border border-border text-foreground/70 px-3 py-1">Recommended</span>
          </div>
          <div className="pl-6 md:pl-12">
            <p className="text-foreground/50 text-lg leading-relaxed font-light mb-8">
              The easiest way to deploy the entire stack is via our interactive bash script. It clones the repositories, prompts for tokens, and orchestrates everything via Docker Compose or Podman Compose.
            </p>
            <div className="bg-muted/30 p-6 border border-border font-mono text-sm text-foreground/70 overflow-x-auto selection:bg-foreground selection:text-background">
              bash &lt;(curl -sL https://raw.githubusercontent.com/semi-constructor/pegasus/main/install.sh)
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl tracking-[0.2em] font-medium text-foreground mb-8 uppercase border-l-2 border-border pl-6">
            Manual Setup (Docker / Podman)
          </h2>
          <div className="pl-6 md:pl-12 space-y-16">
            <p className="text-foreground/50 text-lg leading-relaxed font-light">
              If you prefer to manage the containers yourself using <strong className="text-foreground font-medium">Docker</strong> or <strong className="text-foreground font-medium">Podman</strong>, follow these steps:
            </p>
            
            <div>
              <h3 className="font-medium tracking-[0.1em] text-foreground uppercase mb-6 text-sm">1. Clone & Configure</h3>
              <div className="bg-[#050505] p-6 border border-border font-mono text-sm text-foreground/70 leading-loose mb-6">
                git clone https://github.com/semi-constructor/pegasus.git<br/>
                cd pegasus<br/>
                cp .env.example .env
              </div>
              <p className="text-sm text-foreground/40 font-light">Edit your <code className="text-foreground font-mono">.env</code> file to include your Discord tokens and Database URL.</p>
            </div>

            <div>
              <h3 className="font-medium tracking-[0.1em] text-foreground uppercase mb-6 text-sm">2. Start the Stack</h3>
              <div className="bg-[#050505] p-6 border border-border font-mono text-sm text-foreground/70 leading-loose mb-4">
                # For Docker<br/>
                docker compose up -d<br/>
                <br/>
                # For Podman<br/>
                podman-compose up -d
              </div>
            </div>

            <div>
              <h3 className="font-medium tracking-[0.1em] text-foreground uppercase mb-6 text-sm">Individual Setup</h3>
              <p className="text-foreground/50 text-lg leading-relaxed font-light mb-6">
                If you only want to run the bot or only the dashboard (assuming your database is hosted externally), you can target specific profiles in the compose file:
              </p>
              <div className="bg-[#050505] p-6 border border-border font-mono text-sm text-foreground/70 leading-loose">
                # Start only the bot<br/>
                docker compose --profile bot up -d<br/>
                <br/>
                # Start only the dashboard<br/>
                docker compose --profile dashboard up -d
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl tracking-[0.2em] font-medium text-foreground mb-8 uppercase border-l-2 border-border pl-6">
            Pterodactyl & Coolify
          </h2>
          <div className="pl-6 md:pl-12">
            <p className="text-foreground/50 text-lg leading-relaxed font-light mb-8">
              Pegasus fully supports deployment via <strong className="text-foreground font-medium">Pterodactyl</strong> and <strong className="text-foreground font-medium">Coolify</strong>. 
            </p>
            
            <div className="border border-border bg-[#050505] p-6 mb-8 flex items-center justify-between hover:bg-foreground/[0.02] transition-colors group">
              <div className="flex items-center gap-4">
                <FileJson className="w-6 h-6 text-foreground/50 group-hover:text-foreground transition-colors" />
                <div>
                  <h4 className="text-foreground font-medium tracking-[0.1em] uppercase text-sm mb-1">Pterodactyl Egg</h4>
                  <p className="text-foreground/40 text-xs">Download the official egg.json for Pterodactyl panels.</p>
                </div>
              </div>
              <a href="/deploy/egg.json" download className="text-xs uppercase tracking-widest border border-border text-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors">
                Download
              </a>
            </div>

            <p className="text-foreground/50 text-lg leading-relaxed font-light">
              When using shared hosting, ensure you set the <code className="font-mono text-foreground">RATE_LIMIT_WINDOW</code> and <code className="font-mono text-foreground">RATE_LIMIT_MAX_REQUESTS</code> environment variables to prevent API abuse.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
