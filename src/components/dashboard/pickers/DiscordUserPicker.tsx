"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { searchDiscordMembersAction } from "@/app/dashboard/[guildId]/actions";
import { useDebounce } from "@/hooks/use-debounce";
import type { DiscordMember } from "@/lib/discord-api";
import { useTranslations } from "next-intl";

interface DiscordUserPickerProps {
  guildId: string;
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DiscordUserPicker({
  guildId,
  value,
  onChange,
  placeholder,
  disabled = false,
  className,
}: DiscordUserPickerProps) {
  const t = useTranslations('forms');
  const defaultPlaceholder = placeholder || t('pickers.searchUsername');
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<DiscordMember[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<DiscordMember | null>(null);
  
  const debouncedQuery = useDebounce(query, 300);

  React.useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    let isMounted = true;
    setLoading(true);
    searchDiscordMembersAction(guildId, debouncedQuery)
      .then((data) => {
        if (isMounted) {
          setResults(data || []);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery, guildId]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white transition-all backdrop-blur-md shadow-sm",
            !value && "text-white/50",
            className
          )}
        >
          <span className="flex items-center gap-2 truncate">
            {value ? (
              <>
                <img 
                  src={selectedUser?.user.avatar ? `https://cdn.discordapp.com/avatars/${value}/${selectedUser.user.avatar}.png` : "/favicon.ico"} 
                  className="w-4 h-4 rounded-full" 
                  alt="" 
                  onError={(e) => { e.currentTarget.src = "/favicon.ico" }}
                />
                {selectedUser?.user.username || value}
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 opacity-50" />
                {defaultPlaceholder}
              </>
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder={t('pickers.searchUsername')} 
            value={query} 
            onValueChange={setQuery} 
          />
          <CommandList>
            {loading && <div className="p-4 text-center text-sm text-white/50 flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> {t('pickers.searching')}</div>}
            {!loading && debouncedQuery.length > 1 && results.length === 0 && (
              <CommandEmpty>{t('pickers.noUsersFound')}</CommandEmpty>
            )}
            <CommandGroup>
              {value && (
                <CommandItem
                  onSelect={() => {
                    onChange(null);
                    setSelectedUser(null);
                    setOpen(false);
                  }}
                  className="text-muted-foreground"
                >
                  <X className="mr-2 h-3.5 w-3.5" />
                  {t('pickers.clearSelection')}
                </CommandItem>
              )}
              {results.map((member) => (
                <CommandItem
                  key={member.user.id}
                  value={member.user.id}
                  onSelect={() => {
                    onChange(member.user.id);
                    setSelectedUser(member);
                    setOpen(false);
                  }}
                >
                  <img 
                    src={member.user.avatar ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png` : "/favicon.ico"} 
                    className="w-5 h-5 rounded-full mr-2" 
                    alt=""
                    onError={(e) => { e.currentTarget.src = "/favicon.ico" }}
                  />
                  <span>{member.user.username} {member.nick && <span className="text-white/40 text-xs ml-1">({member.nick})</span>}</span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === member.user.id ? "opacity-100" : "opacity-0"
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
