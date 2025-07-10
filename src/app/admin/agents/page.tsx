'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Agent, Departement, Function  } from '@/types'; // Adjust the import path as necessary


export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [departments, setDepartments] = useState<Departement[]>([]);
  const [functions, setFunctions] = useState<Function[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAgents = async () => {
      const res = await fetch('/api/agents');
      const data = await res.json();
      setAgents(data);
    };

    const fetchDepartments = async () => {
      const res = await fetch('/api/departements');
      const data = await res.json();
      console.log('Departments fetched:', data);
      
      setDepartments(data);
    };

    const fetchFunctions = async () => {
      const res = await fetch('/api/function');
      const data = await res.json();
      console.log('Functions fetched:', data);
      
      setFunctions(data);
    };

    fetchAgents();
    fetchDepartments();
    fetchFunctions();
  }, []);

  const getDepartmentName = (id: string) => {
    return departments.find((d) => String(d.id) === String(id))?.name || 'Inconnu';
  };

  const getFunctionName = (id: string | number) => {
    return functions.find((f) => String(f.id) === String(id))?.name || 'Inconnu';
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    const newStatus = currentStatus === true ? true : false;
    await fetch(`/api/agents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: !currentStatus }),
    });
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === id ? { ...agent, status: !currentStatus } : agent
      )
    );
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Liste des agents</h1>
      <Separator />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card key={agent.id} className="hover:shadow-xl transition-shadow rounded-xl">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={agent.photoUrl || '/placeholder.jpg'}
                  alt={`${agent.firstName} ${agent.lastName}`}
                  className="w-16 h-16 rounded-full object-cover border"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{agent.firstName} {agent.lastName}</h2>
                  <p className="text-sm text-muted-foreground">Fonction: {getFunctionName(agent.functionId)}</p>
                  <p className="text-sm text-muted-foreground">Tél: {agent.phoneNumbers.join(', ')}</p>
                  <p className="text-sm text-muted-foreground">Département: {getDepartmentName(agent.departementId)}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant={agent.status === true ? 'default' : 'secondary'}>
                  {agent.status === true ? 'Actif' : 'Inactif'}
                </Badge>
                <Switch
                  checked={agent.status === true}
                  onCheckedChange={() => toggleStatus(agent.id, agent.status)}
                />
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push(`/admin/agents/${agent.id}`)}
              >
                Voir les détails
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
