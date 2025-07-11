'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Agent, Departement, Function } from '@/types';
import { AddAgentDialog } from '@/components/addAgent';

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [departments, setDepartments] = useState<Departement[]>([]);
  const [functions, setFunctions] = useState<Function[]>([]);
  const router = useRouter();

  const fetchAgents = async () => {
    const res = await fetch('/api/agents');
    const data = await res.json();
    setAgents(data);
  };

  useEffect(() => {
    fetchAgents();

    const fetchDepartments = async () => {
      const res = await fetch('/api/departements');
      const data = await res.json();
      setDepartments(data);
    };

    const fetchFunctions = async () => {
      const res = await fetch('/api/function');
      const data = await res.json();
      setFunctions(data);
    };

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
    await fetch(`/api/agents`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id ,status: !currentStatus, }),
    });
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === id ? { ...agent, status: !currentStatus } : agent
      )
    );
  };

  const formatPhoneNumbers = (phones: any) => {
    if (Array.isArray(phones)) return phones.join(', ');
    if (typeof phones === 'string') return phones;
    return '';
  };

  // Fonction qui transforme "YYYY-MM" en "MM/YYYY"
  const formatMonthYear = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    return `${month}/${year}`;
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Liste des agents</h1>
        <AddAgentDialog
          departments={departments}
          functions={functions}
          onAgentAdded={fetchAgents}
        />
      </div>
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
                  <p className="text-sm text-muted-foreground">{getFunctionName(agent.functionId)}</p>
                  {agent.engagementDate && (
                    <p className="text-sm text-muted-foreground">
                      Depuis {formatMonthYear(agent.engagementDate)}
                    </p>
                  )}
                  <p className="text-sm font-semibold text-muted-foreground">{getDepartmentName(agent.departementId)}</p>
                  <p className="text-sm text-muted-foreground">{formatPhoneNumbers(agent.phoneNumbers)}</p>

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
