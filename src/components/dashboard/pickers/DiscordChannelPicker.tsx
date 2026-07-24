"use client";

import * as React from"react";
import { Check, Hash, Volume2, ChevronsUpDown, X } from"lucide-react";
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

export interface ChannelOption {
 id: string;
 name: string;
 type: number; // 0=text, 2=voice, 5=announcement, etc.
 parent_id: string | null;
}

interface DiscordChannelPickerProps {
 channels: ChannelOption[];
 value: string | null;
 onChange: (value: string | null) => void;
 placeholder?: string;
 disabled?: boolean;
 className?: string;
}

interface DiscordChannelMultiPickerProps {
 channels: ChannelOption[];
 value: string[];
 onChange: (value: string[]) => void;
 placeholder?: string;
 disabled?: boolean;
 className?: string;
}

function ChannelIcon({ type }: { type: number }) {
 if (type === 2 || type === 13) {
 return <Volume2 className="w-3.5 h-3.5 text-muted-foreground shrink-0"/>;
 }
 return <Hash className="w-3.5 h-3.5 text-muted-foreground shrink-0"/>;
}

export function DiscordChannelPicker({
 channels,
 value,
 onChange,
 placeholder ="Select channel...",
 disabled = false,
 className,
}: DiscordChannelPickerProps) {
 const [open, setOpen] = React.useState(false);
 const selected = channels.find((c) => c.id === value);

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
 <ChannelIcon type={selected.type} />
 {selected.name}
 </>
 ) : (
 placeholder
 )}
 </span>
 <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
 </Button>
 </PopoverTrigger>
 <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0"align="start">
 <Command>
 <CommandInput placeholder="Search channels..."/>
 <CommandList>
 <CommandEmpty>No channels found.</CommandEmpty>
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
 {channels.map((channel) => (
 <CommandItem
 key={channel.id}
 value={`${channel.name}-${channel.id}`}
 onSelect={() => {
 onChange(channel.id);
 setOpen(false);
 }}
 >
 <ChannelIcon type={channel.type} />
 <span className="ml-2">{channel.name}</span>
 <Check
 className={cn(
"ml-auto h-4 w-4",
 value === channel.id ?"opacity-100":"opacity-0"
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

export function DiscordChannelMultiPicker({
 channels,
 value,
 onChange,
 placeholder ="Select channels...",
 disabled = false,
 className,
}: DiscordChannelMultiPickerProps) {
 const [open, setOpen] = React.useState(false);
 const selectedChannels = channels.filter((c) => value.includes(c.id));

 const toggleChannel = (channelId: string) => {
 if (value.includes(channelId)) {
 onChange(value.filter((id) => id !== channelId));
 } else {
 onChange([...value, channelId]);
 }
 };

 const removeChannel = (channelId: string, e: React.MouseEvent) => {
 e.stopPropagation();
 onChange(value.filter((id) => id !== channelId));
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
 {selectedChannels.length > 0 ? (
 selectedChannels.map((ch) => (
 <Badge
 key={ch.id}
 variant="secondary"
 className="rounded-md border border-border text-xs gap-1"
 >
 <ChannelIcon type={ch.type} />
 {ch.name}
 <X
 className="h-3 w-3 cursor-pointer hover:text-destructive"
 onClick={(e) => removeChannel(ch.id, e)}
 />
 </Badge>
 ))
 ) : (
 placeholder
 )}
 </span>
 <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
 </Button>
 </PopoverTrigger>
 <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0"align="start">
 <Command>
 <CommandInput placeholder="Search channels..."/>
 <CommandList>
 <CommandEmpty>No channels found.</CommandEmpty>
 <CommandGroup>
 {channels.map((channel) => (
 <CommandItem
 key={channel.id}
 value={`${channel.name}-${channel.id}`}
 onSelect={() => toggleChannel(channel.id)}
 >
 <ChannelIcon type={channel.type} />
 <span className="ml-2">{channel.name}</span>
 <Check
 className={cn(
"ml-auto h-4 w-4",
 value.includes(channel.id) ?"opacity-100":"opacity-0"
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
