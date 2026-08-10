"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

type SurveyStatsProps = {
  survey: any;
  questions: any[];
  responses: any[];
  answers: any[];
};

export function SurveyStatistics({ survey, questions, responses, answers }: SurveyStatsProps) {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658'];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{survey.title}</CardTitle>
          <p className="text-muted-foreground">{survey.description}</p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium">
              {responses.length} Responses
            </div>
            <div className="bg-muted px-4 py-2 rounded-lg font-medium uppercase text-muted-foreground">
              {survey.status}
            </div>
          </div>
        </CardContent>
      </Card>

      {questions.map((q) => {
        const qAnswers = answers.filter((a) => a.questionId === q.id);

        if (q.type === 'MULTIPLE_CHOICE' || q.type === 'CHECKBOXES' || q.type === 'DROPDOWN') {
          // Process answers for pie chart
          const counts: Record<string, number> = {};
          q.options?.forEach((opt: any) => {
            counts[opt.id] = 0;
          });

          qAnswers.forEach((a) => {
            if (a.answerChoices) {
              const choices = Array.isArray(a.answerChoices) ? a.answerChoices : [a.answerChoices];
              choices.forEach((choice: string) => {
                if (counts[choice] !== undefined) counts[choice]++;
              });
            }
          });

          const data = q.options?.map((opt: any) => ({
            name: opt.label,
            value: counts[opt.id] || 0
          })).filter((d: any) => d.value > 0); // Only show options with > 0 votes

          return (
            <Card key={q.id}>
              <CardHeader>
                <CardTitle className="text-lg">{q.questionText}</CardTitle>
                <p className="text-sm text-muted-foreground">{q.type.replace('_', ' ')} - {qAnswers.length} responses</p>
              </CardHeader>
              <CardContent>
                {data && data.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {data.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No data for this question yet.</p>
                )}
              </CardContent>
            </Card>
          );
        }

        // For TEXT or LONG_TEXT
        return (
          <Card key={q.id}>
            <CardHeader>
              <CardTitle className="text-lg">{q.questionText}</CardTitle>
              <p className="text-sm text-muted-foreground">{q.type.replace('_', ' ')} - {qAnswers.length} responses</p>
            </CardHeader>
            <CardContent>
              {qAnswers.length > 0 ? (
                <ul className="space-y-3">
                  {qAnswers.slice(0, 10).map((a, i) => (
                    <li key={i} className="bg-muted/30 p-3 rounded-md text-sm">
                      {a.answerText || 'No answer'}
                    </li>
                  ))}
                  {qAnswers.length > 10 && (
                    <li className="text-sm text-muted-foreground text-center">+ {qAnswers.length - 10} more responses</li>
                  )}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-8">No responses yet.</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
