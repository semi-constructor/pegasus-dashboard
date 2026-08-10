import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SurveyBuilder } from "@/components/survey-builder/SurveyBuilder";

export default function NewGuildSurveyPage({ params }: { params: { guildId: string } }) {
  return (
    <div className="p-6 space-y-6 h-[calc(100vh-4rem)] flex flex-col">
      <SurveyBuilder 
        title="Create Survey"
        subtitle="Server survey builder"
        onCancelUrl={`/dashboard/${params.guildId}/surveys`} 
        scope="GUILD" 
        guildId={params.guildId} 
      />
    </div>
  );
}
