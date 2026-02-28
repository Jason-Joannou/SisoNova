"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Send,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  ArrowUpRight,
  History, 
  ListFilter, 
  Sparkles,
  Zap,
  FileText
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Invoice } from "@/lib/types/invoicing";
import Link from "next/link";
import { ViewInvoiceModal } from "./modals/view-invoice-modal";

// Mock data remains the same...
const mockInvoices: Invoice[] = [
  { id: "1", invoiceNumber: "INV-2024-001", buyerName: "Ridgeway Butchery", amount: 15750.0, dueDate: "2024-11-15", status: "pending", service: "invoicing", createdAt: "2024-10-15" },
  { id: "2", invoiceNumber: "INV-2024-002", buyerName: "Tech Solutions Ltd", amount: 28500.0, dueDate: "2024-11-20", status: "paid", service: "invoicing", createdAt: "2024-10-18" },
  { id: "3", invoiceNumber: "INV-2024-003", buyerName: "Green Energy Co", amount: 12300.0, dueDate: "2024-10-25", status: "overdue", service: "invoicing", createdAt: "2024-09-25" },
  { id: "4", invoiceNumber: "INV-2024-004", buyerName: "Urban Developers", amount: 45000.0, dueDate: "2024-11-30", status: "pending", service: "financing", createdAt: "2024-10-20" },
  { id: "5", invoiceNumber: "INV-2024-005", buyerName: "Retail Mart", amount: 8900.0, dueDate: "2024-11-10", status: "paid", service: "invoicing", createdAt: "2024-10-12" },
];

