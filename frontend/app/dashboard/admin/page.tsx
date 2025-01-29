'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data - replace with actual data from your backend
const adminUsers = [
  { id: 1, nome: 'João Silva', username: 'joao.admin', ativo: true },
  { id: 2, nome: 'Maria Santos', username: 'maria.admin', ativo: true },
  { id: 3, nome: 'Carlos Oliveira', username: 'carlos.admin', ativo: true },
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Administração do Sistema</h1>
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