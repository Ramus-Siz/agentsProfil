'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Agent, Departement, Function } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdvansAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [departments, setDepartments] = useState<Departement[]>([]);
  const [functions, setFunctions] = useState<Function[]>([]);
  const [agences, setAgences] = useState<any[]>([]);
  const [provinceFilter, setProvinceFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [agenceFilter, setAgenceFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [agentsRes, depRes, funcRes, agencesRes] = await Promise.all([
      fetch('/api/agents'),
      fetch('/api/departements'),
      fetch('/api/function'),
      fetch('/api/agences'),
    ]);

    const [agents, departments, functions, agences] = await Promise.all([
      agentsRes.json(),
      depRes.json(),
      funcRes.json(),
      agencesRes.json(),
    ]);

    setAgents(agents.filter((a: Agent) => a.status === true));
    setDepartments(departments);
    setFunctions(functions);
    setAgences(agences);
  };

  const getDepartmentName = (id: string) =>
    departments.find((d) => String(d.id) === String(id))?.name || 'Inconnu';

  const getFunctionName = (id: string | number) =>
    functions.find((f) => String(f.id) === String(id))?.name || 'Inconnu';

  const filteredAgences = agences.filter(
    (ag) => provinceFilter === 'all' || ag.provinceId === Number(provinceFilter)
  );

  const filteredAgents = agents.filter((agent) => {
    if (departmentFilter !== 'all' && String(agent.departementId) !== departmentFilter) return false;
    if (provinceFilter !== 'all') {
      const agence = agences.find((a) => a.id === agent.agenceId);
      if (!agence || String(agence.provinceId) !== provinceFilter) return false;
    }
    if (agenceFilter !== 'all' && String(agent.agenceId) !== agenceFilter) return false;
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      if (
        !agent.firstName.toLowerCase().includes(q) &&
        !agent.lastName.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const agentsGrouped = departments.map((department) => {
    const agentsByDepartment = filteredAgents.filter(
      (a) => String(a.departementId) === String(department.id)
    );
    const agencesByDepartment = [...new Set(agentsByDepartment.map((a) => a.agenceId))];
    return {
      ...department,
      agences: agences
        .filter((ag) => agencesByDepartment.includes(ag.id))
        .map((agence) => ({
          ...agence,
          agents: agentsByDepartment.filter((a) => a.agenceId === agence.id),
        })),
    };
  });

  const AgentCard = ({ agent }: { agent: Agent }) => (
    <Card className="rounded-xl shadow-md hover:shadow-xl transition">
      <CardContent className="flex flex-col items-center p-6 space-y-4">
        <img
          src={agent.photoUrl || '/images/defaultImage.png'}
          alt={`${agent.firstName} ${agent.lastName}`}
          className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
        />
        <div className="text-center">
          <h2 className="font-semibold text-lg">
            {agent.firstName} {agent.lastName}
          </h2>
          <p className="text-xs text-[#008237]">{getFunctionName(agent.functionId)}</p>
          <p className="text-xs text-gray-400">{getDepartmentName(agent.departementId)}</p>
          <p className="text-sm font-semibold">{Array.isArray(agent.phoneNumbers) ? agent.phoneNumbers.join(', ') : agent.phoneNumbers}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-center">
        <img src="/Advans_Congo_Logo.svg" alt="Advans Congo Logo" className="h-16" />
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <div>
          <label className="block mb-1 font-medium">Département</label>
          <Select onValueChange={setDepartmentFilter} value={departmentFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Département" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={String(dept.id)}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Agence</label>
          <Select onValueChange={setAgenceFilter} value={agenceFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Agence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              {filteredAgences.map((ag) => (
                <SelectItem key={ag.id} value={String(ag.id)}>
                  {ag.name} ({ag.codeAgence})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Recherche</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nom ou Prénom"
            className="border rounded-md px-3 py-2 w-56"
          />
        </div>
      </div>

      <Separator />

      {agentsGrouped.map((department) =>
        department.agences.length > 0 ? (
          <div key={department.id} className="space-y-1">
            <h2 className="text-xl font-bold ">{department.name}</h2>

            {department.agences.map((agence) => (
              <div key={agence.id} className="space-y-4">
                <h3 className="text-sm font-semibold text-[#95c11e]">
                  {agence.name} ({agence.codeAgence})
                </h3>

                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {agence.agents.map((agent: Agent) => (
                    <AgentCard key={agent.id} agent={agent} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null
      )}
    </div>
  );
}
