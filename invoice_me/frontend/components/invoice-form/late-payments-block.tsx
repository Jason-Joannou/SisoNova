import { InvoiceConfiguration, LatePaymentConfig } from "@/lib/types/invoicing";
import { AlertTriangle, X, Calendar, DollarSign, Percent } from "lucide-react";
import { ConfirmationModalWithButton } from "../modals/invoice-form/confirmation-modal-button";
import { EditableInputField } from "../ui/editable-field";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { loadLatePaymentConfig } from "@/lib/utility/invoicing/utils";

interface LatePaymentsBlockProps {
  toggleComponent: (
    component:
      | "notes"
      | "paymentTerms"
      | "paymentMethods"
      | "lateFees"
      | "earlyDiscount"
      | "clientAddress"
      | "businessDetails"
      | "invoiceSettings"
  ) => void;
  config: InvoiceConfiguration;
  updateInvoiceConfig: (section: string, field: string, value: any) => void;
}

export function LatePaymentsBlock({
  toggleComponent,
  config,
  updateInvoiceConfig,
}: LatePaymentsBlockProps) {
  const [componentConfig, setComponentConfig] = useState<LatePaymentConfig>(
    loadLatePaymentConfig(config)
  );

  useEffect(() => {
    if (!config.late_payment_terms) {
      const defaultTerms = loadLatePaymentConfig(config);
      updateInvoiceConfig("", "late_payment_terms", defaultTerms);
    }
  }, [config.late_payment_terms, updateInvoiceConfig]);

  const updateComponentConfig = (field: string, value: any) => {
    const updatedConfig = {
      ...componentConfig,
      [field]: value,
    };
    setComponentConfig(updatedConfig);
    updateInvoiceConfig("", "late_payment_terms", updatedConfig);
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-red-800 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Late Payment Terms
        </h3>
        <ConfirmationModalWithButton
          modalInformation={{
            modalTitle: "Delete Late Payment Terms",
            modalDescription:
              "Are you sure you want to delete these late payment terms? This action cannot be undone.",
          }}
          buttonInformation={{
            buttonText: "Delete",
            buttonIcon: <X className="h-4 w-4" />,
            buttonVariant: "ghost",
            buttonSize: "sm",
          }}
          updateInvoiceConfig={updateInvoiceConfig}
          toggleComponent={toggleComponent}
          componentInfo={{
            component: "lateFees",
            section: "",
            field: "late_payment_terms",
            value: undefined,
          }}
        />
      </div>

      {/* Late Fee Configuration */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-red-800">
            Enable Late Payment Fees
          </label>
          <Switch
            checked={componentConfig.late_fee_enabled}
            onCheckedChange={(val) =>
              updateComponentConfig("late_fee_enabled", val)
            }
          />
        </div>

        {componentConfig.late_fee_enabled && (
          <div className="bg-white border border-red-200 rounded-lg p-4 space-y-4">
            {/* Grace Period */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Grace Period
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <EditableInputField
                  value={componentConfig.grace_period_days}
                  type="number"
                  onEdit={(value) =>
                    updateComponentConfig("grace_period_days", value)
                  }
                  placeholder="0"
                />
                <span className="text-sm text-gray-600">
                  days after due date before fees apply
                </span>
              </div>
            </div>

            {/* Late Fee Amount and Type */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Late Fee Configuration
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">
                    Fee Amount:
                  </label>
                  <div className="flex items-center gap-2">
                    {componentConfig.late_fee_type === "percentage" ? (
                      <Percent className="h-4 w-4 text-gray-500" />
                    ) : (
                      <DollarSign className="h-4 w-4 text-gray-500" />
                    )}
                    <EditableInputField
                      value={componentConfig.late_fee_amount}
                      type="number"
                      onEdit={(value) =>
                        updateComponentConfig("late_fee_amount", value)
                      }
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">
                    Fee Type:
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

            {/* Compound Interest */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Compound Interest
                </label>
                <p className="text-xs text-gray-600">
                  Apply late fees on previously unpaid late fees
                </p>
              </div>
              <Switch
                checked={componentConfig.compound_interest}
                onCheckedChange={(val) =>
                  updateComponentConfig("compound_interest", val)
                }
              />
            </div>

            {/* Late Fee Description */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Late Fee Description
              </label>
              <EditableInputField
                value={componentConfig.late_fee_description}
                type="text"
                onEdit={(value) =>
                  updateComponentConfig("late_fee_description", value)
                }
                placeholder="Description that appears on invoice"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}