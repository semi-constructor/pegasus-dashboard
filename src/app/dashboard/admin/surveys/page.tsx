import { db } from "@/lib/db";
import { surveys } from "../../../../../schemas/surveys";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminSurveysPage() {
  const adminSurveys = await db.select().from(surveys).where(eq(surveys.scope, 'SYSTEM'));

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-border pb-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-lg font-medium tracking-[0.3em] uppercase text-foreground">System Surveys</h1>
          <p className="text-foreground/50 text-sm tracking-wide">Manage global surveys for all users.</p>
        </div>
        <Link href={`/dashboard/admin/surveys/new`}>
          <button className="px-6 py-3 border border-border text-foreground text-[10px] uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors w-full md:w-auto">
            Create Global Survey
          </button>
        </Link>
      </div>
      
      <div className="space-y-12">
        {adminSurveys.length === 0 ? (
          <div className="bg-background border border-border p-12 text-center">
            <h3 className="text-foreground text-sm tracking-widest uppercase mb-2">No global surveys</h3>
            <p className="text-foreground/50 text-[10px] tracking-widest uppercase">Create a system-wide survey here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/10 border border-border">
            {adminSurveys.map((survey) => (
              <div key={survey.id} className="bg-background p-8 hover:bg-foreground/5 transition-colors flex flex-col justify-between group min-h-[250px]">
                <div className="space-y-4 mb-8">
                  <h3 className="text-foreground text-lg tracking-wide">{survey.title}</h3>
                  <p className="text-foreground/50 text-sm line-clamp-3">{survey.description}</p>
                </div>
                <div className="flex justify-between items-end mt-auto pt-8 border-t border-border">
                  <span className="text-[10px] text-foreground/50 uppercase tracking-widest border border-border px-2 py-1">{survey.status}</span>
                  <Link href={`/dashboard/admin/surveys/${survey.id}`}>
                    <span className="text-[10px] text-foreground uppercase tracking-widest group-hover:underline">View Stats</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
