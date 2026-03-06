// components/dashboard/invoicing-page.tsx
"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditableInputField } from "../../ui/editable-field";
import { Switch } from "@/components/ui/switch";
import {
  BusinessProfile,
  ClientDetails,
  InvoiceItem,
  InvoiceConfiguration,
} from "@/lib/types/invoicing";
import {
  Plus,
  Trash2,
  Eye,
  Download,
  FileText,
  Calculator,
  Building,
  User,
  CreditCard,
  Clock,
  AlertTriangle,
  Percent,
  Phone,
  Mail,
  MessageSquare,
  Zap,
  Info,
  Settings,
  Sparkles
} from "lucide-react";
import { ExpandedBusinessDetailsBlock } from "../../invoice-form/expanded-business-details-block";
import { PaymentTermsBlock } from "../../invoice-form/payment-terms-block";
import { AcceptedPaymentsBlock } from "../../invoice-form/accepted-payments-block";
import { LatePaymentsBlock } from "../../invoice-form/late-payments-block";
import { DiscountedPaymentsBlock } from "../../invoice-form/discounted-payments-block";
import { NotesBlock } from "../../invoice-form/notes-block";
import { PricingModal } from "../../modals/invoice-form/invoice-pricing-modal";
import { InvoicePreviewModal } from "../../modals/invoice-form/invoice-preview-modal";
import { InvoiceSettingsBlock } from "../../invoice-form/invoice-settings-block";
import { generateInvoiceNumber, calculateTotals } from "@/lib/utility/invoicing/utils";

// Enhanced dummy data (same as before)
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

const defaultClientDetails: ClientDetails = {
  company_name: "Ridgeway Butchery",
  contact_person: "John Smith",
  email: "accounts@ridgewaybutchery.co.za",
  phone: "+27 11 987 6543",
  address_line_1: "789 Main Street",
  city: "Johannesburg",
  province: "Gauteng",
  postal_code: "2000",
  vat_number: "4987654321",
  purchase_order_number: "PO123",
  credit_limit_enabled: false,
};

