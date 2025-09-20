import { Clock, X, Save, Edit } from "lucide-react";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { EditableInputField } from "../ui/editable-field";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  PaymentTermsType,
  AcceptedPaymentMethods,
} from "@/lib/enums/invoicing";

import {
  InvoicePaymentTerms,
  InvoiceConfiguration,
} from "@/lib/types/invoicing";

interface PaymentTermsBlockProps {
  config: InvoiceConfiguration;
  toggleComponent: (
    component:
      | "notes"
      | "paymentTerms"
      | "paymentMethods"
      | "lateFees"
      | "earlyDiscount"
      | "clientAddress"
      | "businessDetails"
      | "vatSettings"
  ) => void;
  updateInvoiceConfig: (section: string, field: string, value: any) => void;
}

function loadPaymentTerms(config: InvoiceConfiguration): InvoicePaymentTerms {
  if (config?.payment_terms) {
    return config.payment_terms;
  }
  // No payment terms present, create defaults
  const defaultPaymentTerms: InvoicePaymentTerms = {
    payment_terms_type: [PaymentTermsType.NET_30],
    payment_description: [
      {
        payment_terms_type: PaymentTermsType.NET_30,
        description: getDefaultDescription(PaymentTermsType.NET_30),
      },
    ],
    accepted_payment_methods: [
      AcceptedPaymentMethods.EFT,
      AcceptedPaymentMethods.CARD_PAYMENTS,
    ],
    late_fee_enabled: false,
    late_fee_type: "percentage",
    late_fee_amount: 0,
    benefit_enabled: false,
    benefit_type: "percentage",
    benefit_amount: 0,
  };

  return defaultPaymentTerms;
}

const getDefaultDescription = (term: PaymentTermsType): string => {
  const descriptions = {
    [PaymentTermsType.NET_15]: "Payment due within 15 days of invoice date",
    [PaymentTermsType.NET_30]: "Payment due within 30 days of invoice date",
    [PaymentTermsType.NET_60]: "Payment due within 60 days of invoice date",
    [PaymentTermsType.CASH_ON_DELIVERY]:
      "Payment required upon delivery of goods/services",
    [PaymentTermsType.CASH_IN_ADVANCE]:
      "Full payment required before work begins",
    [PaymentTermsType.CASH_BEFORE_DELIVERY]: "Payment required before delivery",
    [PaymentTermsType.CASH_WITH_ORDER]: "Payment required when order is placed",
    [PaymentTermsType.CUSTOM]: "Your custom payment terms here",
  };
  return descriptions[term] || `Payment terms: ${term}`;
};

