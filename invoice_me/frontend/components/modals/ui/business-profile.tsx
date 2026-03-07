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
import { ShieldCheck, Zap } from "lucide-react";
import { BusinessProfile } from "@/lib/types/invoicing";

const INDUSTRY_TYPES = [
  { value: "retail", label: "Retail" },
  { value: "legal", label: "Legal" },
  { value: "entertainment", label: "Entertainment" },
  { value: "construction", label: "Construction" },
  { value: "consulting", label: "Consulting" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "other", label: "Other" },
];

interface BusinessProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BusinessProfile) => void | Promise<void>;
  initialData?: Partial<BusinessProfile>;
  title?: string;
  description?: string;
  submitButtonText?: string;
  allowClose?: boolean;
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
}: BusinessProfileModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BusinessProfile>({
    company_name: initialData?.company_name || "",
    trading_name: initialData?.trading_name || "",
    address_line_1: initialData?.address_line_1 || "",
    address_line_2: initialData?.address_line_2 || "",
    contact_email: initialData?.contact_email || "",
    city: initialData?.city || "",
    province: initialData?.province || "",
    postal_code: initialData?.postal_code || "",
    country: initialData?.country || "South Africa",
    vat_number: initialData?.vat_number || "",
    company_registration: initialData?.company_registration || "",
    tax_registration: initialData?.tax_registration || "",
    industry_type: initialData?.industry_type || "",
    contact_phone: initialData?.contact_phone || "",
  });

  const handleInputChange = (field: keyof BusinessProfile, value: string) => {
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
        // REMOVED custom Close button logic to let Dialog handle it via allowClose
      >
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
          {/* FIXED HEADER */}
          <div className="p-8 border-b border-slate-50 bg-slate-50/30 shrink-0">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 bg-slate-900 rounded flex items-center justify-center text-white">
                  <Zap className="h-3.5 w-3.5 fill-white" />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Identity Verification</span>
              </div>
              <DialogTitle className="text-3xl font-black text-slate-900 tracking-tighter italic leading-none">
                {title}
              </DialogTitle>
              <DialogDescription className="text-xs font-medium text-slate-500 mt-2">
                {description}
              </DialogDescription>
            </div>
          </div>

          {/* SCROLLABLE BODY */}
          <div className="p-8 space-y-12 overflow-y-auto custom-scrollbar">
            {/* SECTION 1: COMPANY CORE */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-1">Entity Details</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Legal Company Name *</Label>
                  <Input
                    value={formData.company_name}
                    onChange={(e) => handleInputChange("company_name", e.target.value)}
                    placeholder="e.g., SisoNova (Pty) Ltd"
                    required
                    className="rounded-xl border-slate-100 bg-slate-50/50 h-11 focus:border-slate-900 focus:ring-0 font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Trading Name</Label>
                  <Input
                    value={formData.trading_name}
                    onChange={(e) => handleInputChange("trading_name", e.target.value)}
                    placeholder="Same as legal unless specified"
                    className="rounded-xl border-slate-100 bg-slate-50/50 h-11 focus:border-slate-900 focus:ring-0 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Industry Sector *</Label>
                <Select value={formData.industry_type} onValueChange={(v) => handleInputChange("industry_type", v)}>
                  <SelectTrigger className="rounded-xl border-slate-100 bg-slate-50/50 h-11 font-bold text-[10px] uppercase">
                    <SelectValue placeholder="SELECT INDUSTRY" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                    {INDUSTRY_TYPES.map((i) => (
                      <SelectItem key={i.value} value={i.value} className="text-[10px] font-black uppercase">{i.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* SECTION 2: CONTACT INFORMATION */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-1">Contact Protocol</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Official Email *</Label>
                  <Input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => handleInputChange("contact_email", e.target.value)}
                    placeholder="billing@company.com"
                    required
                    className="rounded-xl border-slate-100 bg-slate-50/50 h-11 focus:border-slate-900 focus:ring-0 font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Contact Phone</Label>
                  <Input
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => handleInputChange("contact_phone", e.target.value)}
                    placeholder="+27 (0) 00 000 0000"
                    className="rounded-xl border-slate-100 bg-slate-50/50 h-11 focus:border-slate-900 focus:ring-0 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: ADDRESS */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-1">Operational HQ</h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Address Line 1 *</Label>
                    <Input
                      value={formData.address_line_1}
                      onChange={(e) => handleInputChange("address_line_1", e.target.value)}
                      placeholder="Street number and name"
                      required
                      className="rounded-xl border-slate-100 bg-slate-50/50 h-11 font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Address Line 2</Label>
                    <Input
                      value={formData.address_line_2}
                      onChange={(e) => handleInputChange("address_line_2", e.target.value)}
                      placeholder="Suite, Floor, Unit"
                      className="rounded-xl border-slate-100 bg-slate-50/50 h-11 font-bold"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="md:col-span-2 space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">City *</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                      className="rounded-xl border-slate-100 bg-slate-50/50 h-11 font-bold"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Country *</Label>
                    <CountryDropdown
                      value={formData.country}
                      onChange={(v) => handleInputChange("country", v)}
                      className="flex h-11 w-full rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2 text-[10px] font-black uppercase tracking-tight focus:outline-none focus:border-slate-900"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Province / State *</Label>
                    <RegionDropdown
                      country={formData.country}
                      value={formData.province}
                      onChange={(v) => handleInputChange("province", v)}
                      className="flex h-11 w-full rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2 text-[10px] font-black uppercase tracking-tight focus:outline-none focus:border-slate-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Postal Code *</Label>
                    <Input
                      value={formData.postal_code}
                      onChange={(e) => handleInputChange("postal_code", e.target.value)}
                      placeholder="0000"
                      required
                      className="rounded-xl border-slate-100 bg-slate-50/50 h-11 font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: REGISTRATION DETAILS */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-1">Compliance & Tax</h3>
              <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-[8px] font-black text-slate-500 uppercase tracking-widest px-1">Company Registration (CIPC)</Label>
                    <Input
                      value={formData.company_registration}
                      onChange={(e) => handleInputChange("company_registration", e.target.value)}
                      placeholder="2023/123456/07"
                      className="bg-white/10 border-white/5 text-white rounded-xl h-11 placeholder:text-slate-600 focus:ring-0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[8px] font-black text-slate-500 uppercase tracking-widest px-1">Tax Registration (SARS)</Label>
                    <Input
                      value={formData.tax_registration}
                      onChange={(e) => handleInputChange("tax_registration", e.target.value)}
                      placeholder="Enter Tax Number"
                      className="bg-white/10 border-white/5 text-white rounded-xl h-11 placeholder:text-slate-600 focus:ring-0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[8px] font-black text-slate-500 uppercase tracking-widest px-1">VAT Number</Label>
                  <Input
                    value={formData.vat_number}
                    onChange={(e) => handleInputChange("vat_number", e.target.value)}
                    placeholder="e.g., 4123456789"
                    className="bg-white/10 border-white/5 text-white rounded-xl h-11 placeholder:text-slate-600 focus:ring-0"
                  />
                </div>
                
                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
                    Data encrypted via AES-256 for KYC verification
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FIXED FOOTER */}
          <DialogFooter className="p-8 bg-slate-50/30 border-t border-slate-50 shrink-0">
            <div className="flex w-full gap-4">
               {allowClose && (
                 <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="flex-1 rounded-xl h-12 text-[10px] font-black tracking-widest uppercase hover:bg-white">
                   Cancel
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