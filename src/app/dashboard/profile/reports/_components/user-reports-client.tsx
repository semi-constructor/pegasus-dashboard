"use client";

import { useState, useTransition } from"react";
import { Bug, Plus, Send } from"lucide-react";
import { Input } from"@/components/ui/input";
import { Textarea } from"@/components/ui/textarea";
import { Button } from"@/components/ui/button";
import { FormSection } from"@/components/dashboard/forms/FormSection";
import { submitBugReport } from"@/app/dashboard/admin/bug-reports/actions";

interface UserBugReportsClientProps {
 initialReports: any[];
}

export default function UserBugReportsClient({
 initialReports,
}: UserBugReportsClientProps) {
 const [isPending, startTransition] = useTransition();

 const [newReport, setNewReport] = useState({
 category:"general",
 command:"",
 title:"",
 description:"",
 stepsToReproduce:"",
 });

 const handleSubmit = () => {
 if (!newReport.title || !newReport.description) return;
 startTransition(async () => {
 await submitBugReport(newReport);
 setNewReport({
 category:"general",
 command:"",
 title:"",
 description:"",
 stepsToReproduce:"",
 });
 });
 };

 return (
 <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-32">
 <div className="flex items-center justify-between border-b border-border pb-4">
 <div>
 <h1 className="text-4xl font-black text-primary tracking-tighter uppercase flex items-center gap-3">
 <Bug className="w-10 h-10 text-primary"/>My Bug Reports</h1>
 <p className="text-muted-foreground mt-2 text-sm">
 Report issues, track triage status, and communicate with developers.
 </p>
 </div>
 </div>

 <FormSection title="Submit New Bug Report"icon={Bug} description="Detail your issue for developer triage.">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Category</label>
 <select
 value={newReport.category}
 onChange={(e) => setNewReport({ ...newReport, category: e.target.value })}
 className="w-full p-2 bg-background border border-border rounded-md text-sm uppercase"
 >
 <option value="general">General Dashboard / Bot</option>
 <option value="moderation">Moderation / AutoMod</option>
 <option value="economy">Economy / Shop</option>
 <option value="tickets">Tickets Workflow</option>
 <option value="xp">XP / Leveling</option>
 <option value="jtc">Join to Create</option>
 </select>
 </div>

 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Related Slash Command (Optional)</label>
 <Input
 placeholder="/warn, /daily, /ticket..."
 value={newReport.command}
 onChange={(e) => setNewReport({ ...newReport, command: e.target.value })}
 className="rounded-md border border-border"
 />
 </div>

 <div className="space-y-1 md:col-span-2">
 <label className="text-xs font-bold uppercase">Issue Summary / Title</label>
 <Input
 placeholder="e.g. Shop item purchase fails when balance exact match"
 value={newReport.title}
 onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
 className="rounded-md border border-border"
 />
 </div>

 <div className="space-y-1 md:col-span-2">
 <label className="text-xs font-bold uppercase">Full Problem Description</label>
 <Textarea
 placeholder="Explain what happened, expected result vs actual behavior..."
 value={newReport.description}
 onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
 className="rounded-md border border-border"
 rows={3}
 />
 </div>

 <div className="space-y-1 md:col-span-2">
 <label className="text-xs font-bold uppercase">Steps to Reproduce</label>
 <Textarea
 placeholder="1. Open shop 2. Click Buy 3. Error displays..."
 value={newReport.stepsToReproduce}
 onChange={(e) => setNewReport({ ...newReport, stepsToReproduce: e.target.value })}
 className="rounded-md border border-border"
 rows={2}
 />
 </div>
 </div>

 <Button
 onClick={handleSubmit}
 disabled={isPending}
 className="rounded-md border border-border shadow-sm font-medium text-xs mt-4"
 >
 <Send className="w-4 h-4 mr-2"/>Submit Report</Button>
 </FormSection>

 <FormSection title="My Submitted Reports"icon={Bug} description="Track status of your reported bugs.">
 <div className="space-y-3">
 {initialReports.length === 0 ? (
 <p className="text-muted-foreground text-sm uppercase p-4 border border-border">
 You haven&apos;t submitted any bug reports yet.
 </p>
 ) : (
 initialReports.map((r) => (
 <div
 key={r.id}
 className="p-4 border border-border bg-card space-y-2 shadow-sm"
 >
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <span className="font-bold text-primary">[{r.category}]</span>
 <span className="font-bold uppercase">{r.title}</span>
 </div>
 <span className="text-xs border px-2 py-0.5 border-primary font-bold uppercase bg-primary/20">
 STATUS: {r.status}
 </span>
 </div>
 <p className="text-sm text-muted-foreground">{r.description}</p>
 {r.developerNote && (
 <p className="text-xs text-primary font-bold bg-primary/10 p-2 border border-primary">
 Developer Note: {r.developerNote}
 </p>
 )}
 </div>
 ))
 )}
 </div>
 </FormSection>
 </div>
 );
}
