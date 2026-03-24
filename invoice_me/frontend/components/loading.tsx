import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  label?: string;
  variant?: "full-page" | "inset" | "skeleton";
  className?: string;
}

export function LoadingState({ 
  label = "Loading...", 
  variant = "inset", 
  className 
}: LoadingStateProps) {
  
  // 1. FULL PAGE: Background must be visible
  if (variant === "full-page") {
    return (
      <div className="fixed inset-0 min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 z-[9999]">
        <Spinner className="size-12 text-slate-900" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">
          {label}
        </p>
      </div>
    );
  }

  // 2. SKELETON: Must have a background color (bg-slate-200) to be seen
  if (variant === "skeleton") {
    return (
      <Skeleton className={cn("h-4 w-24 bg-slate-200 rounded-md", className)} />
    );
  }

  // 3. INSET: Must have a background and centering
  return (
    <div className={cn(
      "absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-[2.5rem]",
      className
    )}>
      <Spinner className="size-8 text-slate-900" />
      {label && (
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">
          {label}
        </p>
      )}
    </div>
  );
}