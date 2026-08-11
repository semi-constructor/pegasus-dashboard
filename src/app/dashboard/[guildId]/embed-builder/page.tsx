"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2, Send, Save, Palette, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function EmbedBuilderPage({ params }: { params: { guildId: string } }) {
  const [isSending, setIsSending] = useState(false);
  const [embed, setEmbed] = useState({
    authorName: "",
    authorUrl: "",
    authorIcon: "",
    title: "Welcome to our Server!",
    titleUrl: "",
    description: "This is a rich embed preview.\\nYou can edit all these fields on the left.",
    color: "#5865F2",
    thumbnail: "",
    image: "",
    footerText: "Pegasus Bot",
    footerIcon: "",
  });

  const [channel, setChannel] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmbed((prev) => ({ ...prev, [name]: value }));
  };

  const handleSend = async () => {
    if (!channel) {
      toast.error("Please select a channel first");
      return;
    }
    
    setIsSending(true);
    try {
      const res = await fetch(`http://localhost:3001/api/guilds/${params.guildId}/embed`, {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}` 
        },
        body: JSON.stringify({
          channelId: channel,
          embed: embed
        })
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Embed sent successfully to channel!");
      } else {
        toast.error(data.error || "Failed to send embed");
      }
    } catch (e) {
      toast.error("Error connecting to bot API");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Interactive Embed Builder</h1>
        <p className="text-muted-foreground">Design rich Discord messages with a live preview and send them to specific channels.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        {/* Editor Form */}
        <div className="lg:col-span-5 space-y-6 overflow-y-auto pr-2 pb-20">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Embed Color</Label>
                <div className="flex gap-2">
                  <Input type="color" name="color" value={embed.color} onChange={handleChange} className="w-16 h-10 p-1 cursor-pointer" />
                  <Input type="text" name="color" value={embed.color} onChange={handleChange} className="flex-1 font-mono" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-primary" />
                Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Author Name</Label>
                <Input name="authorName" value={embed.authorName} onChange={handleChange} placeholder="e.g. Server Admin" />
              </div>
              <div className="space-y-2">
                <Label>Author Icon URL</Label>
                <Input name="authorIcon" value={embed.authorIcon} onChange={handleChange} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input name="title" value={embed.title} onChange={handleChange} placeholder="Embed Title" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea name="description" value={embed.description} onChange={handleChange} placeholder="Embed Description..." className="min-h-[120px]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Thumbnail URL</Label>
                <Input name="thumbnail" value={embed.thumbnail} onChange={handleChange} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input name="image" value={embed.image} onChange={handleChange} placeholder="https://..." />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Footer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Footer Text</Label>
                <Input name="footerText" value={embed.footerText} onChange={handleChange} placeholder="Footer text" />
              </div>
              <div className="space-y-2">
                <Label>Footer Icon URL</Label>
                <Input name="footerIcon" value={embed.footerIcon} onChange={handleChange} placeholder="https://..." />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview & Send Actions */}
        <div className="lg:col-span-7 flex flex-col gap-6 sticky top-6">
          <Card className="bg-[#313338] border-none text-[#dbdee1] overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-[#2b2d31] bg-[#2b2d31]/50 pb-4">
              <CardTitle className="text-sm font-medium text-slate-300">Live Discord Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#5865F2] flex-shrink-0 flex items-center justify-center">
                  <Wand2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-medium text-white">Pegasus</span>
                    <span className="bg-[#5865F2] text-xs px-1.5 py-0.5 rounded text-white font-medium flex items-center gap-1">
                      <CheckCircleIcon className="w-3 h-3" /> APP
                    </span>
                    <span className="text-xs text-[#949ba4]">Today at {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  
                  {/* The Embed Box */}
                  <div className="flex">
                    <div className="w-1 rounded-l-md flex-shrink-0" style={{ backgroundColor: embed.color || '#202225' }} />
                    <div className="bg-[#2b2d31] p-4 rounded-r-md max-w-[520px] flex-1">
                      {/* Author */}
                      {(embed.authorName || embed.authorIcon) && (
                        <div className="flex items-center gap-2 mb-2">
                          {embed.authorIcon && <img src={embed.authorIcon} alt="author" className="w-6 h-6 rounded-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />}
                          {embed.authorName && <span className="font-medium text-white text-sm">{embed.authorName}</span>}
                        </div>
                      )}
                      
                      <div className="flex gap-4">
                        <div className="flex-1">
                          {/* Title */}
                          {embed.title && (
                            <div className="font-semibold text-white mb-2 leading-tight">
                              {embed.title}
                            </div>
                          )}
                          
                          {/* Description */}
                          {embed.description && (
                            <div className="text-sm text-[#dbdee1] whitespace-pre-wrap leading-relaxed">
                              {embed.description}
                            </div>
                          )}
                        </div>
                        
                        {/* Thumbnail */}
                        {embed.thumbnail && (
                          <div className="w-20 h-20 flex-shrink-0 ml-4 rounded overflow-hidden">
                            <img src={embed.thumbnail} alt="thumbnail" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                          </div>
                        )}
                      </div>
                      
                      {/* Image */}
                      {embed.image && (
                        <div className="mt-4 rounded overflow-hidden max-h-[300px]">
                          <img src={embed.image} alt="embed" className="w-full object-contain max-h-[300px]" onError={(e) => e.currentTarget.style.display = 'none'} />
                        </div>
                      )}
                      
                      {/* Footer */}
                      {(embed.footerText || embed.footerIcon) && (
                        <div className="flex items-center gap-2 mt-4 text-xs text-[#949ba4]">
                          {embed.footerIcon && <img src={embed.footerIcon} alt="footer" className="w-5 h-5 rounded-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />}
                          {embed.footerText && <span>{embed.footerText}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6 flex items-end gap-4">
              <div className="flex-1 space-y-2">
                <Label>Destination Channel</Label>
                <Input 
                  placeholder="e.g. #announcements or Channel ID" 
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                />
              </div>
              <Button onClick={handleSend} disabled={isSending} className="gap-2" size="lg">
                <Send className="w-4 h-4" />
                {isSending ? "Sending..." : "Send Embed"}
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CheckCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
