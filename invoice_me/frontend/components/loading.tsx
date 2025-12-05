import { Bouncy } from 'ldrs/react';

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = "Loading..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Bouncy size="60" speed="1.75" color="black"/>
        <p className="text-lg font-medium text-slate-700">{message}</p>
      </div>
    </div>
  );
}