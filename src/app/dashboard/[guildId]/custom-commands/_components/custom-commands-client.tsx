"use client";

import { useState, useTransition } from"react";
import { Save, Terminal, Plus, Trash2 } from"lucide-react";
import { updateGuildSettingsData } from"../../actions";
import { Input } from"@/components/ui/input";
import { Button } from"@/components/ui/button";
import { Textarea } from"@/components/ui/textarea";

export default function CustomCommandsClient({ guildId, initialCommands }: { guildId: string, initialCommands: any[] }) {
 const [isPending, startTransition] = useTransition();

 const [commands, setCommands] = useState<any[]>(initialCommands);
 const [newCommandName, setNewCommandName] = useState("");
 const [newCommandResponse, setNewCommandResponse] = useState("");

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

 const handleAddCommand = () => {
 if (!newCommandName || !newCommandResponse) return;
 
 const formattedName = newCommandName.toLowerCase().replace(/[^a-z0-9]/g, '');
 if (!formattedName) return;

 setCommands([...commands, { name: formattedName, response: newCommandResponse, id: Math.random().toString() }]);
 setNewCommandName("");
 setNewCommandResponse("");
 };

 const handleDeleteCommand = (id: string) => {
 setCommands(commands.filter(c => c.id !== id));
 };

 return (
 <div className="flex flex-col gap-8 p-6 lg:p-10 max-w-5xl mx-auto w-full animate-in fade-in duration-500">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
 <div>
 <h1 className="text-4xl font-black text-primary tracking-tighter uppercase flex items-center gap-3">
 <Terminal className="w-10 h-10 text-primary"/>Custom Commands</h1>
 <p className="text-muted-foreground mt-2 text-sm">
 Define programmatic auto-responses.
 </p>
 </div>
 </div>

 <div className="bg-card border border-border shadow-sm rounded-xl p-6 space-y-6">
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Trigger Name</label>
 <Input 
 type="text"
 value={newCommandName}
 onChange={(e) => setNewCommandName(e.target.value)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 text-sm focus-visible:ring-0"
 placeholder="ping"
 />
 </div>
 <div className="space-y-2 md:col-span-2">
 <label className="text-sm font-bold text-primary uppercase">Payload Response</label>
 <Textarea 
 value={newCommandResponse}
 onChange={(e) => setNewCommandResponse(e.target.value)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 text-sm focus-visible:ring-0 min-h-[40px] h-10"
 placeholder="Pong!"
 />
 </div>
 </div>
 
 <Button 
 onClick={handleAddCommand} 
 className="rounded-md border border-border shadow-sm hover:shadow-sm transition-all font-bold mt-4"
 >
 <Plus className="w-4 h-4 mr-2"/>Compile Command</Button>

 <div className="mt-8 space-y-4">
 {commands.length === 0 ? (
 <div className="border-2 border-dashed border-primary/50 p-6 text-center text-muted-foreground uppercase font-bold">No Commands Registered</div>
 ) : (
 commands.map((c) => (
 <div key={c.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-background border border-border shadow-sm gap-4">
 <div className="flex flex-col gap-2 w-full">
 <div className="flex items-center gap-2">
 <Terminal className="w-4 h-4 text-primary"/>
 <span className="font-black text-primary bg-primary/10 px-2 py-0.5 border border-primary/20">/{c.name}</span>
 </div>
 <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/30 p-2 border border-border/50">
 {c.response}
 </div>
 </div>
 <Button
 variant="destructive"
 size="sm"
 onClick={() => handleDeleteCommand(c.id)}
 className="rounded-md border border-destructive uppercase font-bold shadow-sm transition-all w-full md:w-auto"
 >
 <Trash2 className="w-4 h-4"/>
 </Button>
 </div>
 ))
 )}
 </div>
 </div>

 <div className="flex justify-end mt-4">
 <Button 
 onClick={handleSave}
 disabled={isPending}
 className="bg-primary hover:bg-primary text-primary-foreground px-8 py-6 rounded-md font-black text-lg flex items-center gap-3 transition-all border border-border shadow-sm hover:shadow-sm"
 >
 <Save className="w-5 h-5"/>
 {isPending ?"SYNCING...":"COMMIT_REGISTRY"}
 </Button>
 </div>
 </div>
 );
}
