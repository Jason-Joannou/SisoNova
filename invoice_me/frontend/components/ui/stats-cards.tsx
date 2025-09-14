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
  const gridClasses = `grid gap-4 md:grid-cols-${columns.md} lg:grid-cols-${columns.lg}`;

  return (
    <div className={`${gridClasses} ${className}`}>
      {cards.map((card, index) => (
        <StatsCard key={index} data={card} />
      ))}
    </div>
  );
}