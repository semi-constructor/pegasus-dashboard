"use client";

import { useState, useTransition } from"react";
import { Bug, Plus, Send } from"lucide-react";
import { Input } from"@/components/ui/input";
import { Textarea } from"@/components/ui/textarea";
import { Button } from"@/components/ui/button";
import { FormSection } from"@/components/dashboard/forms/FormSection";
import { submitBugReport } from"@/app/dashboard/admin/bug-reports/actions";
import { useTranslations } from "next-intl";

interface UserBugReportsClientProps {
 initialReports: any[];
}

export default function UserBugReportsClient({
 initialReports,
}: UserBugReportsClientProps) {
 const t = useTranslations('profilePages');
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
 <h1 className="text-4xl font-black text-primary tracking-tight uppercase flex items-center gap-3">
 <Bug className="w-10 h-10 text-primary"/>{t('bugReports.title')}</h1>
 <p className="text-foreground/40 mt-2 text-sm">
 {t('bugReports.description')}
 </p>
 </div>
 </div>

 <FormSection title={t('bugReports.submitNewReport')} icon={Bug} description={t('bugReports.detailIssue')}>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="flex flex-col gap-2">
 <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">{t('bugReports.category')}</label>
 <select
 value={newReport.category}
 onChange={(e) => setNewReport({ ...newReport, category: e.target.value })}
 className="w-full min-h-[40px] px-3 py-2 bg-background/40 border border-border text-foreground placeholder:text-foreground/30 rounded-lg text-sm uppercase outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 >
 <option value="general">{t('bugReports.categoryGeneral')}</option>
 <option value="moderation">{t('bugReports.categoryModeration')}</option>
 <option value="economy">{t('bugReports.categoryEconomy')}</option>
 <option value="tickets">{t('bugReports.categoryTickets')}</option>
 <option value="xp">{t('bugReports.categoryXp')}</option>
 <option value="jtc">{t('bugReports.categoryJtc')}</option>
 </select>
 </div>

 <div className="flex flex-col gap-2">
 <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">{t('bugReports.relatedCommand')}</label>
 <Input
 placeholder={t('bugReports.commandPlaceholder')}
 value={newReport.command}
 onChange={(e) => setNewReport({ ...newReport, command: e.target.value })}
 className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 />
 </div>

 <div className="space-y-1 md:col-span-2">
 <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">{t('bugReports.issueTitle')}</label>
 <Input
 placeholder={t('bugReports.titlePlaceholder')}
 value={newReport.title}
 onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
 className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 />
 </div>

 <div className="space-y-1 md:col-span-2">
 <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">{t('bugReports.fullDescription')}</label>
 <Textarea
 placeholder={t('bugReports.descPlaceholder')}
 value={newReport.description}
 onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
 className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg h-10 px-3 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 rows={3}
 />
 </div>

 <div className="space-y-1 md:col-span-2">
 <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">{t('bugReports.stepsToReproduce')}</label>
 <Textarea
 placeholder={t('bugReports.stepsPlaceholder')}
 value={newReport.stepsToReproduce}
 onChange={(e) => setNewReport({ ...newReport, stepsToReproduce: e.target.value })}
 className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg h-10 px-3 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 rows={2}
 />
 </div>
 </div>

 <Button
 onClick={handleSubmit}
 disabled={isPending}
 className="rounded-md border border-border shadow-sm font-medium text-xs mt-4"
 >
 <Send className="w-4 h-4 mr-2"/>{t('bugReports.submitReport')}</Button>
 </FormSection>

 <FormSection title={t('bugReports.mySubmittedReports')} icon={Bug} description={t('bugReports.trackStatus')}>
 <div className="space-y-3">
 {initialReports.length === 0 ? (
 <p className="text-foreground/40 text-sm uppercase p-4 border border-border">
 {t('bugReports.noReportsSubmitted')}
 </p>
 ) : (
 initialReports.map((r) => (
 <div
 key={r.id}
 className="p-4 rounded-xl border border-border bg-background/20 text-foreground backdrop-blur-md hover:bg-foreground/5 transition-all space-y-2 shadow-sm"
 >
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <span className="font-bold text-primary">[{r.category}]</span>
 <span className="font-bold uppercase">{r.title}</span>
 </div>
 <span className="text-xs border px-2 py-0.5 border-primary font-bold uppercase bg-primary/20">
 {t('bugReports.status')}: {r.status}
 </span>
 </div>
 <p className="text-sm text-foreground/40">{r.description}</p>
 {r.developerNote && (
 <p className="text-xs text-primary font-bold bg-primary/10 p-2 border border-primary">
 {t('bugReports.devNote')}: {r.developerNote}
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
