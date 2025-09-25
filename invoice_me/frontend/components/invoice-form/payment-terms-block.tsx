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
import { ConfirmationModalWithButton } from "../modals/invoice-form/confirmation-modal-button";

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

  const handlePaymentTermToggle = (
    term: PaymentTermsType,
    checked: boolean
  ) => {
    const current = componentConfig.payment_terms_type;
    const updated = checked
      ? [...current, term]
      : current.filter((t) => t !== term);

    let updatedDescriptions = componentConfig.payment_description || [];
    if (checked) {
      if (!updatedDescriptions.find((d) => d.payment_terms_type === term)) {
        updatedDescriptions = [
          ...updatedDescriptions,
          {
            payment_terms_type: term,
            description: getDefaultDescription(term),
          },
        ];
      }
    } else {
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
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-blue-800 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Payment Terms
        </h3>
        <ConfirmationModalWithButton
          modalInformation={{
            modalTitle: "Remove Payment Terms?",
            modalDescription: "Are you sure you want to remove this component? This will reset all payment terms to default.",
          }}
          buttonInformation={{
            buttonVariant: "ghost",
            buttonSize: "sm",
            buttonClass: "text-blue-600 hover:text-blue-800",
            buttonIcon: <X className="h-4 w-4" />,
            buttonText: "X",
          }}
          updateInvoiceConfig={updateInvoiceConfig}
          toggleComponent={toggleComponent}
          componentInfo={{
            component: "paymentTerms",
            section: "",
            field: "payment_terms",
            value: undefined,
          }}
        />
      </div>

      <div className="space-y-6">
        {/* Payment Terms Type */}
        <div>
          <label className="text-sm font-medium text-blue-800 block mb-3">
            Choose your payment terms:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.values(PaymentTermsType).map((term) => {
              const isSelected =
                componentConfig.payment_terms_type.includes(term);
              return (
                <div
                  key={term}
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                      : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
                  }`}
                  onClick={() => handlePaymentTermToggle(term, !isSelected)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-900">
                        {formatPaymentMethod(term)}
                      </h4>
                    </div>
                    <div className="ml-3">
                      {isSelected ? (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Description */}
        <div>
          <label className="text-sm font-medium text-blue-800 block mb-3">
            Customize your payment term descriptions:
          </label>
          {componentConfig.payment_description &&
          componentConfig.payment_description.length > 0 ? (
            <div className="space-y-3">
              {componentConfig.payment_description.map((desc, index) => (
                <div
                  key={desc.payment_terms_type}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <h5 className="font-medium text-sm text-gray-900">
                      {formatPaymentMethod(desc.payment_terms_type)}
                    </h5>
                  </div>
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
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-gray-400 mb-2">
                <svg
                  className="w-8 h-8 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-500 italic">
                Select payment terms above to customize their descriptions
              </p>
            </div>
          )}
        </div>

        {/* Late Fees Section */}
        <div className="border-t pt-4">
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
        <div className="border-t pt-4">
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
