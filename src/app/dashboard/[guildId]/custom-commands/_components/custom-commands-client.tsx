"use client";

import { useState, useTransition } from "react";
import { Save, Terminal, Plus, Trash2, Edit2, LayoutTemplate, MessageSquare, Settings } from "lucide-react";
import { updateGuildSettingsData } from "../../actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DiscordChannelPicker, type ChannelOption } from "@/components/dashboard/pickers/DiscordChannelPicker";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormSection } from "@/components/dashboard/forms/FormSection";
import { ToggleField } from "@/components/dashboard/forms/ToggleField";
import { useTranslations } from "next-intl";

export default function CustomCommandsClient({ guildId, initialCommands, initialGlobalChannel, channels }: { guildId: string, initialCommands: any[], initialGlobalChannel?: string, channels: ChannelOption[] }) {
  const t = useTranslations('guildCustomCommands');
 const [isPending, startTransition] = useTransition();

  const [commands, setCommands] = useState<any[]>(initialCommands);
  const [globalChannel, setGlobalChannel] = useState(initialGlobalChannel || "");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCommandId, setEditingCommandId] = useState<string | null>(null);

  const [newCommand, setNewCommand] = useState({
    name: "",
    responseType: "text", // "text" or "embed"
    response: "",
    embedTitle: "",
    embedDescription: "",
    embedColor: "#3498db",
    embedFooter: "",
    embedImage: "",
    embedThumbnail: "",
    channelId: "",
  });

 const handleSave = () => {
 startTransition(async () => {
 const result = await updateGuildSettingsData(guildId, {
 customCommands: JSON.stringify(commands),
 customCommandsChannel: globalChannel
 });
 if (result.success) {
 console.log(t('savedSuccess'));
 }
 });
 };

  const handleSaveCommand = () => {
    if (!newCommand.name) return;
    
    const formattedName = newCommand.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!formattedName) return;

    if (editingCommandId) {
      setCommands(commands.map(c => c.id === editingCommandId ? { ...newCommand, name: formattedName, id: editingCommandId } : c));
    } else {
      setCommands([...commands, { ...newCommand, name: formattedName, id: Math.random().toString() }]);
    }
    
    setIsDialogOpen(false);
  };

  const handleDeleteCommand = (id: string) => {
    setCommands(commands.filter(c => c.id !== id));
  };

  const openDialog = (cmd?: any) => {
    if (cmd) {
      setEditingCommandId(cmd.id);
      setNewCommand({
        name: cmd.name || "",
        responseType: cmd.responseType || "text",
        response: cmd.response || "",
        embedTitle: cmd.embedTitle || "",
        embedDescription: cmd.embedDescription || "",
        embedColor: cmd.embedColor || "#3498db",
        embedFooter: cmd.embedFooter || "",
        embedImage: cmd.embedImage || "",
        embedThumbnail: cmd.embedThumbnail || "",
        channelId: cmd.channelId || "",
      });
    } else {
      setEditingCommandId(null);
      setNewCommand({
        name: "",
        responseType: "text",
        response: "",
        embedTitle: "",
        embedDescription: "",
        embedColor: "#3498db",
        embedFooter: "",
        embedImage: "",
        embedThumbnail: "",
        channelId: "",
      });
    }
    setIsDialogOpen(true);
  };

  return (
    <div className="text-white p-6 lg:p-10 max-w-[1400px] mx-auto animate-in fade-in duration-500 space-y-6 lg:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
              <Terminal className="w-8 h-8 text-white" />
            </div>
            {t('title')}
          </h1>
          <p className="text-white/40 mt-3 text-sm font-medium tracking-wide">
            {t('description')}
          </p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={isPending}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-6 font-bold flex items-center gap-2 rounded-xl transition-all"
        >
          <Save className="w-4 h-4" />
          {isPending ? t('syncing') : t('saveRegistry')}
        </Button>
      </div>

      <FormSection
        title={t('generalSettings.title')}
        icon={Settings}
        description={t('generalSettings.description')}
      >
        <div className="flex flex-col gap-2">
          <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('generalSettings.restrictChannelLabel')}</label>
          <DiscordChannelPicker
            channels={channels}
            value={globalChannel}
            onChange={(v) => setGlobalChannel(v || "")}
          />
          <p className="text-xs text-white/40 mt-1">{t('generalSettings.leaveEmptyText')}</p>
        </div>
      </FormSection>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Terminal className="w-5 h-5 text-primary" />
              {editingCommandId ? t('dialog.editTitle') : t('dialog.createTitle')}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('dialog.triggerName')}</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-white/50">/</span>
                  <Input 
                    type="text"
                    value={newCommand.name}
                    onChange={(e) => setNewCommand({ ...newCommand, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] pl-9 pr-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
                    placeholder="ping"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('dialog.responseType')}</label>
                <select
                  value={newCommand.responseType}
                  onChange={(e) => setNewCommand({ ...newCommand, responseType: e.target.value })}
                  className="w-full min-h-[40px] px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm uppercase text-white [&>option]:bg-neutral-900 outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
                >
                  <option value="text">{t('dialog.plainText')}</option>
                  <option value="embed">{t('dialog.richEmbed')}</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('dialog.restrictChannel')}</label>
              <DiscordChannelPicker
                channels={channels}
                value={newCommand.channelId || ""}
                onChange={(v) => setNewCommand({ ...newCommand, channelId: v || "" })}
              />
              <p className="text-xs text-white/40">{t('dialog.restrictChannelDesc')}</p>
            </div>

            {newCommand.responseType === "text" ? (
              <div className="flex flex-col gap-2">
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('dialog.plainTextResponse')}</label>
                <Textarea 
                  value={newCommand.response}
                  onChange={(e) => setNewCommand({ ...newCommand, response: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all min-h-[100px]"
                  placeholder="Pong!"
                />
              </div>
            ) : (
              <div className="space-y-4 p-4 border border-white/10 rounded-lg bg-white/5 mt-2">
                <h4 className="font-bold text-sm uppercase text-primary border-b border-primary/20 pb-2 flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4"/> {t('dialog.embedSettings')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('dialog.embedTitleLabel')}</label>
                    <Input 
                      value={newCommand.embedTitle}
                      onChange={(e) => setNewCommand({ ...newCommand, embedTitle: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
                      placeholder="Embed Title"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('dialog.embedColorHex')}</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={newCommand.embedColor} 
                        onChange={(e) => setNewCommand({ ...newCommand, embedColor: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
                      />
                      <Input 
                        value={newCommand.embedColor}
                        onChange={(e) => setNewCommand({ ...newCommand, embedColor: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('dialog.embedDescriptionLabel')}</label>
                    <Textarea 
                      value={newCommand.embedDescription}
                      onChange={(e) => setNewCommand({ ...newCommand, embedDescription: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all min-h-[80px]"
                      placeholder="Embed main content here..."
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('dialog.embedFooterText')}</label>
                    <Input 
                      value={newCommand.embedFooter}
                      onChange={(e) => setNewCommand({ ...newCommand, embedFooter: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
                      placeholder="Footer text"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('dialog.embedThumbnailUrl')}</label>
                    <Input 
                      value={newCommand.embedThumbnail}
                      onChange={(e) => setNewCommand({ ...newCommand, embedThumbnail: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('dialog.embedImageUrl')}</label>
                    <Input 
                      value={newCommand.embedImage}
                      onChange={(e) => setNewCommand({ ...newCommand, embedImage: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-white/50 hover:text-white">
              {t('dialog.cancel')}
            </Button>
            <Button
              onClick={handleSaveCommand}
              className="bg-white/10 hover:bg-white/20 text-white border-0"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingCommandId ? t('dialog.saveChanges') : t('dialog.createCommand')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <FormSection 
        title={t('registered.title')} 
        icon={Terminal} 
        description={t('registered.description')}
        headerAction={
          <Button
            onClick={() => openDialog()}
            className="bg-white/10 hover:bg-white/20 text-white border-0 shadow-sm font-bold text-xs uppercase"
          >
            <Plus className="w-4 h-4 mr-2" />{t('registered.newCommand')}
          </Button>
        }
      >
        <div className="space-y-3">
          {commands.length === 0 ? (
            <div className="border border-white/10 bg-white/5 rounded-xl p-6 text-center text-white/50 uppercase font-bold text-sm">
              {t('registered.noCommands')}
            </div>
          ) : (
            commands.map((c) => (
              <div key={c.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-black/40 border border-white/10 rounded-xl gap-4 hover:border-primary/50 transition-colors">
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-primary"/>
                    <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">/{c.name}</span>
                    <span className="text-xs uppercase bg-white/10 text-white px-2 py-0.5 rounded font-bold">
                      {c.responseType === "embed" ? t('registered.embed') : t('registered.text')}
                    </span>
                    {c.channelId && (
                      <span className="text-xs uppercase bg-primary/20 text-primary px-2 py-0.5 rounded font-bold border border-primary/30">
                        {t('registered.channel', { id: c.channelId })}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-white/70 whitespace-pre-wrap bg-black/50 p-3 rounded-lg border border-white/5 max-h-32 overflow-y-auto">
                    {c.responseType === "embed" ? (
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-white">{c.embedTitle || t('registered.untitledEmbed')}</span>
                        <span className="text-white/50">{c.embedDescription || t('registered.noDescription')}</span>
                      </div>
                    ) : (
                      c.response || t('registered.emptyResponse')
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDialog(c)}
                    className="rounded-md border border-white/20 bg-transparent text-white hover:bg-white/10 uppercase font-bold"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteCommand(c.id)}
                    className="rounded-md uppercase font-bold shadow-sm transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </FormSection>
    </div>
 );
}
