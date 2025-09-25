import { InvoiceConfiguration } from "@/lib/types/invoicing";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { EditableInputField } from "../ui/editable-field";

interface businessDetailsProps {
  toggleComponent: (component: "notes" | "paymentTerms" | "paymentMethods" | "lateFees" | "earlyDiscount" | "clientAddress" | "businessDetails") => void;
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
    <div>
      {businessType === "buyer" ? (
        <div className="mt-4 pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">
              Business Details
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleComponent("businessDetails")}
              className="h-5 w-5 p-0 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {/* Single Address Field */}
          <div className="mb-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-slate-600 w-12">Address:</span>
              <EditableInputField
                value={config.business_profile.address_line_1}
                placeholder="123 Business Street&#10;Suite 456&#10;"
                className="text-sm w-full"
                multiline
                onEdit={(value) =>
                  updateInvoiceConfig(
                    "business_profile",
                    "address_line_1",
                    value
                  )
                }
              />
            </div>
          </div>

          <div className="mb-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-slate-600 w-12">City:</span>
              <EditableInputField
                value={config.business_profile.city}
                placeholder="Cape Town"
                className="text-sm w-full"
                multiline
                onEdit={(value) =>
                  updateInvoiceConfig("business_profile", "city", value)
                }
              />
            </div>
          </div>

          <div className="mb-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-slate-600 w-12">Province:</span>
              <EditableInputField
                value={config.business_profile.province}
                placeholder="Western Cape"
                className="text-sm w-full"
                multiline
                onEdit={(value) =>
                  updateInvoiceConfig("business_profile", "province", value)
                }
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">
              Client Address
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleComponent("clientAddress")}
              className="h-5 w-5 p-0 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {/* Single Address Field */}
          <div className="mb-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-slate-600 w-12">Address:</span>
              <EditableInputField
                value={config.client_details.address_line_1}
                placeholder="789 Main Street&#10;"
                className="text-sm w-full"
                multiline
                onEdit={(value) =>
                  updateInvoiceConfig("client_details", "address_line_1", value)
                }
              />
            </div>
          </div>

          <div className="mb-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-slate-600 w-12">City:</span>
              <EditableInputField
                value={config.client_details.city}
                placeholder="Johannesburg"
                className="text-sm w-full"
                multiline
                onEdit={(value) =>
                  updateInvoiceConfig("client_details", "city", value)
                }
              />
            </div>
          </div>

          <div className="mb-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-slate-600 w-12">Province:</span>
              <EditableInputField
                value={config.client_details.province}
                placeholder="Gauteng"
                className="text-sm w-full"
                multiline
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
