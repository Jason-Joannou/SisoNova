"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Users,
  FileText,
  Clock,
  Search,
  Save,
  Copy,
  Trash2,
  Edit,
  Building2,
  Mail,
  Phone,
  MapPin,
  Zap,
  History,
  UserPlus,
  Download,
  Eye,
  Info,
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  UserPlus2, 
  FileStack, 
  LayoutTemplate,
} from "lucide-react";
import { InvoiceBuilder } from "./invoice-builder";
import {
  BusinessProfile,
  ClientDetails,
  InvoiceConfiguration,
} from "@/lib/types/invoicing";

// Mock data for saved buyers
const mockSavedBuyers: ClientDetails[] = [
  {
    company_name: "Ridgeway Butchery",
    contact_person: "John Smith",
    email: "accounts@ridgewaybutchery.co.za",
    phone: "+27 11 987 6543",
    address_line_1: "789 Main Street",
    city: "Johannesburg",
    province: "Gauteng",
    postal_code: "2000",
    vat_number: "4987654321",
    credit_limit_enabled: false,
  },
  {
    company_name: "Tech Solutions Ltd",
    contact_person: "Sarah Johnson",
    email: "billing@techsolutions.co.za",
    phone: "+27 21 555 1234",
    address_line_1: "45 Innovation Drive",
    city: "Cape Town",
    province: "Western Cape",
    postal_code: "8001",
    vat_number: "4123456789",
    credit_limit_enabled: true,
    credit_limit_amount: 50000,
  },
  {
    company_name: "Green Energy Co",
    contact_person: "Michael Brown",
    email: "finance@greenenergy.co.za",
    phone: "+27 31 444 5678",
    address_line_1: "12 Solar Street",
    city: "Durban",
    province: "KwaZulu-Natal",
    postal_code: "4001",
    vat_number: "4567891234",
    credit_limit_enabled: false,
  },
];

// Mock data for recent invoices
const mockRecentInvoices = [
  {
    id: "1",
    invoice_number: "INV-2024-001",
    client_name: "Ridgeway Butchery",
    amount: 15750.00,
    date: "2024-10-15",
    status: "paid",
  },
  {
    id: "2",
    invoice_number: "INV-2024-002",
    client_name: "Tech Solutions Ltd",
    amount: 28500.00,
    date: "2024-10-18",
    status: "pending",
  },
  {
    id: "3",
    invoice_number: "INV-2024-003",
    client_name: "Green Energy Co",
    amount: 12300.00,
    date: "2024-10-20",
    status: "overdue",
  },
];

// Mock invoice templates
const mockTemplates = [
  {
    id: "1",
    name: "Consulting Services",
    description: "Standard consulting invoice template",
    items: [
      {
        id: "1",
        title: "Consulting Services",
        description: "Professional consulting and advisory",
        quantity: 1,
        unit: "hours",
        unit_price: 1500,
        discount_percentage: 0,
      },
    ],
  },
  {
    id: "2",
    name: "Monthly Retainer",
    description: "Monthly retainer agreement",
    items: [
      {
        id: "1",
        title: "Monthly Retainer Fee",
        description: "Ongoing support and services",
        quantity: 1,
        unit: "months",
        unit_price: 25000,
        discount_percentage: 0,
      },
    ],
  },
  {
    id: "3",
    name: "Product Sale",
    description: "Standard product invoice",
    items: [
      {
        id: "1",
        title: "Product Item",
        description: "Product description",
        quantity: 1,
        unit: "each",
        unit_price: 0,
        discount_percentage: 0,
      },
    ],
  },
];

