"use client";

import * as React from"react";
import { Check, ChevronsUpDown, X } from"lucide-react";
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

export interface Option {
 label: string;
 value: string;
}

interface BrutalistMultiSelectProps {
 options: Option[];
 selected: string[];
 onChange: (selected: string[]) => void;
 placeholder?: string;
 emptyMessage?: string;
 className?: string;
}

export function BrutalistMultiSelect({
 options,
 selected,
 onChange,
 placeholder ="Select options...",
 emptyMessage ="No options found.",
 className,
}: BrutalistMultiSelectProps) {
 const [open, setOpen] = React.useState(false);

 const handleUnselect = (item: string) => {
 onChange(selected.filter((i) => i !== item));
 };

 return (
 <Popover open={open} onOpenChange={setOpen}>
 <PopoverTrigger asChild>
 <Button
 variant="outline"
 role="combobox"
 aria-expanded={open}
 className={cn(
"w-full justify-between bg-background shadow-sm hover:bg-accent hover:text-accent-foreground transition-all h-auto min-h-10 py-2 text-sm",
 className
 )}
 >
 <div className="flex flex-wrap gap-1">
 {selected.length > 0 ? (
 selected.map((item) => {
 const option = options.find((o) => o.value === item);
 return (
 <Badge
 key={item}
 variant="secondary"
 className="rounded-md mr-1"
 onClick={(e) => {
 e.stopPropagation();
 handleUnselect(item);
 }}
 >
 {option?.label || item}
 <X className="ml-1 h-3 w-3 cursor-pointer"/>
 </Badge>
 );
 })
 ) : (
 <span className="text-muted-foreground">{placeholder}</span>
 )}
 </div>
 <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
 </Button>
 </PopoverTrigger>
 <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
 <Command>
 <CommandInput placeholder="Search..."className="border-none focus:ring-0"/>
 <CommandList>
 <CommandEmpty>{emptyMessage}</CommandEmpty>
 <CommandGroup>
 {options.map((option) => (
 <CommandItem
 key={option.value}
 value={option.value}
 onSelect={(currentValue) => {
 const isSelected = selected.includes(option.value);
 if (isSelected) {
 onChange(selected.filter((item) => item !== option.value));
 } else {
 onChange([...selected, option.value]);
 }
 }}
 className="cursor-pointer"
 >
 <Check
 className={cn(
"mr-2 h-4 w-4",
 selected.includes(option.value) ?"opacity-100":"opacity-0"
 )}
 />
 {option.label}
 </CommandItem>
 ))}
 </CommandGroup>
 </CommandList>
 </Command>
 </PopoverContent>
 </Popover>
 );
}
