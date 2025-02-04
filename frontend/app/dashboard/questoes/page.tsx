'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PencilIcon, Trash2, BookPlus, Search, CheckCircle2 } from 'lucide-react';
import { QuestionDialog } from './components/question-dialog';
import { ViewQuestionDialog } from './components/view-question-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ToastContainer, toast, Bounce } from 'react-toastify';

const delete_success = () => {
  toast.success('Questão removida com sucesso', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "light",
    transition: Bounce,
    });
};

type Dificuldade = 'Fácil' | 'Médio' | 'Difícil';

interface Questao {
  id: number;
  titulo: string;
  tema: string;
  dificuldade: Dificuldade;
  alternativas: string[];
  respostaCorreta: number;
}

const dificuldadeColors: Record<Dificuldade, string> = {
  'Fácil': 'bg-green-500',
  'Médio': 'bg-yellow-500',
  'Difícil': 'bg-red-500',
};

export default function QuestoesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTema, setSelectedTema] = useState('');
  const [selectedDificuldade, setSelectedDificuldade] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  const questoes: Questao[] = [
    {
      id: 1,
      titulo: 'Sistema Solar e seus planetas',
      tema: 'Astronomia',
      dificuldade: 'Fácil',
      alternativas: [
        'Mercúrio é o planeta mais próximo do Sol',
        'Vênus é o segundo planeta do Sistema Solar',
        'A Terra é o terceiro planeta do Sistema Solar',
        'Marte é conhecido como planeta vermelho',
      ],
      respostaCorreta: 0,
    },
    {
      id: 2,
      titulo: 'Buracos Negros',
      tema: 'Astronomia',
      dificuldade: 'Difícil',
      alternativas: [
        'São regiões do espaço-tempo',
        'Possuem uma força gravitacional intensa',
        'Nem a luz consegue escapar',
        'Podem ser resultado da morte de estrelas',
      ],
      respostaCorreta: 2,
    },
    {
      id: 3,
      titulo: 'Exploração Espacial',
      tema: 'História Espacial',
      dificuldade: 'Médio',
      alternativas: [
        'Primeiro homem na Lua: Neil Armstrong',
        'Missão Apollo 11 foi em 1969',
        'Yuri Gagarin foi o primeiro homem no espaço',
        'A ISS é a maior estrutura humana no espaço',
      ],
      respostaCorreta: 1,
    },
  ];

  const filteredQuestoes = questoes.filter(questao => 
    questao.titulo.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!selectedTema || questao.tema === selectedTema) &&
    (!selectedDificuldade || questao.dificuldade === selectedDificuldade)
  );

  const handleDelete = (id: number) => {
    setSelectedQuestion(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log('Deleting question:', selectedQuestion);
    delete_success();
    setDeleteDialogOpen(false);
    setSelectedQuestion(null);
  };

  return (
    <div className="space-y-6">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"
        transition={Bounce}
      />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Questões</h1>
        <QuestionDialog
          mode="create"
          trigger={
            <Button className="bg-pink-600 hover:bg-pink-700">
              <BookPlus className="mr-2 h-4 w-4" />
              Nova Questão
            </Button>
          }
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar questão..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={selectedTema} onValueChange={setSelectedTema}>
          <SelectTrigger className="sm:max-w-xs">
            <SelectValue placeholder="Filtrar por tema" />
          </SelectTrigger>
          <SelectContent>
            {[...new Set(questoes.map(q => q.tema))].map(tema => (
              <SelectItem key={tema} value={tema}>{tema}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedDificuldade} onValueChange={setSelectedDificuldade}>
          <SelectTrigger className="sm:max-w-xs">
            <SelectValue placeholder="Filtrar por dificuldade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Fácil">Fácil</SelectItem>
            <SelectItem value="Médio">Médio</SelectItem>
            <SelectItem value="Difícil">Difícil</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredQuestoes.map((questao) => (
          <Card key={questao.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">{questao.titulo}</CardTitle>
              <Badge className={`${dificuldadeColors[questao.dificuldade]}`}>
                {questao.dificuldade}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Tema: {questao.tema}</p>
                <div className="space-y-1">
                  {questao.alternativas.map((alt, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm">
                        {String.fromCharCode(65 + index)})
                      </span>
                      <p className="text-sm flex-grow">{alt}</p>
                      {index === questao.respostaCorreta && (
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <ViewQuestionDialog question={questao} />
                  <QuestionDialog
                    mode="edit"
                    question={questao}
                    trigger={
                      <Button size="icon" variant="outline" className="text-amber-500 hover:text-amber-600">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(questao.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta questão? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDelete}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}