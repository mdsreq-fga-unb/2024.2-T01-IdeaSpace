'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { updateQuestionnaire } from '@/services/questionnaire';
import { useToast } from '@/hooks/use-toast';

interface ReleaseQuestionnaireDialogProps {
  questionnaireId: number;
  isReleased: boolean;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function ReleaseQuestionnaireDialog({ 
  questionnaireId, 
  isReleased,
  onSuccess,
  trigger 
}: ReleaseQuestionnaireDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRelease = async () => {
    setLoading(true);
    try {
      await updateQuestionnaire(questionnaireId, { released: !isReleased });
      toast({
        title: 'Sucesso',
        description: isReleased ? 'Questionário recolhido com sucesso' : 'Questionário liberado com sucesso',
      });
      setOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error releasing questionnaire:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status do questionário',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Send className="h-4 w-4" />
            {isReleased ? 'Recolher' : 'Liberar para Turma'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isReleased ? 'Recolher Questionário' : 'Liberar Questionário'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p>
            {isReleased
              ? 'Tem certeza que deseja recolher este questionário? Os alunos não poderão mais respondê-lo.'
              : 'Tem certeza que deseja liberar este questionário para a turma? Os alunos poderão começar a respondê-lo.'}
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleRelease}
              disabled={loading}
              className="bg-pink-600 hover:bg-pink-700"
            >
              {loading ? 'Processando...' : isReleased ? 'Recolher' : 'Liberar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}