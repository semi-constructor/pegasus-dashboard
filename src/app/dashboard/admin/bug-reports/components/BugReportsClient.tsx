"use client";

import { useState, useMemo } from"react";
import { Search, Filter, MessageSquare, AlertCircle, CheckCircle2, Clock, XCircle, MoreVertical, Loader2, User } from"lucide-react";
import { updateBugReport } from"../actions";

type BugReport = {
 id: string;
 userId: string;
 category: string;
 command: string | null;
 title: string;
 description: string;
 stepsToReproduce: string | null;
 status: string;
 createdAt: Date;
 updatedAt: Date;
 user: {
 username: string;
 avatarUrl: string | null;
 } | null;
};

export default function BugReportsClient({ initialBugs }: { initialBugs: BugReport[] }) {
 const [bugs, setBugs] = useState(initialBugs);
 const [search, setSearch] = useState("");
 const [statusFilter, setStatusFilter] = useState<string>("all");
 const [loadingId, setLoadingId] = useState<string | null>(null);
 
 const [selectedBug, setSelectedBug] = useState<BugReport | null>(null);
 const [note, setNote] = useState("");
 const [developer, setDeveloper] = useState("");

 const filteredBugs = useMemo(() => {
 return bugs.filter(bug => {
 const matchesSearch = bug.title.toLowerCase().includes(search.toLowerCase()) || 
 bug.id.toLowerCase().includes(search.toLowerCase()) ||
 bug.user?.username.toLowerCase().includes(search.toLowerCase());
 const matchesStatus = statusFilter ==="all"|| bug.status === statusFilter;
 return matchesSearch && matchesStatus;
 });
 }, [bugs, search, statusFilter]);

 const handleStatusChange = async (id: string, newStatus:"open"|"in_progress"|"solved"|"closed") => {
 setLoadingId(id);
 const res = await updateBugReport(id, { status: newStatus });
 if (res.success) {
 setBugs(bugs.map(b => b.id === id ? { ...b, status: newStatus } : b));
 }
 setLoadingId(null);
 };

 const handleAddNote = async (id: string) => {
 if (!note) return;
 const bug = bugs.find(b => b.id === id);
 if (!bug) return;
 await updateBugReport(id, { status: bug.status, developerNote: note });
 setNote("");
 alert("Note added!");
 };

 const handleAssign = async (id: string) => {
 if (!developer) return;
 const bug = bugs.find(b => b.id === id);
 if (!bug) return;
 await updateBugReport(id, { status: bug.status, assignee: developer });
 setDeveloper("");
 alert("Developer assigned!");
 };

 const getStatusIcon = (status: string) => {
 switch(status) {
 case"open": return <AlertCircle className="h-4 w-4 text-red-400"/>;
 case"in_progress": return <Clock className="h-4 w-4 text-amber-400"/>;
 case"solved": return <CheckCircle2 className="h-4 w-4 text-emerald-400"/>;
 case"closed": return <XCircle className="h-4 w-4 text-slate-400"/>;
 default: return <AlertCircle className="h-4 w-4"/>;
 }
 };

 const getStatusLabel = (status: string) => {
 switch(status) {
 case"open": return"Open";
 case"in_progress": return"In Progress";
 case"solved": return"Fixed";
 case"closed": return"Declined";
 default: return status;
 }
 };

 return (
 <div className="space-y-6">
 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
 <div>
 <h2 className="text-2xl font-bold tracking-tight">Bug Reports</h2>
 <p className="text-muted-foreground">Manage and track user submitted issues.</p>
 </div>
 
 <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
 <div className="relative w-full sm:w-64">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
 <input 
 type="text"
 placeholder="Search bugs..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="w-full pl-9 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
 />
 </div>
 <select 
 value={statusFilter}
 onChange={(e) => setStatusFilter(e.target.value)}
 className="w-full sm:w-auto px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
 >
 <option value="all">All Statuses</option>
 <option value="open">Open</option>
 <option value="in_progress">In Progress</option>
 <option value="solved">Fixed</option>
 <option value="closed">Declined</option>
 </select>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <div className="lg:col-span-2 border border-white/10 rounded-xl bg-card/20 backdrop-blur-xl overflow-hidden shadow-2xl">
 <div className="overflow-x-auto">
 <table className="w-full text-sm text-left">
 <thead className="text-xs uppercase bg-black/40 text-muted-foreground border-b border-white/5">
 <tr>
 <th className="px-6 py-4 font-medium">Issue</th>
 <th className="px-6 py-4 font-medium">Status</th>
 <th className="px-6 py-4 font-medium">Reporter</th>
 <th className="px-6 py-4 font-medium">Date</th>
 <th className="px-6 py-4 text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-white/5">
 {filteredBugs.length === 0 && (
 <tr>
 <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
 No bug reports found.
 </td>
 </tr>
 )}
 {filteredBugs.map((bug) => (
 <tr 
 key={bug.id} 
 className={`hover:bg-white/[0.02] transition-colors group cursor-pointer ${selectedBug?.id === bug.id ?"bg-white/[0.05]":""}`}
 onClick={() => setSelectedBug(bug)}
 >
 <td className="px-6 py-4">
 <div className="flex flex-col">
 <span className="font-medium text-white/90 group-hover:text-purple-400 transition-colors">{bug.title}</span>
 <span className="text-xs text-muted-foreground mt-0.5">{bug.id.split("-")[0]}...</span>
 </div>
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center gap-2">
 {getStatusIcon(bug.status)}
 <span className="text-white/80">{getStatusLabel(bug.status)}</span>
 </div>
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center gap-2 text-white/70">
 {bug.user?.avatarUrl ? (
 <img src={bug.user.avatarUrl} alt="Avatar"className="h-6 w-6 rounded-full"/>
 ) : (
 <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-[10px] text-white font-bold">
 {bug.user?.username?.charAt(0).toUpperCase() ||"?"}
 </div>
 )}
 {bug.user?.username ||"Unknown"}
 </div>
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center gap-4 text-muted-foreground">
 <span className="flex items-center gap-1.5"><Clock className="h-3 w-3"/> {new Date(bug.createdAt).toLocaleDateString()}</span>
 </div>
 </td>
 <td className="px-6 py-4 text-right">
 <div className="flex items-center justify-end gap-2">
 <select 
 className="px-2 py-1 bg-black/20 border border-white/10 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs"
 value={bug.status}
 onClick={(e) => e.stopPropagation()}
 onChange={(e) => handleStatusChange(bug.id, e.target.value as any)}
 disabled={loadingId === bug.id}
 >
 <option value="open">Open</option>
 <option value="in_progress">In Progress</option>
 <option value="solved">Fixed</option>
 <option value="closed">Declined</option>
 </select>
 {loadingId === bug.id && <Loader2 className="h-3 w-3 animate-spin text-purple-400"/>}
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {selectedBug && (
 <div className="border border-white/10 rounded-xl bg-card/20 backdrop-blur-xl p-6 shadow-2xl flex flex-col gap-4">
 <div>
 <h3 className="text-xl font-bold text-white/90">{selectedBug.title}</h3>
 <p className="text-sm text-muted-foreground">Category: {selectedBug.category} {selectedBug.command && `| Command: ${selectedBug.command}`}</p>
 </div>
 
 <div>
 <h4 className="text-sm font-semibold mb-1 text-white/80">Description</h4>
 <div className="bg-black/30 p-3 rounded-lg text-sm text-white/70 whitespace-pre-wrap">
 {selectedBug.description}
 </div>
 </div>

 {selectedBug.stepsToReproduce && (
 <div>
 <h4 className="text-sm font-semibold mb-1 text-white/80">Steps to Reproduce</h4>
 <div className="bg-black/30 p-3 rounded-lg text-sm text-white/70 whitespace-pre-wrap">
 {selectedBug.stepsToReproduce}
 </div>
 </div>
 )}

 <div className="pt-4 border-t border-white/5 space-y-4">
 <div>
 <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><User className="h-4 w-4"/> Assign Developer</h4>
 <div className="flex gap-2">
 <input 
 type="text"
 placeholder="Developer name..."
 value={developer}
 onChange={(e) => setDeveloper(e.target.value)}
 className="flex-1 px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
 />
 <button onClick={() => handleAssign(selectedBug.id)} className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors">Assign</button>
 </div>
 </div>

 <div>
 <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><MessageSquare className="h-4 w-4"/> Add Note</h4>
 <div className="flex flex-col gap-2">
 <textarea 
 placeholder="Type a note..."
 value={note}
 onChange={(e) => setNote(e.target.value)}
 className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm min-h-[80px]"
 />
 <button onClick={() => handleAddNote(selectedBug.id)} className="self-end px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors">Save Note</button>
 </div>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>
 );
}
