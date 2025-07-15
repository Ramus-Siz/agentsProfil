import { Loader2 } from 'lucide-react';

export default function OverlayLoading() {
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <Loader2 className="w-12 h-12 animate-spin text-[#008237]" />
    </div>
  );
}