export function PaymentTermsBlock({
  config,
  toggleComponent,
  updateInvoiceConfig,
}: PaymentTermsBlockProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<any>("");

  const [componentConfig, setComponentConfig] = useState<InvoicePaymentTerms>(
    loadPaymentTerms(config)
  );

  useEffect(() => {
    if (!config.payment_terms) {
      const defaultTerms = loadPaymentTerms(config);
      updateInvoiceConfig("", "payment_terms", defaultTerms);
    }
  }, [config.payment_terms, updateInvoiceConfig]);

  const updateComponentConfig = (field: string, value: any) => {
    const updatedConfig = { ...componentConfig, [field]: value };
    setComponentConfig(updatedConfig);

    updateInvoiceConfig("", "payment_terms", updatedConfig);
  };

  const formatPaymentMethod = (method: string) =>
    method.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-blue-800 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Payment Terms
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleComponent("paymentTerms")}
          className="text-blue-600 hover:text-blue-800"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Payment Terms Type */}
        <div>
          <label className="text-sm font-medium text-blue-800 block mb-1">
            Payment Terms:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(PaymentTermsType).map((term) => (
              <div key={term} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={term}
                  checked={componentConfig.payment_terms_type.includes(term)}
                  onChange={(e) => {
                    const current = componentConfig.payment_terms_type;
                    const updated = e.target.checked
                      ? [...current, term]
                      : current.filter((t) => t !== term);

                    let updatedDescriptions =
                      componentConfig.payment_description || [];
                    if (e.target.checked) {
                      // Add description placeholder if missing
                      if (
                        !updatedDescriptions.find(
                          (d) => d.payment_terms_type === term
                        )
                      ) {
                        updatedDescriptions = [
                          ...updatedDescriptions,
                          {
                            payment_terms_type: term,
                            description: getDefaultDescription(term),
                          },
                        ];
                      }
                    } else {
                      // Remove description for unchecked term
                      updatedDescriptions = updatedDescriptions.filter(
                        (d) => d.payment_terms_type !== term
                      );
                    }

                    const newConfig = {
                      ...componentConfig,
                      payment_terms_type: updated,
                      payment_description: updatedDescriptions,
                    };

                    setComponentConfig(newConfig);
                    updateInvoiceConfig("", "payment_terms", newConfig);
                  }}
                  className="rounded border-gray-300"
                />
                <label htmlFor={term} className="text-sm cursor-pointer">
                  {formatPaymentMethod(term)}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Description */}
        <div>
          <label className="text-sm font-medium text-blue-800 block mb-1">
            Descriptions:
          </label>
          {componentConfig.payment_description &&
          componentConfig.payment_description.length > 0 ? (
            <div className="space-y-2">
              {componentConfig.payment_description.map((desc, index) => (
                <div key={desc.payment_terms_type}>
                  <EditableInputField
                    value={desc.description}
                    onEdit={(value) => {
                      const currentDescriptions =
                        componentConfig.payment_description || [];
                      const updatedDescriptions = currentDescriptions.map(
                        (d, i) =>
                          i === index ? { ...d, description: value } : d
                      );
                      updateComponentConfig(
                        "payment_description",
                        updatedDescriptions
                      );
                    }}
                    placeholder={getDefaultDescription(desc.payment_terms_type)}
                    multiline
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              Select payment terms above to add descriptions
            </p>
          )}
        </div>

        {/* Accepted Payment Methods */}
        <div>
          <label className="text-sm font-medium text-blue-800 block mb-2">
            Accepted Payment Methods:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(AcceptedPaymentMethods).map((method) => (
              <div key={method} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={method}
                  checked={componentConfig.accepted_payment_methods.includes(
                    method
                  )}
                  onChange={(e) => {
                    const current = componentConfig.accepted_payment_methods;
                    const updated = e.target.checked
                      ? [...current, method]
                      : current.filter((m) => m !== method);
                    updateComponentConfig("accepted_payment_methods", updated);
                  }}
                  className="rounded border-gray-300"
                />
                <label htmlFor={method} className="text-sm cursor-pointer">
                  {formatPaymentMethod(method)}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Late Fees Section */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-blue-800">
              Late Payment Fees:
            </label>
            <Switch
              checked={componentConfig.late_fee_enabled}
              onCheckedChange={(val) =>
                updateComponentConfig("late_fee_enabled", val)
              }
            />
          </div>

          {componentConfig.late_fee_enabled && (
            <div className="bg-white p-3 rounded border ml-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">
                    Amount:
                  </label>
                  <EditableInputField
                    value={componentConfig.late_fee_amount}
                    type="number"
                    onEdit={(value) =>
                      updateComponentConfig("late_fee_amount", value)
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">
                    Type:
                  </label>
                  <EditableInputField
                    value={componentConfig.late_fee_type}
                    selectOptions={["percentage", "fixed"]}
                    displayValue={
                      componentConfig.late_fee_type === "percentage"
                        ? "Percentage (%)"
                        : "Fixed Amount (R)"
                    }
                    onEdit={(value) =>
                      updateComponentConfig("late_fee_type", value)
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Early Payment Benefit Section */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-blue-800">
              Early Payment Discount:
            </label>
            <Switch
              checked={componentConfig.benefit_enabled}
              onCheckedChange={(val) =>
                updateComponentConfig("benefit_enabled", val)
              }
            />
          </div>

          {componentConfig.benefit_enabled && (
            <div className="bg-white p-3 rounded border ml-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">
                    Amount:
                  </label>
                  <EditableInputField
                    value={componentConfig.benefit_amount}
                    type="number"
                    onEdit={(value) =>
                      updateComponentConfig("benefit_amount", value)
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">
                    Type:
                  </label>
                  <EditableInputField
                    value={componentConfig.benefit_type}
                    selectOptions={["percentage", "fixed"]}
                    displayValue={
                      componentConfig.benefit_type === "percentage"
                        ? "Percentage (%)"
                        : "Fixed Amount (R)"
                    }
                    onEdit={(value) =>
                      updateComponentConfig("benefit_type", value)
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
