import { db } from "@/lib/db";
import { surveys, surveyResponses } from "../../../../../schemas/surveys";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ProfileSurveysPage() {
  const session = await auth();

  if (!session?.user?.discordId) {
    return <div>Please log in</div>;
  }

  // Fetch responses joined with survey details
  const userResponses = await db.select({
    response: surveyResponses,
    survey: surveys
  })
  .from(surveyResponses)
  .innerJoin(surveys, eq(surveyResponses.surveyId, surveys.id))
  .where(eq(surveyResponses.userId, session.user.discordId));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Surveys</h1>
        <p className="text-muted-foreground">View and edit the surveys you've filled out.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {userResponses.length === 0 ? (
          <div className="col-span-full text-muted-foreground py-10">
            You haven't responded to any surveys yet.
          </div>
        ) : (
          userResponses.map((item) => {
            const isClosed = item.survey.status === 'CLOSED' || (item.survey.endDate && new Date(item.survey.endDate) < new Date());
            return (
              <Card key={item.response.id}>
                <CardHeader>
                  <CardTitle>{item.survey.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">
                    Responded on {new Date(item.response.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-md ${isClosed ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                      {isClosed ? 'CLOSED' : 'ACTIVE'}
                    </span>
                    <Link href={`/surveys/${item.survey.id}`}>
                      <Button variant="secondary" size="sm">
                        {isClosed ? 'View Answers' : 'Edit Answers'}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
