"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Ticket,
  Plus,
  Trash2,
  Layers,
  MessageSquare,
  Star,
  CheckCircle,
  Lock,
  Snowflake,
  UserCheck,
  Save,
  XCircle,
  FileText
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormSection } from "@/components/dashboard/forms/FormSection";
import { ToggleField } from "@/components/dashboard/forms/ToggleField";
import {
 DiscordChannelPicker,
 type ChannelOption,
} from"@/components/dashboard/pickers/DiscordChannelPicker";
import {
 DiscordRoleMultiPicker,
 type RoleOption,
} from"@/components/dashboard/pickers/DiscordRolePicker";
import {
 createTicketPanel,
 deleteTicketPanel,
 updateTicketPanel,
 createTicketDepartment,
 deleteTicketDepartment,
 updateTicketDepartment,
 updateTicketStatus,
} from"../actions";

interface ModalField {
 id: string;
 type:"short"|"paragraph";
 label: string;
 placeholder?: string;
 required: boolean;
}

interface TicketsClientProps {
 guildId: string;
 initialPanels: any[];
 initialDepartments: any[];
 initialTickets: any[];
 initialRatings: any[];
 channels: ChannelOption[];
 roles: RoleOption[];
}

export default function TicketsClient({
 guildId,
 initialPanels,
 initialDepartments,
 initialTickets,
 initialRatings,
 channels,
 roles,
}: TicketsClientProps) {
 const t = useTranslations('guildTickets');
 const [activeTab, setActiveTab] = useState<
"panels"|"departments"|"board"|"ratings"
 >("panels");
 const [isPending, startTransition] = useTransition();

 // ── New Panel Form State ───────────────────────────────────────
 const [newPanel, setNewPanel] = useState({
 panelId:"",
 title:"",
 description:"",
 buttonLabel:"Create Ticket",
 buttonStyle: 1,
 supportRoles: [] as string[],
 categoryId: null as string | null,
 ticketNameFormat:"ticket-{number}",
 maxTicketsPerUser: 1,
 welcomeMessage:"",
 isActive: true,
 });

 // ── New Department Form State (With Modal Field Builder UI) ─────
 const [newDept, setNewDept] = useState({
 panelId:"",
 departmentId:"",
 name:"",
 description:"",
 emoji:"🎫",
 categoryId: null as string | null,
 supportRoles: [] as string[],
 welcomeMessage:"",
 slaTimeoutMinutes: 60,
 });

 const [modalFields, setModalFields] = useState<ModalField[]>([
 { id:"1", type:"short", label:"Subject", placeholder:"Brief summary...", required: true },
 { id:"2", type:"paragraph", label:"Issue Details", placeholder:"Explain your issue...", required: true },
 ]);

 const addModalField = () => {
 setModalFields([
 ...modalFields,
 {
 id: Math.random().toString(36).substring(7),
 type:"short",
 label:"New Question",
 placeholder:"Enter value...",
 required: false,
 },
 ]);
 };

 const removeModalField = (id: string) => {
 setModalFields(modalFields.filter((f) => f.id !== id));
 };

 const updateModalField = (id: string, key: keyof ModalField, value: any) => {
 setModalFields(
 modalFields.map((f) => (f.id === id ? { ...f, [key]: value } : f))
 );
 };

  const [editingPanelId, setEditingPanelId] = useState<string | null>(null);
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);

  const [isPanelDialogOpen, setIsPanelDialogOpen] = useState(false);
  const [isDeptDialogOpen, setIsDeptDialogOpen] = useState(false);

  // Actions
  const handleSavePanel = () => {
    if (!newPanel.panelId || !newPanel.title) return;
    startTransition(async () => {
      if (editingPanelId) {
        await updateTicketPanel(guildId, editingPanelId, newPanel);
      } else {
        await createTicketPanel(guildId, newPanel);
      }
      setEditingPanelId(null);
      setIsPanelDialogOpen(false);
      setNewPanel({
        panelId: "",
        title: "",
        description: "",
        buttonLabel: "Create Ticket",
        buttonStyle: 1,
        supportRoles: [],
        categoryId: null,
        ticketNameFormat: "ticket-{number}",
        maxTicketsPerUser: 1,
        welcomeMessage: "",
        isActive: true,
      });
    });
  };

  const handleSaveDept = () => {
    if (!newDept.panelId || !newDept.departmentId || !newDept.name) return;
    startTransition(async () => {
      if (editingDeptId) {
        await updateTicketDepartment(guildId, editingDeptId, { ...newDept, modalFields });
      } else {
        await createTicketDepartment(guildId, { ...newDept, modalFields });
      }
      setEditingDeptId(null);
      setIsDeptDialogOpen(false);
      setNewDept({
        panelId: "",
        departmentId: "",
        name: "",
        description: "",
        emoji: "🎫",
        categoryId: null,
        supportRoles: [],
        welcomeMessage: "",
        slaTimeoutMinutes: 60,
      });
      setModalFields([
        { id: "1", type: "short", label: "Subject", placeholder: "Brief summary...", required: true },
        { id: "2", type: "paragraph", label: "Issue Details", placeholder: "Explain your issue...", required: true },
      ]);
    });
  };

  const tabs = [
    { id: "panels", label: t("tabs.panels"), icon: Layers },
    { id: "departments", label: t("tabs.departments"), icon: Plus },
    { id: "board", label: t("tabs.liveBoard"), icon: Ticket },
    { id: "ratings", label: t("tabs.ratings"), icon: Star },
  ];

  return (
    <div className="text-white p-2 sm:p-6 lg:p-10 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-white/10 pb-4 sm:pb-6 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 tracking-tight flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md shrink-0">
              <Ticket className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            {t("title")}
          </h1>
          <p className="text-white/40 mt-2 sm:mt-3 text-xs sm:text-sm font-medium tracking-wide">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col backdrop-blur-md">
        {/* Browser-style Tabs Header */}
        <div className="flex overflow-x-auto items-end bg-black/40 pt-3 sm:pt-4 px-2 sm:px-4 border-b border-white/10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0 touch-pan-x">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "group relative flex items-center gap-2 px-3.5 sm:px-6 py-2.5 sm:py-3 transition-all duration-300 font-bold text-xs sm:text-sm tracking-wide rounded-t-xl border-t border-x -mb-[1px] shrink-0 whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-white/10 border-white/10 text-white z-10 backdrop-blur-xl"
                  : "bg-transparent border-transparent text-white/40 hover:bg-white/5 hover:text-white/80 hover:border-white/5 z-0"
              )}
            >
              <tab.icon className={cn("w-4 h-4 transition-colors shrink-0", activeTab === tab.id ? "text-white" : "text-white/40 group-hover:text-white/60")} />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-[#0c0c0c]" />
              )}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="p-3 sm:p-6 md:p-10 relative flex-1">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative z-10"
            >

 {/* Tab 1: Panels */}
 {activeTab ==="panels"&& (
 <div className="space-y-6">
    <Dialog open={isPanelDialogOpen} onOpenChange={(open) => {
      setIsPanelDialogOpen(open);
      if (!open) {
        setEditingPanelId(null);
        setNewPanel({
          panelId: "", title: "", description: "", buttonLabel: "Create Ticket",
          buttonStyle: 1, supportRoles: [], categoryId: null, ticketNameFormat: "ticket-{number}",
          maxTicketsPerUser: 1, welcomeMessage: "", isActive: true
        });
      }
    }}>
      <DialogContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Layers className="w-5 h-5 text-primary" />
            {editingPanelId ? "Edit Ticket Panel" : "Create Ticket Panel"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="flex flex-col gap-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('panels.customId')}</label>
 <Input
 placeholder="support-main"
 value={newPanel.panelId}
 onChange={(e) => setNewPanel({ ...newPanel, panelId: e.target.value })}
 className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 />
 </div>

 <div className="flex flex-col gap-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('panels.embedTitle')}</label>
 <Input
 placeholder={t('panels.embedTitlePlaceholder')}
 value={newPanel.title}
 onChange={(e) => setNewPanel({ ...newPanel, title: e.target.value })}
 className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 />
 </div>

 <div className="space-y-1 md:col-span-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('panels.embedDesc')}</label>
 <Textarea
 placeholder={t('panels.embedDescPlaceholder')}
 value={newPanel.description}
 onChange={(e) => setNewPanel({ ...newPanel, description: e.target.value })}
 className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all "
 rows={2}
 />
 </div>

 <div className="flex flex-col gap-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('panels.buttonLabel')}</label>
 <Input
 placeholder={t('panels.buttonLabelPlaceholder')}
 value={newPanel.buttonLabel}
 onChange={(e) => setNewPanel({ ...newPanel, buttonLabel: e.target.value })}
 className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 />
 </div>

 <div className="flex flex-col gap-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('panels.maxPerUser')}</label>
 <Input
 type="number"
 min={1}
 max={5}
 value={newPanel.maxTicketsPerUser}
 onChange={(e) => setNewPanel({ ...newPanel, maxTicketsPerUser: Number(e.target.value) })}
 className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 />
 </div>

 <div className="space-y-1 md:col-span-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('panels.supportRoles')}</label>
 <DiscordRoleMultiPicker
 roles={roles}
 value={newPanel.supportRoles}
 onChange={(r) => setNewPanel({ ...newPanel, supportRoles: r })}
 />
 </div>
 </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
          <Button variant="ghost" onClick={() => setIsPanelDialogOpen(false)} className="text-white/50 hover:text-white">
            {t('cancel')}
          </Button>
          <Button
            onClick={handleSavePanel}
            disabled={isPending}
            className="bg-white/10 hover:bg-white/20 text-white border-0"
          >
            <Save className="w-4 h-4 mr-2" />
            {editingPanelId ? t('save') : t('panels.createTitle')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <FormSection
      title={t('panels.title')}
      icon={Layers}
      description={t('panels.desc')}
      headerAction={
        <Button
          onClick={() => {
            setEditingPanelId(null);
            setNewPanel({
              panelId: "", title: "", description: "", buttonLabel: "Create Ticket",
              buttonStyle: 1, supportRoles: [], categoryId: null, ticketNameFormat: "ticket-{number}",
              maxTicketsPerUser: 1, welcomeMessage: "", isActive: true
            });
            setIsPanelDialogOpen(true);
          }}
          className="bg-white/10 hover:bg-white/20 text-white border-0 shadow-sm font-bold text-xs uppercase"
        >
          <Plus className="w-4 h-4 mr-2" />{t('panels.add')}
        </Button>
      }
    >
            <div className="space-y-3">
              {initialPanels.length === 0 ? (
                <p className="text-white/40 text-sm uppercase p-4 border border-white/10 bg-white/5 rounded-xl">
                  No ticket panels configured.
                </p>
              ) : (
                initialPanels.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl bg-black/20 border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">[{p.panelId}]</span>
                        <span className="font-bold uppercase">{p.title}</span>
                      </div>
                      <p className="text-xs text-white/40 mt-1 text-white/50">
                        Button: &quot;{p.buttonLabel}&quot; | Max/User: {p.maxTicketsPerUser} | Format: {p.ticketNameFormat}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="bg-white/5 hover:bg-white/10 text-white border border-white/10"onClick={() => {
                            setEditingPanelId(p.id);
                            setNewPanel({
                              panelId: p.panelId,
                              title: p.title,
                              description: p.description,
                              buttonLabel: p.buttonLabel,
                              buttonStyle: p.buttonStyle,
                              supportRoles: p.supportRoles,
                              categoryId: p.categoryId,
                              ticketNameFormat: p.ticketNameFormat,
                              maxTicketsPerUser: p.maxTicketsPerUser,
                              welcomeMessage: p.welcomeMessage || "",
                              isActive: p.isActive,
                            });
                            setIsPanelDialogOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                      <Button
                        size="sm"
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"onClick={() => startTransition(async () => { await deleteTicketPanel(guildId, p.id); })}
                      >
                        <Trash2 className="w-3.5 h-3.5"/>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </FormSection>
        </div>
      )}

 {/* Tab 2: Departments & Modal Field Builder */}
 {activeTab ==="departments"&& (
 <div className="space-y-6">
    <Dialog open={isDeptDialogOpen} onOpenChange={(open) => {
      setIsDeptDialogOpen(open);
      if (!open) {
        setEditingDeptId(null);
        setNewDept({
          panelId: "", departmentId: "", name: "", description: "", emoji: "🎫",
          categoryId: null, supportRoles: [], welcomeMessage: "", slaTimeoutMinutes: 60
        });
        setModalFields([
          { id: "1", type: "short", label: "Subject", placeholder: "Brief summary...", required: true },
          { id: "2", type: "paragraph", label: "Issue Details", placeholder: "Explain your issue...", required: true },
        ]);
      }
    }}>
      <DialogContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Plus className="w-5 h-5 text-primary" />
            {editingDeptId ? "Edit Ticket Department" : "Create Ticket Department"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="flex flex-col gap-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Target Panel ID</label>
 <select
 value={newDept.panelId}
 onChange={(e) => setNewDept({ ...newDept, panelId: e.target.value })}
 className="w-full min-h-[40px] px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm uppercase text-white [&>option]:bg-neutral-900 outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 >
 <option value="">Select Panel...</option>
 {initialPanels.map((p) => (
 <option key={p.id} value={p.id}>
 {p.title} ({p.panelId})
 </option>
 ))}
 </select>
 </div>

 <div className="flex flex-col gap-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Department ID</label>
 <Input
 placeholder="billing-dept"
 value={newDept.departmentId}
 onChange={(e) => setNewDept({ ...newDept, departmentId: e.target.value })}
 className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 />
 </div>

 <div className="flex flex-col gap-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Department Name</label>
 <Input
 placeholder="Billing & Payments"
 value={newDept.name}
 onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
 className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 />
 </div>

 <div className="flex flex-col gap-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Emoji</label>
 <Input
 placeholder="💳"
 value={newDept.emoji}
 onChange={(e) => setNewDept({ ...newDept, emoji: e.target.value })}
 className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 />
 </div>

 <div className="space-y-1 md:col-span-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Department Support Roles</label>
 <DiscordRoleMultiPicker
 roles={roles}
 value={newDept.supportRoles}
 onChange={(r) => setNewDept({ ...newDept, supportRoles: r })}
 />
 </div>
 </div>

 {/* MODAL FIELDS BUILDER UI (Non-negotiable requirement) */}
 <div className="p-4 border border-border bg-primary/5 space-y-4 mt-4">
 <div className="flex items-center justify-between border-b border-primary/20 pb-2">
 <h4 className="font-bold text-sm uppercase text-primary">Discord Modal Field Builder ({modalFields.length} FIELDS)
 </h4>
 <Button
 size="sm"
 className="bg-white/5 hover:bg-white/10 text-white border border-white/10"onClick={addModalField}
 >
 <Plus className="w-3.5 h-3.5 mr-1"/>
 Add Input Field
 </Button>
 </div>

 <div className="space-y-3">
 {modalFields.map((field, idx) => (
 <div
 key={field.id}
 className="p-3 border border-border bg-background flex flex-col md:flex-row items-start md:items-center gap-3"
 >
 <span className="font-bold text-primary text-xs">#{idx + 1}</span>

 <select
 value={field.type}
 onChange={(e) => updateModalField(field.id,"type", e.target.value)}
 className="w-full min-h-[40px] px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm uppercase text-white [&>option]:bg-neutral-900 outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 >
 <option value="short">Short Input</option>
 <option value="paragraph">Paragraph Textarea</option>
 </select>

 <Input
 placeholder="Field Label"
 value={field.label}
 onChange={(e) => updateModalField(field.id,"label", e.target.value)}
 className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 />

 <Input
 placeholder="Placeholder"
 value={field.placeholder ||""}
 onChange={(e) => updateModalField(field.id,"placeholder", e.target.value)}
 className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 />

 <label className="flex items-center gap-1 text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5 ml-1 cursor-pointer">
 <input
 type="checkbox"
 checked={field.required}
 onChange={(e) => updateModalField(field.id,"required", e.target.checked)}
 />
 Required
 </label>

 <Button
 size="sm"
 className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"onClick={() => removeModalField(field.id)}
 >
 <Trash2 className="w-3.5 h-3.5"/>
 </Button>
 </div>
 ))}
 </div>
 </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
          <Button variant="ghost" onClick={() => setIsDeptDialogOpen(false)} className="text-white/50 hover:text-white">
            Cancel
          </Button>
          <Button
            onClick={handleSaveDept}
            disabled={isPending}
            className="bg-white/10 hover:bg-white/20 text-white border-0"
          >
            <Save className="w-4 h-4 mr-2" />
            {editingDeptId ? "Save Changes" : "Create Department"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <FormSection
      title="Active Departments"
      icon={Layers}
      description="Configured departments with modal fields."
      headerAction={
        <Button
          onClick={() => {
            setEditingDeptId(null);
            setNewDept({
              panelId: "", departmentId: "", name: "", description: "", emoji: "🎫",
              categoryId: null, supportRoles: [], welcomeMessage: "", slaTimeoutMinutes: 60
            });
            setModalFields([
              { id: "1", type: "short", label: "Subject", placeholder: "Brief summary...", required: true },
              { id: "2", type: "paragraph", label: "Issue Details", placeholder: "Explain your issue...", required: true },
            ]);
            setIsDeptDialogOpen(true);
          }}
          className="bg-white/10 hover:bg-white/20 text-white border-0 shadow-sm font-bold text-xs uppercase"
        >
          <Plus className="w-4 h-4 mr-2" />Add Department
        </Button>
      }
    >
            <div className="space-y-3">
              {initialDepartments.length === 0 ? (
                <p className="text-white/40 text-sm uppercase p-4 border border-white/10 bg-white/5 rounded-xl">
                  No ticket departments created.
                </p>
              ) : (
                initialDepartments.map((d) => (
                  <div
                    key={d.id}
                    className="p-4 rounded-xl bg-black/20 border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span>{d.emoji}</span>
                        <span className="font-bold uppercase text-primary">{d.name}</span>
                        <span className="text-xs border px-1 border-primary">
                          [{d.departmentId}]
                        </span>
                      </div>
                      <p className="text-xs text-white/40 mt-1 text-white/50">
                        Modal Fields: {JSON.stringify(d.modalFields)} | SLA: {d.slaTimeoutMinutes}m
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="bg-white/5 hover:bg-white/10 text-white border border-white/10"onClick={() => {
                          setEditingDeptId(d.id);
                          setNewDept({
                            panelId: d.panelId,
                            departmentId: d.departmentId,
                            name: d.name,
                            description: d.description,
                            emoji: d.emoji || "🎫",
                            categoryId: d.categoryId,
                            supportRoles: d.supportRoles,
                            welcomeMessage: d.welcomeMessage || "",
                            slaTimeoutMinutes: d.slaTimeoutMinutes,
                          });
                          setModalFields(d.modalFields || []);
                          setIsDeptDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"onClick={() => startTransition(async () => { await deleteTicketDepartment(guildId, d.id); })}
                      >
                        <Trash2 className="w-3.5 h-3.5"/>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </FormSection>
        </div>
      )}

 {/* Tab 3: Live Ticket Board */}
 {activeTab ==="board"&& (
 <FormSection title="Live Ticket Board"icon={Ticket} description="Active and historical user support tickets.">
 <div className="space-y-3">
 {initialTickets.length === 0 ? (
 <p className="text-white/40 text-sm uppercase p-4 border border-white/10 bg-white/5 rounded-xl">
 No tickets found in database.
 </p>
 ) : (
 initialTickets.map((t) => (
 <div
 key={t.id}
 className="p-4 rounded-xl bg-black/20 border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm"
 >
 <div>
 <div className="flex items-center gap-2">
 <span className="font-bold text-primary">
 #TICKET-{t.ticketNumber}
 </span>
 <span className="text-xs border px-2 py-0.5 border-primary bg-primary/20 font-bold uppercase">
 STATUS: {t.status}
 </span>
 </div>
 <p className="text-xs text-white/40 mt-1">
 User: {t.userId} | Channel: {t.channelId} | Opened: {new Date(t.createdAt).toLocaleString()}
 </p>
 {t.reason && <p className="text-sm mt-2">Reason: {t.reason}</p>}
 </div>

 {/* Ticket Management Override Controls */}
 <div className="flex flex-wrap items-center gap-2">
 {t.status !=="claimed"&& t.status !=="closed"&& (
 <Button
 size="sm"
 className="bg-white/5 hover:bg-white/10 text-white border border-white/10"onClick={() =>
 startTransition(async () => { await updateTicketStatus(guildId, t.id, "claimed"); })
 }
 >
 <UserCheck className="w-3.5 h-3.5 mr-1"/>
 Claim
 </Button>
 )}
 {t.status !=="locked"&& t.status !=="closed"&& (
 <Button
 size="sm"
 className="bg-white/5 hover:bg-white/10 text-white border border-white/10"onClick={() =>
 startTransition(async () => { await updateTicketStatus(guildId, t.id, "locked"); })
 }
 >
 <Lock className="w-3.5 h-3.5 mr-1"/>
 Lock
 </Button>
 )}
 {t.status !=="frozen"&& t.status !=="closed"&& (
 <Button
 size="sm"
 className="bg-white/5 hover:bg-white/10 text-white border border-white/10"onClick={() =>
 startTransition(async () => { await updateTicketStatus(guildId, t.id, "frozen"); })
 }
 >
 <Snowflake className="w-3.5 h-3.5 mr-1"/>
 Freeze
 </Button>
 )}
 {t.status !=="closed"&& (
 <Button
 size="sm"
 className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"onClick={() =>
 startTransition(async () => { await updateTicketStatus(guildId, t.id, "closed"); })
 }
 >
 <XCircle className="w-3.5 h-3.5 mr-1"/>
 Close
 </Button>
 )}
 <Link href={`/dashboard/${guildId}/tickets/transcripts/${t.id}`}>
   <Button size="sm" className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20">
     <FileText className="w-3.5 h-3.5 mr-1" />
     Transcript
   </Button>
 </Link>
 </div>
 </div>
 ))
 )}
 </div>
 </FormSection>
 )}

 {/* Tab 4: Staff Ratings */}
 {activeTab ==="ratings"&& (
 <FormSection title="Staff Ticket Ratings"icon={Star} description="Member feedback ratings for resolved support tickets.">
 <div className="overflow-x-auto border border-border">
 <table className="w-full text-left border-collapse text-sm">
 <thead className="bg-primary/10 border-b border-white/10 text-xs uppercase text-white/60">
 <tr>
 <th className="p-3">Rating</th>
 <th className="p-3">User ID</th>
 <th className="p-3">Staff Member (Claimed By)</th>
 <th className="p-3">Feedback Note</th>
 <th className="p-3">Date</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-primary/20">
 {initialRatings.length === 0 ? (
 <tr>
 <td colSpan={5} className="p-6 text-center text-white/40 uppercase">
 No ticket ratings submitted yet.
 </td>
 </tr>
 ) : (
 initialRatings.map((r) => (
 <tr key={r.id} className="hover:bg-primary/5">
 <td className="p-3 font-bold text-yellow-500">{"★".repeat(r.rating)}</td>
 <td className="p-3">{r.userId}</td>
 <td className="p-3 font-bold">{r.claimedBy ||"Unclaimed"}</td>
 <td className="p-3 truncate max-w-xs">{r.feedback ||"No feedback text"}</td>
 <td className="p-3 text-xs text-white/40">
 {new Date(r.createdAt).toLocaleDateString()}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </FormSection>
 )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