export function InvoicingPage() {
  const [showInvoiceBuilder, setShowInvoiceBuilder] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState<ClientDetails | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [savedBuyers, setSavedBuyers] = useState(mockSavedBuyers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddBuyerOpen, setIsAddBuyerOpen] = useState(false);
  const [newBuyer, setNewBuyer] = useState<Partial<ClientDetails>>({
    credit_limit_enabled: false,
  });

  // Filter buyers based on search
  const filteredBuyers = savedBuyers.filter(
    (buyer) =>
      buyer.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.contact_person.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle buyer selection
  const handleSelectBuyer = (buyer: ClientDetails) => {
    setSelectedBuyer(buyer);
  };

  // Handle template selection
  const handleSelectTemplate = (templateId: string | null) => {
    setSelectedTemplate(templateId);
  };

  // Start creating invoice
  const handleStartInvoice = () => {
    if (!selectedBuyer) {
      alert("Please select a buyer first");
      return;
    }
    setShowInvoiceBuilder(true);
  };

  // Add new buyer
  const handleAddBuyer = () => {
    if (!newBuyer.company_name || !newBuyer.email) {
      alert("Please fill in required fields");
      return;
    }
    
    const buyer: ClientDetails = {
      company_name: newBuyer.company_name,
      contact_person: newBuyer.contact_person || "",
      email: newBuyer.email,
      phone: newBuyer.phone,
      address_line_1: newBuyer.address_line_1,
      city: newBuyer.city,
      province: newBuyer.province,
      postal_code: newBuyer.postal_code,
      vat_number: newBuyer.vat_number,
      credit_limit_enabled: newBuyer.credit_limit_enabled || false,
      credit_limit_amount: newBuyer.credit_limit_amount,
    };

    setSavedBuyers([...savedBuyers, buyer]);
    setNewBuyer({ credit_limit_enabled: false });
    setIsAddBuyerOpen(false);
    setSelectedBuyer(buyer);
  };

  // Load invoice from history
  const handleLoadInvoice = (invoiceId: string) => {
    console.log("Loading invoice:", invoiceId);
    // Implement load invoice logic
  };

  // Duplicate invoice
  const handleDuplicateInvoice = (invoiceId: string) => {
    console.log("Duplicating invoice:", invoiceId);
    // Implement duplicate logic
  };

  if (showInvoiceBuilder) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => setShowInvoiceBuilder(false)}
          className="text-slate-500 font-bold text-xs tracking-widest hover:text-purple-600 transition-colors"
        >
          ← BACK TO SETUP
        </Button>
        <InvoiceBuilder
          initialBuyer={selectedBuyer}
          initialTemplate={selectedTemplate}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* 1. NARRATIVE HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              Create <span className="text-slate-300 font-light">Invoice</span>
            </h1>
            <p className="text-slate-500 max-w-lg text-sm leading-relaxed">
              Step-by-step guidance to generate professional invoices. 
              Select a <span className="text-slate-900 font-bold underline decoration-purple-400">client</span> to begin.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
             <div className="flex -space-x-2">
                {[1, 2, 3].map((step) => (
                  <div key={step} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black
                    ${step === 1 ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    0{step}
                  </div>
                ))}
             </div>
             <div className="w-px h-6 bg-slate-200" />
             <Button 
                onClick={handleStartInvoice}
                disabled={!selectedBuyer}
                className="bg-slate-900 text-white rounded-xl px-6 h-9 hover:bg-slate-800 transition-all font-bold text-xs"
             >
                START BUILDING <ArrowRight className="h-3 w-3 ml-2" />
             </Button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-10">
          
          {/* 2. THE MAIN STAGE: Buyer Selection */}
          <main className="col-span-12 lg:col-span-8 space-y-8">
            <div className="space-y-4">
               <div className="flex items-center justify-between px-2">
                  <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Select Recipient</h2>
                  <Button variant="ghost" onClick={() => setIsAddBuyerOpen(true)} className="text-[10px] font-black text-purple-600 hover:bg-purple-50 tracking-widest">
                    <UserPlus2 className="h-3.5 w-3.5 mr-2" /> ADD NEW BUYER
                  </Button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredBuyers.map((buyer) => (
                    <div 
                      key={buyer.email}
                      onClick={() => setSelectedBuyer(buyer)}
                      className={`p-6 rounded-[2rem] transition-all cursor-pointer border relative group
                        ${selectedBuyer?.email === buyer.email 
                          ? 'bg-white border-purple-600 shadow-xl shadow-purple-100' 
                          : 'bg-white border-slate-100 hover:border-purple-200'}`}
                    >
                      {selectedBuyer?.email === buyer.email && (
                        <CheckCircle2 className="absolute top-6 right-6 h-5 w-5 text-purple-600" />
                      )}
                      <div className="flex items-center gap-4 mb-4">
                         <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors
                           ${selectedBuyer?.email === buyer.email ? 'bg-purple-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-purple-50 group-hover:text-purple-600'}`}>
                            <Building2 className="h-6 w-6" />
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-900">{buyer.company_name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{buyer.contact_person}</p>
                         </div>
                      </div>
                      <div className="space-y-2 border-t border-slate-50 pt-4">
                         <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                            <Mail className="h-3 w-3" /> {buyer.email}
                         </div>
                         <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                            <MapPin className="h-3 w-3" /> {buyer.city}, {buyer.province}
                         </div>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* 3. TEMPLATE SELECTION (Horizontal Flow) */}
            <div className="space-y-4">
               <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">Blueprint (Optional)</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    onClick={() => setSelectedTemplate(null)}
                    className={`p-6 rounded-[2rem] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3
                      ${selectedTemplate === null ? 'bg-purple-50 border-purple-600' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                  >
                    <Plus className={`h-8 w-8 ${selectedTemplate === null ? 'text-purple-600' : 'text-slate-300'}`} />
                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Blank Slate</p>
                  </div>
                  {mockTemplates.map((t) => (
                    <div 
                      key={t.id}
                      onClick={() => setSelectedTemplate(t.id)}
                      className={`p-6 rounded-[2rem] border transition-all cursor-pointer
                        ${selectedTemplate === t.id ? 'bg-white border-purple-600 shadow-xl shadow-purple-100' : 'bg-white border-slate-100'}`}
                    >
                      <LayoutTemplate className={`h-5 w-5 mb-4 ${selectedTemplate === t.id ? 'text-purple-600' : 'text-slate-400'}`} />
                      <p className="text-xs font-black text-slate-900 mb-1">{t.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium leading-tight">{t.description}</p>
                    </div>
                  ))}
               </div>
            </div>
          </main>

          {/* 4. THE ASIDE: Context & History */}
          <aside className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
              <Zap className="absolute -top-4 -right-4 h-24 w-24 text-white/5 rotate-12" />
              <h3 className="text-xs font-black uppercase tracking-widest text-purple-400 mb-6">Recent History</h3>
              <div className="space-y-6">
                {mockRecentInvoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between group cursor-pointer">
                    <div className="space-y-1">
                      <p className="text-sm font-bold group-hover:text-purple-400 transition-colors">{inv.invoice_number}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">{inv.client_name}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black">R{(inv.amount/1000).toFixed(1)}k</p>
                       <Badge className="bg-white/5 text-[8px] h-4 border-0">{inv.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="text-white/40 text-[10px] font-black p-0 mt-8 h-auto hover:text-white uppercase tracking-widest">
                VIEW FULL AUDIT LOG <ArrowRight className="h-3 w-3 ml-2" />
              </Button>
            </div>

            <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Pro Tip</h3>
               <p className="text-xs text-slate-500 leading-relaxed">
                  Invoices with <span className="text-slate-900 font-bold">Purchase Orders (PO)</span> are typically processed <span className="text-emerald-600 font-bold">15% faster</span> by large companies.
               </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}