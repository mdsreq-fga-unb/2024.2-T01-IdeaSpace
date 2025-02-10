'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { getQuestionnaire, startQuestionnaire, submitQuestionnaireAnswers } from '@/services/questionnaire';

interface QuizClientProps {
  params: {
    id: string;
  };
}

export default function QuizClient({ params }: QuizClientProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Array<{ question_id: number; option_id: number }>>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const initQuiz = async () => {
      try {
        const questionnaireData = await getQuestionnaire(parseInt(params.id));
        
        // Check if the questionnaire is closed
        if (questionnaireData.closed) {
          router.push(`/quiz/${params.id}/results`);
          return;
        }

        // Check if the questionnaire is released
        if (!questionnaireData.released) {
          toast({
            title: 'Questionário Indisponível',
            description: 'Este questionário ainda não foi liberado.',
            variant: 'destructive',
          });
          router.push('/quiz/listing');
          return;
        }

        setQuestionnaire(questionnaireData);
        setTimeLeft(questionnaireData.duration * 60); // Set initial time in seconds
        setLoading(false);
      } catch (error: any) {
        console.error('Error loading quiz:', error);
        toast({
          title: 'Erro',
          description: error.message || 'Não foi possível carregar o questionário',
          variant: 'destructive',
        });
        router.push('/quiz/listing');
      }
    };

    initQuiz();
  }, [params.id]);

  const handleStart = async () => {
    try {
      const data = await startQuestionnaire({ questionnaire_id: parseInt(params.id) });
  
      // Se o backend retornar que o questionário já foi respondido,
      // exibe um aviso e redireciona para a página de resultados.
      if (data.info && data.info.already_answered) {
        toast({
          title: 'Questionário já respondido',
          description: 'Você já respondeu este questionário. Redirecionando para os resultados.',
        });
        router.push(`/quiz/${params.id}/results`);
        return;
      }
  
      // Se não, inicia o quiz normalmente.
      setHasStarted(true);
    } catch (error: any) {
      console.error('Error starting quiz:', error);
      
      // Se o erro indicar que o questionário já foi respondido,
      // exibe o aviso e redireciona para a página de resultados.
      if (error.message && error.message.toLowerCase().includes('already answered')) {
        toast({
          title: 'Questionário já respondido',
          description: 'Você já respondeu este questionário. Redirecionando para os resultados.',
        });
        router.push(`/quiz/${params.id}/results`);
        return;
      }
  
      // Se ocorrer outro erro, exibe um aviso genérico e redireciona para a listagem.
      toast({
        title: 'Erro',
        description: 'Não foi possível iniciar o questionário. Por favor, tente novamente.',
        variant: 'destructive',
      });
      router.push('/quiz/listing');
    }
  };
  

  useEffect(() => {
    if (hasStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // Ensure handleTimeUp is called immediately when time expires
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else if (hasStarted && timeLeft === 0) {
      // Additional check to ensure handleTimeUp is called if time is already 0
      handleTimeUp();
    }
  }, [timeLeft, hasStarted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswer = async (questionId: number, optionId: number) => {
    const newAnswers = [...answers, { question_id: questionId, option_id: optionId }];
    setAnswers(newAnswers);

    if (currentQuestion >= questionnaire.questions.length - 1) {
      await submitAnswers(newAnswers);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleTimeUp = async () => {
    try {
      // Show toast to inform user
      toast({
        title: 'Tempo Esgotado',
        description: 'O tempo do questionário acabou. Suas respostas serão enviadas automaticamente.',
      });

      // Submit whatever answers we have
      await submitQuestionnaireAnswers({
        questionnaire_id: parseInt(params.id),
        answers: answers,
      });

      // Redirect to results page
      router.push(`/quiz/${params.id}/results`);
    } catch (error: any) {
      console.error('Error submitting answers:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível enviar as respostas',
        variant: 'destructive',
      });
      // Even if there's an error, try to go to results
      router.push(`/quiz/${params.id}/results`);
    }
  };

  const submitAnswers = async (finalAnswers: Array<{ question_id: number; option_id: number }>) => {
    try {
      await submitQuestionnaireAnswers({
        questionnaire_id: parseInt(params.id),
        answers: finalAnswers,
      });
      router.push(`/quiz/${params.id}/results`);
    } catch (error: any) {
      console.error('Error submitting answers:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível enviar as respostas',
        variant: 'destructive',
      });
      // Even if there's an error, try to go to results
      router.push(`/quiz/${params.id}/results`);
    }
  };

  if (loading || !questionnaire) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-8">
            <p>Carregando questionário...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6 flex items-center gap-4">
            <Link href="/quiz/listing">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-pink-50 dark:hover:bg-pink-900/20">
                <ArrowLeft className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">
              Questionário #{params.id}
            </h1>
          </div>

          <Card className="mx-auto max-w-3xl p-6 shadow-lg">
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Pronto para Começar?</h2>
                <p className="text-muted-foreground">
                  Este questionário contém {questionnaire.questions.length} questões e você terá {questionnaire.duration} minutos para completá-lo.
                </p>
              </div>

              <div className="space-y-4 bg-muted/50 p-4 rounded-lg text-left">
                <h3 className="font-medium">Antes de começar:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  <li>Certifique-se de ter uma conexão estável com a internet</li>
                  <li>O tempo começará a contar assim que você iniciar</li>
                  <li>Você não poderá pausar o questionário depois de iniciado</li>
                  <li>Suas respostas são salvas automaticamente ao avançar</li>
                </ul>
              </div>

              <Button
                onClick={handleStart}
                className="bg-pink-600 hover:bg-pink-700 text-white font-medium px-8"
              >
                Iniciar Questionário
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestionData = questionnaire.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/quiz/listing">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-pink-50 dark:hover:bg-pink-900/20">
                <ArrowLeft className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </Button>
            </Link>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">
                Questionário #{params.id}
              </h1>
              <p className="text-sm text-muted-foreground">
                {questionnaire.questions.length} questões • {questionnaire.duration} minutos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 px-4 py-2 rounded-full">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <Card className="mx-auto max-w-3xl p-6 shadow-lg">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-pink-600 dark:text-pink-400">
                  Questão {currentQuestion + 1} de {questionnaire.questions.length}
                </span>
                <span className="text-sm font-medium bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 px-3 py-1 rounded-full">
                  {Math.round((currentQuestion / questionnaire.questions.length) * 100)}% Completo
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-pink-50 dark:bg-pink-900/20">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-pink-600 to-pink-400 transition-all duration-300"
                  style={{ width: `${(currentQuestion / questionnaire.questions.length) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground break-words">
                  {currentQuestionData.text}
                </h2>
              </div>

              <div className="grid gap-3">
                {currentQuestionData.options.map((option: any, index: number) => (
                  <Button
                    key={option.id}
                    variant="outline"
                    className="w-full min-h-[3.5rem] h-auto justify-start p-4 text-left text-base hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-900/20 dark:hover:text-pink-400 whitespace-normal transition-all duration-200"
                    onClick={() => handleAnswer(currentQuestionData.id, option.id)}
                  >
                    <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-pink-600 dark:border-pink-400 text-sm font-medium text-pink-600 dark:text-pink-400">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="break-words">{option.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}