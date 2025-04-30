// components/ui/ubuntu-heading.tsx
import { cn } from "@/lib/utils";

interface UbuntuHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function UbuntuHeading({ children, className }: UbuntuHeadingProps) {
  return (
    <div className={cn("relative flex items-center justify-center mb-8", className)}>
      <div className="absolute h-px w-full bg-border" />
      <div className="relative bg-white px-4 z-10 rounded-full">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-ubuntu-green mr-2" />
          <h2 className="text-3xl font-bold">{children}</h2>
          <div className="w-3 h-3 rounded-full bg-ubuntu-red ml-2" />
        </div>
      </div>
    </div>
  );
}