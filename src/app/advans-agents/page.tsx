'use client';

import AgentsPage from '@/components/agents/agentsPage';
// import AgentsPage from '@/app/admin/agents/page'; 
import Image from 'next/image';

export default function AgentsViewPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <header className="flex flex-col items-center mb-12 bg-white shadow-md rounded-lg py-8 px-10 w-full max-w-4xl">
        <div className="w-28 h-28 relative mb-6">
          <Image
            src="/Advans_Congo_Logo.svg"
            alt="Advans Congo Logo"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Liste des Agents</h1>
        <p className="text-gray-600 text-lg max-w-xl text-center">
          Gestion et visualisation des profils des agents d'Advans Congo
        </p>
      </header>

      <main className="w-full max-w-7xl">
        <AgentsPage withButton={false} />
      </main>
    </div>
  );
}
