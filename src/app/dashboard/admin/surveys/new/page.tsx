import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SurveyBuilder } from "@/components/survey-builder/SurveyBuilder";

export default function NewAdminSurveyPage() {
  return (
    <div className="space-y-12 h-[calc(100vh-4rem)] flex flex-col">
      <SurveyBuilder 
        title="Create Global Survey"
        subtitle="System-wide survey builder"
        onCancelUrl="/dashboard/admin/surveys" 
        scope="SYSTEM" 
        guildId={null} 
      />
    </div>
  );
}
