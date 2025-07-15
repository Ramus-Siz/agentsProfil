'use client';

import { ReactNode, useState } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { Separator } from '@/components/ui/separator';
import OverlayLoading from '@/components/OverlayLoading';
import LogoutIcon from '@/components/icon-logout';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);

  return (
    <SidebarProvider>
      {loading && <OverlayLoading />}
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-xl font-semibold">Administration</h1>

          <div className="flex items-center justify-end flex-1 pr-14">
            <LogoutIcon onLoading={setLoading} />
          </div>
        </header>
        <main className="flex-1 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
