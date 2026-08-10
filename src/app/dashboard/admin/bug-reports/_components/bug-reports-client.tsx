"use client";

import { useState, useTransition } from"react";
import { Bug, Save, CheckCircle2, Clock, AlertCircle, XCircle } from"lucide-react";
import { Input } from"@/components/ui/input";
import { Textarea } from"@/components/ui/textarea";
import { Button } from"@/components/ui/button";
import { FormSection } from"@/components/dashboard/forms/FormSection";
import { updateBugReport } from"../actions";
import { useTranslations } from "next-intl";

interface BugReportsAdminClientProps {
 initialReports: any[];
}

export default function BugReportsAdminClient({
 initialReports,
}: BugReportsAdminClientProps) {
 const t = useTranslations('adminPages');
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
 <Bug className="w-10 h-10 text-primary"/>{t('bugReports.title')}</h1>
 <p className="text-white/40 mt-2 text-sm">
 {t('bugReports.description')}
 </p>
 </div>
 </div>

 <FormSection title={t('bugReports.submittedReports')} icon={Bug} description={t('bugReports.submittedReportsDesc')}>
 {editingReport && (
 <div className="p-4 border border-border bg-primary/10 mb-4 space-y-4">
 <h4 className="font-bold text-sm uppercase text-primary">{t('bugReports.triageReport')} #{editingReport.id.substring(0, 8)}
 </h4>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="flex flex-col gap-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('bugReports.status')}</label>
 <select
 value={editingReport.status}
 onChange={(e) => setEditingReport({ ...editingReport, status: e.target.value })}
 className="w-full min-h-[40px] px-3 py-2 bg-black/40 border border-white/10 text-white placeholder:text-white/30 rounded-lg text-sm uppercase outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 >
 <option value="open">{t('bugReports.statusOpen')}</option>
 <option value="in_progress">{t('bugReports.statusInProgress')}</option>
 <option value="solved">{t('bugReports.statusSolved')}</option>
 <option value="closed">{t('bugReports.statusClosed')}</option>
 </select>
 </div>

 <div className="flex flex-col gap-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('bugReports.assignee')}</label>
 <Input
 placeholder={t('bugReports.devPlaceholder')}
 value={editingReport.assignee}
 onChange={(e) => setEditingReport({ ...editingReport, assignee: e.target.value })}
 className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 />
 </div>

 <div className="space-y-1 md:col-span-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('bugReports.developerNotes')}</label>
 <Textarea
 placeholder={t('bugReports.notesPlaceholder')}
 value={editingReport.developerNote}
 onChange={(e) => setEditingReport({ ...editingReport, developerNote: e.target.value })}
 className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg h-10 px-3 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
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
 <Save className="w-3.5 h-3.5 mr-1"/>{t('bugReports.saveTriage')}</Button>
 <Button
 size="sm"
 className="bg-white/5 hover:bg-white/10 text-white border border-white/10"onClick={() => setEditingReport(null)}
 >
 {t('bugReports.cancel')}
 </Button>
 </div>
 </div>
 )}

 <div className="space-y-3">
 {initialReports.length === 0 ? (
 <p className="text-white/40 text-sm uppercase p-4 border border-border">
 {t('bugReports.noReportsSubmitted')}
 </p>
 ) : (
 initialReports.map((report) => (
 <div
 key={report.id}
 className="p-4 rounded-xl border border-white/5 bg-black/20 text-white backdrop-blur-md hover:bg-white/5 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm"
 >
 <div>
 <div className="flex items-center gap-2">
 <span className="font-bold text-primary text-base">[{report.category}]</span>
 <span className="font-bold uppercase text-foreground">{report.title}</span>
 <span className="text-xs border px-2 py-0.5 border-primary font-bold uppercase">
 {t('bugReports.status')}: {report.status}
 </span>
 </div>
 <p className="text-xs text-white/40 mt-1">
 {t('bugReports.submittedByUser')}: {report.userId} | {t('bugReports.command')}: {report.command ||"N/A"} | {t('bugReports.date')}: {new Date(report.createdAt).toLocaleString()}
 </p>
 <p className="text-sm mt-2">{report.description}</p>
 {report.stepsToReproduce && (
 <p className="text-xs text-white/40 mt-1">
 {t('bugReports.steps')}: {report.stepsToReproduce}
 </p>
 )}
 {report.developerNote && (
 <p className="text-xs text-primary mt-1 font-bold">
 {t('bugReports.devNote')}: {report.developerNote}
 </p>
 )}
 </div>

 <Button
 size="sm"
 className="bg-white/5 hover:bg-white/10 text-white border border-white/10"onClick={() =>
 setEditingReport({
 id: report.id,
 status: report.status,
 assignee: report.assignee ||"",
 developerNote: report.developerNote ||"",
 })
 }
 >
 {t('bugReports.triageEdit')}
 </Button>
 </div>
 ))
 )}
 </div>
 </FormSection>
 </div>
 );
}
