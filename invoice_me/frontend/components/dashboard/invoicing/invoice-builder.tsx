"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditableInputField } from "../../ui/editable-field";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
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
  Sparkles,
  ArrowRight
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
import { calculateTotals } from "@/lib/utility/invoicing/utils";

// --- NECESSARY CHANGE: Update Interface to receive persistent state ---
interface InvoiceBuilderProps {
  config: InvoiceConfiguration;
  setConfig: React.Dispatch<React.SetStateAction<InvoiceConfiguration | null>>;
  onProceedToReview: (config: InvoiceConfiguration) => void;
}

export function InvoiceBuilder({ 
  config, 
  setConfig, 
  onProceedToReview 
}: InvoiceBuilderProps) {
  
  // --- NECESSARY CHANGE: Component visibility state remains local ---
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

  useEffect(() => {
    setShowComponents({
      paymentTerms: !!config.payment_terms,
      paymentMethods: !!config.accepted_payment_methods,
      notes: !!config.notes,
      lateFees: !!config.late_payment_terms,
      earlyDiscount: !!config.early_discount_terms,
      invoiceSettings: !!config.invoice_settings,
      // These are usually toggled based on presence of specific address fields if needed
      clientAddress: showComponents.clientAddress, 
      businessDetails: showComponents.businessDetails,
    });
  }, [config]); // Runs whenever the config prop updates

  const [isGenerating, setIsGenerating] = useState(false);
  const { subtotal, vatAmount, total } = calculateTotals(config);

  const toggleComponent = (component: keyof typeof showComponents) => {
    setShowComponents((prev) => ({
      ...prev,
      [component]: !prev[component],
    }));
  };

  // --- NECESSARY CHANGE: setter now uses setConfig from props ---
  const updateInvoiceConfig = useCallback(
    (section: string, field: string, value: any, index?: string) => {
      switch (section) {
        case "business_profile":
          setConfig((prev: any) => ({
            ...prev,
            business_profile: { ...prev.business_profile, [field]: value },
          }));
          break;
        case "client_details":
          setConfig((prev: any) => ({
            ...prev,
            client_details: { ...prev.client_details, [field]: value },
          }));
          break;
        case "invoice_items":
          setConfig((prev: any) => ({
            ...prev,
            items: prev.items.map((item: any) => {
              if (item.id === index) {
                return { ...item, [field]: value };
              }
              return item;
            }),
          }));
          break;
        default:
          setConfig((prev: any) => ({ ...prev, [field]: value }));
      }
    },
    [setConfig]
  );

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
    setConfig((prev: any) => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (id: string) => {
    setConfig((prev: any) => ({
      ...prev,
      items: prev.items.filter((item: any) => item.id !== id),
    }));
  };

  const AddComponentButtons = () => (
    <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
      <p className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">
        Add optional components to your invoice:
      </p>

      {[
        { id: 'paymentTerms', label: 'Payment Terms', icon: Clock, color: 'text-slate-900' },
        { id: 'paymentMethods', label: 'Payment Methods', icon: CreditCard, color: 'text-slate-900' },
        { id: 'notes', label: 'Notes', icon: MessageSquare, color: 'text-slate-900' },
        { id: 'lateFees', label: 'Late Fees', icon: AlertTriangle, color: 'text-rose-500' },
        { id: 'earlyDiscount', label: 'Early Discount', icon: Percent, color: 'text-emerald-500' },
        { id: 'clientAddress', label: 'Client Address', icon: Building, color: 'text-slate-900' },
        { id: 'businessDetails', label: 'Business Details', icon: FileText, color: 'text-slate-900' },
        { id: 'invoiceSettings', label: 'Invoice Settings', icon: Settings, color: 'text-slate-900' },
      ].map((btn) => (
        !showComponents[btn.id as keyof typeof showComponents] && (
          <Button
            key={btn.id}
            variant="outline"
            size="sm"
            onClick={() => toggleComponent(btn.id as any)}
            className="rounded-lg border-slate-200 bg-white text-[10px] font-bold uppercase hover:border-slate-900 h-8"
          >
            <btn.icon className={`h-3 w-3 mr-2 ${btn.color}`} />
            {btn.label}
          </Button>
        )
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Zap className="h-6 w-6 text-slate-900 fill-slate-900" />
            Smart Invoice Builder
          </h1>
          <p className="text-sm text-slate-500">
            Start with the basics, add what you need
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
          <PricingModal invoiceTotal={total} currency={config.currency}>
            <Button variant="ghost" size="sm" className="rounded-lg text-[10px] font-black tracking-widest text-slate-400 hover:text-slate-900 px-3">
              <Info className="h-3.5 w-3.5 mr-1.5" /> PRICING INFO
            </Button>
          </PricingModal>
          <InvoicePreviewModal config={config}>
            <Button variant="ghost" size="sm" className="rounded-lg text-[10px] font-black tracking-widest text-slate-400 hover:text-slate-900 px-3">
              <Eye className="h-3.5 w-3.5 mr-1.5" /> PREVIEW
            </Button>
          </InvoicePreviewModal>
          
          {/* --- NECESSARY CHANGE: Button triggers onProceedToReview --- */}
          <Button
            onClick={() => onProceedToReview(config)}
            disabled={isGenerating}
            className="bg-slate-900 text-white rounded-lg px-6 h-9 hover:bg-black transition-all font-bold text-[10px] uppercase shadow-md flex items-center gap-2"
          >
            Review & Finalize <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </header>

      <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
        <CardContent className="p-8 lg:p-12 space-y-10">
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="space-y-4 flex-1 w-full md:w-auto">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">INVOICE</h1>
              <EditableInputField
                value={config.business_profile.company_name}
                placeholder="Your Company Name"
                className="text-lg font-semibold text-slate-700"
                onEdit={(val) => updateInvoiceConfig("business_profile", "company_name", val)}
              />
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 w-full md:w-auto min-w-[240px]">
              <div className="space-y-2">
                <div className="flex justify-between items-center gap-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Invoice #:</span>
                  <EditableInputField value={config.invoice_number} className="font-mono text-xs font-bold text-slate-900" onEdit={(v) => updateInvoiceConfig("", "invoice_number", v)} />
                </div>
                <div className="flex justify-between items-center gap-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Date:</span>
                  <EditableInputField value={config.invoice_date} type="date" className="text-xs font-bold text-slate-900" onEdit={(v) => updateInvoiceConfig("", "invoice_date", v)} />
                </div>
                <div className="flex justify-between items-center gap-3 pt-1 border-t border-slate-200">
                  <span className="text-[10px] font-black text-rose-400 uppercase">Due:</span>
                  <EditableInputField value={config.due_date} type="date" className="text-xs font-bold text-rose-500" onEdit={(v) => updateInvoiceConfig("", "due_date", v)} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Building className="h-3.5 w-3.5" /> BILL FROM
              </h3>
              <div className="p-5 rounded-2xl border border-slate-100 bg-white space-y-2">
                <EditableInputField value={config.business_profile.company_name} className="font-bold text-slate-900 text-sm" onEdit={(v) => updateInvoiceConfig("business_profile", "company_name", v)} />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Mail className="h-3 w-3" /> <EditableInputField value={config.business_profile.contact_email} onEdit={(v) => updateInvoiceConfig("business_profile", "email", v)} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Phone className="h-3 w-3" /> <EditableInputField value={config.business_profile.contact_phone} onEdit={(v) => updateInvoiceConfig("business_profile", "phone", v)} />
                  </div>
                </div>
              </div>
              {showComponents.businessDetails && (
                <ExpandedBusinessDetailsBlock toggleComponent={toggleComponent} businessType="buyer" config={config} updateInvoiceConfig={updateInvoiceConfig} />
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <User className="h-3.5 w-3.5" /> BILL TO
              </h3>
              <div className="p-5 rounded-2xl border border-slate-100 bg-white space-y-2">
                <EditableInputField value={config.client_details.company_name} className="font-bold text-slate-900 text-sm" onEdit={(v) => updateInvoiceConfig("client_details", "company_name", v)} />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Mail className="h-3 w-3" /> <EditableInputField value={config.client_details.email} onEdit={(v) => updateInvoiceConfig("client_details", "email", v)} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Phone className="h-3 w-3" /> <EditableInputField value={config.client_details.phone} onEdit={(v) => updateInvoiceConfig("client_details", "phone", v)} />
                  </div>
                </div>
              </div>
              {showComponents.clientAddress && (
                <ExpandedBusinessDetailsBlock toggleComponent={toggleComponent} businessType="seller" config={config} updateInvoiceConfig={updateInvoiceConfig} />
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calculator className="h-3.5 w-3.5" /> Invoice Items
              </h3>
            </div>
            <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr className="text-left">
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Description</th>
                    <th className="p-4 text-center text-[10px] font-black text-slate-400 uppercase w-16">Qty</th>
                    <th className="p-4 text-center text-[10px] font-black text-slate-400 uppercase w-20">Unit</th>
                    <th className="p-4 text-right text-[10px] font-black text-slate-400 uppercase w-28">Rate</th>
                    <th className="p-4 text-right text-[10px] font-black text-slate-400 uppercase w-28">Amount</th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {config.items.map((item) => {
                    const lineTotal = item.quantity * item.unit_price * (1 - item.discount_percentage / 100);
                    return (
                      <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors bg-white">
                        <td className="p-4">
                          <EditableInputField value={item.title} className="font-bold text-slate-900" onEdit={(v) => updateInvoiceConfig("invoice_items", "title", v, item.id)} />
                          <EditableInputField value={item.description || ""} className="text-xs text-slate-400 mt-0.5" multiline onEdit={(v) => updateInvoiceConfig("invoice_items", "description", v, item.id)} />
                        </td>
                        <td className="p-4 text-center">
                          <EditableInputField value={item.quantity} type="number" className="font-medium text-slate-600 text-center" onEdit={(v) => updateInvoiceConfig("invoice_items", "quantity", Number(v), item.id)} />
                        </td>
                        <td className="p-4 text-center">
                          <EditableInputField value={item.unit} selectOptions={["each", "hours", "days", "kg", "m", "l"]} className="text-[10px] font-bold uppercase text-slate-400 text-center" onEdit={(v) => updateInvoiceConfig("invoice_items", "unit", v, item.id)} />
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1 font-bold text-slate-600">
                            <span className="text-[9px] opacity-40">R</span>
                            <EditableInputField value={item.unit_price} type="number" onEdit={(v) => updateInvoiceConfig("invoice_items", "unit_price", Number(v), item.id)} />
                          </div>
                        </td>
                        <td className="p-4 text-right font-black text-slate-900">
                          R{lineTotal.toLocaleString("en-ZA")}
                        </td>
                        <td className="p-4 text-center">
                          {config.items.length > 1 && (
                            <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)} className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-600 transition-all p-1">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="p-3 bg-slate-50/30 border-t border-slate-100">
                <Button variant="ghost" size="sm" onClick={addItem} className="text-[10px] font-black text-slate-900 uppercase hover:bg-white rounded-lg h-8 border border-slate-200">
                  <Plus className="h-3 w-3 mr-1" /> Add Item
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end pt-8 border-t border-slate-100 space-y-2">
             <div className="w-full md:w-72 space-y-1 px-1">
                <div className="flex justify-between text-xs text-slate-400 uppercase font-bold tracking-tight">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-black">R{subtotal.toLocaleString("en-ZA")}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400 uppercase font-bold tracking-tight">
                  <div className="flex items-center gap-3">
                    <Switch checked={config.include_vat} onCheckedChange={(v) => setConfig((prev: any) => ({...prev, include_vat: v}))} className="scale-75 data-[state=checked]:bg-slate-900" />
                    <span>VAT (15%)</span>
                  </div>
                  <span className="text-slate-900 font-black">R{vatAmount.toLocaleString("en-ZA")}</span>
                </div>
                
                <div className="flex justify-between items-center pt-3 mt-2 border-t-2 border-slate-900">
                  <span className="text-[10px] font-black uppercase text-slate-900 tracking-widest">Total Due</span>
                  <span className="text-xl font-black italic text-slate-900">R{total.toLocaleString("en-ZA")}</span>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {showComponents.paymentTerms && <PaymentTermsBlock config={config} toggleComponent={toggleComponent} updateInvoiceConfig={updateInvoiceConfig} />}
              {showComponents.notes && <NotesBlock config={config} toggleComponent={toggleComponent} updateInvoiceConfig={updateInvoiceConfig} />}
              {showComponents.lateFees && <LatePaymentsBlock config={config} toggleComponent={toggleComponent} updateInvoiceConfig={updateInvoiceConfig} />}
              {showComponents.paymentMethods && <AcceptedPaymentsBlock config={config} toggleComponent={toggleComponent} updateInvoiceConfig={updateInvoiceConfig} />}
              {showComponents.earlyDiscount && <DiscountedPaymentsBlock config={config} toggleComponent={toggleComponent} updateInvoiceConfig={updateInvoiceConfig} />}
              {showComponents.invoiceSettings && <InvoiceSettingsBlock config={config} toggleComponent={toggleComponent} updateInvoiceConfig={updateInvoiceConfig} />}
          </div>

          <AddComponentButtons />

          <footer className="pt-8 border-t border-slate-100 text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest space-x-2">
              <span className="text-slate-900">{config.business_profile.company_name}</span>
              <span>•</span>
              <span>{config.business_profile.contact_email}</span>
              <span>•</span>
              <span>{config.business_profile.contact_phone}</span>
            </div>
            <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em] mt-4">
              Generated via SisoNova Platform
            </p>
          </footer>
        </CardContent>
      </Card>
    </div>
  );
}