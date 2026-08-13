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
 headerAction?: React.ReactNode;
}

export function FormSection({
 title,
 description,
 icon: Icon,
 children,
 variant ="default",
 className,
 headerAction,
}: FormSectionProps) {
 const isDanger = variant ==="danger";

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 shadow-2xl backdrop-blur-md relative overflow-hidden",
        isDanger
          ? "border-red-500/30 bg-red-500/5"
          : "border-border bg-foreground/5",
        className
      )}
    >
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <h3
            className={cn(
              "text-xl sm:text-2xl font-bold flex items-center gap-2.5 sm:gap-3 tracking-tight",
              isDanger ? "text-red-400" : "text-foreground"
            )}
          >
            {Icon && <Icon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />}
            {title}
          </h3>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
        {description && (
          <p
            className={cn(
              "text-xs sm:text-sm font-medium mt-1.5 sm:mt-2 max-w-2xl",
              isDanger ? "text-red-400/80" : "text-foreground/50"
            )}
          >
            {description}
          </p>
        )}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
