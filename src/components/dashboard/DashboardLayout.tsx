"use client"

import * as React from"react"
import Link from"next/link"
import { usePathname } from"next/navigation"
import { motion } from"framer-motion"
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
 Database,
 Wand2,
 Gift,
 Trophy,
 Mic,
 Coins,
 Ticket,
} from"lucide-react"
import { signOut } from"next-auth/react"

import { cn } from"@/lib/utils"
import { Button } from"@/components/ui/button"


export function DashboardSidebar({ session, isAdmin = false }: { session: any, isAdmin?: boolean }) {
 const pathname = usePathname()
 
 // Extract guildId if we are in a guild route: /dashboard/123456789/...
 const match = pathname?.match(/^\/dashboard\/(\d+)(?:\/(.*))?$/)
 const guildId = match ? match[1] : null

 let contextItems: any[] = []
 
 if (guildId) {
 contextItems = [
 { name:"Overview", href: `/dashboard/${guildId}`, icon: Activity },
 { name:"Settings", href: `/dashboard/${guildId}/settings`, icon: Settings },
 { name:"Moderation", href: `/dashboard/${guildId}/moderation`, icon: Shield },
 { name:"AutoMod", href: `/dashboard/${guildId}/automod`, icon: Wand2 },
 { name:"Tickets", href: `/dashboard/${guildId}/tickets`, icon: Ticket },
 { name:"Economy", href: `/dashboard/${guildId}/economy`, icon: Coins },
 { name:"XP & Leveling", href: `/dashboard/${guildId}/xp`, icon: Star },
 { name:"Giveaways", href: `/dashboard/${guildId}/giveaways`, icon: Gift },
 { name:"Engagement", href: `/dashboard/${guildId}/engagement`, icon: Trophy },
 { name:"JTC", href: `/dashboard/${guildId}/jtc`, icon: Mic },
 { name:"Logging", href: `/dashboard/${guildId}/logging`, icon: Activity },
 ]
 } else if (pathname?.startsWith("/dashboard/admin") && isAdmin) {
 contextItems = [
 { name:"Overview", href:"/dashboard/admin", icon: Activity },
 { name:"Security & Audits", href:"/dashboard/admin/security", icon: Shield },
 { name:"Database", href:"/dashboard/admin/database", icon: Database },
 { name:"Metrics", href:"/dashboard/admin/metrics", icon: Activity },
 { name:"Bug Reports", href:"/dashboard/admin/bug-reports", icon: MessageSquare },
 ]
 } else if (pathname?.startsWith("/dashboard/profile")) {
 contextItems = [
 { name:"Data Export", href:"/dashboard/profile/data", icon: Database },
 { name:"My Bug Reports", href:"/dashboard/profile/reports", icon: MessageSquare },
 ...(isAdmin ? [{ name:"My Passkeys", href:"/dashboard/profile/passkeys", icon: Shield }] : []),
 ]
 }
 
 return (
 <aside className="hidden w-64 flex-col border-r border-border bg-card/30 backdrop-blur-xl md:flex z-40 fixed inset-y-0 left-0">
 <div className="flex h-16 items-center px-6 border-b border-border">
 <Link href="/"className="flex items-center gap-2">
 <img src="/favicon.ico" alt="Pegasus Logo" className="w-8 h-8 rounded-lg" />
 <span className="font-bold text-lg tracking-tight text-foreground">Pegasus</span>
 </Link>
 </div>
 
 <div className="flex-1 overflow-y-auto py-6 px-4">
 {contextItems.length > 0 && (
 <nav className="flex flex-col gap-2">
 <div className="px-3 pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
 {guildId ?"Server": pathname?.startsWith("/dashboard/admin") ?"Admin":"Profile"}
 </div>
 {contextItems.map((item) => {
 let isActive = false
 if (item.href === `/dashboard/${guildId}` || item.href ==="/dashboard/admin") {
 isActive = pathname === item.href
 } else {
 isActive = pathname?.startsWith(item.href) || false
 }
 
 return (
 <Link key={item.name} href={item.href}>
 <motion.div
 className={cn(
"group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
 isActive 
 ?"text-foreground"
 :"text-muted-foreground hover:text-foreground"
 )}
 whileHover={{ x: 4 }}
 whileTap={{ scale: 0.98 }}
 >
 {isActive && (
 <motion.div
 layoutId="active-nav-context"
 className="absolute inset-0 rounded-lg bg-secondary z-0"
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
 <Link href="/dashboard/admin">
 <div className={cn("flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors", pathname?.startsWith("/dashboard/admin") ?"bg-secondary text-foreground":"text-muted-foreground hover:text-foreground hover:bg-secondary/50")}>
 <Shield size={18} />
 <span>Admin Panel</span>
 </div>
 </Link>
 )}
 <Link href="/dashboard">
 <div className={cn("flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors", pathname ==="/dashboard"?"bg-secondary text-foreground":"text-muted-foreground hover:text-foreground hover:bg-secondary/50")}>
 <LayoutDashboard size={18} />
 <span>Servers</span>
 </div>
 </Link>
 <Link href="/dashboard/profile/data">
 <div className={cn("flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors", pathname?.startsWith("/dashboard/profile") ?"bg-secondary text-foreground":"text-muted-foreground hover:text-foreground hover:bg-secondary/50")}>
 <Settings size={18} />
 <span>Profile</span>
 </div>
 </Link>
 </nav>
 
 <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-secondary border border-border mt-2">
 <div className="h-8 w-8 rounded-full bg-foreground flex items-center justify-center text-xs font-bold text-background">
 {session?.user?.name?.charAt(0) ||"U"}
 </div>
 <div className="flex-1 overflow-hidden">
 <p className="text-sm font-medium truncate text-foreground">{session?.user?.name ||"User"}</p>
 </div>
 <Button variant="ghost"size="icon"className="h-8 w-8 text-muted-foreground hover:text-foreground"onClick={() => signOut({ callbackUrl:"/"})}>
 <LogOut size={16} />
 </Button>
 </div>
 </div>
 </aside>
 )
}

export function DashboardHeader() {
 return (
 <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/10 bg-black/40 px-6 backdrop-blur-xl">
 <div className="flex items-center gap-4">
 <div className="md:hidden">
 <Button variant="ghost"size="icon">
 <Menu size={20} />
 </Button>
 </div>
 <h1 className="text-lg font-medium hidden md:block">Dashboard</h1>
 </div>
 
 <div className="flex items-center gap-4">
 <Button variant="outline"size="sm"className="hidden md:flex gap-2 text-xs">
 <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"/>
 Bot Online
 </Button>
 <div className="h-8 w-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
 <Bot size={16} className="text-white/70"/>
 </div>
 </div>
 </header>
 )
}

export function DashboardLayout({ children, session, isAdmin = false }: { children: React.ReactNode, session: any, isAdmin?: boolean }) {
 return (
 <div className="min-h-screen bg-black text-white selection:bg-primary/30">
 {/* Background gradients */}
 <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
 <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]"/>
 <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-600/20 blur-[120px]"/>
 </div>

 <DashboardSidebar session={session} isAdmin={isAdmin} />
 
 <div className="flex flex-col md:pl-64 relative z-10 min-h-screen">
 <DashboardHeader />
 <main className="flex-1 p-6 md:p-8 animate-in fade-in duration-500">
 {children}
 </main>
 </div>
 </div>
 )
}
