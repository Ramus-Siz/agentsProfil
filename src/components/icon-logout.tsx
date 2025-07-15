'use client';

import { LogOut, Loader2 } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

interface Props {
  onLoading?: (loading: boolean) => void;
}

export default function LogoutIcon({ onLoading }: Props) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    onLoading?.(true);
    await signOut({ callbackUrl: '/login' });
    setLoading(false);
    onLoading?.(false);
  };

  return (
    <div
      onClick={handleLogout}
      role="button"
      aria-label="Se déconnecter"
      className="w-6 h-6 cursor-pointer text-gray-700 hover:text-red-600"
    >
      {loading ? (
        <span className="sr-only">Déconnexion...</span>
        // <Loader2 className="animate-spin w-6 h-6 text-[#]" />
      ) : (
        <LogOut className="w-6 h-6" />
      )}
    </div>
  );
}
