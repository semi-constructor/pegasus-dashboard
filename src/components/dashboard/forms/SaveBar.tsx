"use client";

import { Save, RotateCcw, Loader2 } from"lucide-react";
import { Button } from"@/components/ui/button";
import { cn } from"@/lib/utils";
import { motion, AnimatePresence } from"framer-motion";
import { useTranslations } from "next-intl";

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
 const t = useTranslations('forms');

  return (
    <AnimatePresence>
      {hasChanges && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={cn(
            "fixed bottom-0 left-0 right-0 md:left-64 z-50 border-t border-border bg-card/80 backdrop-blur-xl p-3 sm:p-4 shadow-lg pb-safe",
            className
          )}
        >
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse shrink-0"/>
              <span className="text-xs sm:text-sm font-medium text-foreground">
                {t('saveBar.unsavedChanges')}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
              <Button
                onClick={onDiscard}
                disabled={isPending}
                variant="ghost"
                size="sm"
                className="font-medium text-xs sm:text-sm flex-1 sm:flex-none"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2"/>
                {t('saveBar.discard')}
              </Button>
              <Button
                onClick={onSave}
                disabled={isPending}
                variant="default"
                size="sm"
                className="font-medium shadow-sm text-xs sm:text-sm flex-1 sm:flex-none"
              >
                {isPending ? (
                  <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 animate-spin"/>
                ) : (
                  <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2"/>
                )}
                {isPending ? t('saveBar.saving') : t('saveBar.saveChanges')}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
