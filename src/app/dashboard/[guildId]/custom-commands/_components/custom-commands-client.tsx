"use client";

import { useState, useTransition } from "react";
import { Save, Terminal, Plus, Trash2, Edit2, LayoutTemplate, MessageSquare } from "lucide-react";
import { updateGuildSettingsData } from "../../actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormSection } from "@/components/dashboard/forms/FormSection";
import { ToggleField } from "@/components/dashboard/forms/ToggleField";

export default function CustomCommandsClient({ guildId, initialCommands }: { guildId: string, initialCommands: any[] }) {
 const [isPending, startTransition] = useTransition();

  const [commands, setCommands] = useState<any[]>(initialCommands);
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
  });

 const handleSave = () => {
 startTransition(async () => {
 const result = await updateGuildSettingsData(guildId, {
 customCommands: JSON.stringify(commands)
 });
 if (result.success) {
 console.log("Saved Custom Commands");
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
      });
    }
    setIsDialogOpen(true);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-32">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-4xl font-black text-primary tracking-tight uppercase flex items-center gap-3">
            <Terminal className="w-10 h-10 text-primary" />Custom Commands</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Define programmatic auto-responses with embed support.
          </p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={isPending}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 font-bold flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isPending ? "Syncing..." : "Save Registry"}
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Terminal className="w-5 h-5 text-primary" />
              {editingCommandId ? "Edit Custom Command" : "Create Custom Command"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-white/70">Trigger Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-white/50">/</span>
                  <Input 
                    type="text"
                    value={newCommand.name}
                    onChange={(e) => setNewCommand({ ...newCommand, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-md pl-7 text-sm focus-visible:ring-0 text-white"
                    placeholder="ping"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-white/70">Response Type</label>
                <select
                  value={newCommand.responseType}
                  onChange={(e) => setNewCommand({ ...newCommand, responseType: e.target.value })}
                  className="w-full p-2 bg-white/5 border border-white/10 rounded-md text-sm text-white [&>option]:bg-neutral-900 focus-visible:ring-0"
                >
                  <option value="text">Plain Text</option>
                  <option value="embed">Rich Embed</option>
                </select>
              </div>
            </div>

            {newCommand.responseType === "text" ? (
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-white/70">Plain Text Response</label>
                <Textarea 
                  value={newCommand.response}
                  onChange={(e) => setNewCommand({ ...newCommand, response: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-md text-sm focus-visible:ring-0 min-h-[100px] text-white"
                  placeholder="Pong!"
                />
              </div>
            ) : (
              <div className="space-y-4 p-4 border border-white/10 rounded-lg bg-white/5 mt-2">
                <h4 className="font-bold text-sm uppercase text-primary border-b border-primary/20 pb-2 flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4"/> Embed Settings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-white/70">Title</label>
                    <Input 
                      value={newCommand.embedTitle}
                      onChange={(e) => setNewCommand({ ...newCommand, embedTitle: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-md text-sm focus-visible:ring-0 text-white"
                      placeholder="Embed Title"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-white/70">Color Hex</label>
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
                        className="flex-1 bg-black/50 border border-white/10 rounded-md text-sm focus-visible:ring-0 text-white font-mono"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold uppercase text-white/70">Description</label>
                    <Textarea 
                      value={newCommand.embedDescription}
                      onChange={(e) => setNewCommand({ ...newCommand, embedDescription: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-md text-sm focus-visible:ring-0 min-h-[80px] text-white"
                      placeholder="Embed main content here..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-white/70">Footer Text</label>
                    <Input 
                      value={newCommand.embedFooter}
                      onChange={(e) => setNewCommand({ ...newCommand, embedFooter: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-md text-sm focus-visible:ring-0 text-white"
                      placeholder="Footer text"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-white/70">Thumbnail URL</label>
                    <Input 
                      value={newCommand.embedThumbnail}
                      onChange={(e) => setNewCommand({ ...newCommand, embedThumbnail: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-md text-sm focus-visible:ring-0 text-white"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold uppercase text-white/70">Image URL</label>
                    <Input 
                      value={newCommand.embedImage}
                      onChange={(e) => setNewCommand({ ...newCommand, embedImage: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-md text-sm focus-visible:ring-0 text-white"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-white/50 hover:text-white">
              Cancel
            </Button>
            <Button
              onClick={handleSaveCommand}
              className="bg-white/10 hover:bg-white/20 text-white border-0"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingCommandId ? "Save Changes" : "Create Command"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <FormSection 
        title="Registered Commands" 
        icon={Terminal} 
        description="All configured auto-responses for this server."
        headerAction={
          <Button
            onClick={() => openDialog()}
            className="bg-white/10 hover:bg-white/20 text-white border-0 shadow-sm font-bold text-xs uppercase"
          >
            <Plus className="w-4 h-4 mr-2" />New Command
          </Button>
        }
      >
        <div className="space-y-3">
          {commands.length === 0 ? (
            <div className="border border-white/10 bg-white/5 rounded-xl p-6 text-center text-white/50 uppercase font-bold text-sm">
              No Commands Registered
            </div>
          ) : (
            commands.map((c) => (
              <div key={c.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-black/40 border border-white/10 rounded-xl gap-4 hover:border-primary/50 transition-colors">
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-primary"/>
                    <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">/{c.name}</span>
                    <span className="text-xs uppercase bg-white/10 text-white px-2 py-0.5 rounded font-bold">
                      {c.responseType === "embed" ? "Embed" : "Text"}
                    </span>
                  </div>
                  <div className="text-sm text-white/70 whitespace-pre-wrap bg-black/50 p-3 rounded-lg border border-white/5 max-h-32 overflow-y-auto">
                    {c.responseType === "embed" ? (
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-white">{c.embedTitle || "Untitled Embed"}</span>
                        <span className="text-white/50">{c.embedDescription || "No description provided"}</span>
                      </div>
                    ) : (
                      c.response || "Empty response"
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
