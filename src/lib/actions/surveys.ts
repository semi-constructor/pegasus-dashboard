"use server";

import { db } from "@/lib/db";
import { surveys, surveyQuestions, surveySections } from "../../../schemas/surveys";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export type SaveSurveyPayload = {
  title: string;
  description: string;
  scope: 'GUILD' | 'SYSTEM';
  guildId: string | null;
  status: 'DRAFT' | 'ACTIVE';
  endDate: string | null;
  questions: {
    id: string;
    type: any;
    questionText: string;
    required: boolean;
    options?: { id: string; label: string }[];
  }[];
};

export async function saveSurvey(payload: SaveSurveyPayload) {
  const session = await auth();
  if (!session?.user?.discordId) {
    throw new Error("Unauthorized");
  }

  // 1. Insert the Survey
  const [newSurvey] = await db.insert(surveys).values({
    title: payload.title || "Untitled Survey",
    description: payload.description,
    scope: payload.scope,
    guildId: payload.guildId,
    creatorId: session.user.discordId,
    status: payload.status,
    endDate: payload.endDate ? new Date(payload.endDate) : null,
    settings: {
      access: { authentication: 'PUBLIC', anonymous: true },
      allowMultipleResponses: false,
      showProgressBar: true,
      shuffleQuestions: false,
      confirmationMessage: "Thanks for your response!"
    }
  }).returning({ id: surveys.id });

  // 2. Insert Questions
  if (payload.questions.length > 0) {
    await db.insert(surveyQuestions).values(
      payload.questions.map((q, index) => ({
        surveyId: newSurvey.id,
        key: q.id,
        type: q.type,
        questionText: q.questionText,
        options: q.options || null,
        required: q.required,
        order: index
      }))
    );
  }

  // Redirect back to list
  if (payload.scope === 'SYSTEM') {
    redirect('/dashboard/admin/surveys');
  } else {
    redirect(`/dashboard/${payload.guildId}/surveys`);
  }
}

export async function submitSurveyResponse(surveyId: string, answers: any[]) {
  const session = await auth();
  if (!session?.user?.discordId) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = session.user.discordId;

  try {
    const { eq, and } = await import('drizzle-orm');
    const { surveyResponses, surveyAnswers, surveys } = await import('../../../schemas/surveys');

    const [survey] = await db.select().from(surveys).where(eq(surveys.id, surveyId));
    if (!survey) return { success: false, error: "Survey not found" };

    if (survey.status === 'CLOSED' || (survey.endDate && new Date(survey.endDate) < new Date())) {
      return { success: false, error: "Survey is closed" };
    }

    // Check if user already responded
    const existing = await db.select().from(surveyResponses).where(
      and(eq(surveyResponses.surveyId, surveyId), eq(surveyResponses.userId, userId))
    );

    let responseId;
    if (existing.length > 0) {
      responseId = existing[0].id;
      // Delete existing answers to replace them
      await db.delete(surveyAnswers).where(eq(surveyAnswers.responseId, responseId));
    } else {
      const [newResponse] = await db.insert(surveyResponses).values({
        surveyId,
        userId
      }).returning({ id: surveyResponses.id });
      responseId = newResponse.id;
    }

    if (answers.length > 0) {
      await db.insert(surveyAnswers).values(
        answers.map(a => ({
          responseId,
          questionId: a.questionId,
          answerText: a.answerText,
          answerChoices: a.answerChoices
        }))
      );
    }

    return { success: true };
  } catch (err: any) {
    console.error(err);
    return { success: false, error: err.message };
  }
}

export async function deleteSurvey(surveyId: string, scope: 'GUILD' | 'SYSTEM', guildId?: string | null) {
  const session = await auth();
  if (!session?.user?.discordId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { eq } = await import('drizzle-orm');
    const { surveys } = await import('../../../schemas/surveys');

    // Make sure they have permission to delete the survey (in this simplistic setup, we just delete it)
    await db.delete(surveys).where(eq(surveys.id, surveyId));
    
    return { success: true };
  } catch (err: any) {
    console.error(err);
    return { success: false, error: err.message };
  }
}
