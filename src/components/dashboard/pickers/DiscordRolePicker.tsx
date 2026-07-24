"use client";

import * as React from"react";
import { Check, ChevronsUpDown, X, Shield } from"lucide-react";
import { cn } from"@/lib/utils";
import { Button } from"@/components/ui/button";
import {
 Command,
 CommandEmpty,
 CommandGroup,
 CommandInput,
 CommandItem,
 CommandList,
} from"@/components/ui/command";
import {
 Popover,
 PopoverContent,
 PopoverTrigger,
} from"@/components/ui/popover";
import { Badge } from"@/components/ui/badge";

export interface RoleOption {
 id: string;
 name: string;
 color: number;
 position: number;
}

interface DiscordRolePickerProps {
 roles: RoleOption[];
 value: string | null;
 onChange: (value: string | null) => void;
 placeholder?: string;
 disabled?: boolean;
 className?: string;
}

interface DiscordRoleMultiPickerProps {
 roles: RoleOption[];
 value: string[];
 onChange: (value: string[]) => void;
 placeholder?: string;
 disabled?: boolean;
 className?: string;
}

function RoleColorDot({ color }: { color: number }) {
 const hexColor = color === 0 ?"#99AAB5": `#${color.toString(16).padStart(6,"0")}`;
 return (
 <div
 className="w-3 h-3 rounded-full shrink-0 border border-white/20"
 style={{ backgroundColor: hexColor }}
 />
 );
}

export function DiscordRolePicker({
 roles,
 value,
 onChange,
 placeholder ="Select role...",
 disabled = false,
 className,
}: DiscordRolePickerProps) {
 const [open, setOpen] = React.useState(false);
 const selected = roles.find((r) => r.id === value);

 return (
 <Popover open={open} onOpenChange={setOpen}>
 <PopoverTrigger asChild>
 <Button
 variant="outline"
 role="combobox"
 aria-expanded={open}
 disabled={disabled}
 className={cn(
"w-full justify-between bg-background text-sm shadow-sm",
 !value &&"text-muted-foreground",
 className
 )}
 >
 <span className="flex items-center gap-2 truncate">
 {selected ? (
 <>
 <RoleColorDot color={selected.color} />
 {selected.name}
 </>
 ) : (
 <>
 <Shield className="w-3.5 h-3.5 opacity-50"/>
 {placeholder}
 </>
 )}
 </span>
 <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
 </Button>
 </PopoverTrigger>
 <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0"align="start">
 <Command>
 <CommandInput placeholder="Search roles..."/>
 <CommandList>
 <CommandEmpty>No roles found.</CommandEmpty>
 <CommandGroup>
 {value && (
 <CommandItem
 onSelect={() => {
 onChange(null);
 setOpen(false);
 }}
 className="text-muted-foreground"
 >
 <X className="mr-2 h-3.5 w-3.5"/>
 Clear selection
 </CommandItem>
 )}
 {roles.map((role) => (
 <CommandItem
 key={role.id}
 value={`${role.name}-${role.id}`}
 onSelect={() => {
 onChange(role.id);
 setOpen(false);
 }}
 >
 <RoleColorDot color={role.color} />
 <span className="ml-2">{role.name}</span>
 <Check
 className={cn(
"ml-auto h-4 w-4",
 value === role.id ?"opacity-100":"opacity-0"
 )}
 />
 </CommandItem>
 ))}
 </CommandGroup>
 </CommandList>
 </Command>
 </PopoverContent>
 </Popover>
 );
}

export function DiscordRoleMultiPicker({
 roles,
 value,
 onChange,
 placeholder ="Select roles...",
 disabled = false,
 className,
}: DiscordRoleMultiPickerProps) {
 const [open, setOpen] = React.useState(false);
 const selectedRoles = roles.filter((r) => value.includes(r.id));

 const toggleRole = (roleId: string) => {
 if (value.includes(roleId)) {
 onChange(value.filter((id) => id !== roleId));
 } else {
 onChange([...value, roleId]);
 }
 };

 const removeRole = (roleId: string, e: React.MouseEvent) => {
 e.stopPropagation();
 onChange(value.filter((id) => id !== roleId));
 };

 return (
 <Popover open={open} onOpenChange={setOpen}>
 <PopoverTrigger asChild>
 <Button
 variant="outline"
 role="combobox"
 aria-expanded={open}
 disabled={disabled}
 className={cn(
"w-full justify-between bg-background text-sm min-h-[40px] h-auto shadow-sm",
 !value.length &&"text-muted-foreground",
 className
 )}
 >
 <span className="flex flex-wrap gap-1 items-center">
 {selectedRoles.length > 0 ? (
 selectedRoles.map((role) => {
 const hexColor = role.color === 0 ?"#99AAB5": `#${role.color.toString(16).padStart(6,"0")}`;
 return (
 <Badge
 key={role.id}
 variant="secondary"
 className="rounded-md border text-xs gap-1"
 style={{ borderColor: hexColor, color: hexColor }}
 >
 <RoleColorDot color={role.color} />
 {role.name}
 <X
 className="h-3 w-3 cursor-pointer hover:text-destructive"
 onClick={(e) => removeRole(role.id, e)}
 />
 </Badge>
 );
 })
 ) : (
 <>
 <Shield className="w-3.5 h-3.5 opacity-50"/>
 {placeholder}
 </>
 )}
 </span>
 <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
 </Button>
 </PopoverTrigger>
 <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0"align="start">
 <Command>
 <CommandInput placeholder="Search roles..."/>
 <CommandList>
 <CommandEmpty>No roles found.</CommandEmpty>
 <CommandGroup>
 {roles.map((role) => (
 <CommandItem
 key={role.id}
 value={`${role.name}-${role.id}`}
 onSelect={() => toggleRole(role.id)}
 >
 <RoleColorDot color={role.color} />
 <span className="ml-2">{role.name}</span>
 <Check
 className={cn(
"ml-auto h-4 w-4",
 value.includes(role.id) ?"opacity-100":"opacity-0"
 )}
 />
 </CommandItem>
 ))}
 </CommandGroup>
 </CommandList>
 </Command>
 </PopoverContent>
 </Popover>
 );
}
