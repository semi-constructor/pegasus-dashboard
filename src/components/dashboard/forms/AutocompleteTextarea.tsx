"use client";

import React, { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface AutocompleteOption {
  value: string; // e.g. "user" (this becomes {user})
  label: string; // e.g. "User Mention"
  description: string; // e.g. "<@userId>"
}

interface AutocompleteTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  options: AutocompleteOption[];
  onValueChange: (val: string) => void;
}

export function AutocompleteTextarea({
  options,
  value,
  onValueChange,
  className,
  ...props
}: AutocompleteTextareaProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [cursorPos, setCursorPos] = useState(0);
  const [filter, setFilter] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const filteredOptions = options.filter(o =>
    o.value.toLowerCase().includes(filter.toLowerCase()) ||
    o.label.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (textareaRef.current && !textareaRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showDropdown) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredOptions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredOptions.length) % filteredOptions.length);
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        insertOption(filteredOptions[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    onValueChange(val);

    const pos = e.target.selectionStart;
    setCursorPos(pos);

    // Look back to see if we are currently typing a variable inside {
    const textBeforeCursor = val.substring(0, pos);
    const lastOpenBraceIndex = textBeforeCursor.lastIndexOf("{");
    const lastCloseBraceIndex = textBeforeCursor.lastIndexOf("}");

    if (lastOpenBraceIndex !== -1 && lastOpenBraceIndex > lastCloseBraceIndex) {
      const currentFilter = textBeforeCursor.substring(lastOpenBraceIndex + 1);
      // Ensure there are no spaces in the variable name
      if (!/\s/.test(currentFilter)) {
        setFilter(currentFilter);
        setShowDropdown(true);
        setSelectedIndex(0);
      } else {
        setShowDropdown(false);
      }
    } else {
      setShowDropdown(false);
    }
  };

  const insertOption = (option: AutocompleteOption) => {
    if (!textareaRef.current) return;
    
    const val = String(value || "");
    const textBeforeCursor = val.substring(0, cursorPos);
    const lastOpenBraceIndex = textBeforeCursor.lastIndexOf("{");
    
    if (lastOpenBraceIndex !== -1) {
      const prefix = val.substring(0, lastOpenBraceIndex);
      // We insert {user} not {<@userId>} 
      const replacement = `{${option.value}}`;
      const suffix = val.substring(cursorPos);
      
      const newVal = prefix + replacement + suffix;
      onValueChange(newVal);
      
      // Reset dropdown
      setShowDropdown(false);
      
      // Update cursor focus
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const newPos = prefix.length + replacement.length;
          textareaRef.current.setSelectionRange(newPos, newPos);
        }
      }, 0);
    }
  };

  return (
    <div className="relative w-full">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={cn("w-full relative z-10", className)}
        {...props}
      />
      {showDropdown && filteredOptions.length > 0 && (
        <div 
          className="absolute z-50 bg-neutral-900 border border-neutral-800 rounded-md shadow-lg py-1 mt-1 flex flex-col max-h-[200px] overflow-y-auto min-w-[200px]"
          // Position relative to textarea cursor approximately (a simple approach is floating below textarea)
        >
          {filteredOptions.map((opt, idx) => (
            <div
              key={opt.value}
              className={cn(
                "px-3 py-2 cursor-pointer flex flex-col transition-colors",
                idx === selectedIndex ? "bg-primary/20 text-primary" : "text-neutral-200 hover:bg-neutral-800"
              )}
              onMouseDown={(e) => {
                e.preventDefault(); // prevent losing focus
                insertOption(opt);
              }}
            >
              <div className="font-bold text-sm">{"{"}{opt.value}{"}"} <span className="text-xs font-normal opacity-70 ml-2">- {opt.label}</span></div>
              <div className="text-xs opacity-50">{opt.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