export function InvoiceBuilder({ 
  initialBuyer, 
  initialTemplate 
}: { 
  initialBuyer?: ClientDetails | null;
  initialTemplate?: string | null;
}) {
  
  const [config, setConfig] = useState<InvoiceConfiguration>({
    invoice_number: generateInvoiceNumber(defaultBusinessProfile.company_name),
    invoice_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    business_profile: defaultBusinessProfile,
    client_details: defaultClientDetails,
    items: [
      {
        id: "1",
        title: "Professional Services",
        description: "Consulting and advisory services",
        category: "Consulting",
        sku: "CONS-001",
        quantity: 10,
        unit: "hours",
        unit_price: 1500,
        discount_percentage: 0,
      },
    ],
    include_vat: true,
    vat_rate: 0.15,
    currency: "ZAR",
  });

  // Component visibility states
  const [showComponents, setShowComponents] = useState({
    paymentTerms: false,
    paymentMethods: false,
    notes: false,
    lateFees: false,
    earlyDiscount: false,
    clientAddress: false,
    businessDetails: false,
    invoiceSettings: false,
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const { subtotal, vatAmount, total } = calculateTotals(config);

  // Toggle component visibility
  const toggleComponent = (component: keyof typeof showComponents) => {
    setShowComponents((prev) => ({
      ...prev,
      [component]: !prev[component],
    }));
  };

  const updateInvoiceConfig = useCallback(
    (section: string, field: string, value: any, index?: string) => {
      switch (section) {
        case "business_profile":
          setConfig((prev: InvoiceConfiguration) => ({
            ...prev,
            business_profile: {
              ...prev.business_profile,
              [field]: value,
            },
          }));
          break;

        case "client_details":
          setConfig((prev: InvoiceConfiguration) => ({
            ...prev,
            client_details: {
              ...prev.client_details,
              [field]: value,
            },
          }));
          break;

        case "invoice_items":
          setConfig((prev: InvoiceConfiguration) => ({
            ...prev,
            items: prev.items.map((item) => {
              if (item.id === index) {
                return {
                  ...item,
                  [field]: value,
                };
              }
              return item;
            }),
          }));

        default:
          setConfig((prev) => ({ ...prev, [field]: value }));
      }
    },
    []
  );

  // Add new item
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      title: "New Item",
      description: "",
      quantity: 1,
      unit: "each",
      unit_price: 0,
      discount_percentage: 0,
    };
    setConfig((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  // Remove item
  const removeItem = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  // Generate PDF
  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      console.log("Generating PDF with config:", config);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("PDF generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Component add buttons
  const AddComponentButtons = () => (
    <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
      <p className="w-full text-sm text-slate-600 mb-2">
        Add optional components to your invoice:
      </p>

      {!showComponents.paymentTerms && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleComponent("paymentTerms")}
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <Clock className="h-4 w-4 mr-2" />
          Payment Terms
        </Button>
      )}

      {!showComponents.paymentMethods && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleComponent("paymentMethods")}
          className="text-green-600 border-green-200 hover:bg-green-50"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Payment Methods
        </Button>
      )}

      {!showComponents.notes && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleComponent("notes")}
          className="text-purple-600 border-purple-200 hover:bg-purple-50"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Notes
        </Button>
      )}

      {!showComponents.lateFees && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            toggleComponent("lateFees");
          }}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Late Fees
        </Button>
      )}

      {!showComponents.earlyDiscount && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            toggleComponent("earlyDiscount");
          }}
          className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
        >
          <Percent className="h-4 w-4 mr-2" />
          Early Discount
        </Button>
      )}

      {!showComponents.clientAddress && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleComponent("clientAddress")}
          className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
        >
          <Building className="h-4 w-4 mr-2" />
          Client Address
        </Button>
      )}

      {!showComponents.businessDetails && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleComponent("businessDetails")}
          className="text-slate-600 border-slate-200 hover:bg-slate-50"
        >
          <FileText className="h-4 w-4 mr-2" />
          Business Details
        </Button>
      )}

      {!showComponents.invoiceSettings && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleComponent("invoiceSettings")}
          className="text-slate-700 border-slate-300 hover:bg-indigo-50 hover:text-indigo-600"
        >
          <Settings className="h-4 w-4 mr-2" />
          Invoice Settings
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* 1. NARRATIVE HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">
              Invoice <span className="text-slate-400 font-light not-italic">Builder</span>
            </h1>
            <p className="text-slate-500 text-sm">
              Refine your draft. Add optional terms to protect your <span className="text-slate-900 font-bold underline decoration-purple-400">cashflow</span>.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
              <PricingModal invoiceTotal={total} currency={config.currency}>
                <Button variant="ghost" size="sm" className="rounded-xl text-[10px] font-black tracking-widest text-slate-400 hover:text-blue-600">
                  <Info className="h-3.5 w-3.5 mr-2" /> PRICING
                </Button>
              </PricingModal>
              <div className="w-px h-4 bg-slate-200" />
              <InvoicePreviewModal config={config} onGeneratePDF={generatePDF}>
                <Button variant="ghost" size="sm" className="rounded-xl text-[10px] font-black tracking-widest text-slate-400 hover:text-purple-600">
                  <Eye className="h-3.5 w-3.5 mr-2" /> PREVIEW
                </Button>
              </InvoicePreviewModal>
              <Button
                onClick={generatePDF}
                disabled={isGenerating}
                className="bg-slate-900 text-white rounded-xl px-6 h-9 hover:bg-slate-800 transition-all font-bold text-xs"
              >
                {isGenerating ? "GENERATING..." : "GENERATE PDF"}
              </Button>
          </div>
        </header>

        {/* 2. THE DOCUMENT (Interactive Invoice) */}
        <Card className="rounded-[3rem] border-none shadow-2xl shadow-slate-200/50 bg-white overflow-hidden">
          <CardContent className="p-12 space-y-12">
            
            {/* INVOICE TOP LOGIC */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="space-y-4 flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-[10px] font-black tracking-widest uppercase">
                  <Sparkles className="h-3 w-3" /> Draft Mode
                </div>
                <EditableInputField
                  value={config.business_profile.company_name}
                  placeholder="Your Company Name"
                  className="text-4xl font-black text-slate-900 tracking-tighter"
                  onEdit={(val) => updateInvoiceConfig("business_profile", "company_name", val)}
                />
              </div>

              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 min-w-[280px]">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice #</span>
                    <EditableInputField value={config.invoice_number} className="font-mono text-sm font-bold text-slate-900" onEdit={(v) => updateInvoiceConfig("", "invoice_number", v)} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</span>
                    <EditableInputField value={config.invoice_date} type="date" className="text-sm font-bold text-slate-900" onEdit={(v) => updateInvoiceConfig("", "invoice_date", v)} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-rose-500">Due</span>
                    <EditableInputField value={config.due_date} type="date" className="text-sm font-bold text-rose-600" onEdit={(v) => updateInvoiceConfig("", "due_date", v)} />
                  </div>
                </div>
              </div>
            </div>

            {/* ADDRESS SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-slate-300" /> Bill From
                </h3>
                <div className="p-6 rounded-[2rem] bg-slate-50/50 border border-slate-100 space-y-3">
                  <EditableInputField value={config.business_profile.company_name} className="font-bold text-slate-900" onEdit={(v) => updateInvoiceConfig("business_profile", "company_name", v)} />
                  <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                    <Mail className="h-3.5 w-3.5" /> <EditableInputField value={config.business_profile.contact_email} onEdit={(v) => updateInvoiceConfig("business_profile", "email", v)} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-purple-400" /> Bill To
                </h3>
                <div className="p-6 rounded-[2rem] bg-purple-50/30 border border-purple-100/50 space-y-3">
                  <EditableInputField value={config.client_details.company_name} className="font-bold text-slate-900" onEdit={(v) => updateInvoiceConfig("client_details", "company_name", v)} />
                  <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                    <Mail className="h-3.5 w-3.5" /> <EditableInputField value={config.client_details.email} onEdit={(v) => updateInvoiceConfig("client_details", "email", v)} />
                  </div>
                </div>
              </div>
            </div>

            {/* ITEMS TABLE */}
            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">Line Items</h3>
              <div className="border-t border-slate-100">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                      <th className="py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">Qty</th>
                      <th className="py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">Rate</th>
                      <th className="py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">Amount</th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {config.items.map((item) => (
                      <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-6 pr-4">
                          <EditableInputField value={item.title} className="font-bold text-slate-900" onEdit={(v) => updateInvoiceConfig("invoice_items", "title", v, item.id)} />
                          <EditableInputField value={item.description || ""} className="text-xs text-slate-400 mt-1" onEdit={(v) => updateInvoiceConfig("invoice_items", "description", v, item.id)} multiline />
                        </td>
                        <td className="py-6 text-center">
                          <EditableInputField value={item.quantity} type="number" className="font-bold text-slate-600" onEdit={(v) => updateInvoiceConfig("invoice_items", "quantity", Number(v), item.id)} />
                        </td>
                        <td className="py-6 text-right">
                          <span className="text-[10px] font-bold text-slate-300 mr-1">ZAR</span>
                          <EditableInputField value={item.unit_price} type="number" className="font-bold text-slate-600 inline" onEdit={(v) => updateInvoiceConfig("invoice_items", "unit_price", Number(v), item.id)} />
                        </td>
                        <td className="py-6 text-right font-black text-slate-900">
                          R{(item.quantity * item.unit_price).toLocaleString("en-ZA")}
                        </td>
                        <td className="py-6 text-right">
                          <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)} className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-600 transition-all">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Button variant="ghost" onClick={addItem} className="mt-4 text-[10px] font-black text-purple-600 tracking-widest hover:bg-purple-50">
                  <Plus className="h-3.5 w-3.5 mr-2" /> ADD LINE ITEM
                </Button>
              </div>
            </div>

            {/* TOTALS SECTION */}
            <div className="flex flex-col items-end pt-8 border-t border-slate-100 space-y-4">
               <div className="w-full md:w-80 space-y-3 px-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-slate-400 uppercase tracking-tighter">Subtotal</span>
                    <span className="font-black text-slate-900">R{subtotal.toLocaleString("en-ZA")}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <Switch checked={config.include_vat} onCheckedChange={(v) => setConfig(prev => ({...prev, include_vat: v}))} className="scale-75 data-[state=checked]:bg-purple-600" />
                      <span className="font-bold text-slate-400 uppercase tracking-tighter">VAT (15%)</span>
                    </div>
                    <span className="font-black text-slate-900">R{vatAmount.toLocaleString("en-ZA")}</span>
                  </div>
                  <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl shadow-slate-900/20 flex justify-between items-center mt-6">
                    <span className="text-xs font-black tracking-[0.2em] uppercase">Total Due</span>
                    <span className="text-2xl font-black">R{total.toLocaleString("en-ZA")}</span>
                  </div>
               </div>
            </div>

            {/* COMPONENT MODULES (Payment Terms etc.) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-10">
                {showComponents.paymentTerms && <PaymentTermsBlock config={config} toggleComponent={toggleComponent} updateInvoiceConfig={updateInvoiceConfig} />}
                {showComponents.notes && <NotesBlock config={config} toggleComponent={toggleComponent} updateInvoiceConfig={updateInvoiceConfig} />}
            </div>

            {/* DYNAMIC ADDER BUTTONS */}
            <div className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Add Extensions</h4>
               <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'paymentTerms', label: 'Payment Terms', icon: Clock, color: 'text-blue-600' },
                    { id: 'notes', label: 'Notes', icon: MessageSquare, color: 'text-purple-600' },
                    { id: 'lateFees', label: 'Late Fees', icon: AlertTriangle, color: 'text-rose-600' },
                  ].map((btn) => (
                    !showComponents[btn.id as keyof typeof showComponents] && (
                      <Button key={btn.id} variant="outline" size="sm" onClick={() => toggleComponent(btn.id as any)} className="rounded-xl border-slate-200 bg-white text-[10px] font-bold hover:border-purple-300">
                        <btn.icon className={`h-3.5 w-3.5 mr-2 ${btn.color}`} /> {btn.label}
                      </Button>
                    )
                  ))}
               </div>
            </div>

            {/* FOOTER */}
            <footer className="text-center pt-10">
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Generated by SisoNova Platform</p>
            </footer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}