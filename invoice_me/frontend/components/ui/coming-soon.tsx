// components/ui/coming-soon.tsx
"use client";

import { Badge } from "./badge";
import { Clock } from "lucide-react";

interface ComingSoonProps {
  featureName?: string;
  message?: string;
  variant?: "overlay" | "card";
}

export function ComingSoon({
  featureName,
  message = "This feature is currently in development",
  variant = "overlay",
}: ComingSoonProps) {
  if (variant === "card") {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Clock className="h-8 w-8 text-slate-400" />
        </div>
        {featureName && (
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {featureName}
          </h3>
        )}
        <Badge className="mb-3 bg-slate-100 text-slate-700 hover:bg-slate-100">
          Coming Soon
        </Badge>
        <p className="text-sm text-slate-600 max-w-xs">{message}</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-lg z-10 flex flex-col items-center justify-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <Clock className="h-8 w-8 text-slate-400" />
      </div>
      {featureName && (
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {featureName}
        </h3>
      )}
      <Badge className="mb-3 bg-slate-100 text-slate-700 hover:bg-slate-100">
        Coming Soon
      </Badge>
      <p className="text-sm text-slate-600 text-center max-w-xs px-4">
        {message}
      </p>
    </div>
  );
}