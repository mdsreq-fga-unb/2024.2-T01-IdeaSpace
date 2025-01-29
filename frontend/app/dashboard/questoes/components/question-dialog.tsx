'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Minus, CheckCircle2 } from 'lucide-react';

interface QuestionDialogProps {
  mode: 'create' | 'edit';
  question?: {
    id: number;
    titulo: string;
    tema: string;
    dificuldade: 'Fácil' | 'Médio' | 'Difícil';
    alternativas: string[];
    respostaCorreta: number;
  };
  trigger?: React.ReactNode;
}

export function QuestionDialog({ mode, question, trigger }: QuestionDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    titulo: question?.titulo || '',
    tema: question?.tema || '',
    dificuldade: question?.dificuldade || '',
    alternativas: question?.alternativas || ['', '', '', ''],
    respostaCorreta: question?.respostaCorreta?.toString() || '0',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', {
      ...formData,
      respostaCorreta: parseInt(formData.respostaCorreta),
    });
    setOpen(false);
  };

  const handleAlternativeChange = (index: number, value: string) => {
    const newAlternatives = [...formData.alternativas];
    newAlternatives[index] = value;
    setFormData({ ...formData, alternativas: newAlternatives });
  };

  const addAlternative = () => {
    if (formData.alternativas.length < 6) {
      setFormData({
        ...formData,
        alternativas: [...formData.alternativas, ''],
      });
    }
  };

  const removeAlternative = (index: number) => {
    if (formData.alternativas.length > 2) {
      const newAlternatives = formData.alternativas.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        alternativas: newAlternatives,
        respostaCorreta: index === parseInt(formData.respostaCorreta) ? '0' : formData.respostaCorreta,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-pink-600 hover:bg-pink-700">
            {mode === 'create' ? 'Nova Questão' : 'Editar Questão'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Adicionar Nova Questão' : 'Editar Questão'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Pergunta</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tema">Tema</Label>
            <Input
              id="tema"
              value={formData.tema}
              onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dificuldade">Nível de Dificuldade</Label>
            <Select
              value={formData.dificuldade}
              onValueChange={(value) => setFormData({ ...formData, dificuldade: value as 'Fácil' | 'Médio' | 'Difícil' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fácil">Fácil</SelectItem>
                <SelectItem value="Médio">Médio</SelectItem>
                <SelectItem value="Difícil">Difícil</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Alternativas</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAlternative}
                disabled={formData.alternativas.length >= 6}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <p className="text-sm font-medium">
                  Selecione o círculo ao lado da alternativa que será a resposta correta
                </p>
              </div>
              <RadioGroup
                value={formData.respostaCorreta}
                onValueChange={(value) => setFormData({ ...formData, respostaCorreta: value })}
                className="space-y-4"
              >
                {formData.alternativas.map((alternativa, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem 
                        value={index.toString()} 
                        id={`alternativa-${index}`} 
                        className="mt-3"
                      />
                      {index.toString() === formData.respostaCorreta && (
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-3" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <Textarea
                        value={alternativa}
                        onChange={(e) => handleAlternativeChange(index, e.target.value)}
                        placeholder={`Alternativa ${String.fromCharCode(65 + index)}`}
                        required
                      />
                    </div>
                    {formData.alternativas.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeAlternative(index)}
                        className="self-start"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
              {mode === 'create' ? 'Adicionar' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}