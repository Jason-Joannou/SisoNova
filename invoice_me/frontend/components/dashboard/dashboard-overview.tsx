"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { StatsGrid } from "../ui/stats-cards";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CreditCard,
  FileText,
  TrendingUp,
  Plus,
  Eye,
  Zap,
  Smartphone,
  ArrowUpRight,
} from "lucide-react";
import { DashboardStats, DashboardKPIs } from "@/lib/types/dashboard";
import { StatsCardData } from "@/lib/types/user-interface";
import { Invoice } from "@/lib/types/invoicing";
import { ServiceCardData } from "@/lib/types/user-interface";
import { ServiceCard } from "../ui/service-card";

// Dummy data

export function DashboardOverview() {
  const router = useRouter()
  const dashboardStats: DashboardStats = {
    totalInvoices: 156,
    totalFinanced: 89,
    totalCollected: 234000,
    pendingAmount: 145000,
    monthlyGrowth: 12.5,
  };

  const recentInvoices: Invoice[] = [
    {
      id: "1",
      invoiceNumber: "INV-001",
      buyerName: "Ridgeway Butchery",
      amount: 15000,
      dueDate: "2025-09-15",
      status: "pending",
      service: "financing",
      createdAt: "2025-08-25",
    },
    {
      id: "2",
      invoiceNumber: "INV-002",
      buyerName: "De Abreu Essop Inc",
      amount: 8500,
      dueDate: "2025-09-10",
      status: "overdue",
      service: "collections",
      createdAt: "2025-08-20",
    },
    {
      id: "3",
      invoiceNumber: "INV-003",
      buyerName: "WLDF SA",
      amount: 12000,
      dueDate: "2025-09-20",
      status: "financed",
      service: "financing",
      createdAt: "2025-08-28",
    },
  ];

  // Quick stats for each service
  const serviceStats: DashboardKPIs = {
    financing: {
      active: 12,
      totalAdvanced: 145000,
      avgProcessingTime: "2.3 hours",
    },
    collections: {
      active: 34,
      collectionRate: 94.2,
      avgDaysToPayment: 18,
    },
    invoicing: {
      thisMonth: 67,
      paidOnTime: 89.5,
      avgAmount: 8750,
    },
  };

  const serviceCardData: ServiceCardData[] = [
    {
      title: "Pay-Me-Now Financing",
      description: "Get instant cash for your invoices",
      serviceClassColor: "border-emerald-200",
      quickStatsColor: "bg-emerald-50",
      icon: Zap,
      inconColor: "text-emerald-600",
      serviceStats: [
        {
          serviceTilte: "Active",
          serviceValue: serviceStats.financing.active,
        },
        {
          serviceTilte: "Total Advanced",
          serviceValue: serviceStats.financing.totalAdvanced,
          serviceValueAffix: "R",
          affixPosition: "prefix",
        },
      ],
      buttonInformation: [
        {
          buttonText: "New Request",
          buttonIcon: Plus,
          buttonVariant: "default",
          buttonSize: "sm",
          buttonColor: "bg-emerald-600",
          buttonHoverColor: "bg-emerald-700",
          onClick: () => {
            console.log("New Financing Request");
          },
        },
        {
          buttonText: "View All",
          buttonIcon: Eye,
          buttonVariant: "outline",
          buttonSize: "sm",
          buttonColor: "border-emerald-200",
          buttonTextColor: "text-emerald-700",
          buttonHoverColor: "bg-emerald-50",
          onClick: () => {
            // Push to Financing page
            router.push("/dashboard/financing")
          },
        },
      ],
    },
    {
      title: "Smart Collections",
      description: "Automated payment collection",
      serviceClassColor: "border-blue-200",
      quickStatsColor: "bg-blue-50",
      icon: CreditCard,
      inconColor: "text-blue-600",
      serviceStats: [
        {
          serviceTilte: "Active",
          serviceValue: serviceStats.collections.active,
        },
        {
          serviceTilte: "Success Rate",
          serviceValue: serviceStats.collections.collectionRate,
          serviceValueAffix: "%",
          affixPosition: "suffix",
        },
      ],
      buttonInformation: [
        {
          buttonText: "Setup Collection",
          buttonIcon: Plus,
          buttonVariant: "default",
          buttonSize: "sm",
          buttonColor: "bg-blue-600",
          buttonHoverColor: "bg-blue-700",
          onClick: () => {
            console.log("Setup Collection");
          },
        },
        {
          buttonText: "View All",
          buttonIcon: Eye,
          buttonVariant: "outline",
          buttonSize: "sm",
          buttonColor: "border-blue-200",
          buttonTextColor: "text-emerald-700",
          buttonHoverColor: "bg-blue-50",
          onClick: () => {
            console.log("View All Collections");
            router.push("/dashboard/collections")
          },
        },
      ],
    },
    {
      title: "Mobile Invoicing",
      description: "Create & send invoices instantly",
      serviceClassColor: "border-purple-200",
      quickStatsColor: "bg-purple-50",
      icon: Smartphone,
      inconColor: "text-purple-600",
      serviceStats: [
        {
          serviceTilte: "This month",
          serviceValue: serviceStats.invoicing.thisMonth,
        },
        {
          serviceTilte: "On time rate",
          serviceValue: serviceStats.invoicing.paidOnTime,
          serviceValueAffix: "%",
          affixPosition: "suffix",
        },
      ],
      buttonInformation: [
        {
          buttonText: "Create Invoice",
          buttonIcon: Plus,
          buttonVariant: "default",
          buttonSize: "sm",
          buttonColor: "bg-purple-600",
          buttonHoverColor: "bg-purple-700",
          onClick: () => {
            console.log("Create Invoice");
          },
        },
        {
          buttonText: "View All",
          buttonIcon: Eye,
          buttonVariant: "outline",
          buttonSize: "sm",
          buttonColor: "border-purple-200",
          buttonTextColor: "text-purple-700",
          buttonHoverColor: "bg-purple-50",
          onClick: () => {
            console.log("View All Invoices");
            router.push("/dashboard/invoicing")
          },
        },
      ],
    },
  ];

  const dashboardStatsData: StatsCardData[] = [
    {
      title: "Total Invoices",
      value: dashboardStats.totalInvoices,
      subtitle: `+${dashboardStats.monthlyGrowth}% from last month`,
      icon: FileText,
      iconColor: "text-slate-500",
      subtitleColor: "text-emerald-600 font-medium",
    },
    {
      title: "Financed",
      value: dashboardStats.totalFinanced,
      subtitle: "Active financing agreements",
      icon: CreditCard,
      iconColor: "text-emerald-600",
      subtitleColor: "text-slate-500",
    },
    {
      title: "Collected",
      value: dashboardStats.totalCollected.toLocaleString(),
      subtitle: "Total collected this month",
      icon: TrendingUp,
      iconColor: "text-emerald-600",
      subtitleColor: "text-emerald-600 font-medium",
      valuePrefix: "R",
    },
    {
      title: "Pending",
      value: dashboardStats.pendingAmount.toLocaleString(),
      subtitle: "Awaiting payment",
      icon: CalendarDays,
      iconColor: "text-slate-500",
      subtitleColor: "text-slate-500",
      valuePrefix: "R",
    },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="space-y-6 p-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back to SisoNova
          </h1>
          <p className="text-slate-600">
            Manage your receivables and track your cashflow
          </p>
        </div>

        {/* Stats Cards */}
        <StatsGrid
          cards={dashboardStatsData}
          columns={{ md: 4, lg: 4 }}
          className="mb-8"
        />

        {/* Service Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {serviceCardData.map((service: ServiceCardData) => (
            <ServiceCard key={service.title} data={service} />
          ))}
        </div>

        {/* Recent Invoices */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-slate-900">Recent Invoices</CardTitle>
              <CardDescription className="text-slate-600">
                Your latest invoice activity across all services
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-slate-600 hover:text-slate-900"
            >
              View All
              <ArrowUpRight className="h-4 w-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium text-slate-900">
                        {invoice.invoiceNumber}
                      </p>
                      <p className="text-sm text-slate-600">
                        {invoice.buyerName}
                      </p>
                    </div>
                    <Badge
                      variant={
                        invoice.status === "paid"
                          ? "default"
                          : invoice.status === "overdue"
                          ? "destructive"
                          : invoice.status === "financed"
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        invoice.status === "paid"
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                          : invoice.status === "financed"
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                          : ""
                      }
                    >
                      {invoice.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={
                        invoice.service === "financing"
                          ? "border-emerald-200 text-emerald-700"
                          : invoice.service === "collections"
                          ? "border-blue-200 text-blue-700"
                          : "border-purple-200 text-purple-700"
                      }
                    >
                      {invoice.service}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900">
                      R{invoice.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-500">
                      Due: {invoice.dueDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
