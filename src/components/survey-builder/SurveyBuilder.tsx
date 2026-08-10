"use client";

import React, { useState } from "react";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { GripVertical, Trash2, Plus, X, Circle, Square } from "lucide-react";

type SurveyOption = { id: string; label: string };

type Question = {
  id: string;
  type: string;
  questionText: string;
  required: boolean;
  options?: SurveyOption[];
};

function SortableQuestion({ 
  question, 
  onRemove,
  onSelect,
  onChange,
  isSelected
}: { 
  question: Question; 
  onRemove: (id: string) => void;
  onSelect: (id: string) => void;
  onChange: (id: string, updates: Partial<Question>) => void;
  isSelected: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const addOption = () => {
    const newOption = { id: `opt_${Date.now()}`, label: `Option ${(question.options?.length || 0) + 1}` };
    onChange(question.id, { options: [...(question.options || []), newOption] });
  };

  const updateOption = (optId: string, newLabel: string) => {
    onChange(question.id, { 
      options: question.options?.map(o => o.id === optId ? { ...o, label: newLabel } : o) 
    });
  };

  const removeOption = (optId: string) => {
    onChange(question.id, { options: question.options?.filter(o => o.id !== optId) });
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`mb-4 cursor-default border-2 transition-all ${isSelected ? 'border-primary shadow-md' : 'border-transparent hover:border-border'}`}
      onClick={(e) => { e.stopPropagation(); onSelect(question.id); }}
    >
      <CardContent className="p-0 flex items-stretch">
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab hover:bg-muted/50 p-3 flex items-center justify-center border-r"
        >
          <GripVertical size={20} className="text-muted-foreground" />
        </div>
        <div className="flex-1 p-5">
          <div className="flex justify-between items-start gap-4">
            <input 
              type="text"
              className="w-full text-lg font-medium bg-transparent outline-none border-b-2 border-transparent focus:border-primary transition-colors pb-1"
              value={question.questionText}
              onChange={(e) => onChange(question.id, { questionText: e.target.value })}
              placeholder="Question text"
            />
          </div>

          <div className="mt-4 pl-1">
            {/* TEXT PREVIEW */}
            {(question.type === 'TEXT' || question.type === 'NUMBER' || question.type === 'DATE') && (
              <div className="border-b border-dashed border-muted-foreground/50 pb-2 w-1/2 text-muted-foreground text-sm">
                Short answer text
              </div>
            )}
            {question.type === 'LONG_TEXT' && (
              <div className="border border-dashed border-muted-foreground/50 rounded-md h-20 p-2 w-3/4 text-muted-foreground text-sm flex items-start">
                Long answer text
              </div>
            )}

            {/* OPTIONS PREVIEW */}
            {(question.type === 'MULTIPLE_CHOICE' || question.type === 'CHECKBOXES' || question.type === 'DROPDOWN') && (
              <div className="space-y-3">
                {question.options?.map((opt, i) => (
                  <div key={opt.id} className="flex items-center gap-3 group">
                    {question.type === 'MULTIPLE_CHOICE' && <Circle size={16} className="text-muted-foreground" />}
                    {question.type === 'CHECKBOXES' && <Square size={16} className="text-muted-foreground" />}
                    {question.type === 'DROPDOWN' && <span className="text-muted-foreground w-4 text-center">{i+1}.</span>}
                    <input 
                      type="text"
                      className="flex-1 bg-transparent outline-none border-b border-transparent focus:border-muted-foreground hover:border-border transition-colors pb-1"
                      value={opt.label}
                      onChange={(e) => updateOption(opt.id, e.target.value)}
                    />
                    {question.options!.length > 1 && (
                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => removeOption(opt.id)}>
                        <X size={14} className="text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                ))}
                <div className="flex items-center gap-3">
                  {question.type === 'MULTIPLE_CHOICE' && <Circle size={16} className="text-muted-foreground/50" />}
                  {question.type === 'CHECKBOXES' && <Square size={16} className="text-muted-foreground/50" />}
                  {question.type === 'DROPDOWN' && <span className="text-muted-foreground/50 w-4 text-center">{question.options?.length ? question.options.length + 1 : 1}.</span>}
                  <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary" onClick={addOption}>
                    Add option
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {isSelected && (
          <div className="flex flex-col items-center justify-start p-2 border-l bg-muted/20 space-y-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => { e.stopPropagation(); onRemove(question.id); }}
              className="text-destructive hover:bg-destructive/10"
              title="Delete question"
            >
              <Trash2 size={18} />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function SurveyBuilder({ 
  onCancelUrl, 
  title, 
  subtitle,
  scope,
  guildId
}: { 
  onCancelUrl: string;
  title: string;
  subtitle: string;
  scope: 'SYSTEM' | 'GUILD';
  guildId: string | null;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const [surveyTitle, setSurveyTitle] = useState("");
  const [surveyDescription, setSurveyDescription] = useState("");
  const [surveyEndDate, setSurveyEndDate] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleSave = async (status: 'DRAFT' | 'ACTIVE') => {
    setIsSaving(true);
    try {
      // Import the action lazily or it should be at top level
      const { saveSurvey } = await import('@/lib/actions/surveys');
      await saveSurvey({
        title: surveyTitle,
        description: surveyDescription,
        scope,
        guildId,
        status,
        endDate: surveyEndDate || null,
        questions
      });
    } catch (e) {
      console.error(e);
      setIsSaving(false);
    }
  };

  const addQuestion = (type: string) => {
    const newId = `q_${Date.now()}`;
    const newQuestion: Question = { 
      id: newId, 
      type, 
      questionText: `New ${type.replace('_', ' ').toLowerCase()} question`,
      required: false 
    };

    if (['MULTIPLE_CHOICE', 'CHECKBOXES', 'DROPDOWN'].includes(type)) {
      newQuestion.options = [{ id: `opt_1`, label: 'Option 1' }];
    }

    setQuestions([...questions, newQuestion]);
    setSelectedId(newId);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const selectedQuestion = questions.find(q => q.id === selectedId);

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href={onCancelUrl}>Cancel</a>
          </Button>
          <Button variant="secondary" onClick={() => handleSave('DRAFT')} disabled={isSaving}>Save Draft</Button>
          <Button onClick={() => handleSave('ACTIVE')} disabled={isSaving}>Publish</Button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-64 border rounded-xl p-4 bg-card flex flex-col gap-2 overflow-y-auto shadow-sm">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">Basic</h3>
          <Button variant="ghost" className="justify-start hover:bg-primary/10" onClick={() => addQuestion('TEXT')}>Short text</Button>
          <Button variant="ghost" className="justify-start hover:bg-primary/10" onClick={() => addQuestion('LONG_TEXT')}>Long text</Button>
          
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mt-4 mb-2">Choices</h3>
          <Button variant="ghost" className="justify-start hover:bg-primary/10" onClick={() => addQuestion('MULTIPLE_CHOICE')}>Multiple choice</Button>
          <Button variant="ghost" className="justify-start hover:bg-primary/10" onClick={() => addQuestion('CHECKBOXES')}>Checkboxes</Button>
          <Button variant="ghost" className="justify-start hover:bg-primary/10" onClick={() => addQuestion('DROPDOWN')}>Dropdown</Button>
          
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mt-4 mb-2">Advanced</h3>
          <Button variant="ghost" className="justify-start hover:bg-primary/10" onClick={() => addQuestion('RATING')}>Rating</Button>
          <Button variant="ghost" className="justify-start hover:bg-primary/10" onClick={() => addQuestion('NUMBER')}>Number</Button>
          <Button variant="ghost" className="justify-start hover:bg-primary/10" onClick={() => addQuestion('DATE')}>Date</Button>
        </div>

        {/* Canvas */}
        <div className="flex-1 border rounded-xl bg-muted/30 p-6 overflow-y-auto" onClick={() => setSelectedId(null)}>
          <div className="max-w-3xl mx-auto space-y-4 pb-20">
            <Card className="mb-6 border-t-8 border-t-primary shadow-md">
              <CardContent className="p-8">
                <input 
                  type="text" 
                  placeholder="Survey Title" 
                  className="text-4xl font-bold bg-transparent border-b-2 border-transparent focus:border-primary outline-none w-full mb-4 transition-colors" 
                  value={surveyTitle}
                  onChange={(e) => setSurveyTitle(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                <textarea 
                  placeholder="Survey Description" 
                  className="w-full bg-transparent border-b-2 border-transparent focus:border-muted-foreground outline-none resize-none text-muted-foreground transition-colors mb-4"
                  value={surveyDescription}
                  onChange={(e) => setSurveyDescription(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  rows={2}
                />
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>End Date (Optional):</span>
                  <input 
                    type="datetime-local" 
                    className="bg-transparent border rounded p-1"
                    value={surveyEndDate}
                    onChange={(e) => setSurveyEndDate(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
              {questions.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-primary/30 rounded-xl text-primary/60 bg-primary/5">
                  <Plus size={48} className="mb-4 opacity-50" />
                  <p className="text-lg font-medium">Add your first question</p>
                  <p className="text-sm mt-2 opacity-80">Click any type from the sidebar to begin</p>
                </div>
              )}
              {questions.map((question) => (
                <SortableQuestion 
                  key={question.id} 
                  question={question} 
                  onRemove={removeQuestion}
                  onSelect={setSelectedId}
                  onChange={updateQuestion}
                  isSelected={selectedId === question.id}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-72 border rounded-xl p-5 bg-card flex flex-col gap-6 overflow-y-auto shadow-sm">
        <h3 className="font-semibold text-lg border-b pb-2">Properties</h3>
        {selectedQuestion ? (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Question Type</label>
              <div className="text-sm bg-muted p-2.5 rounded-md font-medium">
                {selectedQuestion.type.replace('_', ' ')}
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Validation</label>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Required field</span>
                <Switch 
                  checked={selectedQuestion.required}
                  onCheckedChange={(c) => updateQuestion(selectedQuestion.id, { required: c })}
                />
              </div>
            </div>

            {['MULTIPLE_CHOICE', 'CHECKBOXES'].includes(selectedQuestion.type) && (
              <div className="space-y-3 pt-4 border-t">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Display Options</label>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Shuffle order</span>
                  <Switch />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground text-center mt-12 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xl">👆</span>
            </div>
            Select a question on the canvas to configure its settings
          </div>
        )}
      </div>

      </div>
    </div>
  );
}
