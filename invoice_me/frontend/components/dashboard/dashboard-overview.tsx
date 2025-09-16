"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { StatsGrid } from "../ui/stats-cards"
import { CalendarDays, CreditCard, FileText, TrendingUp, Plus, Eye, Zap, Smartphone, ArrowUpRight } from "lucide-react"
import { DashboardStats, DashboardKPIs } from "@/lib/types/dashboard"
import { StatsCardData } from "@/lib/types/user-interface"
import { Invoice } from "@/lib/types/invoicing"

// Dummy data
const dashboardStats: DashboardStats = {
  totalInvoices: 156,
  totalFinanced: 89,
  totalCollected: 234000,
  pendingAmount: 145000,
  monthlyGrowth: 12.5
}

const recentInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-001",
    buyerName: "Ridgeway Butchery",
    amount: 15000,
    dueDate: "2025-09-15",
    status: "pending",
    service: "financing",
    createdAt: "2025-08-25"
  },
  {
    id: "2",
    invoiceNumber: "INV-002",
    buyerName: "De Abreu Essop Inc",
    amount: 8500,
    dueDate: "2025-09-10",
    status: "overdue",
    service: "collections",
    createdAt: "2025-08-20"
  },
  {
    id: "3",
    invoiceNumber: "INV-003",
    buyerName: "WLDF SA",
    amount: 12000,
    dueDate: "2025-09-20",
    status: "financed",
    service: "financing",
    createdAt: "2025-08-28"
  }
]

// Quick stats for each service
const serviceStats: DashboardKPIs = {
  financing: {
    active: 12,
    totalAdvanced: 145000,
    avgProcessingTime: "2.3 hours"
  },
  collections: {
    active: 34,
    collectionRate: 94.2,
    avgDaysToPayment: 18
  },
  invoicing: {
    thisMonth: 67,
    paidOnTime: 89.5,
    avgAmount: 8750
  }
}

const dashboardStatsData: StatsCardData[] = [
  {
    title: "Total Invoices",
    value: dashboardStats.totalInvoices,
    subtitle: `+${dashboardStats.monthlyGrowth}% from last month`,
    icon: FileText,
    iconColor: "text-slate-500",
    subtitleColor: "text-emerald-600 font-medium"
  },
  {
    title: "Financed",
    value: dashboardStats.totalFinanced,
    subtitle: "Active financing agreements",
    icon: CreditCard,
    iconColor: "text-emerald-600",
    subtitleColor: "text-slate-500"
  },
  {
    title: "Collected",
    value: dashboardStats.totalCollected.toLocaleString(),
    subtitle: "Total collected this month",
    icon: TrendingUp,
    iconColor: "text-emerald-600",
    subtitleColor: "text-emerald-600 font-medium",
    valuePrefix: "R"
  },
  {
    title: "Pending",
    value: dashboardStats.pendingAmount.toLocaleString(),
    subtitle: "Awaiting payment",
    icon: CalendarDays,
    iconColor: "text-slate-500",
    subtitleColor: "text-slate-500",
    valuePrefix: "R"
  }
];

export function DashboardOverview() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="space-y-6 p-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back to SisoNova</h1>
          <p className="text-slate-600">Manage your receivables and track your cashflow</p>
        </div>

        {/* Stats Cards */}
        <StatsGrid 
          cards={dashboardStatsData} 
          columns={{ md: 4, lg: 4 }}
          className="mb-8"
        />

        {/* Service Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Zap className="h-5 w-5 text-emerald-600" />
                Pay-Me-Now Financing
              </CardTitle>
              <CardDescription className="text-slate-600">
                Get instant cash for your invoices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick stats for financing */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-emerald-50 rounded-lg">
                <div>
                  <p className="text-xs text-slate-600">Active</p>
                  <p className="font-semibold text-slate-900">{serviceStats.financing.active}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Advanced</p>
                  <p className="font-semibold text-slate-900">R{serviceStats.financing.totalAdvanced.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
                </Button>
                <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Smart Collections
              </CardTitle>
              <CardDescription className="text-slate-600">
                Automated payment collection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick stats for collections */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-xs text-slate-600">Active</p>
                  <p className="font-semibold text-slate-900">{serviceStats.collections.active}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Success Rate</p>
                  <p className="font-semibold text-slate-900">{serviceStats.collections.collectionRate}%</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Setup Collection
                </Button>
                <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Smartphone className="h-5 w-5 text-purple-600" />
                Mobile Invoicing
              </CardTitle>
              <CardDescription className="text-slate-600">
                Create & send invoices instantly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick stats for invoicing */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-xs text-slate-600">This Month</p>
                  <p className="font-semibold text-slate-900">{serviceStats.invoicing.thisMonth}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">On-Time Rate</p>
                  <p className="font-semibold text-slate-900">{serviceStats.invoicing.paidOnTime}%</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
                <Button variant="outline" size="sm" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardContent>
          </Card>
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
            <Button variant="outline" size="sm" className="text-slate-600 hover:text-slate-900">
              View All
              <ArrowUpRight className="h-4 w-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium text-slate-900">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-slate-600">{invoice.buyerName}</p>
                    </div>
                    <Badge variant={
                      invoice.status === 'paid' ? 'default' :
                      invoice.status === 'overdue' ? 'destructive' :
                      invoice.status === 'financed' ? 'secondary' : 'outline'
                    } className={
                      invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' :
                      invoice.status === 'financed' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' : ''
                    }>
                      {invoice.status}
                    </Badge>
                    <Badge variant="outline" className={
                      invoice.service === 'financing' ? 'border-emerald-200 text-emerald-700' :
                      invoice.service === 'collections' ? 'border-blue-200 text-blue-700' :
                      'border-purple-200 text-purple-700'
                    }>
                      {invoice.service}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900">R{invoice.amount.toLocaleString()}</p>
                    <p className="text-sm text-slate-500">Due: {invoice.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}