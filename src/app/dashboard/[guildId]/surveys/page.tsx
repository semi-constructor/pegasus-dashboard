import { db } from "@/lib/db";
import { surveys } from "../../../../../schemas/surveys";
import { eq, and } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function GuildSurveysPage({ params }: { params: { guildId: string } }) {
  const guildSurveys = await db.select().from(surveys).where(and(eq(surveys.guildId, params.guildId), eq(surveys.scope, 'GUILD')));

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Surveys</h1>
          <p className="text-muted-foreground">Manage feedback and forms for your server.</p>
        </div>
        <Link href={`/dashboard/${params.guildId}/surveys/new`}>
          <Button>Create Survey</Button>
        </Link>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {guildSurveys.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <h3 className="text-lg font-semibold">No surveys yet</h3>
              <p className="text-muted-foreground mt-2">Create your first survey to start collecting feedback.</p>
            </CardContent>
          </Card>
        ) : (
          guildSurveys.map((survey) => (
            <Card key={survey.id}>
              <CardHeader>
                <CardTitle>{survey.title}</CardTitle>
                <CardDescription>{survey.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <span className="text-sm font-medium">{survey.status}</span>
                <Link href={`/dashboard/${params.guildId}/surveys/${survey.id}`}>
                  <Button variant="outline" size="sm">View Stats</Button>
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
