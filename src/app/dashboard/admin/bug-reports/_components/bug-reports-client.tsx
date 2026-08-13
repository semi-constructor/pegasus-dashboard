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
  <div className="space-y-12 pb-32">
  <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-border pb-8">
  <div className="flex flex-col gap-4">
  <h1 className="text-lg font-medium tracking-[0.3em] uppercase flex items-center gap-4 text-foreground">
  <Bug className="w-5 h-5 text-foreground"/>{t('bugReports.title')}</h1>
  <p className="text-foreground/50 text-sm tracking-wide">
  {t('bugReports.description')}
  </p>
  </div>
  </div>

  <div className="space-y-12">
  <div className="border-b border-border pb-4">
  <h3 className="text-sm tracking-[0.2em] uppercase text-foreground flex items-center gap-2">
  <Bug className="w-4 h-4" />
  {t('bugReports.submittedReports')}
  </h3>
  <p className="text-[10px] text-foreground/50 tracking-widest uppercase mt-2">{t('bugReports.submittedReportsDesc')}</p>
  </div>

  {editingReport && (
  <div className="p-8 border border-border bg-background mb-12 space-y-8 relative overflow-hidden">
  <div className="absolute top-0 left-0 w-1 h-full bg-foreground" />
  <h4 className="font-medium text-[10px] tracking-widest uppercase text-foreground">{t('bugReports.triageReport')} #{editingReport.id.substring(0, 8)}
  </h4>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  <div className="flex flex-col gap-4">
  <label className="block text-[10px] text-foreground/50 uppercase tracking-[0.2em]">{t('bugReports.status')}</label>
  <select
  value={editingReport.status}
  onChange={(e) => setEditingReport({ ...editingReport, status: e.target.value })}
  className="w-full h-12 px-4 bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-none text-[10px] uppercase tracking-widest outline-none focus-visible:border-border transition-all appearance-none"
  >
  <option value="open" className="bg-background text-foreground">{t('bugReports.statusOpen')}</option>
  <option value="in_progress" className="bg-background text-foreground">{t('bugReports.statusInProgress')}</option>
  <option value="solved" className="bg-background text-foreground">{t('bugReports.statusSolved')}</option>
  <option value="closed" className="bg-background text-foreground">{t('bugReports.statusClosed')}</option>
  </select>
  </div>

  <div className="flex flex-col gap-4">
  <label className="block text-[10px] text-foreground/50 uppercase tracking-[0.2em]">{t('bugReports.assignee')}</label>
  <Input
  placeholder={t('bugReports.devPlaceholder')}
  value={editingReport.assignee}
  onChange={(e) => setEditingReport({ ...editingReport, assignee: e.target.value })}
  className="w-full h-12 bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-none px-4 text-[10px] uppercase tracking-widest focus-visible:border-border transition-all focus-visible:ring-0"
  />
  </div>

  <div className="space-y-4 md:col-span-2">
  <label className="block text-[10px] text-foreground/50 uppercase tracking-[0.2em]">{t('bugReports.developerNotes')}</label>
  <Textarea
  placeholder={t('bugReports.notesPlaceholder')}
  value={editingReport.developerNote}
  onChange={(e) => setEditingReport({ ...editingReport, developerNote: e.target.value })}
  className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-none p-4 text-xs font-mono focus-visible:border-border transition-all focus-visible:ring-0 min-h-[100px]"
  />
  </div>
  </div>

  <div className="flex items-center gap-4 pt-4 border-t border-border">
  <button
  onClick={handleUpdate}
  disabled={isPending}
  className="px-6 py-3 bg-foreground text-background hover:bg-foreground/90 transition-colors text-[10px] uppercase tracking-widest flex items-center gap-2 font-medium"
  >
  <Save className="w-3 h-3"/>{t('bugReports.saveTriage')}</button>
  <button
  onClick={() => setEditingReport(null)}
  className="px-6 py-3 border border-border/30 text-foreground/70 hover:border-border hover:text-foreground transition-colors text-[10px] uppercase tracking-widest"
  >
  {t('bugReports.cancel')}
  </button>
  </div>
  </div>
  )}

  <div className="space-y-px bg-foreground/10 border border-border">
  {initialReports.length === 0 ? (
  <div className="bg-background p-12 text-center">
  <p className="text-foreground/50 text-sm tracking-widest uppercase">
  {t('bugReports.noReportsSubmitted')}
  </p>
  </div>
  ) : (
  initialReports.map((report) => (
  <div
  key={report.id}
  className="p-8 bg-background hover:bg-foreground/5 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-8 group"
  >
  <div className="flex-1 space-y-4">
  <div className="flex items-center gap-4 flex-wrap">
  <span className="font-medium text-xs tracking-widest uppercase text-foreground/50 border border-border px-2 py-1">[{report.category}]</span>
  <span className="font-medium text-sm tracking-wide uppercase text-foreground">{report.title}</span>
  <span className="text-[10px] border border-border/30 px-2 py-1 uppercase tracking-widest text-foreground/70">
  {t('bugReports.status')}: {report.status}
  </span>
  </div>
  <p className="text-[10px] text-foreground/30 uppercase tracking-widest font-mono">
  {t('bugReports.submittedByUser')}: {report.userId} | {t('bugReports.command')}: {report.command || "N/A"} | {t('bugReports.date')}: {new Date(report.createdAt).toLocaleString()}
  </p>
  <p className="text-sm text-foreground/70 font-mono mt-4 leading-relaxed">{report.description}</p>
  
  {(report.stepsToReproduce || report.developerNote) && (
    <div className="mt-6 pt-6 border-t border-border space-y-4">
      {report.stepsToReproduce && (
      <div>
        <h5 className="text-[10px] text-foreground/50 uppercase tracking-widest mb-2">{t('bugReports.steps')}</h5>
        <p className="text-xs text-foreground/70 font-mono pl-4 border-l border-border/30">
        {report.stepsToReproduce}
        </p>
      </div>
      )}
      {report.developerNote && (
      <div>
        <h5 className="text-[10px] text-foreground/50 uppercase tracking-widest mb-2">{t('bugReports.devNote')}</h5>
        <p className="text-xs text-foreground font-mono pl-4 border-l border-border">
        {report.developerNote}
        </p>
      </div>
      )}
    </div>
  )}
  </div>

  <button
  onClick={() =>
  setEditingReport({
  id: report.id,
  status: report.status,
  assignee: report.assignee || "",
  developerNote: report.developerNote || "",
  })
  }
  className="px-6 py-3 border border-border/30 text-foreground/70 hover:border-border hover:text-foreground transition-colors text-[10px] uppercase tracking-widest shrink-0"
  >
  {t('bugReports.triageEdit')}
  </button>
  </div>
  ))
  )}
  </div>
  </div>
  </div>
 );
}
