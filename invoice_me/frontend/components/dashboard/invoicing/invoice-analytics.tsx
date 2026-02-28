"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Download,
  Filter,
  Clock,
  Target,
  X,
  Sparkles,
  ArrowRight,
  CalendarDays,
  MousePointer2,
  Lightbulb,
  Zap,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  ComposedChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Enhanced mock data with more details
const invoiceData = [
  // January
  { id: 1, month: "Jan", buyer: "Urban Developers", revenue: 15000, dueDate: "2024-01-15", paidDate: "2024-01-10", daysToPay: 5 },
  { id: 2, month: "Jan", buyer: "Tech Solutions Ltd", revenue: 12000, dueDate: "2024-01-20", paidDate: "2024-01-18", daysToPay: 8 },
  { id: 3, month: "Jan", buyer: "Green Energy Co", revenue: 18000, dueDate: "2024-01-25", paidDate: "2024-01-30", daysToPay: 15 },

  // February
  { id: 4, month: "Feb", buyer: "Urban Developers", revenue: 18000, dueDate: "2024-02-15", paidDate: "2024-02-12", daysToPay: 7 },
  { id: 5, month: "Feb", buyer: "Retail Mart", revenue: 14000, dueDate: "2024-02-20", paidDate: "2024-02-25", daysToPay: 10 },
  { id: 6, month: "Feb", buyer: "Tech Solutions Ltd", revenue: 20000, dueDate: "2024-02-28", paidDate: "2024-03-05", daysToPay: 12 },

  // March
  { id: 7, month: "Mar", buyer: "Green Energy Co", revenue: 16000, dueDate: "2024-03-10", paidDate: "2024-03-08", daysToPay: 3 },
  { id: 8, month: "Mar", buyer: "Urban Developers", revenue: 12000, dueDate: "2024-03-15", paidDate: "2024-03-20", daysToPay: 15 },
  { id: 9, month: "Mar", buyer: "Ridgeway Butchery", revenue: 20000, dueDate: "2024-03-25", paidDate: "2024-03-27", daysToPay: 7 },

  // April
  { id: 10, month: "Apr", buyer: "Tech Solutions Ltd", revenue: 22000, dueDate: "2024-04-10", paidDate: "2024-04-08", daysToPay: 5 },
  { id: 11, month: "Apr", buyer: "Urban Developers", revenue: 19000, dueDate: "2024-04-15", paidDate: "2024-04-14", daysToPay: 6 },
  { id: 12, month: "Apr", buyer: "Retail Mart", revenue: 20000, dueDate: "2024-04-25", paidDate: "2024-04-30", daysToPay: 10 },

  // May
  { id: 13, month: "May", buyer: "Green Energy Co", revenue: 18000, dueDate: "2024-05-10", paidDate: "2024-05-15", daysToPay: 12 },
  { id: 14, month: "May", buyer: "Urban Developers", revenue: 17000, dueDate: "2024-05-15", paidDate: "2024-05-13", daysToPay: 4 },
  { id: 15, month: "May", buyer: "Tech Solutions Ltd", revenue: 20000, dueDate: "2024-05-25", paidDate: "2024-05-28", daysToPay: 8 },

  // June
  { id: 16, month: "Jun", buyer: "Urban Developers", revenue: 25000, dueDate: "2024-06-10", paidDate: "2024-06-09", daysToPay: 4 },
  { id: 17, month: "Jun", buyer: "Retail Mart", revenue: 22000, dueDate: "2024-06-15", paidDate: "2024-06-20", daysToPay: 10 },
  { id: 18, month: "Jun", buyer: "Ridgeway Butchery", revenue: 20000, dueDate: "2024-06-25", paidDate: "2024-06-27", daysToPay: 7 },

  // July
  { id: 19, month: "Jul", buyer: "Tech Solutions Ltd", revenue: 24000, dueDate: "2024-07-10", paidDate: "2024-07-08", daysToPay: 5 },
  { id: 20, month: "Jul", buyer: "Urban Developers", revenue: 28000, dueDate: "2024-07-15", paidDate: "2024-07-14", daysToPay: 6 },
  { id: 21, month: "Jul", buyer: "Green Energy Co", revenue: 20000, dueDate: "2024-07-25", paidDate: "2024-07-30", daysToPay: 12 },

  // August
  { id: 22, month: "Aug", buyer: "Urban Developers", revenue: 23000, dueDate: "2024-08-10", paidDate: "2024-08-09", daysToPay: 4 },
  { id: 23, month: "Aug", buyer: "Retail Mart", revenue: 25000, dueDate: "2024-08-15", paidDate: "2024-08-20", daysToPay: 10 },
  { id: 24, month: "Aug", buyer: "Tech Solutions Ltd", revenue: 20000, dueDate: "2024-08-25", paidDate: "2024-08-28", daysToPay: 8 },

  // September
  { id: 25, month: "Sep", buyer: "Green Energy Co", revenue: 25000, dueDate: "2024-09-10", paidDate: "2024-09-08", daysToPay: 3 },
  { id: 26, month: "Sep", buyer: "Urban Developers", revenue: 30000, dueDate: "2024-09-15", paidDate: "2024-09-14", daysToPay: 5 },
  { id: 27, month: "Sep", buyer: "Ridgeway Butchery", revenue: 20000, dueDate: "2024-09-25", paidDate: "2024-09-27", daysToPay: 7 },

  // October
  { id: 28, month: "Oct", buyer: "Tech Solutions Ltd", revenue: 28000, dueDate: "2024-10-10", paidDate: "2024-10-08", daysToPay: 5 },
  { id: 29, month: "Oct", buyer: "Urban Developers", revenue: 32000, dueDate: "2024-10-15", paidDate: "2024-10-14", daysToPay: 6 },
  { id: 30, month: "Oct", buyer: "Retail Mart", revenue: 22000, dueDate: "2024-10-25", paidDate: "2024-10-30", daysToPay: 10 },

  // November
  { id: 31, month: "Nov", buyer: "Green Energy Co", revenue: 26000, dueDate: "2024-11-10", paidDate: "2024-11-15", daysToPay: 12 },
  { id: 32, month: "Nov", buyer: "Urban Developers", revenue: 30000, dueDate: "2024-11-15", paidDate: "2024-11-13", daysToPay: 4 },
  { id: 33, month: "Nov", buyer: "Tech Solutions Ltd", revenue: 22000, dueDate: "2024-11-25", paidDate: "2024-11-28", daysToPay: 8 },

  // December
  { id: 34, month: "Dec", buyer: "Urban Developers", revenue: 35000, dueDate: "2024-12-10", paidDate: "2024-12-09", daysToPay: 4 },
  { id: 35, month: "Dec", buyer: "Retail Mart", revenue: 28000, dueDate: "2024-12-15", paidDate: "2024-12-20", daysToPay: 10 },
  { id: 36, month: "Dec", buyer: "Ridgeway Butchery", revenue: 22000, dueDate: "2024-12-25", paidDate: "2024-12-27", daysToPay: 7 },
];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-lg shadow-lg border border-slate-700">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.name.includes("Revenue") || entry.name.includes("Amount")
              ? `R${entry.value.toLocaleString()}`
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Colors for charts
const COLORS = {
  primary: "#9333ea", // purple-600
  secondary: "#a855f7", // purple-500
  success: "#22c55e", // green-500
  warning: "#eab308", // yellow-500
  danger: "#ef4444", // red-500
  info: "#3b82f6", // blue-500
};

