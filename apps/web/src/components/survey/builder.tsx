'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { QuestionType, SurveyQuestion } from './form';

interface SurveyBuilderProps {
  initialQuestions?: SurveyQuestion[];
  onSave: (questions: SurveyQuestion[]) => void;
}

export function SurveyBuilder({ initialQuestions = [], onSave }: SurveyBuilderProps) {
  const [questions, setQuestions] = useState<SurveyQuestion[]>(initialQuestions);

  const addQuestion = () => {
    const newQuestion: SurveyQuestion = {
      id: `q_${Date.now()}`,
      type: 'text',
      title: 'New Question',
      required: false,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, updates: Partial<SurveyQuestion>) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    setQuestions(newQuestions);
  };

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const addOption = (questionIndex: number) => {
    const question = questions[questionIndex];
    const newOptions = [
      ...(question.options || []),
      `Option ${(question.options?.length || 0) + 1}`,
    ];
    updateQuestion(questionIndex, { options: newOptions });
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const question = questions[questionIndex];
    const newOptions = [...(question.options || [])];
    newOptions[optionIndex] = value;
    updateQuestion(questionIndex, { options: newOptions });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const question = questions[questionIndex];
    const newOptions = question.options?.filter((_, i) => i !== optionIndex);
    updateQuestion(questionIndex, { options: newOptions });
  };

  const renderQuestionEditor = (question: SurveyQuestion, index: number) => {
    return (
      <Card key={question.id} className="mb-4">
        <CardHeader className="flex flex-row items-center gap-2 pb-4">
          <GripVertical className="text-muted-foreground h-4 w-4 cursor-move" />
          <CardTitle className="text-lg">Question {index + 1}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteQuestion(index)}
            className="text-destructive hover:text-destructive ml-auto"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Question Type */}
          <div>
            <label className="text-sm font-medium">Question Type</label>
            <Select
              value={question.type}
              onValueChange={(value: QuestionType) => updateQuestion(index, { type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="radio">Multiple Choice</SelectItem>
                <SelectItem value="scale">Rating Scale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Question Title */}
          <div>
            <label className="text-sm font-medium">Question Title</label>
            <Input
              value={question.title}
              onChange={(e) => updateQuestion(index, { title: e.target.value })}
              placeholder="Enter your question..."
            />
          </div>

          {/* Question Subtitle */}
          <div>
            <label className="text-sm font-medium">Subtitle (optional)</label>
            <Input
              value={question.subtitle || ''}
              onChange={(e) => updateQuestion(index, { subtitle: e.target.value })}
              placeholder="Additional context or instructions..."
            />
          </div>

          {/* Placeholder for text/number questions */}
          {(question.type === 'text' ||
            question.type === 'number' ||
            question.type === 'email') && (
            <div>
              <label className="text-sm font-medium">Placeholder Text</label>
              <Input
                value={question.placeholder || ''}
                onChange={(e) => updateQuestion(index, { placeholder: e.target.value })}
                placeholder="Placeholder text..."
              />
            </div>
          )}

          {/* Min/Max for number and scale questions */}
          {(question.type === 'number' || question.type === 'scale') && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">
                  {question.type === 'scale' ? 'Minimum Value' : 'Minimum'}
                </label>
                <Input
                  type="number"
                  value={question.min || ''}
                  onChange={(e) =>
                    updateQuestion(index, { min: parseInt(e.target.value) || undefined })
                  }
                  placeholder={question.type === 'scale' ? '1' : '0'}
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  {question.type === 'scale' ? 'Maximum Value' : 'Maximum'}
                </label>
                <Input
                  type="number"
                  value={question.max || ''}
                  onChange={(e) =>
                    updateQuestion(index, { max: parseInt(e.target.value) || undefined })
                  }
                  placeholder={question.type === 'scale' ? '10' : '100'}
                />
              </div>
            </div>
          )}

          {/* Options for radio questions */}
          {question.type === 'radio' && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium">Answer Options</label>
                <Button variant="outline" size="sm" onClick={() => addOption(index)}>
                  <Plus className="mr-1 h-4 w-4" />
                  Add Option
                </Button>
              </div>
              <div className="space-y-2">
                {question.options?.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                      placeholder={`Option ${optionIndex + 1}`}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index, optionIndex)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Required toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`required-${index}`}
              checked={question.required || false}
              onChange={(e) => updateQuestion(index, { required: e.target.checked })}
              className="rounded"
            />
            <label htmlFor={`required-${index}`} className="text-sm font-medium">
              Required question
            </label>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">Survey Builder</h1>
        <p className="text-muted-foreground">Create and customize your survey questions</p>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => renderQuestionEditor(question, index))}

        <div className="flex gap-4">
          <Button onClick={addQuestion} className="flex-1">
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
          <Button onClick={() => onSave(questions)} variant="default" className="flex-1">
            Save Survey
          </Button>
        </div>
      </div>

      {questions.length > 0 && (
        <div className="bg-muted mt-8 rounded-lg p-4">
          <h3 className="mb-2 font-semibold">Survey Preview</h3>
          <pre className="text-muted-foreground overflow-auto text-xs">
            {JSON.stringify(questions, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
