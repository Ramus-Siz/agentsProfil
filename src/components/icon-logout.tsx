import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function LogoutIcon() {
  return (
    <LogOut
      className="w-6 h-6 cursor-pointer text-gray-700 hover:text-red-600"
      onClick={() => signOut({ callbackUrl: '/login' })}
      role="button"
      aria-label="Se déconnecter"
    >
      <title>Se déconnecter</title>
    </LogOut>
  );
}
