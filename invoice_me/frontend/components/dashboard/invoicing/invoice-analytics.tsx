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
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              Invoice Analytics
            </h1>
            <p className="text-slate-600">
              Interactive insights into your invoicing performance and cashflow patterns
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="12months">Last 12 Months</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        <Card className="border-2 border-purple-200 bg-purple-50/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="h-5 w-5 text-purple-600" />
                Advanced Filters
              </CardTitle>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-purple-600 hover:text-purple-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Filter by Buyer
                </label>
                <Select value={selectedBuyer} onValueChange={setSelectedBuyer}>
                  <SelectTrigger>
                    <Users className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Buyers</SelectItem>
                    {buyers.map(buyer => (
                      <SelectItem key={buyer} value={buyer}>
                        {buyer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Payment Speed
                </label>
                <Select value={paymentSpeedFilter} onValueChange={setPaymentSpeedFilter}>
                  <SelectTrigger>
                    <Clock className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Speeds</SelectItem>
                    <SelectItem value="fast">Fast (0-7 days)</SelectItem>
                    <SelectItem value="medium">Medium (8-14 days)</SelectItem>
                    <SelectItem value="slow">Slow (15+ days)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Active Filters
                </label>
                <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
                  {selectedBuyer !== "all" && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      {selectedBuyer}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => setSelectedBuyer("all")}
                      />
                    </Badge>
                  )}
                  {paymentSpeedFilter !== "all" && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {paymentSpeedFilter === "fast" ? "Fast Payment" : 
                       paymentSpeedFilter === "medium" ? "Medium Payment" : "Slow Payment"}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => setPaymentSpeedFilter("all")}
                      />
                    </Badge>
                  )}
                  {!hasActiveFilters && (
                    <span className="text-sm text-slate-500">No filters applied</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {formatCurrency(metrics.totalRevenue)}
              </div>
              <div className="flex items-center text-xs text-slate-600 mt-2">
                <Target className="h-3 w-3 mr-1" />
                <span>From {metrics.totalInvoices} invoices</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {metrics.totalInvoices}
              </div>
              <div className="flex items-center text-xs text-slate-600 mt-2">
                <Filter className="h-3 w-3 mr-1" />
                <span>Filtered results</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Avg. Invoice Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {formatCurrency(Math.round(metrics.avgInvoiceValue))}
              </div>
              <div className="flex items-center text-xs text-slate-600 mt-2">
                <DollarSign className="h-3 w-3 mr-1" />
                <span>Per invoice</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Avg. Payment Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {metrics.avgPaymentTime} days
              </div>
              <div className="flex items-center text-xs text-slate-600 mt-2">
                <Clock className="h-3 w-3 mr-1" />
                <span>Average speed</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Over Time - Bar Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Revenue Over Time
              {selectedBuyer !== "all" && (
                <Badge variant="outline" className="ml-2">
                  {selectedBuyer}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Monthly revenue trends - hover over bars for details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `R${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="revenue" 
                  fill={COLORS.primary} 
                  name="Revenue"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Two Column Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Speed Distribution - Pie Chart */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                Payment Speed Distribution
              </CardTitle>
              <CardDescription>
                How quickly clients pay - interactive pie chart
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentFrequencyPie}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {paymentFrequencyPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Buyers - Bar Chart */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Top Buyers by Revenue
              </CardTitle>
              <CardDescription>
                Revenue contribution by client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topBuyers} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    type="number" 
                    stroke="#64748b"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `R${(value / 1000).toFixed(0)}k`}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    stroke="#64748b"
                    style={{ fontSize: '11px' }}
                    width={120}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="amount" 
                    fill={COLORS.info} 
                    name="Amount"
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Payment Timing by Month - Line Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Payment Speed Trends
            </CardTitle>
            <CardDescription>
              Average days to payment by month - identify best cashflow periods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bestPaymentMonths}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Days', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="avgDays" 
                  stroke={COLORS.warning} 
                  strokeWidth={3}
                  name="Avg Payment Days"
                  dot={{ fill: COLORS.warning, r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Buyer Payment Patterns */}
        <Card className="shadow-lg border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Buyer Payment Patterns
            </CardTitle>
            <CardDescription>
              Understand each buyer's payment behavior for better cashflow planning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {buyerPaymentPatterns.map((pattern) => (
                <div
                  key={pattern.buyer}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-slate-900">{pattern.buyer}</h4>
                        <Badge
                          variant="outline"
                          className={`${
                            pattern.avgDays <= 7
                              ? "bg-green-100 text-green-700 border-green-200"
                              : pattern.avgDays <= 14
                              ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                              : "bg-red-100 text-red-700 border-red-200"
                          }`}
                        >
                          Avg: {pattern.avgDays} days
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span>{pattern.invoices} invoices</span>
                        <span>•</span>
                        <span>{formatCurrency(pattern.totalRevenue)} total</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500 mb-1">Payment Speed</div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-8 rounded ${
                              i < Math.ceil((1 - pattern.avgDays / 30) * 5)
                                ? pattern.avgDays <= 7
                                  ? "bg-green-500"
                                  : pattern.avgDays <= 14
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                                : "bg-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cashflow Insights */}
        <Card className="shadow-lg border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Cashflow Planning Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">
                      Best Months for Cashflow
                    </h4>
                    <p className="text-sm text-blue-700">
                      {bestPaymentMonths.slice(0, 3).map(m => m.month).join(", ")} show the 
                      fastest payment times. Schedule major expenses after these months.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">
                      Reliable Payers
                    </h4>
                    <p className="text-sm text-green-700">
                      {buyerPaymentPatterns.filter(p => p.avgDays <= 7).length} buyers 
                      consistently pay within 7 days. Prioritize work with these clients.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-1">
                      Payment Timing
                    </h4>
                    <p className="text-sm text-yellow-700">
                      Average payment time is {metrics.avgPaymentTime} days. 
                      Factor this into your working capital planning.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-1">
                      Revenue Concentration
                    </h4>
                    <p className="text-sm text-purple-700">
                      Top buyer contributes {topBuyers[0] ? Math.round((topBuyers[0].amount / metrics.totalRevenue) * 100) : 0}% of revenue. 
                      Consider diversifying your client base for stability.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}