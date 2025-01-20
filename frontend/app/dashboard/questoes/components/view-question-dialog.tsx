'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

interface ViewQuestionDialogProps {
  question: {
    id: number;
    titulo: string;
    tema: string;
    dificuldade: 'Fácil' | 'Médio' | 'Difícil';
    alternativas: string[];
    respostaCorreta: number;
  };
}

const dificuldadeColors = {
  'Fácil': 'bg-green-500',
  'Médio': 'bg-yellow-500',
  'Difícil': 'bg-red-500',
} as const;

export function ViewQuestionDialog({ question }: ViewQuestionDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="text-blue-500 hover:text-blue-600">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Questão</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Título</h4>
              <p className="text-base">{question.titulo}</p>
            </div>
            <div className="flex gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Tema</h4>
                <p className="text-base">{question.tema}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Dificuldade</h4>
                <Badge className={`${dificuldadeColors[question.dificuldade]} mt-1`}>
                  {question.dificuldade}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Alternativas</h4>
            <div className="space-y-3 border rounded-md p-4">
              {question.alternativas.map((alternativa, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <span className="font-medium min-w-[24px]">{String.fromCharCode(65 + index)})</span>
                  <p className="flex-grow">{alternativa}</p>
                  {index === question.respostaCorreta && (
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}