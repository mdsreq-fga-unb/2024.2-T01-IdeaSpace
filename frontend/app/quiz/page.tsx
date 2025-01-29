'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import QuizQuestion from './quizQuestion';
import Result from './Result';
import questions from './questions';

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes in seconds

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowResult(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, showResult]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (isCorrect) => {
    const newAnswers = [...answers, isCorrect ? 1 : 0];
    setAnswers(newAnswers);

    if (currentQuestion >= questions.length - 1) {
      setShowResult(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const restartTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setTimeLeft(45 * 60); // Reset timer to 45 minutes
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-pink-50 dark:hover:bg-pink-900/20">
                <ArrowLeft className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">
              Questionário React
            </h1>
          </div>
          {!showResult && (
            <div className="flex items-center gap-2 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 px-4 py-2 rounded-full">
              <Clock className="h-4 w-4" />
              <span className="font-medium">{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>

        <Card className="mx-auto max-w-3xl p-6 shadow-lg">
          <div className="space-y-6">
            {!showResult && (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <span className="text-sm font-medium text-pink-600 dark:text-pink-400">
                    Questão {currentQuestion + 1} de {questions.length}
                  </span>
                  <span className="text-sm font-medium bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 px-3 py-1 rounded-full">
                    {Math.round((currentQuestion / questions.length) * 100)}% Completo
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-pink-50 dark:bg-pink-900/20">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-pink-600 to-pink-400 transition-all duration-300"
                    style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
                  />
                </div>
              </>
            )}
            
            {!showResult && (
              <QuizQuestion
                question={questions[currentQuestion]}
                questionNumber={currentQuestion + 1}
                onAnswer={handleAnswer}
              />
            )}
            
            {showResult && <Result answers={answers} questions={questions} restartTest={restartTest} />}
          </div>
        </Card>
      </div>
    </div>
  );
}