import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  label?: string;
  variant?: "full-page" | "inset";
  className?: string;
}

export function LoadingState({ 
  label = "Loading...", 
  variant = "inset", 
  className 
}: LoadingStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center gap-3 transition-all duration-300",
      variant === "full-page" ? "fixed inset-0 min-h-screen bg-slate-50/80 backdrop-blur-sm z-50" : "absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 rounded-[2.5rem]",
      className
    )}>
      {/* Shadcn Spinner */}
      <Spinner className="size-8 text-slate-900" />
      
      {label && (
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">
          {label}
        </p>
      )}
    </div>
  );
}