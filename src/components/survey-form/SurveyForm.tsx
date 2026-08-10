"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { submitSurveyResponse } from "@/lib/actions/surveys";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SurveyForm({ survey, questions, previousAnswers, isClosed }: any) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    // Prepopulate answers if they exist
    const initial: Record<string, any> = {};
    previousAnswers?.forEach((a: any) => {
      const q = questions.find((q: any) => q.id === a.questionId);
      if (q) {
        if (q.type === 'CHECKBOXES') {
          initial[q.id] = Array.isArray(a.answerChoices) ? a.answerChoices : [a.answerChoices];
        } else if (q.type === 'MULTIPLE_CHOICE' || q.type === 'DROPDOWN') {
          initial[q.id] = Array.isArray(a.answerChoices) ? a.answerChoices[0] : a.answerChoices;
        } else {
          initial[q.id] = a.answerText;
        }
      }
    });
    return initial;
  });

  const handleChange = (questionId: string, value: any) => {
    if (isClosed) return;
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isClosed) return;
    
    setIsSubmitting(true);
    try {
      const formattedAnswers = questions.map((q: any) => {
        const val = answers[q.id];
        return {
          questionId: q.id,
          answerText: (q.type === 'TEXT' || q.type === 'LONG_TEXT' || q.type === 'NUMBER' || q.type === 'DATE') ? String(val || '') : null,
          answerChoices: (q.type === 'MULTIPLE_CHOICE' || q.type === 'DROPDOWN') ? (val ? [val] : []) : 
                         (q.type === 'CHECKBOXES' ? (val || []) : null),
        };
      });

      const res = await submitSurveyResponse(survey.id, formattedAnswers);
      if (res.success) {
        toast.success("Survey submitted successfully!");
        router.push(`/dashboard/profile/surveys`);
      } else {
        toast.error(res.error || "Failed to submit survey");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6 pb-20">
      <Card className="border-t-8 border-t-primary">
        <CardHeader>
          <CardTitle className="text-3xl">{survey.title}</CardTitle>
          {survey.description && <CardDescription className="text-lg mt-2">{survey.description}</CardDescription>}
          {isClosed && (
            <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md mt-4 font-medium">
              This survey is now closed. You cannot modify your answers.
            </div>
          )}
        </CardHeader>
      </Card>

      {questions.map((q: any) => (
        <Card key={q.id}>
          <CardHeader>
            <CardTitle className="text-lg">
              {q.questionText} {q.required && <span className="text-destructive">*</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {q.type === 'TEXT' && (
              <Input 
                value={answers[q.id] || ''} 
                onChange={(e) => handleChange(q.id, e.target.value)} 
                required={q.required}
                disabled={isClosed}
              />
            )}
            
            {q.type === 'LONG_TEXT' && (
              <Textarea 
                value={answers[q.id] || ''} 
                onChange={(e) => handleChange(q.id, e.target.value)} 
                required={q.required}
                disabled={isClosed}
                rows={4}
              />
            )}

            {q.type === 'NUMBER' && (
              <Input 
                type="number"
                value={answers[q.id] || ''} 
                onChange={(e) => handleChange(q.id, e.target.value)} 
                required={q.required}
                disabled={isClosed}
              />
            )}

            {q.type === 'DATE' && (
              <Input 
                type="date"
                value={answers[q.id] || ''} 
                onChange={(e) => handleChange(q.id, e.target.value)} 
                required={q.required}
                disabled={isClosed}
              />
            )}

            {q.type === 'MULTIPLE_CHOICE' && (
              <RadioGroup 
                value={answers[q.id] || ''} 
                onValueChange={(val) => handleChange(q.id, val)}
                disabled={isClosed}
              >
                {q.options?.map((opt: any) => (
                  <div key={opt.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt.id} id={`radio-${opt.id}`} />
                    <Label htmlFor={`radio-${opt.id}`}>{opt.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {q.type === 'CHECKBOXES' && (
              <div className="space-y-2">
                {q.options?.map((opt: any) => {
                  const isChecked = (answers[q.id] || []).includes(opt.id);
                  return (
                    <div key={opt.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`check-${opt.id}`} 
                        checked={isChecked}
                        disabled={isClosed}
                        onCheckedChange={(checked) => {
                          const current = answers[q.id] || [];
                          if (checked) {
                            handleChange(q.id, [...current, opt.id]);
                          } else {
                            handleChange(q.id, current.filter((id: string) => id !== opt.id));
                          }
                        }}
                      />
                      <Label htmlFor={`check-${opt.id}`}>{opt.label}</Label>
                    </div>
                  );
                })}
              </div>
            )}

            {q.type === 'DROPDOWN' && (
              <Select 
                value={answers[q.id] || ''} 
                onValueChange={(val) => handleChange(q.id, val)}
                disabled={isClosed}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {q.options?.map((opt: any) => (
                    <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

          </CardContent>
        </Card>
      ))}

      {!isClosed && (
        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : (previousAnswers?.length > 0 ? "Update Response" : "Submit Survey")}
          </Button>
        </div>
      )}
    </form>
  );
}
