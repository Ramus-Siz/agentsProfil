'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, UserCheck, Users } from 'lucide-react';
import OverlayLoading from '@/components/OverlayLoading';

export default function DashboardClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ agents: 0, activeAgents: 0, departments: 0 });

  const stylBoutonRacourcisAgents =
    'w-full bg-[#008237] dark:bg-gray-800 text-white-800 dark:text-white py-3 cursor-pointer px-4 rounded-md hover:bg-[#10bc58] dark:hover:bg-gray-700';
    const stylBoutonRacourcisDepartements =
    'w-full bg-[#95c121] dark:bg-gray-800 text-gray-800 dark:text-white py-3 cursor-pointer px-4 rounded-md hover:bg-[#7ca50b] dark:hover:bg-gray-700';
    const stylBoutonRacourcisFonctions =
    'w-full bg-[#ffcb00] dark:bg-gray-800 text-gray-800 dark:text-white py-3 cursor-pointer px-4 rounded-md hover:bg-[#c19907] dark:hover:bg-gray-700';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [agentsRes, departmentsRes] = await Promise.all([
          fetch('/api/agents'),
          fetch('/api/departements'),
        ]);

        const agents = await agentsRes.json();
        const departments = await departmentsRes.json();
        const activeAgents = agents.filter((agent: any) => agent.status === true);

        setStats({
          agents: agents.length,
          activeAgents: activeAgents.length,
          departments: departments.length,
        });
      } catch (error) {
        console.error('Erreur lors du chargement du dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const StatCard = ({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) => (
    <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h4>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className="text-gray-400 dark:text-gray-600 text-4xl">{icon}</div>
      </div>
    </div>
  );

  return (
    <>
      {loading && <OverlayLoading />}

      <div className="flex flex-1 flex-col gap-4">
        <div className="grid gap-6 md:grid-cols-3">
          <StatCard
            title="Agents enregistrés"
            value={stats.agents}
            icon={<Users className="w-10 h-10 text-[#95c11e]" />}
          />
          <StatCard
            title="Agents actifs"
            value={stats.activeAgents}
            icon={<UserCheck className="w-10 h-10 text-[#95c11e]" />}
          />
          <StatCard
            title="Départements"
            value={stats.departments}
            icon={<Building2 className="w-10 h-10 text-[#95c11e]" />}
          />
        </div>

        <div className="mt-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">Gérer les données</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <button onClick={() => router.push('/admin/agents')} className={stylBoutonRacourcisAgents}>
              Agents
            </button>
            <button onClick={() => router.push('/admin/departements')} className={stylBoutonRacourcisDepartements}>
              Départements
            </button>
            <button onClick={() => router.push('/admin/fonctions')} className={stylBoutonRacourcisFonctions}>
              Fonctions
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
