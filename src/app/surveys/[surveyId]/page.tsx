import { db } from "@/lib/db";
import { surveys, surveyQuestions, surveyResponses, surveyAnswers } from "../../../../schemas/surveys";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { SurveyForm } from "@/components/survey-form/SurveyForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function PublicSurveyPage({ params }: { params: Promise<{ surveyId: string }> }) {
  const { surveyId } = await params;
  const session = await auth();

  if (!session?.user?.discordId) {
    // Requires discord login
    redirect(`/login?callbackUrl=/surveys/${surveyId}`);
  }

  const [survey] = await db.select().from(surveys).where(eq(surveys.id, surveyId));
  
  if (!survey) {
    notFound();
  }

  const isClosed = survey.status === 'CLOSED' || (survey.endDate && new Date(survey.endDate) < new Date());

  const questions = await db.select().from(surveyQuestions).where(eq(surveyQuestions.surveyId, surveyId)).orderBy(surveyQuestions.order);

  // Check if user has answered before
  const existingResponses = await db.select().from(surveyResponses).where(
    and(eq(surveyResponses.surveyId, surveyId), eq(surveyResponses.userId, session.user.discordId))
  );

  let previousAnswers: any[] = [];
  if (existingResponses.length > 0) {
    previousAnswers = await db.select().from(surveyAnswers).where(eq(surveyAnswers.responseId, existingResponses[0].id));
  }

  return (
    <div className="min-h-screen bg-muted/10 p-6">
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between">
        <Link href="/dashboard/profile/surveys">
          <Button variant="ghost">← Back to Profile</Button>
        </Link>
      </div>
      
      <SurveyForm 
        survey={survey} 
        questions={questions} 
        previousAnswers={previousAnswers} 
        isClosed={isClosed} 
      />
    </div>
  );
}
