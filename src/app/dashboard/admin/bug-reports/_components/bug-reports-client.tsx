"use client";

import { useState, useTransition } from"react";
import { Bug, Save, CheckCircle2, Clock, AlertCircle, XCircle } from"lucide-react";
import { Input } from"@/components/ui/input";
import { Textarea } from"@/components/ui/textarea";
import { Button } from"@/components/ui/button";
import { FormSection } from"@/components/dashboard/forms/FormSection";
import { updateBugReport } from"../actions";

interface BugReportsAdminClientProps {
 initialReports: any[];
}

export default function BugReportsAdminClient({
 initialReports,
}: BugReportsAdminClientProps) {
 const [isPending, startTransition] = useTransition();

 const [editingReport, setEditingReport] = useState<{
 id: string;
 status: string;
 assignee: string;
 developerNote: string;
 } | null>(null);

 const handleUpdate = () => {
 if (!editingReport) return;
 startTransition(async () => {
 await updateBugReport(editingReport.id, {
 status: editingReport.status,
 assignee: editingReport.assignee,
 developerNote: editingReport.developerNote,
 });
 setEditingReport(null);
 });
 };

 return (
 <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-32">
 <div className="flex items-center justify-between border-b border-border pb-4">
 <div>
 <h1 className="text-4xl font-black text-primary tracking-tight uppercase flex items-center gap-3">
 <Bug className="w-10 h-10 text-primary"/>Bug Reports Triage</h1>
 <p className="text-muted-foreground mt-2 text-sm">
 Internal developer triage board for reported issues and feedback.
 </p>
 </div>
 </div>

 <FormSection title="Submitted Reports"icon={Bug} description="Manage report status, developer notes, and assignments.">
 {editingReport && (
 <div className="p-4 border border-border bg-primary/10 mb-4 space-y-4">
 <h4 className="font-bold text-sm uppercase text-primary">Triage Report #{editingReport.id.substring(0, 8)}
 </h4>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Status</label>
 <select
 value={editingReport.status}
 onChange={(e) => setEditingReport({ ...editingReport, status: e.target.value })}
 className="w-full p-2 bg-background border border-border rounded-md text-sm uppercase"
 >
 <option value="open">Open</option>
 <option value="in_progress">In Progress</option>
 <option value="solved">Solved</option>
 <option value="closed">Closed</option>
 </select>
 </div>

 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Assignee</label>
 <Input
 placeholder="Dev username / ID"
 value={editingReport.assignee}
 onChange={(e) => setEditingReport({ ...editingReport, assignee: e.target.value })}
 className="rounded-md border border-border"
 />
 </div>

 <div className="space-y-1 md:col-span-2">
 <label className="text-xs font-bold uppercase">Developer Notes</label>
 <Textarea
 placeholder="Root cause, fix commit hash, or resolution details..."
 value={editingReport.developerNote}
 onChange={(e) => setEditingReport({ ...editingReport, developerNote: e.target.value })}
 className="rounded-md border border-border"
 rows={2}
 />
 </div>
 </div>

 <div className="flex items-center gap-2">
 <Button
 size="sm"
 onClick={handleUpdate}
 disabled={isPending}
 className="rounded-md border border-border text-xs font-medium"
 >
 <Save className="w-3.5 h-3.5 mr-1"/>Save Triage</Button>
 <Button
 size="sm"
 variant="outline"
 onClick={() => setEditingReport(null)}
 className="rounded-md border border-border text-xs uppercase"
 >
 Cancel
 </Button>
 </div>
 </div>
 )}

 <div className="space-y-3">
 {initialReports.length === 0 ? (
 <p className="text-muted-foreground text-sm uppercase p-4 border border-border">
 No bug reports submitted.
 </p>
 ) : (
 initialReports.map((report) => (
 <div
 key={report.id}
 className="p-4 border border-border bg-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm"
 >
 <div>
 <div className="flex items-center gap-2">
 <span className="font-bold text-primary text-base">[{report.category}]</span>
 <span className="font-bold uppercase text-foreground">{report.title}</span>
 <span className="text-xs border px-2 py-0.5 border-primary font-bold uppercase">
 STATUS: {report.status}
 </span>
 </div>
 <p className="text-xs text-muted-foreground mt-1">
 Submitted By User: {report.userId} | Command: {report.command ||"N/A"} | Date: {new Date(report.createdAt).toLocaleString()}
 </p>
 <p className="text-sm mt-2">{report.description}</p>
 {report.stepsToReproduce && (
 <p className="text-xs text-muted-foreground mt-1">
 Steps: {report.stepsToReproduce}
 </p>
 )}
 {report.developerNote && (
 <p className="text-xs text-primary mt-1 font-bold">
 Dev Note: {report.developerNote}
 </p>
 )}
 </div>

 <Button
 size="sm"
 variant="outline"
 onClick={() =>
 setEditingReport({
 id: report.id,
 status: report.status,
 assignee: report.assignee ||"",
 developerNote: report.developerNote ||"",
 })
 }
 className="rounded-md border border-border text-xs uppercase shrink-0"
 >
 Triage / Edit
 </Button>
 </div>
 ))
 )}
 </div>
 </FormSection>
 </div>
 );
}
