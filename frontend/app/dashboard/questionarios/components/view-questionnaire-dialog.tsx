'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getQuestionnaire } from '@/services/questionnaire';
import { useToast } from '@/hooks/use-toast';

interface ViewQuestionnaireDialogProps {
  questionnaireId: number;
  trigger?: React.ReactNode;
}

export function ViewQuestionnaireDialog({ questionnaireId, trigger }: ViewQuestionnaireDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadQuestionnaire();
    }
  }, [open]);

  const loadQuestionnaire = async () => {
    try {
      const data = await getQuestionnaire(questionnaireId);
      setQuestionnaire(data);
    } catch (error) {
      console.error('Error loading questionnaire:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar o questionário',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Médio';
      case 'hard': return 'Difícil';
      default: return difficulty;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            Visualizar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Visualizar Questionário</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="py-8 text-center">Carregando...</div>
        ) : (
          <ScrollArea className="max-h-[600px]">
            <div className="space-y-6 p-4">
              <div className="grid gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Turma</h4>
                  <p className="text-base">{questionnaire?.classroom?.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Duração</h4>
                  <p className="text-base">{questionnaire?.duration} minutos</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <p className="text-base">
                    {questionnaire?.released ? 'Liberado' : 'Não liberado'} 
                    {questionnaire?.closed ? ' (Encerrado)' : ''}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Questões</h3>
                {questionnaire?.questions.map((question: any, index: number) => (
                  <div
                    key={question.id}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="font-medium">Questão {index + 1}</h4>
                        <p>{question.text}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {question.category.name} - {getDifficultyLabel(question.difficulty)}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {question.options.map((option: any, optIndex: number) => (
                        <div
                          key={option.id}
                          className="flex items-center gap-2 p-2 rounded-lg border"
                        >
                          <span className="font-medium">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span>{option.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}