"use client";

import { useState, useTransition } from "react";
import { Send, LayoutTemplate, Settings } from "lucide-react";
import { sendControlPanelMessage } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DiscordChannelPicker, type ChannelOption } from "@/components/dashboard/pickers/DiscordChannelPicker";
import { FormSection } from "@/components/dashboard/forms/FormSection";

export default function ControlPanelClient({ guildId, channels }: { guildId: string, channels: ChannelOption[] }) {
  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [channelId, setChannelId] = useState("");
  const [msgType, setMsgType] = useState("text"); // "text" or "embed"
  
  const [textMode, setTextMode] = useState("");
  const [embedData, setEmbedData] = useState({
    title: "",
    description: "",
    color: "#3498db",
    footer: "",
    image: "",
    thumbnail: "",
  });

  const handleSend = () => {
    if (!channelId) {
      setErrorMsg("Please select a channel first.");
      return;
    }

    let payload: any = {};
    if (msgType === "text") {
      if (!textMode.trim()) {
        setErrorMsg("Message content cannot be empty.");
        return;
      }
      payload = { content: textMode };
    } else {
      payload = {
        embeds: [{
          title: embedData.title || undefined,
          description: embedData.description || undefined,
          color: parseInt(embedData.color.replace("#", ""), 16) || 0x3498db,
          footer: embedData.footer ? { text: embedData.footer } : undefined,
          image: embedData.image ? { url: embedData.image } : undefined,
          thumbnail: embedData.thumbnail ? { url: embedData.thumbnail } : undefined,
        }]
      };
    }

    setErrorMsg("");
    setSuccessMsg("");
    
    startTransition(async () => {
      const result = await sendControlPanelMessage(guildId, channelId, payload);
      if (result.success) {
        setSuccessMsg("Message sent successfully!");
        setTextMode("");
        setEmbedData({
          title: "",
          description: "",
          color: "#3498db",
          footer: "",
          image: "",
          thumbnail: "",
        });
      } else {
        setErrorMsg(result.error || "Failed to send message.");
      }
    });
  };

  return (
    <div className="text-white p-6 lg:p-10 max-w-[1400px] mx-auto animate-in fade-in duration-500 space-y-6 lg:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
              <Send className="w-8 h-8 text-blue-500" />
            </div>
            Live Control Panel
          </h1>
          <p className="text-white/40 mt-3 text-sm font-medium tracking-wide">
            Send messages or embeds directly to your server as the bot.
          </p>
        </div>
      </div>

      <FormSection
        title="Message Configuration"
        icon={Settings}
        description="Configure where and how the bot should send the message."
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Target Channel</label>
            <DiscordChannelPicker
              channels={channels}
              value={channelId}
              onChange={(v) => setChannelId(v || "")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Message Type</label>
            <select
              value={msgType}
              onChange={(e) => setMsgType(e.target.value)}
              className="w-full p-3 bg-black/40 border border-white/10 rounded-lg text-sm uppercase text-white outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
            >
              <option value="text">Plain Text Message</option>
              <option value="embed">Rich Embed Message</option>
            </select>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Message Content"
        icon={LayoutTemplate}
        description="Draft your message content."
      >
        {msgType === "text" ? (
          <div className="flex flex-col gap-2">
            <Textarea
              value={textMode}
              onChange={(e) => setTextMode(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg px-4 py-3 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all min-h-[200px]"
              placeholder="Type your message here..."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-white/10 rounded-xl bg-white/5">
            <div className="flex flex-col gap-2">
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Embed Title</label>
              <Input 
                value={embedData.title}
                onChange={(e) => setEmbedData({ ...embedData, title: e.target.value })}
                className="w-full bg-black/40 border border-white/10 text-white placeholder:text-white/30 rounded-lg px-4 py-2"
                placeholder="Announcement"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Embed Color (Hex)</label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={embedData.color} 
                  onChange={(e) => setEmbedData({ ...embedData, color: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <Input 
                  value={embedData.color}
                  onChange={(e) => setEmbedData({ ...embedData, color: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 text-white placeholder:text-white/30 rounded-lg px-4 py-2 uppercase"
                  placeholder="#3498db"
                />
              </div>
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Description</label>
              <Textarea 
                value={embedData.description}
                onChange={(e) => setEmbedData({ ...embedData, description: e.target.value })}
                className="w-full bg-black/40 border border-white/10 text-white placeholder:text-white/30 rounded-lg px-4 py-3 min-h-[120px]"
                placeholder="Main embed content goes here..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Footer Text</label>
              <Input 
                value={embedData.footer}
                onChange={(e) => setEmbedData({ ...embedData, footer: e.target.value })}
                className="w-full bg-black/40 border border-white/10 text-white placeholder:text-white/30 rounded-lg px-4 py-2"
                placeholder="Powered by Pegasus"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Thumbnail URL</label>
              <Input 
                value={embedData.thumbnail}
                onChange={(e) => setEmbedData({ ...embedData, thumbnail: e.target.value })}
                className="w-full bg-black/40 border border-white/10 text-white placeholder:text-white/30 rounded-lg px-4 py-2"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Image URL</label>
              <Input 
                value={embedData.image}
                onChange={(e) => setEmbedData({ ...embedData, image: e.target.value })}
                className="w-full bg-black/40 border border-white/10 text-white placeholder:text-white/30 rounded-lg px-4 py-2"
                placeholder="https://..."
              />
            </div>
          </div>
        )}
      </FormSection>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 font-medium">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl mb-6 font-medium">
          {successMsg}
        </div>
      )}

      <div className="flex justify-end mt-8">
        <Button 
          onClick={handleSend}
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 h-auto text-lg font-bold flex items-center gap-3 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
        >
          <Send className="w-5 h-5" />
          {isPending ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </div>
  );
}
