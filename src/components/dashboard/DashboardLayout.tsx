"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { 
  LayoutDashboard, 
  Settings, 
  Bot, 
  Users, 
  MessageSquare,
  Shield,
  Activity,
  LogOut,
  Menu,
  X,
  Star,
  Send,
  CheckCircle2,
  Database,
  Wand2,
  Gift,
  Trophy,
  Mic,
  Coins,
  Ticket,
  Terminal,
  AlertTriangle,
  FileText,
  Server,
  Calendar,
  CreditCard,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { useTranslations } from 'next-intl'
import { sendGTMEvent } from "@next/third-parties/google"
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { getGuildInfoAction } from "@/app/dashboard/[guildId]/actions"
import { ThemeToggle } from "@/components/ThemeToggle"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function DashboardSidebar({ session, isAdmin = false, isMobile = false, onNavigate }: { session: any, isAdmin?: boolean, isMobile?: boolean, onNavigate?: () => void }) {
  const t = useTranslations('guild');
  const td = useTranslations('dashboard');
  const tp = useTranslations('profile');
  const ta = useTranslations('admin');
  const pathname = usePathname()
  
  const isPreview = pathname?.startsWith("/preview")
  const basePath = isPreview ? "/preview" : "/dashboard"
  const match = pathname?.match(new RegExp(`^${basePath}\\/([^/]+)(?:\\/(.*))?$`))
  const rawId = match ? match[1] : null
  const guildId = rawId && !['admin', 'profile', 'instances', 'tickets'].includes(rawId) ? rawId : null
  const [guildName, setGuildName] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (isPreview) return;
    if (guildId) {
      getGuildInfoAction(guildId).then(data => {
        if (data?.name) setGuildName(data.name)
      }).catch(console.error)
    } else {
      setGuildName(null)
    }
  }, [guildId])

  let contextItems: any[] = []
  
  if (guildId) {
    contextItems = [
      { name: t('overview'), href: `${basePath}/${guildId}`, icon: Activity },
      { name: t('settings'), href: `${basePath}/${guildId}/settings`, icon: Settings },
      { name: t('engagement'), href: `${basePath}/${guildId}/engagement`, icon: Users },
      { name: t('tickets'), href: `${basePath}/${guildId}/tickets`, icon: Ticket },
      { name: t('economy'), href: `${basePath}/${guildId}/economy`, icon: Coins },
      { name: t('xpLeveling'), href: `${basePath}/${guildId}/xp`, icon: Star },
      { name: t('giveaways'), href: `${basePath}/${guildId}/giveaways`, icon: Gift },
      { name: t('schedule'), href: `${basePath}/${guildId}/schedule`, icon: Calendar },
      { name: t('jtc'), href: `${basePath}/${guildId}/jtc`, icon: Mic },
      { name: t('customCommands'), href: `${basePath}/${guildId}/custom-commands`, icon: Terminal },
      { name: "Starboard", href: `${basePath}/${guildId}/starboard`, icon: Star },
      { name: "Reaction Roles", href: `${basePath}/${guildId}/reaction-roles`, icon: CheckCircle2 },
      { name: "Surveys", href: `${basePath}/${guildId}/surveys`, icon: FileText },
      { name: "Control Panel", href: `${basePath}/${guildId}/control-panel`, icon: Send },
      { name: t('warns'), href: `${basePath}/${guildId}/warns`, icon: AlertTriangle },
    ]
  } else if (pathname?.startsWith("/dashboard/admin") && isAdmin) {
    contextItems = [
      { name: ta('adminDashboard'), href: "/dashboard/admin", icon: Activity },
      { name: ta('servers'), href: "/dashboard/admin/servers", icon: Server },
      { name: ta('securityCenter'), href: "/dashboard/admin/security", icon: Shield },
      { name: ta('apiMetrics'), href: "/dashboard/admin/metrics", icon: Activity },
      { name: ta('bugReports'), href: "/dashboard/admin/bug-reports", icon: MessageSquare },
      { name: "Surveys", href: "/dashboard/admin/surveys", icon: FileText },
      { name: "Blogs", href: "/dashboard/admin/blogs", icon: FileText },
      { name: "Tickets", href: "/dashboard/admin/tickets", icon: Ticket },
      { name: ta('auditLogs'), href: "/dashboard/admin/audit-logs", icon: FileText },
    ]
  } else if (pathname?.startsWith("/dashboard/profile")) {
    contextItems = [
      { name: "Billing & Invoices", href: "/dashboard/profile/billing", icon: CreditCard },
      { name: tp('dataExport'), href: "/dashboard/profile/data", icon: Database },
      { name: tp('myBugReports'), href: "/dashboard/profile/reports", icon: MessageSquare },
      ...(isAdmin ? [{ name: tp('myPasskeys'), href: "/dashboard/profile/passkeys", icon: Shield }] : []),
    ]
  }

  const handleLinkClick = () => {
    if (onNavigate) onNavigate()
  }
  
  return (
    <aside className={cn(
      "w-64 flex-col border-r border-border bg-background z-40",
      isMobile ? "flex h-full" : "hidden md:flex fixed inset-y-0 left-0"
    )}>
      <div className="flex h-16 items-center px-6 border-b border-border">
        <Link href="/" onClick={handleLinkClick} className="flex items-center gap-2">
          <>
<img src="/logos/whitemode-logo.png" alt="Pegasus Logo" className="w-8 h-8 rounded-lg dark:hidden block" />
<img src="/logos/darkmode-logo.png" alt="Pegasus Logo" className="w-8 h-8 rounded-lg hidden dark:block" />
</>
          <span className="font-bold text-lg tracking-tight text-foreground">Pegasus</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4">
        {contextItems.length > 0 && (
          <nav className="flex flex-col gap-2">
            <div className="px-3 pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {guildId ? (guildName || td('server')) : pathname?.startsWith("/dashboard/admin") ? td('admin') : td('profile')}
            </div>
            {contextItems.map((item) => {
              let isActive = false
              if (item.href === `${basePath}/${guildId}` || item.href === "/dashboard/admin") {
                isActive = pathname === item.href
              } else {
                isActive = pathname?.startsWith(item.href) || false
              }
              
              return (
                <Link key={item.name} href={item.href} onClick={handleLinkClick}>
                  <motion.div
                    className={cn(
                      "group relative flex items-center gap-3 rounded-none px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive 
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-context"
                        className="absolute inset-0 rounded-none bg-secondary z-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    <item.icon size={18} className="relative z-10"/>
                    <span className="relative z-10">{item.name}</span>
                  </motion.div>
                </Link>
              )
            })}
          </nav>
        )}
      </div>

      <div className="p-4 border-t border-border flex flex-col gap-2">
        <nav className="flex flex-col gap-1 mb-2">
          {isAdmin && (
            <Link href="/dashboard/admin" onClick={handleLinkClick}>
              <div className={cn("flex items-center gap-3 px-3 py-2 rounded-none text-sm font-medium transition-colors", pathname?.startsWith("/dashboard/admin") ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50")}>
                <Shield size={18} />
                <span>{td('adminPanel')}</span>
              </div>
            </Link>
          )}
          <Link href="/dashboard" onClick={handleLinkClick}>
            <div className={cn("flex items-center gap-3 px-3 py-2 rounded-none text-sm font-medium transition-colors", pathname === "/dashboard" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50")}>
              <LayoutDashboard size={18} />
              <span>{td('servers')}</span>
            </div>
          </Link>
          <Link href="/dashboard/tickets" onClick={handleLinkClick}>
            <div className={cn("flex items-center gap-3 px-3 py-2 rounded-none text-sm font-medium transition-colors", pathname?.startsWith("/dashboard/tickets") ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50")}>
              <Ticket size={18} />
              <span>Support Tickets</span>
            </div>
          </Link>
          <Link href="/dashboard/instances" onClick={handleLinkClick}>
            <div className={cn("flex items-center gap-3 px-3 py-2 rounded-none text-sm font-medium transition-colors", pathname?.startsWith("/dashboard/instances") ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50")}>
              <Server size={18} />
              <span>My Instances</span>
            </div>
          </Link>
          <Link href="/dashboard/profile/data" onClick={handleLinkClick}>
            <div className={cn("flex items-center gap-3 px-3 py-2 rounded-none text-sm font-medium transition-colors", pathname?.startsWith("/dashboard/profile") ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50")}>
              <Settings size={18} />
              <span>{td('profile')}</span>
            </div>
          </Link>
        </nav>
        
        <LanguageSwitcher variant="compact" />
        
        <div className="flex items-center gap-3 px-3 py-2 rounded-none bg-secondary border border-border mt-2">
          <Avatar className="h-8 w-8 rounded-full border border-border shrink-0">
            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
            <AvatarFallback className="bg-foreground text-background text-xs font-bold">{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate text-foreground">{session?.user?.name || "User"}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0" onClick={() => { sendGTMEvent({ event: 'logout' }); signOut({ callbackUrl: "/" }); }}>
            <LogOut size={16} />
          </Button>
        </div>
      </div>
    </aside>
  )
}

export function FullscreenSidebarContent({
  session,
  isAdmin = false,
  onClose,
}: {
  session: any;
  isAdmin?: boolean;
  onClose: () => void;
}) {
  const t = useTranslations('guild');
  const td = useTranslations('dashboard');
  const tp = useTranslations('profile');
  const ta = useTranslations('admin');
  const pathname = usePathname();

  const isPreview = pathname?.startsWith("/preview");
  const basePath = isPreview ? "/preview" : "/dashboard";
  const match = pathname?.match(new RegExp(`^${basePath}\\/([^/]+)(?:\\/(.*))?$`));
  const rawId = match ? match[1] : null;
  const guildId = rawId && !['admin', 'profile', 'instances', 'tickets'].includes(rawId) ? rawId : null;
  const [guildName, setGuildName] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isPreview) return;
    if (guildId) {
      getGuildInfoAction(guildId)
        .then((data) => {
          if (data?.name) setGuildName(data.name);
        })
        .catch(console.error);
    } else {
      setGuildName(null);
    }
  }, [guildId]);

  let contextItems: any[] = [];
  if (guildId) {
    contextItems = [
      { name: t('overview'), href: `${basePath}/${guildId}`, icon: Activity },
      { name: t('settings'), href: `${basePath}/${guildId}/settings`, icon: Settings },
      { name: t('engagement'), href: `${basePath}/${guildId}/engagement`, icon: Users },
      { name: t('tickets'), href: `${basePath}/${guildId}/tickets`, icon: Ticket },
      { name: t('economy'), href: `${basePath}/${guildId}/economy`, icon: Coins },
      { name: t('xpLeveling'), href: `${basePath}/${guildId}/xp`, icon: Star },
      { name: t('giveaways'), href: `${basePath}/${guildId}/giveaways`, icon: Gift },
      { name: t('schedule'), href: `${basePath}/${guildId}/schedule`, icon: Calendar },
      { name: t('jtc'), href: `${basePath}/${guildId}/jtc`, icon: Mic },
      { name: t('customCommands'), href: `${basePath}/${guildId}/custom-commands`, icon: Terminal },
      { name: "Starboard", href: `${basePath}/${guildId}/starboard`, icon: Star },
      { name: "Reaction Roles", href: `${basePath}/${guildId}/reaction-roles`, icon: CheckCircle2 },
      { name: "Surveys", href: `${basePath}/${guildId}/surveys`, icon: FileText },
      { name: "Control Panel", href: `${basePath}/${guildId}/control-panel`, icon: Send },
      { name: t('warns'), href: `${basePath}/${guildId}/warns`, icon: AlertTriangle },
    ];
  } else if (pathname?.startsWith("/dashboard/admin") && isAdmin) {
    contextItems = [
      { name: ta('adminDashboard'), href: "/dashboard/admin", icon: Activity },
      { name: ta('servers'), href: "/dashboard/admin/servers", icon: Server },
      { name: ta('securityCenter'), href: "/dashboard/admin/security", icon: Shield },
      { name: ta('apiMetrics'), href: "/dashboard/admin/metrics", icon: Activity },
      { name: ta('bugReports'), href: "/dashboard/admin/bug-reports", icon: MessageSquare },
      { name: "Surveys", href: "/dashboard/admin/surveys", icon: FileText },
      { name: "Blogs", href: "/dashboard/admin/blogs", icon: FileText },
      { name: "Tickets", href: "/dashboard/admin/tickets", icon: Ticket },
      { name: ta('auditLogs'), href: "/dashboard/admin/audit-logs", icon: FileText },
    ];
  } else if (pathname?.startsWith("/dashboard/profile")) {
    contextItems = [
      { name: "Billing & Invoices", href: "/dashboard/profile/billing", icon: CreditCard },
      { name: tp('dataExport'), href: "/dashboard/profile/data", icon: Database },
      { name: tp('myBugReports'), href: "/dashboard/profile/reports", icon: MessageSquare },
      ...(isAdmin ? [{ name: tp('myPasskeys'), href: "/dashboard/profile/passkeys", icon: Shield }] : []),
    ];
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col justify-between p-6 sm:p-10 md:p-14 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <Link href="/" onClick={onClose} className="flex items-center gap-3 group">
          <>
<img src="/logos/whitemode-logo.png" alt="Pegasus Logo" className="w-10 h-10 rounded-xl group-hover:scale-105 transition-transform dark:hidden block" />
<img src="/logos/darkmode-logo.png" alt="Pegasus Logo" className="w-10 h-10 rounded-xl group-hover:scale-105 transition-transform hidden dark:block" />
</>
          <div>
            <span className="font-extrabold text-2xl tracking-tight text-foreground block">Pegasus</span>
            <span className="text-xs text-foreground/50">{guildId ? (guildName || td('server')) : pathname?.startsWith("/dashboard/admin") ? td('admin') : td('profile')}</span>
          </div>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-11 w-11 rounded-full bg-foreground/5 hover:bg-foreground/15 text-foreground border border-border transition-colors"
        >
          <X size={22} />
        </Button>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 my-8 max-w-7xl mx-auto w-full">
        {/* Left Column: Context Page Navigation */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/60">
              {td('pageNavigation')}
            </h3>
            {guildId && (
              <span className="text-xs text-primary font-medium">{guildName || td('server')}</span>
            )}
          </div>

          {contextItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {contextItems.map((item) => {
                let isActive = false;
                if (item.href === `${basePath}/${guildId}` || item.href === "/dashboard/admin") {
                  isActive = pathname === item.href;
                } else {
                  isActive = pathname?.startsWith(item.href) || false;
                }
                return (
                  <Link key={item.name} href={item.href} onClick={onClose}>
                    <motion.div
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-none border transition-all duration-200 group cursor-pointer",
                        isActive
                          ? "bg-primary/20 border-primary/50 text-foreground shadow-[0_0_20px_rgba(139,92,246,0.25)]"
                          : "bg-foreground/5 border-border text-foreground/70 hover:bg-foreground/10 hover:text-foreground hover:border-border"
                      )}
                    >
                      <div className={cn("p-2.5 rounded-none shrink-0 transition-colors", isActive ? "bg-primary text-foreground" : "bg-background/20 text-foreground/70 group-hover:text-foreground group-hover:bg-foreground/10")}>
                        <item.icon size={20} />
                      </div>
                      <span className="font-semibold text-base tracking-wide">{item.name}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-foreground/40 text-sm italic">{td('selectServerNavigation')}</p>
          )}

          {/* Quick Dashboard Links */}
          <div className="pt-6 border-t border-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/60 mb-4">
              {td('dashboardSections')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {isAdmin && (
                <Link href="/dashboard/admin" onClick={onClose}>
                  <div className={cn("flex items-center gap-3 p-3.5 rounded-none border transition-all hover:scale-[1.02]", pathname?.startsWith("/dashboard/admin") ? "bg-primary/20 border-primary/50 text-foreground" : "bg-foreground/5 border-border text-foreground/70 hover:bg-foreground/10 hover:text-foreground")}>
                    <Shield size={18} className="text-primary shrink-0" />
                    <span className="font-medium text-sm">{td('adminPanel')}</span>
                  </div>
                </Link>
              )}
              <Link href="/dashboard" onClick={onClose}>
                <div className={cn("flex items-center gap-3 p-3.5 rounded-none border transition-all hover:scale-[1.02]", pathname === "/dashboard" ? "bg-primary/20 border-primary/50 text-foreground" : "bg-foreground/5 border-border text-foreground/70 hover:bg-foreground/10 hover:text-foreground")}>
                  <LayoutDashboard size={18} className="text-primary shrink-0" />
                  <span className="font-medium text-sm">{td('servers')}</span>
                </div>
              </Link>
              <Link href="/dashboard/tickets" onClick={onClose}>
                <div className={cn("flex items-center gap-3 p-3.5 rounded-none border transition-all hover:scale-[1.02]", pathname?.startsWith("/dashboard/tickets") ? "bg-primary/20 border-primary/50 text-foreground" : "bg-foreground/5 border-border text-foreground/70 hover:bg-foreground/10 hover:text-foreground")}>
                  <Ticket size={18} className="text-primary shrink-0" />
                  <span className="font-medium text-sm">Support Tickets</span>
                </div>
              </Link>
              <Link href="/dashboard/instances" onClick={onClose}>
                <div className={cn("flex items-center gap-3 p-3.5 rounded-none border transition-all hover:scale-[1.02]", pathname?.startsWith("/dashboard/instances") ? "bg-primary/20 border-primary/50 text-foreground" : "bg-foreground/5 border-border text-foreground/70 hover:bg-foreground/10 hover:text-foreground")}>
                  <Server size={18} className="text-primary shrink-0" />
                  <span className="font-medium text-sm">My Instances</span>
                </div>
              </Link>
              <Link href="/dashboard/profile/data" onClick={onClose}>
                <div className={cn("flex items-center gap-3 p-3.5 rounded-none border transition-all hover:scale-[1.02]", pathname?.startsWith("/dashboard/profile") ? "bg-primary/20 border-primary/50 text-foreground" : "bg-foreground/5 border-border text-foreground/70 hover:bg-foreground/10 hover:text-foreground")}>
                  <Settings size={18} className="text-primary shrink-0" />
                  <span className="font-medium text-sm">{td('profile')}</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Language Selector */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="p-6 rounded-none bg-foreground/5 border border-border space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground/60">{td('languageSelector')}</span>
            </div>
            <p className="text-xs text-foreground/50">{td('chooseLanguage')}</p>
            <div className="pt-2">
              <LanguageSwitcher variant="default" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer User Info */}
      <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10 rounded-full border border-primary/50 shrink-0">
            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
            <AvatarFallback className="bg-primary/30 text-foreground text-sm font-bold">{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-bold text-foreground">{session?.user?.name || "User"}</p>
            <p className="text-xs text-foreground/40">{session?.user?.email || "Discord Account"}</p>
          </div>
        </div>
        <Button
          variant="destructive"
          onClick={() => { sendGTMEvent({ event: 'logout' }); signOut({ callbackUrl: "/" }); }}
          className="w-full sm:w-auto font-medium"
        >
          <LogOut className="w-4 h-4 mr-2" /> {td('signOut')}
        </Button>
      </div>
    </div>
  );
}

export function DashboardHeader({ session, isAdmin = false }: { session: any, isAdmin?: boolean }) {
  const t = useTranslations('dashboard');
  const [isFullscreenOpen, setIsFullscreenOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between md:justify-end border-b border-border bg-background px-4 md:px-6">
      <div className="flex items-center gap-3 md:hidden">
        <Sheet open={isFullscreenOpen} onOpenChange={setIsFullscreenOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 px-3 text-foreground hover:bg-foreground/10 border border-border rounded-none">
              <Menu size={20} />
              <span className="font-semibold text-sm">{t('navigation')}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" showCloseButton={false} className="p-0 w-screen h-screen max-w-full sm:max-w-full md:max-w-full bg-background border-none text-foreground z-50 overflow-y-auto">
            <SheetTitle className="sr-only">{t('fullscreenNavigation')}</SheetTitle>
            <FullscreenSidebarContent session={session} isAdmin={isAdmin} onClose={() => setIsFullscreenOpen(false)} />
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center gap-2">
          <>
<img src="/logos/whitemode-logo.png" alt="Pegasus Logo" className="w-7 h-7 rounded-lg dark:hidden block" />
<img src="/logos/darkmode-logo.png" alt="Pegasus Logo" className="w-7 h-7 rounded-lg hidden dark:block" />
</>
          <span className="font-bold text-base tracking-tight text-foreground hidden sm:inline">Pegasus</span>
        </Link>
      </div>
 
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="hidden md:flex gap-2 text-xs border-border text-foreground/70 hover:text-foreground">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"/>
          {t('botOnline')}
        </Button>
        <div className="h-8 w-8 rounded-full bg-foreground/10 border border-border flex items-center justify-center cursor-pointer hover:bg-foreground/20 transition-colors">
          <Bot size={16} className="text-foreground/70"/>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}

export function AdminTopNav({ session, onNavigate }: { session: any, onNavigate?: () => void }) {
  const ta = useTranslations('admin');
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: "/dashboard/admin" },
    { name: 'Servers', href: "/dashboard/admin/servers" },
    { name: 'Security', href: "/dashboard/admin/security" },
    { name: 'Metrics', href: "/dashboard/admin/metrics" },
    { name: 'Reports', href: "/dashboard/admin/bug-reports" },
    { name: 'Tickets', href: "/dashboard/admin/tickets" },
    { name: "Audit Logs", href: "/dashboard/admin/audit-logs" },
  ];

  return (
    <nav 
      aria-label="Admin Navigation" 
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 transition-all duration-500 w-full py-4 bg-background border-b border-border"
    >
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-4 focus-visible:outline-none group">
          <>
<img src="/logos/whitemode-logo.png" alt="Pegasus Logo" className="w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity duration-500 dark:hidden block" />
<img src="/logos/darkmode-logo.png" alt="Pegasus Logo" className="w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity duration-500 hidden dark:block" />
</>
          <span className="font-medium text-lg tracking-wider uppercase text-foreground">Pegasus</span>
          <span className="font-medium text-xs tracking-wider uppercase text-foreground/30 ml-4 hidden sm:block">SYS_ADMIN</span>
        </Link>
      </div>
      
      <div className="hidden lg:flex items-center gap-10 text-xs tracking-wider uppercase font-medium text-foreground/50">
        {navItems.map((item) => {
          const isActive = item.href === "/dashboard/admin" 
            ? pathname === item.href 
            : pathname?.startsWith(item.href);
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={cn(
                "hover:text-foreground transition-colors py-2 relative group",
                isActive && "text-foreground"
              )}
            >
              {item.name}
              <span className={cn(
                "absolute bottom-0 left-1/2 h-px bg-foreground transition-all duration-300",
                isActive ? "w-full left-0" : "w-0 group-hover:w-full group-hover:left-0"
              )} />
            </Link>
          )
        })}
      </div>

      <div className="flex items-center gap-6">
        <Link href="/dashboard" tabIndex={-1}>
          <Button variant="ghost" className="hidden md:flex rounded-none text-foreground/50 hover:text-foreground hover:bg-transparent text-xs tracking-wider uppercase transition-all">
            Exit Admin
          </Button>
        </Link>
        <Avatar className="h-8 w-8 rounded-none border border-border cursor-pointer hover:opacity-80 transition-opacity">
          <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
          <AvatarFallback className="bg-foreground/10 text-foreground text-xs font-bold tracking-widest uppercase">{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <ThemeToggle />
      </div>
    </nav>
  )
}

export function AdminLayoutWrapper({ children, session }: { children: React.ReactNode, session: any }) {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      
      {/* Premium Background Effects removed for brutalist design */}

      <AdminTopNav session={session} />
      
      <div className="relative z-10 min-h-screen flex flex-col pt-32 pb-12 px-4 sm:px-6 md:px-12">
        <main className="flex-1 animate-in slide-in-from-bottom-4 fade-in duration-700 ease-out">
          {children}
        </main>
      </div>
    </div>
  )
}

export function DashboardLayout({ children, session, isAdmin = false }: { children: React.ReactNode, session: any, isAdmin?: boolean }) {
  const pathname = usePathname();
  
  if (pathname?.startsWith("/dashboard/admin") && isAdmin) {
    return <AdminLayoutWrapper session={session}>{children}</AdminLayoutWrapper>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Background gradients removed for brutalist design */}

      <DashboardSidebar session={session} isAdmin={isAdmin} />
      
      <div className="flex flex-col md:pl-64 relative z-10 min-h-screen">
        <DashboardHeader session={session} isAdmin={isAdmin} />
        <main className="flex-1 p-3 sm:p-6 md:p-8 animate-in fade-in duration-500">
          {children}
        </main>
      </div>
    </div>
  )
}
