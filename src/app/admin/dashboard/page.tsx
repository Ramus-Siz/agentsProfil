'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({ agents: 0, activeAgents: 0, departments: 0 });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      router.replace('/admin/login');
    }

    const fetchData = async () => {
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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#"></BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid gap-6 md:grid-cols-3">
            <StatCard title="Agents enregistrés" value={stats.agents} icon={<span>👥</span>} />
            <StatCard title="Agents actifs" value={stats.activeAgents} icon={<span>✅</span>} />
            <StatCard title="Départements" value={stats.departments} icon={<span>🏢</span>} />
          </div>
          <div className="mt-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">Gérer les données</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <button
                onClick={() => router.push('/admin/agents')}
                className="w-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white py-3 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Agents
              </button>
              <button
                onClick={() => router.push('/admin/departements')}
                className="w-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white py-3 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Départements
              </button>
              <button
                onClick={() => router.push('/admin/functions')}
                className="w-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white py-3 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Fonctions
              </button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
