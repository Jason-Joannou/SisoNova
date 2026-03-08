"use client";

import { InvoiceConfiguration } from "@/lib/types/invoicing";
import { X, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { EditableInputField } from "../ui/editable-field";

interface businessDetailsProps {
  toggleComponent: (component: "notes" | "paymentTerms" | "paymentMethods" | "lateFees" | "earlyDiscount" | "clientAddress" | "businessDetails" | "invoiceSettings") => void;
  businessType: "buyer" | "seller";
  config: InvoiceConfiguration;
  updateInvoiceConfig: (section: string, field: string, value: any) => void;
}

export function ExpandedBusinessDetailsBlock({
  toggleComponent,
  businessType,
  config,
  updateInvoiceConfig,
}: businessDetailsProps) {
  return (
    <div className="animate-in fade-in slide-in-from-top-1 duration-200">
      {businessType === "buyer" ? (
        <div className="mt-2 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-slate-400" />
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                Entity HQ Details
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleComponent("businessDetails")}
              className="h-5 w-5 p-0 text-slate-300 hover:text-rose-500 transition-colors"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          <div className="space-y-1">
            {/* Address Row */}
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group">
              <span className="text-[9px] font-black text-slate-400 uppercase w-14 tracking-tighter">Address</span>
              <EditableInputField
                value={config.business_profile.address_line_1}
                placeholder="123 Business Street..."
                className="text-[11px] font-bold text-slate-700 w-full p-0 border-none bg-transparent"
                multiline
                onEdit={(value) =>
                  updateInvoiceConfig("business_profile", "address_line_1", value)
                }
              />
            </div>

            {/* City Row */}
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <span className="text-[9px] font-black text-slate-400 uppercase w-14 tracking-tighter">City</span>
              <EditableInputField
                value={config.business_profile.city}
                placeholder="Cape Town"
                className="text-[11px] font-bold text-slate-700 w-full p-0 border-none bg-transparent"
                onEdit={(value) =>
                  updateInvoiceConfig("business_profile", "city", value)
                }
              />
            </div>

            {/* Province Row */}
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <span className="text-[9px] font-black text-slate-400 uppercase w-14 tracking-tighter">Province</span>
              <EditableInputField
                value={config.business_profile.province}
                placeholder="Western Cape"
                className="text-[11px] font-bold text-slate-700 w-full p-0 border-none bg-transparent"
                onEdit={(value) =>
                  updateInvoiceConfig("business_profile", "province", value)
                }
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-2 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-slate-400" />
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                Client HQ Details
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleComponent("clientAddress")}
              className="h-5 w-5 p-0 text-slate-300 hover:text-rose-500 transition-colors"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          <div className="space-y-1">
            {/* Address Row */}
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group">
              <span className="text-[9px] font-black text-slate-400 uppercase w-14 tracking-tighter">Address</span>
              <EditableInputField
                value={config.client_details.address_line_1}
                placeholder="789 Main Street..."
                className="text-[11px] font-bold text-slate-700 w-full p-0 border-none bg-transparent"
                multiline
                onEdit={(value) =>
                  updateInvoiceConfig("client_details", "address_line_1", value)
                }
              />
            </div>

            {/* City Row */}
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <span className="text-[9px] font-black text-slate-400 uppercase w-14 tracking-tighter">City</span>
              <EditableInputField
                value={config.client_details.city}
                placeholder="Johannesburg"
                className="text-[11px] font-bold text-slate-700 w-full p-0 border-none bg-transparent"
                onEdit={(value) =>
                  updateInvoiceConfig("client_details", "city", value)
                }
              />
            </div>

            {/* Province Row */}
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <span className="text-[9px] font-black text-slate-400 uppercase w-14 tracking-tighter">Province</span>
              <EditableInputField
                value={config.client_details.province}
                placeholder="Gauteng"
                className="text-[11px] font-bold text-slate-700 w-full p-0 border-none bg-transparent"
                onEdit={(value) =>
                  updateInvoiceConfig("client_details", "province", value)
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}