export function InvoiceDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // LOGIC: Functional Filtering restored
  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.buyerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const StatusBadge = ({ status }: { status: Invoice["status"] }) => {
    const variants = {
      pending: { color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
      paid: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle },
      overdue: { color: "bg-rose-50 text-rose-700 border-rose-200", icon: AlertCircle },
      financed: { color: "bg-blue-50 text-blue-700 border-blue-200", icon: Zap },
    };
    const variant = variants[status];
    const Icon = variant.icon;
    return (
      <Badge variant="outline" className={`${variant.color} flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border`}>
        <Icon className="h-3 w-3" />
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        
        {/* HEADER: Dynamic Context */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Invoicing Dashboard
            </h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              Viewing {filteredInvoices.length} transactions across your portfolio.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" className="rounded-full shadow-sm bg-white border-slate-200">
                <History className="h-4 w-4 mr-2" /> Audit Log
             </Button>
             <Link href="/dashboard/invoicing/create">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6 shadow-lg transition-all hover:-translate-y-0.5">
                  <Plus className="h-4 w-4 mr-2" /> New Invoice
                </Button>
             </Link>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          
          {/* MAIN COLUMN (75%) */}
          <main className="col-span-12 lg:col-span-9 space-y-8">
            
            {/* MONEY PATH SECTION */}
            <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <DollarSign className="h-32 w-32" />
               </div>
               <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Revenue Pipeline</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                  <div>
                    <p className="text-slate-500 text-sm">Drafts & Pending</p>
                    <h3 className="text-3xl font-black text-slate-900 mt-1">R 60,750</h3>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4">
                       <div className="w-2/3 h-full bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
                    </div>
                  </div>
                  <div className="border-l border-slate-100 pl-12 hidden md:block">
                    <p className="text-slate-500 text-sm">Collected (MTD)</p>
                    <h3 className="text-3xl font-black text-emerald-600 mt-1">R 37,400</h3>
                    <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
                       <ArrowUpRight className="h-3 w-3" /> +12.5%
                    </p>
                  </div>
                  <div className="border-l border-slate-100 pl-12 hidden md:block">
                    <p className="text-slate-500 text-sm">Projected (Q4)</p>
                    <h3 className="text-3xl font-black text-slate-900 mt-1">R 145,000</h3>
                    <p className="text-xs text-slate-400 mt-2 italic">Active contracts</p>
                  </div>
               </div>
            </section>

            {/* ACTIONABLE TABLE SECTION */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold text-slate-900">Recent Transactions</h2>
                
                {/* FUNCTIONAL SEARCH & FILTER */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      className="pl-9 h-9 w-64 bg-slate-100 border-none rounded-lg focus-visible:ring-1" 
                      placeholder="Search invoices..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] h-9 bg-white rounded-lg border-slate-200">
                      <ListFilter className="h-4 w-4 mr-2 text-slate-400" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-none hover:bg-transparent">
                      <TableHead className="pl-6 font-bold text-slate-500">CLIENT</TableHead>
                      <TableHead className="font-bold text-slate-500">AMOUNT</TableHead>
                      <TableHead className="font-bold text-slate-500">STATUS</TableHead>
                      <TableHead className="font-bold text-slate-500">DUE DATE</TableHead>
                      <TableHead className="text-right pr-6">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-20">
                          <FileText className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                          <p className="text-slate-500">No transactions match your search.</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <TableCell className="pl-6 py-5">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900">{invoice.buyerName}</span>
                              <span className="text-xs text-slate-400 font-mono tracking-tighter">{invoice.invoiceNumber}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-extrabold text-slate-900">
                            R {invoice.amount.toLocaleString("en-ZA")}
                          </TableCell>
                          <TableCell>
                             <StatusBadge status={invoice.status} />
                          </TableCell>
                          <TableCell className="text-slate-500 text-sm">
                             {new Date(invoice.dueDate).toLocaleDateString("en-ZA", { day: 'numeric', month: 'short' })}
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            {/* ACTION MENU RESTORED */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full">
                                  <MoreVertical className="h-4 w-4 text-slate-500" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-xl border-slate-200">
                                <DropdownMenuItem onClick={() => { setSelectedInvoice(invoice); setIsViewModalOpen(true); }} className="cursor-pointer">
                                  <Eye className="h-4 w-4 mr-2" /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Edit className="h-4 w-4 mr-2" /> Edit Invoice
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Send className="h-4 w-4 mr-2" /> Send to Client
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50">
                                  <AlertCircle className="h-4 w-4 mr-2" /> Mark Overdue
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
            </div>
          </main>

          {/* ASIDE COLUMN (25%) */}
          <aside className="col-span-12 lg:col-span-3 space-y-6">
            <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6">
               <div className="flex items-center gap-2 text-rose-700 mb-4">
                  <AlertCircle className="h-5 w-5" />
                  <h3 className="font-bold">Attention Needed</h3>
               </div>
               <div className="space-y-4">
                  <div className="bg-white/60 p-4 rounded-2xl border border-rose-200/50 shadow-sm">
                     <p className="text-xs font-bold text-rose-900">Green Energy Co</p>
                     <p className="text-xs text-rose-700">R 12,300 is 5 days overdue</p>
                     <Button variant="link" className="p-0 h-auto text-[10px] text-rose-900 font-black mt-2 underline-offset-4">
                        SEND REMINDER →
                     </Button>
                  </div>
               </div>
            </div>

            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200">
               <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  Quick Actions
               </h3>
               <div className="grid grid-cols-1 gap-2">
                  <Button variant="secondary" className="justify-start bg-white/10 border-none hover:bg-white/20 text-white text-xs h-9 rounded-xl">
                     <Send className="h-3 w-3 mr-2" /> Batch Reminders
                  </Button>
                  <Button variant="secondary" className="justify-start bg-white/10 border-none hover:bg-white/20 text-white text-xs h-9 rounded-xl">
                     <Download className="h-3 w-3 mr-2" /> Monthly Report
                  </Button>
               </div>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-3xl">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Market Health</h3>
               <div className="space-y-6">
                  <div>
                     <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-500">Collection Rate</span>
                        <span className="font-bold text-slate-900">92%</span>
                     </div>
                     <div className="w-full h-1.5 bg-slate-100 rounded-full">
                        <div className="w-[92%] h-full bg-emerald-500 rounded-full" />
                     </div>
                  </div>
                  <div>
                     <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-500">Avg. Pay Time</span>
                        <span className="font-bold text-slate-900">14 Days</span>
                     </div>
                     <div className="w-full h-1.5 bg-slate-100 rounded-full">
                        <div className="w-[60%] h-full bg-purple-500 rounded-full" />
                     </div>
                  </div>
               </div>
            </div>
          </aside>
        </div>
      </div>

      {/* MODAL Integration restored */}
      {selectedInvoice && (
        <ViewInvoiceModal
          companyName={selectedInvoice.buyerName}
          invoiceNumber={selectedInvoice.invoiceNumber}
          open={isViewModalOpen}
          onOpenChange={setIsViewModalOpen}
        />
      )}
    </div>
  );
}