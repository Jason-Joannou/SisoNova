// components/ui/ubuntu-heading.tsx
import { cn } from "@/lib/utils";

interface UbuntuHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function UbuntuHeading({ children, className }: UbuntuHeadingProps) {
  return (
    <div className={cn("relative flex items-center justify-center mb-8", className)}>
      {/* South African flag-inspired line */}
      <div className="absolute h-[3px] w-full">
        <div className="h-full w-full flex">
          <div className="h-full w-1/6 bg-black"></div>
          <div className="h-full w-1/6 bg-[#FFB612]"></div> {/* Gold/Yellow */}
          <div className="h-full w-1/6 bg-[#007A4D]"></div> {/* Green */}
          <div className="h-full w-1/6 bg-white"></div>
          <div className="h-full w-1/6 bg-[#DE3831]"></div> {/* Red */}
          <div className="h-full w-1/6 bg-[#002395]"></div> {/* Blue */}
        </div>
      </div>
      
      {/* Heading container */}
      <div className="relative bg-white px-8 py-3 z-10 rounded-full shadow-md border border-gray-200">
        <div className="flex items-center">
          {/* Heading text */}
          <h2 className="text-2xl font-bold text-[#291009]">{children}</h2>
        </div>
      </div>
      
      {/* Decorative elements on sides */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 flex items-center">
        <div className="w-2 h-2 rounded-full bg-[#007A4D] mr-1"></div> {/* Green */}
        <div className="w-2 h-2 rounded-full bg-[#FFB612] mr-1"></div> {/* Yellow */}
      </div>
      
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center">
        <div className="w-2 h-2 rounded-full bg-[#DE3831] ml-1"></div> {/* Red */}
        <div className="w-2 h-2 rounded-full bg-[#002395] ml-1"></div> {/* Blue */}
      </div>
    </div>
  );
}