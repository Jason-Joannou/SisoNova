"use client";

import { useState } from "react";
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ShieldCheck, Zap, Landmark, Building2, Contact, Globe } from "lucide-react";
import { BusinessProfile, ClientDetails } from "@/lib/types/invoicing";

const INDUSTRY_TYPES = [
  { value: "retail", label: "Retail" },
  { value: "legal", label: "Legal" },
  { value: "technology", label: "Technology" },
  { value: "butchery", label: "Butchery" },
  { value: "energy", label: "Energy" },
  { value: "consulting", label: "Consulting" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "construction", label: "Construction" },
  { value: "other", label: "Other" },
];

interface BusinessProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void | Promise<void>;
  initialData?: Partial<ClientDetails>;
  title?: string;
  description?: string;
  submitButtonText?: string;
  allowClose?: boolean;
  mode?: "merchant" | "buyer";
}

export function BusinessProfileModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title = "Merchant Identity",
  description = "Register your business entity to enable core financial utilities.",
  submitButtonText = "Register Business",
  allowClose = true,
  mode = "merchant"
}: BusinessProfileModalProps) {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<ClientDetails>({
    company_name: initialData?.company_name || "",
    trading_name: initialData?.trading_name || "",
    address_line_1: initialData?.address_line_1 || "",
    address_line_2: initialData?.address_line_2 || "",
    contact_email: initialData?.contact_email || "",
    contact_phone: initialData?.contact_phone || "",
    city: initialData?.city || "",
    province: initialData?.province || "",
    postal_code: initialData?.postal_code || "",
    country: initialData?.country || "South Africa",
    vat_number: initialData?.vat_number || "",
    company_registration: initialData?.company_registration || "",
    tax_registration: initialData?.tax_registration || "",
    industry_type: initialData?.industry_type || "",
    credit_limit_enabled: initialData?.credit_limit_enabled || false,
    credit_limit_amount: initialData?.credit_limit_amount || 0,
    purchase_order_number: initialData?.purchase_order_number || "",
  });

  const handleInputChange = (field: keyof ClientDetails, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={allowClose ? onOpenChange : undefined}>
      <DialogContent
        className="sm:max-w-[750px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white"
        onInteractOutside={(e) => !allowClose && e.preventDefault()}
        onEscapeKeyDown={(e) => !allowClose && e.preventDefault()}
      >
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
          {/* HEADER */}
          <div className="p-8 border-b border-slate-50 bg-slate-50/30 shrink-0">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 bg-slate-900 rounded flex items-center justify-center text-white">
                  <Zap className="h-3.5 w-3.5 fill-white" />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                  {mode === "buyer" ? "Counterparty Management" : "KYC Identity Phase"}
                </span>
              </div>
              <DialogTitle className="text-3xl font-black text-slate-900 tracking-tighter italic leading-none uppercase">
                {title}
              </DialogTitle>
              <DialogDescription className="text-xs font-medium text-slate-500 mt-2">
                {description}
              </DialogDescription>
            </div>
          </div>

          {/* SCROLLABLE BODY */}
          <div className="p-8 space-y-10 overflow-y-auto custom-scrollbar">
            
            {/* SECTION 1: LEGAL IDENTITY */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 px-1">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Legal Branding</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Registered Company Name *</Label>
                  <Input
                    value={formData.company_name}
                    onChange={(e) => handleInputChange("company_name", e.target.value)}
                    required
                    className="rounded-xl border-slate-100 bg-slate-50/50 h-10 font-bold focus:border-slate-900"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Trading Name (DBA)</Label>
                  <Input
                    value={formData.trading_name}
                    onChange={(e) => handleInputChange("trading_name", e.target.value)}
                    placeholder="Optional"
                    className="rounded-xl border-slate-100 bg-slate-50/50 h-10 font-bold focus:border-slate-900"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Industry Vertical *</Label>
                <Select value={formData.industry_type} onValueChange={(v) => handleInputChange("industry_type", v)}>
                  <SelectTrigger className="rounded-xl border-slate-100 bg-slate-50/50 h-10 font-bold text-[10px] uppercase">
                    <SelectValue placeholder="Categorize Entity" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {INDUSTRY_TYPES.map((i) => (
                      <SelectItem key={i.value} value={i.value} className="text-[10px] font-bold uppercase">{i.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* SECTION 2: CONTACTS */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 px-1">
                <Contact className="h-3.5 w-3.5 text-slate-400" />
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Communications</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Primary Billing Email *</Label>
                  <Input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => handleInputChange("contact_email", e.target.value)}
                    required
                    className="rounded-xl border-slate-100 bg-slate-50/50 h-10 font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Contact Phone</Label>
                  <Input
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => handleInputChange("contact_phone", e.target.value)}
                    className="rounded-xl border-slate-100 bg-slate-50/50 h-10 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: ADDRESS */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 px-1">
                <Globe className="h-3.5 w-3.5 text-slate-400" />
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Nexus / Location</h3>
              </div>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Street Address Line 1 *</Label>
                    <Input
                      value={formData.address_line_1}
                      onChange={(e) => handleInputChange("address_line_1", e.target.value)}
                      required
                      className="rounded-xl border-slate-100 bg-slate-50/50 h-10 font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Building / Unit (Line 2)</Label>
                    <Input
                      value={formData.address_line_2}
                      onChange={(e) => handleInputChange("address_line_2", e.target.value)}
                      placeholder="Optional"
                      className="rounded-xl border-slate-100 bg-slate-50/50 h-10 font-bold"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">City *</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                      className="rounded-xl border-slate-100 bg-slate-50/50 h-10 font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Region / Province *</Label>
                    <RegionDropdown
                      country={formData.country}
                      value={formData.province}
                      onChange={(v) => handleInputChange("province", v)}
                      className="flex h-10 w-full rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2 text-[10px] font-black uppercase tracking-tight"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Postal Code *</Label>
                    <Input
                      value={formData.postal_code}
                      onChange={(e) => handleInputChange("postal_code", e.target.value)}
                      required
                      className="rounded-xl border-slate-100 bg-slate-50/50 h-10 font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Country Jurisdiction *</Label>
                  <CountryDropdown
                    value={formData.country}
                    onChange={(v) => handleInputChange("country", v)}
                    className="flex h-10 w-full rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2 text-[10px] font-black uppercase tracking-tight"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: BUYER SPECIFIC CREDIT */}
            {mode === "buyer" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-1">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-1">Credit Liquidity</h3>
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Enable Credit Facility</Label>
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Allow deferred payment cycle for this counterparty</p>
                  </div>
                  <Switch 
                    checked={formData.credit_limit_enabled} 
                    onCheckedChange={(v) => handleInputChange("credit_limit_enabled", v)}
                    className="data-[state=checked]:bg-slate-900 scale-90"
                  />
                </div>
                {formData.credit_limit_enabled && (
                  <div className="grid md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Credit Limit (Quantum)</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={formData.credit_limit_amount}
                          onChange={(e) => handleInputChange("credit_limit_amount", Number(e.target.value))}
                          className="rounded-xl border-slate-100 bg-white h-10 font-bold pl-10"
                        />
                        <Landmark className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Default PO Reference</Label>
                      <Input
                        value={formData.purchase_order_number}
                        onChange={(e) => handleInputChange("purchase_order_number", e.target.value)}
                        placeholder="PO-000"
                        className="rounded-xl border-slate-100 bg-white h-10 font-bold"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 5: COMPLIANCE MODULE */}
            <div className="space-y-6 pb-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-1">Regulatory Vault</h3>
              <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white space-y-6 shadow-xl relative overflow-hidden">
                <ShieldCheck className="absolute -bottom-4 -right-4 h-24 w-24 text-white/5 -rotate-12" />
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[8px] font-black text-slate-500 uppercase tracking-widest px-1">Entity Registration (CIPC)</Label>
                    <Input
                      value={formData.company_registration}
                      onChange={(e) => handleInputChange("company_registration", e.target.value)}
                      placeholder="e.g., 2023/123456/07"
                      className="bg-white/10 border-white/5 text-white rounded-xl h-10 focus:ring-0 placeholder:text-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[8px] font-black text-slate-500 uppercase tracking-widest px-1">Tax Reference (SARS)</Label>
                    <Input
                      value={formData.tax_registration}
                      onChange={(e) => handleInputChange("tax_registration", e.target.value)}
                      placeholder="e.g., 9000123456"
                      className="bg-white/10 border-white/5 text-white rounded-xl h-10 focus:ring-0 placeholder:text-slate-700"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[8px] font-black text-slate-500 uppercase tracking-widest px-1">Value Added Tax (VAT) #</Label>
                  <Input
                    value={formData.vat_number}
                    onChange={(e) => handleInputChange("vat_number", e.target.value)}
                    placeholder="e.g., 4123456789"
                    className="bg-white/10 border-white/5 text-white rounded-xl h-10 focus:ring-0 placeholder:text-slate-700"
                  />
                </div>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] pt-2 border-t border-white/5">
                  Secure Identity verification required for Financing facilities
                </p>
              </div>
            </div>
          </div>

          {/* FIXED FOOTER */}
          <DialogFooter className="p-8 bg-slate-50/30 border-t border-slate-50 shrink-0">
            <div className="flex w-full gap-4">
               {allowClose && (
                 <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="flex-1 rounded-xl h-12 text-[10px] font-black tracking-widest uppercase hover:bg-white transition-all">
                   Abort
                 </Button>
               )}
               <Button
                type="submit"
                className="flex-[2] bg-slate-900 hover:bg-black text-white rounded-xl h-12 text-[10px] font-black tracking-widest transition-all shadow-xl shadow-slate-200 uppercase"
                disabled={loading}
              >
                {loading ? "PROCESSING..." : submitButtonText}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}