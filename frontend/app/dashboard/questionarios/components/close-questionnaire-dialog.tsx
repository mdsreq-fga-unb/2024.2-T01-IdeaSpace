'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { updateQuestionnaire } from '@/services/questionnaire';
import { useToast } from '@/hooks/use-toast';

interface CloseQuestionnaireDialogProps {
  questionnaireId: number;
  isClosed?: boolean;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function CloseQuestionnaireDialog({ 
  questionnaireId,
  isClosed = false,
  onSuccess,
  trigger 
}: CloseQuestionnaireDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleToggle = async () => {
    setLoading(true);
    try {
      await updateQuestionnaire(questionnaireId, { closed: !isClosed });
      toast({
        title: 'Sucesso',
        description: isClosed 
          ? 'Questionário reaberto com sucesso'
          : 'Questionário encerrado com sucesso',
      });
      setOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error toggling questionnaire:', error);
      toast({
        title: 'Erro',
        description: isClosed
          ? 'Não foi possível reabrir o questionário'
          : 'Não foi possível encerrar o questionário',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isClosed ? 'Reabrir Questionário' : 'Encerrar Questionário'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {isClosed ? (
            <>
              <p>
                Tem certeza que deseja reabrir este questionário? Ao reabrir:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Os alunos poderão voltar a responder o questionário</li>
                <li>O questionário precisará ser liberado novamente</li>
                <li>As respostas anteriores serão mantidas</li>
              </ul>
            </>
          ) : (
            <>
              <p>
                Tem certeza que deseja encerrar este questionário? Esta ação pode ser revertida, mas:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Os alunos não poderão mais iniciar o questionário</li>
                <li>Os alunos que já iniciaram não poderão continuar respondendo</li>
                <li>As respostas e estatísticas ficarão disponíveis para visualização</li>
              </ul>
            </>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleToggle}
              disabled={loading}
              className={isClosed ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            >
              {loading 
                ? (isClosed ? 'Reabrindo...' : 'Encerrando...') 
                : (isClosed ? 'Reabrir Questionário' : 'Encerrar Questionário')
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}