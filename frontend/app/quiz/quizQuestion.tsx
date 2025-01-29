'use client';

import { Button } from '@/components/ui/button';

interface QuizQuestionProps {
  question: {
    text: string;
    options: Array<{
      text: string;
      isCorrect: boolean;
    }>;
  };
  questionNumber: number;
  onAnswer: (isCorrect: boolean) => void;
}

export default function QuizQuestion({ question, onAnswer }: QuizQuestionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground break-words">{question.text}</h2>
      </div>

      <div className="grid gap-3">
        {question.options.map((option, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full min-h-[3.5rem] h-auto justify-start p-4 text-left text-base hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-900/20 dark:hover:text-pink-400 whitespace-normal transition-all duration-200"
            onClick={() => onAnswer(option.isCorrect)}
          >
            <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-pink-600 dark:border-pink-400 text-sm font-medium text-pink-600 dark:text-pink-400">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="break-words">{option.text}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}