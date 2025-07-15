import { Loader2 } from 'lucide-react';

export default function OverlayLoading() {
  return (
    <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-[#008237]" />
    </div>
  );
}
