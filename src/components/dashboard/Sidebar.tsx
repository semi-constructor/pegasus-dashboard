import Link from"next/link";
import { LayoutDashboard, Settings, Server, Shield, Key, Database, Bug } from"lucide-react";

export function Sidebar() {
 return (
 <aside className="w-64 border-r border-border/50 bg-card/30 backdrop-blur-xl flex flex-col h-full">
 <div className="p-6">
 <Link href="/dashboard"className="flex items-center gap-2">
 <img src="/favicon.ico" alt="Pegasus Logo" className="w-8 h-8 rounded-lg" />
 <h2 className="text-xl font-bold text-foreground">Pegasus</h2>
 </Link>
 </div>
 
 <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
 <div className="pb-2">
 <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Servers</p>
 </div>
 <Link href="/dashboard"className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary/10 text-primary transition-colors font-medium">
 <LayoutDashboard className="w-4 h-4"/>
 Select Server
 </Link>
 
 <div className="pt-6 pb-2">
 <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">System</p>
 </div>
 <Link href="/dashboard/admin"className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
 <Shield className="w-4 h-4"/>
 Admin Dashboard
 </Link>
 <Link href="/dashboard/admin/security"className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
 <Shield className="w-4 h-4"/>
 Security Center
 </Link>
 <Link href="/dashboard/admin/database"className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
 <Database className="w-4 h-4"/>
 Database Browser
 </Link>
 <Link href="/dashboard/admin/bug-reports"className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
 <Bug className="w-4 h-4"/>
 Bug Reports
 </Link>
 <Link href="/dashboard/admin/metrics"className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
 <Server className="w-4 h-4"/>Api Metrics
 </Link>
 <Link href="/dashboard/admin/profile"className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
 <Key className="w-4 h-4"/>
 Passkeys
 </Link>
 </nav>
 
 <div className="p-4 border-t border-border/50">
 <Link href="/dashboard/profile/data"className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
 <Settings className="w-4 h-4"/>
 Profile Settings
 </Link>
 </div>
 </aside>
 );
}
