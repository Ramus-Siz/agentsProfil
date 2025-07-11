'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Agent, Departement, Function } from '@/types';
import { AddAgentDialog } from '@/components/addAgent';
import { AgentDetailDialog } from '@/components/dialogDetailAgents';

type AgentsPageProps = {
  withButton?: boolean;
};

export default function AgentsPage({ withButton = true }: AgentsPageProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [departments, setDepartments] = useState<Departement[]>([]);
  const [functions, setFunctions] = useState<Function[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleOpenDetail = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setSelectedAgent(null);
    setIsDetailOpen(false);
  };

  const handleAgentUpdated = (updatedAgent: Agent) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === updatedAgent.id ? updatedAgent : a))
    );
  };

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

  const getDepartmentName = (id: string) =>
    departments.find((d) => String(d.id) === String(id))?.name || 'Inconnu';

  const getFunctionName = (id: string | number) =>
    functions.find((f) => String(f.id) === String(id))?.name || 'Inconnu';

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    await fetch(`/api/agents`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: !currentStatus }),
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

  const formatMonthYear = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    return `${month}/${year}`;
  };

  const filteredAgents = agents.filter((agent) => {
    if (statusFilter === 'active' && agent.status !== true) return false;
    if (statusFilter === 'inactive' && agent.status === true) return false;
    if (departmentFilter !== 'all' && String(agent.departementId) !== departmentFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
         {withButton && (
          <h1 className="text-2xl font-bold">Liste des agents</h1>
        )}
        {withButton && (
          <AddAgentDialog
            departments={departments}
            functions={functions}
            onAgentAdded={fetchAgents}
          />
        )}
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label htmlFor="statusFilter" className="block mb-1 font-medium">
            Filtrer par statut
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="border rounded px-2 py-1"
          >
            <option value="all">Tous</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
        </div>

        <div>
          <label htmlFor="departmentFilter" className="block mb-1 font-medium">
            Filtrer par département
          </label>
          <select
            id="departmentFilter"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">Tous</option>
            {departments.map((dept) => (
              <option key={dept.id} value={String(dept.id)}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAgents.map((agent) => (
          <Card key={agent.id} className="hover:shadow-xl transition-shadow rounded-xl">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={agent.photoUrl || '/placeholder.jpg'}
                  alt={`${agent.firstName} ${agent.lastName}`}
                  className="w-16 h-16 rounded-full object-cover border"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">
                    {agent.firstName} {agent.lastName}
                  </h2>
                  <p className="text-sm text-muted-foreground">{getFunctionName(agent.functionId)}</p>
                  {agent.engagementDate && (
                    <p className="text-sm text-muted-foreground">
                      Depuis {formatMonthYear(agent.engagementDate)}
                    </p>
                  )}
                  <p className="text-sm font-semibold text-muted-foreground">
                    {getDepartmentName(agent.departementId)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatPhoneNumbers(agent.phoneNumbers)}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant={agent.status === true ? 'default' : 'secondary'}>
                  {agent.status === true ? 'Actif' : 'Inactif'}
                </Badge>
                {withButton? 
                  <Switch
                    checked={agent.status === true}
                    onCheckedChange={() => toggleStatus(agent.id, agent.status)}
                  />
                  :<Switch
                    checked={agent.status === true}
                    onCheckedChange={() => toggleStatus(agent.id, agent.status)}
                    disabled
                  />
}
              </div>
              {withButton? <Button
                variant="outline"
                className="w-full"

                onClick={() => handleOpenDetail(agent)}
              >   Voir les détails
              </Button> :           
               <Button
                  variant="outline"
                  className="w-full"
                  disabled
                >
                  Voir les détails
                </Button>}
              
             
  

            </CardContent>
          </Card>
        ))}
      </div>

      {selectedAgent && (
        <AgentDetailDialog
          isOpen={isDetailOpen}
          onClose={handleCloseDetail}
          agent={selectedAgent}
          departments={departments}
          functions={functions}
          onAgentUpdated={handleAgentUpdated}
        />
      )}
    </div>
  );
}
