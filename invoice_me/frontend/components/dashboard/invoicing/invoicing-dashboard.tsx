"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Send,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Invoice } from "@/lib/types/invoicing";
import Link from "next/link";
import { InvoiceStatsCard } from "./ui/invoice-stats-card";

// Mock data for demonstration
const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    buyerName: "Ridgeway Butchery",
    amount: 15750.00,
    dueDate: "2024-11-15",
    status: "pending",
    service: "invoicing",
    createdAt: "2024-10-15",
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    buyerName: "Tech Solutions Ltd",
    amount: 28500.00,
    dueDate: "2024-11-20",
    status: "paid",
    service: "invoicing",
    createdAt: "2024-10-18",
  },
  {
    id: "3",
    invoiceNumber: "INV-2024-003",
    buyerName: "Green Energy Co",
    amount: 12300.00,
    dueDate: "2024-10-25",
    status: "overdue",
    service: "invoicing",
    createdAt: "2024-09-25",
  },
  {
    id: "4",
    invoiceNumber: "INV-2024-004",
    buyerName: "Urban Developers",
    amount: 45000.00,
    dueDate: "2024-11-30",
    status: "pending",
    service: "financing",
    createdAt: "2024-10-20",
  },
  {
    id: "5",
    invoiceNumber: "INV-2024-005",
    buyerName: "Retail Mart",
    amount: 8900.00,
    dueDate: "2024-11-10",
    status: "paid",
    service: "invoicing",
    createdAt: "2024-10-12",
  },
];

export function InvoiceDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");

  // Calculate statistics
  const stats = {
    total: mockInvoices.reduce((sum, inv) => sum + inv.amount, 0),
    pending: mockInvoices
      .filter((inv) => inv.status === "pending")
      .reduce((sum, inv) => sum + inv.amount, 0),
    paid: mockInvoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + inv.amount, 0),
    overdue: mockInvoices
      .filter((inv) => inv.status === "overdue")
      .reduce((sum, inv) => sum + inv.amount, 0),
    count: {
      total: mockInvoices.length,
      pending: mockInvoices.filter((inv) => inv.status === "pending").length,
      paid: mockInvoices.filter((inv) => inv.status === "paid").length,
      overdue: mockInvoices.filter((inv) => inv.status === "overdue").length,
    },
  };

  // Filter invoices
  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.buyerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    const matchesService =
      serviceFilter === "all" || invoice.service === serviceFilter;
    return matchesSearch && matchesStatus && matchesService;
  });

  // Status badge component
  const StatusBadge = ({ status }: { status: Invoice["status"] }) => {
    const variants = {
      pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
      paid: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
      overdue: { color: "bg-red-100 text-red-800 border-red-200", icon: AlertCircle },
      financed: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: TrendingUp },
    };

    const variant = variants[status];
    const Icon = variant.icon;

    return (
      <Badge
        variant="outline"
        className={`${variant.color} flex items-center gap-1 w-fit`}
      >
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Invoice Dashboard
            </h1>
            <p className="text-slate-600">
              Manage and track all your invoices in one place
            </p>
          </div>
          <Link href="/dashboard/invoicing/create">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Revenue */}
          <InvoiceStatsCard
            title="Total Revenue"
            cardColour="blue-500"
            textColour="text-slate-600"
            titleIcon={<DollarSign className="h-5 w-5 text-blue-500" />}
          >
            <div className="text-2xl font-bold text-slate-900">
              R{stats.total.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center text-xs text-green-600 mt-2">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>12.5% from last month</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {stats.count.total} total invoices
            </p>
          </InvoiceStatsCard>

          {/* Pending */}
          <InvoiceStatsCard
            title="Pending Payment"
            cardColour="yellow-500"
            textColour="text-slate-600"
            titleIcon={<Clock className="h-5 w-5 text-yellow-500" />}
          >
            <div className="text-2xl font-bold text-slate-900">
              R{stats.pending.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center text-xs text-slate-600 mt-2">
              <FileText className="h-3 w-3 mr-1" />
              <span>{stats.count.pending} invoices</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Awaiting payment
            </p>
          </InvoiceStatsCard>

          {/* Paid */}
          <InvoiceStatsCard
            title="Paid Invoices"
            cardColour="green-500"
            textColour="text-slate-600"
            titleIcon={<CheckCircle className="h-5 w-5 text-green-500" />}
          >
            <div className="text-2xl font-bold text-slate-900">
              R{stats.paid.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center text-xs text-green-600 mt-2">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>8.2% increase</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {stats.count.paid} invoices paid
            </p>
          </InvoiceStatsCard>

          {/* Overdue */}
          <InvoiceStatsCard
            title="Overdue"
            cardColour="red-500"
            textColour="text-slate-600"
            titleIcon={<AlertCircle className="h-5 w-5 text-red-500" />}
          >
            <div className="text-2xl font-bold text-slate-900">
              R{stats.overdue.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center text-xs text-red-600 mt-2">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              <span>Needs attention</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {stats.count.overdue} invoices overdue
            </p>
          </InvoiceStatsCard>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by invoice number or client name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="financed">Financed</SelectItem>
                </SelectContent>
              </Select>

              {/* Service Filter */}
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="invoicing">Invoicing</SelectItem>
                  <SelectItem value="financing">Financing</SelectItem>
                  <SelectItem value="collections">Collections</SelectItem>
                </SelectContent>
              </Select>

              {/* Export Button */}
              <Button variant="outline" className="w-full md:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Recent Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2 text-slate-500">
                          <FileText className="h-12 w-12 text-slate-300" />
                          <p>No invoices found</p>
                          <p className="text-sm">
                            Try adjusting your filters or create a new invoice
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <TableRow
                        key={invoice.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <TableCell className="font-mono font-medium">
                          {invoice.invoiceNumber}
                        </TableCell>
                        <TableCell className="font-medium">
                          {invoice.buyerName}
                        </TableCell>
                        <TableCell className="font-semibold">
                          R{invoice.amount.toLocaleString("en-ZA", {
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={invoice.status} />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {invoice.service}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            {new Date(invoice.dueDate).toLocaleDateString("en-ZA")}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {new Date(invoice.createdAt).toLocaleDateString("en-ZA")}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Send className="h-4 w-4 mr-2" />
                                Send
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-100 hover:border-purple-300">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Plus className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Create Invoice</h3>
                  <p className="text-sm text-slate-600">
                    Generate a new invoice
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-100 hover:border-blue-300">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Send className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Send Reminders</h3>
                  <p className="text-sm text-slate-600">
                    Notify pending clients
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-100 hover:border-green-300">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Download className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Export Report</h3>
                  <p className="text-sm text-slate-600">
                    Download financial data
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}