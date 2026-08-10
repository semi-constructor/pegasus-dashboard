import { db } from "@/lib/db";
import { surveys, surveyQuestions, surveyResponses, surveyAnswers } from "../../../../../../schemas/surveys";
import { eq, and, inArray } from "drizzle-orm";
import { SurveyStatistics } from "@/components/survey-dashboard/SurveyStatistics";
import { CopyLinkButton } from "@/components/survey-dashboard/CopyLinkButton";
import { DeleteSurveyButton } from "@/components/survey-dashboard/DeleteSurveyButton";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function GuildSurveyStatsPage({ params }: { params: Promise<{ guildId: string, surveyId: string }> }) {
  const { guildId, surveyId } = await params;

  const [survey] = await db.select().from(surveys).where(
    and(eq(surveys.id, surveyId), eq(surveys.guildId, guildId))
  );
  
  if (!survey) {
    notFound();
  }

  const questions = await db.select().from(surveyQuestions).where(eq(surveyQuestions.surveyId, surveyId));
  const responses = await db.select().from(surveyResponses).where(eq(surveyResponses.surveyId, surveyId));
  
  const responseIds = responses.map(r => r.id);
  const answers = responseIds.length > 0 
    ? await db.select().from(surveyAnswers).where(inArray(surveyAnswers.responseId, responseIds))
    : [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Survey Statistics</h1>
          <p className="text-muted-foreground">Server overview</p>
        </div>
        <div className="flex gap-2">
          <CopyLinkButton surveyId={survey.id} />
          <Link href={`/dashboard/${guildId}/surveys`}>
            <Button variant="outline">Back to Surveys</Button>
          </Link>
          <DeleteSurveyButton surveyId={survey.id} scope="GUILD" guildId={guildId} />
        </div>
      </div>
      
      <SurveyStatistics survey={survey} questions={questions} responses={responses} answers={answers} />
    </div>
  );
}
