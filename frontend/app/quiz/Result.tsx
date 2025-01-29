'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ResultProps {
  answers: number[];
  questions: Array<{
    text: string;
    options: Array<{
      text: string;
      isCorrect: boolean;
    }>;
  }>;
  restartTest: () => void;
}

export default function Result({ answers, questions, restartTest }: ResultProps) {
  const score = answers.reduce((total, score) => total + score, 0);
  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">
          Questionário Concluído!
        </h2>
        <div className="mt-6 space-y-2">
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-pink-50 dark:bg-pink-900/20" />
            <p className="relative text-5xl font-bold text-pink-600 dark:text-pink-400 py-8 px-12">
              {percentage}%
            </p>
          </div>
          <p className="text-lg text-muted-foreground mt-4">
            Você acertou {score} de {questions.length} questões
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-pink-600 dark:text-pink-400">
          Revisão das Questões
        </h3>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {questions.map((question, index) => {
              const isCorrect = answers[index] === 1;
              const correctAnswer = question.options.find(opt => opt.isCorrect)?.text;

              return (
                <div
                  key={index}
                  className={`rounded-lg border p-4 transition-all duration-200 ${
                    isCorrect 
                      ? 'border-pink-100 bg-pink-50/30 dark:border-pink-900 dark:bg-pink-900/10' 
                      : 'border-red-100 bg-red-50/30 dark:border-red-900 dark:bg-red-900/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-pink-600 dark:text-pink-400" />
                    ) : (
                      <XCircle className="mt-1 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
                    )}
                    <div className="space-y-1 break-words">
                      <p className="font-medium">{question.text}</p>
                      {!isCorrect && (
                        <p className="text-sm text-pink-600 dark:text-pink-400 mt-2 font-medium">
                          Resposta correta: {correctAnswer}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <div className="flex justify-center pt-4">
        <Button
          onClick={restartTest}
          className="bg-pink-600 hover:bg-pink-700 text-white font-medium px-8"
        >
          Tentar Novamente
        </Button>
      </div>
    </div>
  );
}