import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface InvoiceStatsProps {
    title: string;
    titleIcon?: React.ReactNode;
    cardColour: string;
    textColour: string;
    children: React.ReactNode;
}

export function InvoiceStatsCard(props: InvoiceStatsProps) {
  return (
    <Card className={`border-l-4 border-l-${props.cardColour} hover:shadow-lg transition-shadow`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={`text-sm font-medium ${props.textColour}`}>
          {props.title}
        </CardTitle>
        {props.titleIcon && props.titleIcon}
      </CardHeader>
      <CardContent>
        {props.children}
      </CardContent>
    </Card>
  );
}