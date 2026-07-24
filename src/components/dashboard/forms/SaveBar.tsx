"use client";

import { Save, RotateCcw, Loader2 } from"lucide-react";
import { Button } from"@/components/ui/button";
import { cn } from"@/lib/utils";
import { motion, AnimatePresence } from"framer-motion";

interface SaveBarProps {
 hasChanges: boolean;
 isPending: boolean;
 onSave: () => void;
 onDiscard: () => void;
 className?: string;
}

export function SaveBar({
 hasChanges,
 isPending,
 onSave,
 onDiscard,
 className,
}: SaveBarProps) {
 return (
 <AnimatePresence>
 {hasChanges && (
 <motion.div
 initial={{ y: 100, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 exit={{ y: 100, opacity: 0 }}
 transition={{ type:"spring", stiffness: 300, damping: 30 }}
 className={cn(
"fixed bottom-0 left-0 right-0 md:left-64 z-50 border-t border-border bg-card/80 backdrop-blur-xl p-4 shadow-lg",
 className
 )}
 >
 <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
 <div className="flex items-center gap-2">
 <div className="w-2 h-2 bg-yellow-500 animate-pulse"/>
 <span className="text-sm font-medium text-foreground">
 Unsaved changes
 </span>
 </div>

 <div className="flex items-center gap-3">
 <Button
 onClick={onDiscard}
 disabled={isPending}
 variant="ghost"
 className="font-medium"
 >
 <RotateCcw className="w-4 h-4 mr-2"/>
 Discard
 </Button>
 <Button
 onClick={onSave}
 disabled={isPending}
 variant="default"
 className="font-medium shadow-sm"
 >
 {isPending ? (
 <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
 ) : (
 <Save className="w-4 h-4 mr-2"/>
 )}
 {isPending ?"Saving...":"Save changes"}
 </Button>
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 );
}
