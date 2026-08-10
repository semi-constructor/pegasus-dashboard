"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteSurvey } from "@/lib/actions/surveys";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DeleteSurveyButton({ surveyId, scope, guildId }: { surveyId: string, scope: 'GUILD' | 'SYSTEM', guildId?: string | null }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this survey? This action cannot be undone and will delete all responses.")) {
      return;
    }

    setIsDeleting(true);
    const res = await deleteSurvey(surveyId, scope, guildId);
    
    if (res.success) {
      toast.success("Survey deleted successfully");
      if (scope === 'SYSTEM') {
        router.push('/dashboard/admin/surveys');
      } else {
        router.push(`/dashboard/${guildId}/surveys`);
      }
    } else {
      toast.error(res.error || "Failed to delete survey");
      setIsDeleting(false);
    }
  };

  return (
    <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="gap-2">
      <Trash2 size={16} />
      {isDeleting ? "Deleting..." : "Delete Survey"}
    </Button>
  );
}
