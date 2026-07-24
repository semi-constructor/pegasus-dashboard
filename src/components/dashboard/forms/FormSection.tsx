"use client";

import { cn } from"@/lib/utils";
import { type LucideIcon } from"lucide-react";

interface FormSectionProps {
 title: string;
 description?: string;
 icon?: LucideIcon;
 children: React.ReactNode;
 variant?:"default"|"danger";
 className?: string;
}

export function FormSection({
 title,
 description,
 icon: Icon,
 children,
 variant ="default",
 className,
}: FormSectionProps) {
 const isDanger = variant ==="danger";

 return (
 <div
 className={cn(
 "rounded-xl border bg-card p-6 space-y-6 shadow-sm",
 isDanger
 ? "border-destructive bg-destructive/10"
 : "border-border",
 className
 )}
 >
 <div>
 <h3
 className={cn(
 "text-xl font-semibold flex items-center gap-2",
 isDanger
 ? "text-destructive"
 : "text-foreground"
 )}
 >
 {Icon && <Icon className="w-6 h-6"/>}
 {title}
 </h3>
 {description && (
 <p
 className={cn(
"text-sm font-medium mt-2",
 isDanger ?"text-destructive/80":"text-muted-foreground"
 )}
 >
 {description}
 </p>
 )}
 </div>
 {children}
 </div>
 );
}
