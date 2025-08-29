"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { CalendarDays, CreditCard, FileText, TrendingUp, Plus, Eye } from "lucide-react"
import { DashboardStats, Invoice } from "@/lib/types/dashboard"
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

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalInvoices}</div>
            <p className="text-xs text-muted-foreground">
              +{dashboardStats.monthlyGrowth}% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Financed</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalFinanced}</div>
            <p className="text-xs text-muted-foreground">
              Active financing agreements
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collected</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{dashboardStats.totalCollected.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total collected this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{dashboardStats.pendingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting payment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Service Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Financing
            </CardTitle>
            <CardDescription>
              Get paid now on specific invoices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              • Upload invoice + proof of work
              • Get firm offers from funding partners
              • Receive payment via RTC/PayShap
            </div>
            <div className="flex gap-2">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Collections
            </CardTitle>
            <CardDescription>
              Routing, reminders & reconciliation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              • Dedicated accounts per buyer
              • Automated reminders via WhatsApp
              • Auto-reconciliation
            </div>
            <div className="flex gap-2">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Setup Collection
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Invoicing
            </CardTitle>
            <CardDescription>
              Mobile-first invoice creation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              • Create professional invoices
              • Embedded payment links
              • WhatsApp-friendly sharing
            </div>
            <div className="flex gap-2">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>
            Your latest invoice activity across all services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">{invoice.invoiceNumber}</p>
                    <p className="text-sm text-muted-foreground">{invoice.buyerName}</p>
                  </div>
                  <Badge variant={
                    invoice.status === 'paid' ? 'default' :
                    invoice.status === 'overdue' ? 'destructive' :
                    invoice.status === 'financed' ? 'secondary' : 'outline'
                  }>
                    {invoice.status}
                  </Badge>
                  <Badge variant="outline">
                    {invoice.service}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="font-medium">R{invoice.amount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Due: {invoice.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}