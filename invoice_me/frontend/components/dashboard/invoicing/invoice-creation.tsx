"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Mail,
  MapPin,
  Zap,
  UserPlus2,
  ArrowRight, 
  CheckCircle2, 
  LayoutTemplate,
  Plus,
} from "lucide-react";
import { InvoiceBuilder } from "./invoice-builder";
import { InvoiceVerification } from "./invoice-verification"; // The new Verification Stage
import {
  ClientDetails,
  InvoiceConfiguration,
  BusinessProfile,
} from "@/lib/types/invoicing";
import { generateInvoiceNumber } from "@/lib/utility/invoicing/utils";

// --- MOCK DATA PRESERVED ---
const defaultBusinessProfile: BusinessProfile = {
  company_name: "SisoNova Solutions (Pty) Ltd",
  trading_name: "SisoNova",
  address_line_1: "123 Business Park Drive",
  address_line_2: "Suite 456",
  city: "Cape Town",
  province: "Western Cape",
  country: "South Africa",
  postal_code: "8001",
  vat_number: "4123456789",
  company_registration: "2023/123456/07",
  contact_email: "billing@SisoNova.co.za",
  contact_phone: "+27 21 123 4567",
  industry_type: "consulting",
};

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

const mockRecentInvoices = [
  { id: "1", invoice_number: "INV-2024-001", client_name: "Ridgeway Butchery", amount: 15750.00, date: "2024-10-15", status: "paid" },
  { id: "2", invoice_number: "INV-2024-002", client_name: "Tech Solutions Ltd", amount: 28500.00, date: "2024-10-18", status: "pending" },
  { id: "3", invoice_number: "INV-2024-003", client_name: "Green Energy Co", amount: 12300.00, date: "2024-10-20", status: "overdue" },
];

const mockTemplates = [
  { id: "1", name: "Consulting Services", description: "Standard consulting invoice template" },
  { id: "2", name: "Monthly Retainer", description: "Monthly retainer agreement" },
  { id: "3", name: "Product Sale", description: "Standard product invoice" },
];

