'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { getQuestion } from '@/services/questions';

const difficultyColors = {
  easy: 'bg-green-500',
  medium: 'bg-yellow-500',
  hard: 'bg-red-500',
} as const;

const difficultyLabels = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
} as const;

interface ViewQuestionDialogProps {
  question: {
    id: number;
    text: string;
    category: {
      name: string;
    };
    difficulty: 'easy' | 'medium' | 'hard';
    options: Array<{
      id: number;
      text: string;
      is_answer: boolean;
    }>;
  };
}

export function ViewQuestionDialog({ question: initialQuestion }: ViewQuestionDialogProps) {
  const [open, setOpen] = useState(false);
  const [questionData, setQuestionData] = useState(initialQuestion);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      getQuestion(initialQuestion.id)
        .then(data => {
          console.log('Fetched question data:', data);
          setQuestionData(data);
        })
        .catch(error => {
          console.error('Error fetching question:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, initialQuestion.id]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="text-blue-500 hover:text-blue-600"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Questão</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-4">Carregando...</div>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Enunciado
                  </h4>
                  <p className="text-base">{questionData.text}</p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Tema
                    </h4>
                    <p className="text-base">{questionData.category.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Dificuldade
                    </h4>
                    <Badge className={`${difficultyColors[questionData.difficulty]} mt-1`}>
                      {difficultyLabels[questionData.difficulty]}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Alternativas
                </h4>
                <div className="space-y-3 border rounded-md p-4">
                  {questionData.options && questionData.options.length > 0 ? (
                    questionData.options.map((option, index) => (
                      <div
                        key={option.id}
                        className={`flex gap-2 items-center p-3 rounded-lg border ${
                          option.is_answer
                            ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-800'
                        }`}
                      >
                        <span className="font-medium min-w-[24px]">
                          {String.fromCharCode(65 + index)})
                        </span>
                        <p className="flex-grow">{option.text}</p>
                        {option.is_answer && (
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhuma alternativa encontrada
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}