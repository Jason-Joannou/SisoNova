// components/modals/business-profile-modal.tsx
"use client";

import { useState } from "react";
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
import { Building2, Shield } from "lucide-react";
import { BusinessProfile } from "@/lib/types/invoicing";

// Industry types enum
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
  title = "Business Information",
  description = "Tell us about your business so we can verify and tailor our services",
  submitButtonText = "Save Business Profile",
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

  const handleCountryChange = (val: string) => {
    setFormData((prev) => ({ 
      ...prev, 
      country: val,
      // Reset province when country changes
      province: ""
    }));
  };

  const handleRegionChange = (val: string) => {
    setFormData((prev) => ({ ...prev, province: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting business profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={allowClose ? onOpenChange : undefined}>
      <DialogContent
        className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => {
          if (!allowClose) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (!allowClose) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building2 className="h-5 w-5 text-emerald-600" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Company Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="company_name"
                  className="text-slate-700 font-medium"
                >
                  Company Name *
                </Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) =>
                    handleInputChange("company_name", e.target.value)
                  }
                  placeholder="Your Company (Pty) Ltd"
                  required
                  className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="trading_name"
                  className="text-slate-700 font-medium"
                >
                  Trading Name
                </Label>
                <Input
                  id="trading_name"
                  value={formData.trading_name}
                  onChange={(e) =>
                    handleInputChange("trading_name", e.target.value)
                  }
                  placeholder="If different from company name"
                  className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Contact Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="contact_email"
                    className="text-slate-700 font-medium"
                  >
                    Contact Email *
                  </Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => handleInputChange("contact_email", e.target.value)}
                    placeholder="contact@yourcompany.com"
                    required
                    className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="contact_phone"
                    className="text-slate-700 font-medium"
                  >
                    Contact Phone
                  </Label>
                  <Input
                    id="contact_phone"
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) =>
                      handleInputChange("contact_phone", e.target.value)
                    }
                    placeholder="+27 12 345 6789"
                    className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <Label
                htmlFor="industry_type"
                className="text-slate-700 font-medium"
              >
                Industry *
              </Label>
              <Select
                value={formData.industry_type}
                onValueChange={(value) =>
                  handleInputChange("industry_type", value)
                }
              >
                <SelectTrigger className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRY_TYPES.map((industry) => (
                    <SelectItem key={industry.value} value={industry.value}>
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Business Address
              </h3>
              <div className="space-y-2">
                <Label
                  htmlFor="address_line_1"
                  className="text-slate-700 font-medium"
                >
                  Address Line 1 *
                </Label>
                <Input
                  id="address_line_1"
                  value={formData.address_line_1}
                  onChange={(e) =>
                    handleInputChange("address_line_1", e.target.value)
                  }
                  placeholder="Street address"
                  required
                  className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="address_line_2"
                  className="text-slate-700 font-medium"
                >
                  Address Line 2
                </Label>
                <Input
                  id="address_line_2"
                  value={formData.address_line_2}
                  onChange={(e) =>
                    handleInputChange("address_line_2", e.target.value)
                  }
                  placeholder="Suite, unit, building, floor, etc."
                  className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-slate-700 font-medium">
                    City *
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="City"
                    required
                    className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="country"
                    className="text-slate-700 font-medium"
                  >
                    Country *
                  </Label>
                  <CountryDropdown
                    value={formData.country}
                    onChange={handleCountryChange}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    priorityOptions={["South Africa", "Botswana", "Namibia", "Zimbabwe"]}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="province"
                    className="text-slate-700 font-medium"
                  >
                    Province / State *
                  </Label>
                  <RegionDropdown
                    country={formData.country}
                    value={formData.province}
                    onChange={handleRegionChange}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    blankOptionLabel="Select province/state"
                    defaultOptionLabel="Select province/state"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="postal_code"
                    className="text-slate-700 font-medium"
                  >
                    Postal Code *
                  </Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) =>
                      handleInputChange("postal_code", e.target.value)
                    }
                    placeholder="0000"
                    required
                    className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Registration Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Registration Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="company_registration"
                    className="text-slate-700 font-medium"
                  >
                    Company Registration Number
                  </Label>
                  <Input
                    id="company_registration"
                    value={formData.company_registration}
                    onChange={(e) =>
                      handleInputChange("company_registration", e.target.value)
                    }
                    placeholder="2023/123456/07"
                    className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="tax_registration"
                    className="text-slate-700 font-medium"
                  >
                    Tax Registration Number
                  </Label>
                  <Input
                    id="tax_registration"
                    value={formData.tax_registration}
                    onChange={(e) =>
                      handleInputChange("tax_registration", e.target.value)
                    }
                    placeholder="Tax registration number"
                    className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="vat_number"
                  className="text-slate-700 font-medium"
                >
                  VAT Number
                </Label>
                <Input
                  id="vat_number"
                  value={formData.vat_number}
                  onChange={(e) =>
                    handleInputChange("vat_number", e.target.value)
                  }
                  placeholder="4123456789"
                  className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Why we need this info */}
            <div className="bg-emerald-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-emerald-900 mb-2">
                    Why we need this information
                  </h4>
                  <ul className="text-sm text-emerald-800 space-y-1">
                    <li>
                      • <strong>Verification:</strong> We verify your business
                      with CIPC to ensure legitimacy
                    </li>
                    <li>
                      • <strong>Risk Assessment:</strong> Industry and location
                      help us assess financing options
                    </li>
                    <li>
                      • <strong>Compliance:</strong> Required for KYC/AML and
                      regulatory compliance
                    </li>
                    <li>
                      • <strong>Tailored Service:</strong> We customize our
                      offerings based on your business type
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            {allowClose && (
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </DialogClose>
            )}
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={loading}
            >
              {loading ? "Saving..." : submitButtonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}