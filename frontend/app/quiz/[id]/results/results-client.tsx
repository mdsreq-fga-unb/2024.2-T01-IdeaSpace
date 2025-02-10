'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { getQuestionnaire, getQuestionnaireResults } from '@/services/questionnaire';
import { useRouter } from 'next/navigation';

interface ResultsClientProps {
  params: {
    id: string;
  };
}

export default function ResultsClient({ params }: ResultsClientProps) {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any>(null);
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const loadResults = async () => {
      try {
        let questionnaireData;
        try {
          // Tenta buscar os dados do questionário
          questionnaireData = await getQuestionnaire(parseInt(params.id));
          setQuestionnaire(questionnaireData);
        } catch (err: any) {
          // Se o erro indicar que não há permissão, tenta continuar
          if (err.message?.includes("You don't have permission")) {
            console.warn(
              "Permission error on getQuestionnaire. Verifying if results exist..."
            );
          } else {
            throw err; // Para outros erros, interrompe a execução
          }
        }

        // Tenta obter os resultados – isto indica se o aluno já respondeu
        const data = await getQuestionnaireResults(parseInt(params.id));
        if (!data) {
          toast({
            title: 'Questionário não respondido',
            description: 'Você ainda não respondeu este questionário.',
            variant: 'destructive',
          });
          router.push(`/quiz/${params.id}`);
          return;
        }
        setResults(data);
      } catch (error: any) {
        console.error('Error loading results:', error);
        toast({
          title: 'Erro',
          description: error.message || 'Não foi possível carregar os resultados',
          variant: 'destructive',
        });
        router.push('/quiz/listing');
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [params.id, router, toast]);

  // Enquanto estiver carregando ou se os resultados (ou results.result) forem nulos, exibe uma tela de carregamento
  if (loading || !results || !results.result) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-8">
            <p>Carregando resultados...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calcula as questões não respondidas com segurança
  const unansweredQuestions = results.result.filter((q: any) => q.student_answer === null);
  const hasUnansweredQuestions = unansweredQuestions.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/quiz/listing">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-pink-50 dark:hover:bg-pink-900/20">
              <ArrowLeft className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            </Button>
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">
              Resultados do Questionário #{params.id}
            </h1>
            {questionnaire?.closed && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Questionário encerrado
              </p>
            )}
          </div>
        </div>

        <Card className="mx-auto max-w-3xl p-6 shadow-lg">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">
                Questionário {questionnaire?.closed ? 'Encerrado' : 'Concluído'}!
              </h2>
              <div className="mt-6 space-y-2">
                <div className="relative inline-flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-pink-50 dark:bg-pink-900/20" />
                  <p className="relative text-5xl font-bold text-pink-600 dark:text-pink-400 py-8 px-12">
                    {Math.round((results.correct_answers / results.total_questions) * 100)}%
                  </p>
                </div>
                <div className="space-y-2 mt-4">
                  <p className="text-lg text-muted-foreground">
                    Você acertou {results.correct_answers} de {results.total_questions} questões
                  </p>
                  {hasUnansweredQuestions && (
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center justify-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {unansweredQuestions.length} questões não foram respondidas
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-pink-600 dark:text-pink-400">
                Revisão das Questões
              </h3>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {results.result.map((question: any) => {
                    const isUnanswered = question.student_answer === null;
                    return (
                      <div
                        key={question.question_id}
                        className={`rounded-lg border p-4 transition-all duration-200 ${
                          isUnanswered
                            ? 'border-yellow-100 bg-yellow-50/30 dark:border-yellow-900 dark:bg-yellow-900/10'
                            : question.is_correct 
                              ? 'border-pink-100 bg-pink-50/30 dark:border-pink-900 dark:bg-pink-900/10' 
                              : 'border-red-100 bg-red-50/30 dark:border-red-900 dark:bg-red-900/10'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {isUnanswered ? (
                            <AlertCircle className="mt-1 h-5 w-5 shrink-0 text-yellow-600 dark:text-yellow-400" />
                          ) : question.is_correct ? (
                            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-pink-600 dark:text-pink-400" />
                          ) : (
                            <XCircle className="mt-1 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
                          )}
                          <div className="space-y-1 break-words">
                            <p className="font-medium">{question.question_text}</p>
                            {isUnanswered ? (
                              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2 font-medium">
                                Questão não respondida
                              </p>
                            ) : !question.is_correct && (
                              <p className="text-sm text-pink-600 dark:text-pink-400 mt-2 font-medium">
                                Resposta correta: {
                                  question.options.find((opt: any) => opt.id === question.correct_answer)?.text
                                }
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
              <Link href="/quiz/listing">
                <Button className="bg-pink-600 hover:bg-pink-700 text-white font-medium px-8">
                  Voltar para Questionários
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
