"use client";

import { Switch } from"@/components/ui/switch";
import { cn } from"@/lib/utils";

interface ToggleFieldProps {
 label: string;
 description?: string;
 checked: boolean;
 onCheckedChange: (checked: boolean) => void;
 disabled?: boolean;
 className?: string;
}

export function ToggleField({
 label,
 description,
 checked,
 onCheckedChange,
 disabled = false,
 className,
}: ToggleFieldProps) {
 return (
 <div
 className={cn(
"flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm",
 className
 )}
 >
 <div className="space-y-0.5">
 <label className="text-base font-semibold text-foreground">
 {label}
 </label>
 {description && (
 <p className="text-sm text-muted-foreground">
 {description}
 </p>
 )}
 </div>
 <Switch
 checked={checked}
 onCheckedChange={onCheckedChange}
 disabled={disabled}
 className=""
 />
 </div>
 );
}
