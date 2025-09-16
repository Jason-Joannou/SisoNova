import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCardData } from "@/lib/types/user-interface";

interface StatsCardProps {
  data: StatsCardData;
  className?: string;
}

export function StatsCard({ data, className = "" }: StatsCardProps) {
  const {
    title,
    value,
    subtitle,
    icon: Icon,
    iconColor = "text-slate-500",
    subtitleColor = "text-slate-500",
    valuePrefix = "",
    valueSuffix = ""
  } = data;

  return (
    <Card className={`hover:shadow-lg transition-shadow ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-700">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">
          {valuePrefix}{value}{valueSuffix}
        </div>
        <p className={`text-xs ${subtitleColor}`}>
          {subtitle}
        </p>
      </CardContent>
    </Card>
  );
}

// StatsGrid Component
interface StatsGridProps {
  cards: StatsCardData[];
  columns?: {
    md?: number;
    lg?: number;
  };
  className?: string;
}

export function StatsGrid({ 
  cards, 
  columns = { md: 2, lg: 4 },
  className = ""
}: StatsGridProps) {
  // Create a mapping for grid classes to ensure they're not purged
  const getGridClasses = (md: number, lg: number) => {
    const mdClasses = {
      1: 'md:grid-cols-1',
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-3',
      4: 'md:grid-cols-4',
      5: 'md:grid-cols-5',
      6: 'md:grid-cols-6',
      7: 'md:grid-cols-7',
      8: 'md:grid-cols-8',
      9: 'md:grid-cols-9',
      10: 'md:grid-cols-10',
      11: 'md:grid-cols-11',
      12: 'md:grid-cols-12'
    };
    
    const lgClasses = {
      1: 'lg:grid-cols-1',
      2: 'lg:grid-cols-2',
      3: 'lg:grid-cols-3',
      4: 'lg:grid-cols-4',
      5: 'lg:grid-cols-5',
      6: 'lg:grid-cols-6',
      7: 'lg:grid-cols-7',
      8: 'lg:grid-cols-8',
      9: 'lg:grid-cols-9',
      10: 'lg:grid-cols-10',
      11: 'lg:grid-cols-11',
      12: 'lg:grid-cols-12'
    };

    return `grid gap-4 ${mdClasses[md as keyof typeof mdClasses] || 'md:grid-cols-2'} ${lgClasses[lg as keyof typeof lgClasses] || 'lg:grid-cols-4'}`;
  };

  const gridClasses = getGridClasses(columns.md || 2, columns.lg || 4);

  return (
    <div className={`${gridClasses} ${className}`}>
      {cards.map((card, index) => (
        <StatsCard key={index} data={card} />
      ))}
    </div>
  );
}