export function InvoicingPage() {
  // --- STATE MANAGEMENT ---
  const [currentStep, setCurrentStep] = useState(1); // 1: Setup, 2: Builder, 3: Verification
  const [selectedBuyer, setSelectedBuyer] = useState<ClientDetails | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [savedBuyers, setSavedBuyers] = useState(mockSavedBuyers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddBuyerOpen, setIsAddBuyerOpen] = useState(false);
  
  // ADDED: Lifting state here to prevent data loss on navigation
  const [activeConfig, setActiveConfig] = useState<InvoiceConfiguration | null>(null);

  const filteredBuyers = savedBuyers.filter(
    (buyer) =>
      buyer.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.contact_person.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartInvoice = () => {
    if (!selectedBuyer) return;

    // ADDED: Initialize activeConfig if it doesn't exist OR if the buyer changed
    if (!activeConfig || activeConfig.client_details.email !== selectedBuyer.email) {
      setActiveConfig({
        invoice_number: generateInvoiceNumber(defaultBusinessProfile.company_name),
        invoice_date: new Date().toISOString().split("T")[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        business_profile: defaultBusinessProfile,
        client_details: selectedBuyer,
        items: [
          {
            id: "1",
            title: "Professional Services",
            description: "Consulting and advisory services",
            category: "Consulting",
            sku: "CONS-001",
            quantity: 1,
            unit: "each",
            unit_price: 0,
            discount_percentage: 0,
          },
        ],
        include_vat: true,
        vat_rate: 0.15,
        currency: "ZAR",
      });
    }

    setCurrentStep(2);
  };

  const handleProceedToVerify = (config: InvoiceConfiguration) => {
    setActiveConfig(config);
    setCurrentStep(3);
  };

  // --- REIMAGINED HEADER LOGIC (Consistent for all steps) ---
  const WorkflowHeader = ({ step, title, subtitle, onBack }: { step: number, title: string, subtitle: string, onBack?: () => void }) => (
    <div className="space-y-8 mb-10">
      {/* 1. TOP UTILITY LINE */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3">
          {onBack ? (
             <Button variant="ghost" onClick={onBack} className="h-8 w-8 rounded-full border border-slate-200 p-0 hover:bg-slate-900 hover:text-white transition-all">
                <ArrowRight className="h-3 w-3 rotate-180" />
             </Button>
          ) : (
             <div className="h-8 w-8 rounded-xl bg-slate-900 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white fill-white" />
             </div>
          )}
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">
            SisoNova <span className="text-slate-300 font-light">Billing</span>
          </span>
        </div>

        {/* COMPACT PROGRESS STRIP (Right-aligned) */}
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl border border-slate-200/60 shadow-sm">
           <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`h-1 transition-all duration-500 rounded-full ${step === s ? 'w-8 bg-slate-900' : 'w-2 bg-slate-200'}`} />
              ))}
           </div>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phase 0{step}</span>
        </div>
      </div>

      {/* 2. NARRATIVE HEADER (Always Left-Aligned) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
            {title} <span className="text-slate-300 font-light not-italic">{subtitle}</span>
          </h1>
          <p className="text-slate-500 max-w-lg text-sm leading-relaxed">
            {step === 1 && "Select a Verified Client from your ledger to initiate the billing sequence."}
            {step === 2 && "Refine your line items and configure arrears protocols for this draft."}
            {step === 3 && "Final verification before document authentication and dispatch."}
          </p>
        </div>

        {step === 1 && (
           <Button 
              onClick={handleStartInvoice}
              disabled={!selectedBuyer}
              className="bg-slate-900 text-white rounded-xl px-8 h-12 hover:bg-black transition-all font-black text-[10px] tracking-[0.2em] uppercase shadow-xl shadow-slate-200 disabled:opacity-30"
           >
              Initialize Builder <ArrowRight className="h-3.5 w-3.5 ml-2" />
           </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 font-sans selection:bg-slate-200">
      <div className="max-w-[1400px] mx-auto">
        
        {/* STEP 01: SELECTION */}
        {currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <WorkflowHeader step={1} title="Identity" subtitle="& Intent." />
            <div className="grid grid-cols-12 gap-10">
              <main className="col-span-12 lg:col-span-8 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Select Recipient</h2>
                    <Button variant="ghost" className="text-[10px] font-black text-slate-900 hover:bg-slate-50 tracking-widest border border-slate-100 rounded-xl px-4 h-8">
                      <UserPlus2 className="h-3.5 w-3.5 mr-2" /> ADD NEW BUYER
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredBuyers.map((buyer) => (
                      <div key={buyer.email} onClick={() => setSelectedBuyer(buyer)}
                        className={`p-6 rounded-[2rem] transition-all cursor-pointer border relative group
                          ${selectedBuyer?.email === buyer.email ? 'bg-white border-slate-900 shadow-xl shadow-slate-200' : 'bg-white border-slate-100 hover:border-slate-300'}`}>
                        {selectedBuyer?.email === buyer.email && <CheckCircle2 className="absolute top-6 right-6 h-5 w-5 text-slate-900" />}
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${selectedBuyer?.email === buyer.email ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}>
                            <Building2 className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900">{buyer.company_name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{buyer.contact_person}</p>
                          </div>
                        </div>
                        <div className="space-y-2 border-t border-slate-50 pt-4 text-[10px] font-bold text-slate-500">
                          <div className="flex items-center gap-2"><Mail className="h-3 w-3" /> {buyer.email}</div>
                          <div className="flex items-center gap-2"><MapPin className="h-3 w-3" /> {buyer.city}, {buyer.province}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">Blueprint (Optional)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div onClick={() => setSelectedTemplate(null)}
                      className={`p-6 rounded-[2rem] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3
                        ${selectedTemplate === null ? 'bg-white border-slate-900' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                      <Plus className={`h-8 w-8 ${selectedTemplate === null ? 'text-slate-900' : 'text-slate-300'}`} />
                      <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Blank Slate</p>
                    </div>
                    {mockTemplates.map((t) => (
                      <div key={t.id} onClick={() => setSelectedTemplate(t.id)}
                        className={`p-6 rounded-[2rem] border transition-all cursor-pointer
                          ${selectedTemplate === t.id ? 'bg-white border-slate-900 shadow-xl shadow-slate-200' : 'bg-white border-slate-100'}`}>
                        <LayoutTemplate className={`h-5 w-5 mb-4 ${selectedTemplate === t.id ? 'text-slate-900' : 'text-slate-400'}`} />
                        <p className="text-xs font-black text-slate-900 mb-1">{t.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium leading-tight">{t.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </main>
              <aside className="col-span-12 lg:col-span-4 space-y-8">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                  <Zap className="absolute -top-4 -right-4 h-24 w-24 text-white/5 rotate-12" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 px-1">Recent History</h3>
                  <div className="space-y-6">
                    {mockRecentInvoices.map((inv) => (
                      <div key={inv.id} className="flex items-center justify-between group cursor-pointer">
                        <div className="space-y-1">
                          <p className="text-sm font-bold group-hover:text-slate-400 transition-colors">{inv.invoice_number}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">{inv.client_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black italic">R{(inv.amount/1000).toFixed(1)}k</p>
                          <Badge className="bg-white/5 text-[8px] h-4 border-0 font-black uppercase tracking-widest">{inv.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}

        {/* STEP 02: BUILDER */}
        {currentStep === 2 && activeConfig && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <WorkflowHeader 
              step={2} 
              title="Construction" 
              subtitle="& Logic." 
              onBack={() => setCurrentStep(1)} 
            />
            <InvoiceBuilder
              // ADDED: Passing the lifted state and the setter
              config={activeConfig}
              setConfig={setActiveConfig}
              onProceedToReview={handleProceedToVerify} 
            />
          </div>
        )}

        {/* STEP 03: VERIFICATION */}
        {currentStep === 3 && activeConfig && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <WorkflowHeader 
              step={3} 
              title="Verification" 
              subtitle="& Dispatch." 
              onBack={() => setCurrentStep(2)} 
            />
            <InvoiceVerification
              config={activeConfig} 
              onBackToBuild={() => setCurrentStep(2)}
              onFinalize={(method) => console.log(`Dispatching via ${method}...`)}
           />
          </div>
        )}

      </div>
    </div>
  );
}