const PIE_COLORS = ["#22c55e", "#eab308", "#ef4444", "#3b82f6"];

export function InvoiceAnalytics() {
  const [timeRange, setTimeRange] = useState("12months");
  const [selectedBuyer, setSelectedBuyer] = useState<string>("all");
  const [paymentSpeedFilter, setPaymentSpeedFilter] = useState<string>("all");

  // Get unique buyers
  const buyers = useMemo(() => {
    const uniqueBuyers = Array.from(new Set(invoiceData.map(inv => inv.buyer)));
    return uniqueBuyers.sort();
  }, []);

  // Filter data based on selections
  const filteredData = useMemo(() => {
    let filtered = [...invoiceData];

    if (selectedBuyer !== "all") {
      filtered = filtered.filter(inv => inv.buyer === selectedBuyer);
    }

    if (paymentSpeedFilter !== "all") {
      if (paymentSpeedFilter === "fast") {
        filtered = filtered.filter(inv => inv.daysToPay <= 7);
      } else if (paymentSpeedFilter === "medium") {
        filtered = filtered.filter(inv => inv.daysToPay > 7 && inv.daysToPay <= 14);
      } else if (paymentSpeedFilter === "slow") {
        filtered = filtered.filter(inv => inv.daysToPay > 14);
      }
    }

    return filtered;
  }, [selectedBuyer, paymentSpeedFilter]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalRevenue = filteredData.reduce((sum, inv) => sum + inv.revenue, 0);
    const totalInvoices = filteredData.length;
    const avgInvoiceValue = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;
    const avgPaymentTime = totalInvoices > 0
      ? filteredData.reduce((sum, inv) => sum + inv.daysToPay, 0) / totalInvoices
      : 0;

    return {
      totalRevenue,
      totalInvoices,
      avgInvoiceValue,
      avgPaymentTime: Math.round(avgPaymentTime),
    };
  }, [filteredData]);

  // Group by month for chart
  const revenueByMonth = useMemo(() => {
    const monthlyData = filteredData.reduce((acc, inv) => {
      if (!acc[inv.month]) {
        acc[inv.month] = { month: inv.month, revenue: 0, invoices: 0, avgPaymentDays: 0, totalDays: 0 };
      }
      acc[inv.month].revenue += inv.revenue;
      acc[inv.month].invoices += 1;
      acc[inv.month].totalDays += inv.daysToPay;
      return acc;
    }, {} as Record<string, { month: string; revenue: number; invoices: number; avgPaymentDays: number; totalDays: number }>);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map(month => {
      const data = monthlyData[month] || { month, revenue: 0, invoices: 0, totalDays: 0 };
      return {
        month: data.month,
        revenue: data.revenue,
        invoices: data.invoices,
        avgPaymentDays: data.invoices > 0 ? Math.round(data.totalDays / data.invoices) : 0,
      };
    });
  }, [filteredData]);

  // Top buyers
  const topBuyers = useMemo(() => {
    const buyerStats = filteredData.reduce((acc, inv) => {
      if (!acc[inv.buyer]) {
        acc[inv.buyer] = { name: inv.buyer, amount: 0, invoices: 0 };
      }
      acc[inv.buyer].amount += inv.revenue;
      acc[inv.buyer].invoices += 1;
      return acc;
    }, {} as Record<string, { name: string; amount: number; invoices: number }>);

    return Object.values(buyerStats)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);
  }, [filteredData]);

  // Payment frequency for pie chart
  const paymentFrequencyPie = useMemo(() => {
    const ranges = [
      { name: "0-7 days", min: 0, max: 7, count: 0, color: COLORS.success },
      { name: "8-14 days", min: 8, max: 14, count: 0, color: COLORS.warning },
      { name: "15-30 days", min: 15, max: 30, count: 0, color: COLORS.danger },
      { name: "31+ days", min: 31, max: Infinity, count: 0, color: COLORS.info },
    ];

    filteredData.forEach(inv => {
      const range = ranges.find(r => inv.daysToPay >= r.min && inv.daysToPay <= r.max);
      if (range) range.count++;
    });

    return ranges.filter(r => r.count > 0);
  }, [filteredData]);

  // Best payment months
  const bestPaymentMonths = useMemo(() => {
    const monthlyPaymentSpeed = filteredData.reduce((acc, inv) => {
      if (!acc[inv.month]) {
        acc[inv.month] = { month: inv.month, totalDays: 0, count: 0 };
      }
      acc[inv.month].totalDays += inv.daysToPay;
      acc[inv.month].count += 1;
      return acc;
    }, {} as Record<string, { month: string; totalDays: number; count: number }>);

    return Object.values(monthlyPaymentSpeed)
      .map(m => ({
        month: m.month,
        avgDays: Math.round(m.totalDays / m.count),
        invoices: m.count,
      }))
      .sort((a, b) => a.avgDays - b.avgDays);
  }, [filteredData]);

  // Buyer payment patterns
  const buyerPaymentPatterns = useMemo(() => {
    const patterns = filteredData.reduce((acc, inv) => {
      if (!acc[inv.buyer]) {
        acc[inv.buyer] = { buyer: inv.buyer, totalDays: 0, count: 0, totalRevenue: 0 };
      }
      acc[inv.buyer].totalDays += inv.daysToPay;
      acc[inv.buyer].count += 1;
      acc[inv.buyer].totalRevenue += inv.revenue;
      return acc;
    }, {} as Record<string, { buyer: string; totalDays: number; count: number; totalRevenue: number }>);

    return Object.values(patterns)
      .map(p => ({
        buyer: p.buyer,
        avgDays: Math.round(p.totalDays / p.count),
        invoices: p.count,
        totalRevenue: p.totalRevenue,
      }))
      .sort((a, b) => a.avgDays - b.avgDays);
  }, [filteredData]);

  const clearFilters = () => {
    setSelectedBuyer("all");
    setPaymentSpeedFilter("all");
  };

  const hasActiveFilters = selectedBuyer !== "all" || paymentSpeedFilter !== "all";

  const formatCurrency = (amount: number) => {
    return `R${amount.toLocaleString('en-ZA')}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-10">

        {/* 1. NARRATIVE HEADER: The "So What?" */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Invoice <span className="text-slate-400 font-light">Analytics</span>
            </h1>
            <p className="text-slate-500 max-w-xl">
              Based on the last 12 months, your average payment cycle is <span className="text-slate-900 font-bold underline decoration-amber-400">14 days</span>.
              Collections are trending <span className="text-emerald-600 font-bold">8% faster</span> than last quarter.
            </p>
          </div>

          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm h-11">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[130px] border-none shadow-none focus:ring-0 text-xs font-bold uppercase tracking-wider h-full px-3">
                <CalendarDays className="h-3.5 w-3.5 mr-2 text-slate-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12months">Last Year</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
              </SelectContent>
            </Select>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <Button className="bg-slate-900 text-white rounded-lg px-4 h-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all border-none">
              <Download className="h-3.5 w-3.5 mr-2" />
              Export
            </Button>
          </div>
        </header>

        {/* 2. THE EXECUTIVE PULSE: Clean & High-Contrast */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Revenue Volume", value: "R 1,110,450", sub: "Total billed", color: "purple" },
            { label: "Avg. Invoice", value: "R 18,250", sub: "Per transaction", color: "blue" },
            { label: "Wait Time", value: "14 Days", sub: "Avg. to cash", color: "amber" },
            { label: "Collection Rate", value: "94.2%", sub: "Net recovery", color: "emerald" },
          ].map((m) => (
            <div key={m.label} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-purple-200 transition-colors">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-2">{m.value}</h3>
              <p className="text-xs text-slate-500 mt-1">{m.sub}</p>
              <div className={`absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-10 transition-opacity`}>
                <TrendingUp className="h-16 w-16" />
              </div>
            </div>
          ))}
        </div>

        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Revenue Velocity</h2>
          </div>

          <Card className="rounded-[3rem] border-none shadow-2xl shadow-slate-200/50 bg-white p-6 lg:p-10 relative">

            {/* IN-CHART LEGEND: Positioned absolutely inside the card */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 flex gap-8 text-[10px] font-black tracking-[0.15em] text-slate-400 whitespace-nowrap">
              <span className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-600 shadow-[0_0_8px_rgba(147,51,234,0.4)]" />
                REVENUE
              </span>
              <span className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                PAY SPEED
              </span>
            </div>

            <div className="h-[500px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {/* Added more bottom margin so X-axis labels have room to render fully */}
                <ComposedChart
                  data={revenueByMonth}
                  margin={{ top: 20, right: 10, left: -10, bottom: 20 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 700 }}
                    dy={15}
                  />
                  <YAxis
                    yAxisId="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                    tickFormatter={(v) => `R${v / 1000}k`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#F59E0B', fontSize: 11, fontWeight: 800 }}
                    tickFormatter={(v) => `${v}d`}
                  />
                  <Tooltip cursor={{ fill: '#F8FAFC' }} content={<CustomTooltip />} />
                  <Bar
                    yAxisId="left"
                    dataKey="revenue"
                    fill="#9333EA"
                    radius={[14, 14, 14, 14]}
                    barSize={40}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="avgPaymentDays"
                    stroke="#F59E0B"
                    strokeWidth={5}
                    dot={{ r: 6, fill: '#F59E0B', strokeWidth: 3, stroke: '#fff' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        {/* 4. PAYER BEHAVIOR (Separate Full Width Section) */}
        <section className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">How Fast You Get Paid</h2>
            <Button variant="ghost" className="text-[10px] font-black text-slate-400 hover:text-purple-600 tracking-widest">
              SEE ALL CLIENTS <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {buyerPaymentPatterns.slice(0, 3).map((pattern) => {
              // Logic: Map the average days to a percentage of a standard 30-day month
              const paymentPercentage = Math.min(100, (pattern.avgDays / 30) * 100);

              // Determine color based on common business terms: Under 10 days is great, over 20 is a concern
              const isGood = pattern.avgDays <= 10;
              const isSlow = pattern.avgDays > 20;

              return (
                <div key={pattern.buyer} className="group p-8 bg-white border border-slate-100 rounded-[2.5rem] hover:shadow-xl hover:shadow-slate-200/60 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <p className="text-sm font-black text-slate-900 group-hover:text-purple-600 transition-colors uppercase tracking-tight">{pattern.buyer}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Based on {pattern.invoices} invoices</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-2xl font-black text-slate-900">{pattern.avgDays}</span>
                        <span className="text-xs font-bold text-slate-400 ml-1 uppercase">Days to pay</span>
                      </div>
                      <Badge variant="outline" className={`rounded-lg font-black px-3 py-1 text-[10px] uppercase border-none ${isGood ? "bg-emerald-50 text-emerald-600" : isSlow ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                        }`}>
                        {isGood ? "Fast Payer" : isSlow ? "Slow Payer" : "Average"}
                      </Badge>
                    </div>

                    {/* The Visual Timeline: Represents a 30-day window */}
                    <div className="space-y-1.5">
                      <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ${isGood ? "bg-emerald-400" : isSlow ? "bg-rose-400" : "bg-amber-400"
                            }`}
                          style={{ width: `${paymentPercentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[8px] font-black text-slate-300 uppercase tracking-tighter">
                        <span>Immediate</span>
                        <span>15 Days</span>
                        <span>30+ Days</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}