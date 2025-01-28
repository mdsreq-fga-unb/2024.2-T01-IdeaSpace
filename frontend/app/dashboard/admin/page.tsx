'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, PencilIcon, Trash2, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock data - replace with actual data from your backend
const adminUsers = [
  { id: 1, nome: 'João Silva', username: 'joao.admin', ativo: true },
  { id: 2, nome: 'Maria Santos', username: 'maria.admin', ativo: true },
  { id: 3, nome: 'Carlos Oliveira', username: 'carlos.admin', ativo: true },
];

export default function AdminPage() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    username: '',
    senha: '',
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmDialogOpen(true);
  };

  const confirmCreate = () => {
    // Handle admin creation
    console.log('Creating admin:', formData);
    setConfirmDialogOpen(false);
    setOpen(false);
    setFormData({ nome: '', username: '', senha: '' });
  };

  const handleDelete = (id: number) => {
    setSelectedAdmin(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log('Deleting admin:', selectedAdmin);
    setDeleteDialogOpen(false);
    setSelectedAdmin(null);
  };

  const handleEdit = (admin: typeof adminUsers[0]) => {
    setFormData({
      nome: admin.nome,
      username: admin.username,
      senha: '',
    });
    setEditMode(true);
    setOpen(true);
  };

  const filteredAdmins = adminUsers.filter(admin =>
    admin.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Administração do Sistema</h1>
        <Dialog open={open} onOpenChange={(value) => {
          setOpen(value);
          if (!value) {
            setEditMode(false);
            setFormData({ nome: '', username: '', senha: '' });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-pink-600 hover:bg-pink-700">
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Administrador
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editMode ? 'Editar Administrador' : 'Adicionar Novo Administrador'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {!editMode && (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar administradores..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <ScrollArea className="h-[200px] border rounded-md p-4">
                    <div className="space-y-4">
                      {filteredAdmins.map((admin) => (
                        <div
                          key={admin.id}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                        >
                          <div>
                            <p className="font-medium">{admin.nome}</p>
                            <p className="text-sm text-muted-foreground">
                              {admin.username}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 text-amber-500 hover:text-amber-600"
                              onClick={() => handleEdit(admin)}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 text-red-500 hover:text-red-600"
                              onClick={() => handleDelete(admin.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Nome de Usuário</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senha">
                    {editMode ? 'Nova Senha (deixe em branco para manter a atual)' : 'Senha'}
                  </Label>
                  <Input
                    id="senha"
                    type="password"
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    required={!editMode}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
                    {editMode ? 'Salvar' : 'Adicionar'}
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar criação</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja criar este novo administrador? Esta ação concederá acesso total ao sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                className="bg-pink-600 hover:bg-pink-700"
                onClick={confirmCreate}
              >
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este administrador? Esta ação não pode ser desfeita.
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

      <Card>
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Versão do Sistema</h3>
            <p className="text-sm text-muted-foreground">1.0.0</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Administradores Ativos</h3>
            <p className="text-sm text-muted-foreground">
              {adminUsers.filter(admin => admin.ativo).length} contas ativas
            </p>
            <div className="mt-2 space-y-1">
              {adminUsers
                .filter(admin => admin.ativo)
                .map(admin => (
                  <p key={admin.id} className="text-sm text-muted-foreground">
                    {admin.nome}
                  </p>
                ))}
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Status do Sistema</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <p className="text-sm text-muted-foreground">Operacional</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}