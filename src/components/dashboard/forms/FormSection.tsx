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
        "rounded-2xl border p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-md relative overflow-hidden",
        isDanger
          ? "border-red-500/30 bg-red-500/5"
          : "border-white/10 bg-white/5",
        className
      )}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4">
          <h3
            className={cn(
              "text-2xl font-bold flex items-center gap-3 tracking-tight",
              isDanger ? "text-red-400" : "text-white"
            )}
          >
            {Icon && <Icon className="w-6 h-6" />}
            {title}
          </h3>
          {headerAction && <div>{headerAction}</div>}
        </div>
        {description && (
          <p
            className={cn(
              "text-sm font-medium mt-2 max-w-2xl",
              isDanger ? "text-red-400/80" : "text-white/50"
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
