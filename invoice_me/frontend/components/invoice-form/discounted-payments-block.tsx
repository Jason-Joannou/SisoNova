import {
  InvoiceConfiguration,
  EarlyDiscountConfig,
  DiscountTier,
} from "@/lib/types/invoicing";
import { Percent, X, Plus, Trash2 } from "lucide-react";
import { ConfirmationModalWithButton } from "../modals/invoice-form/confirmation-modal-button";
import { EditableInputField } from "../ui/editable-field";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { loadEarlyDiscountConfig, generateId } from "@/lib/utility/invoicing/utils";

interface DiscountedPaymentsBlockProps {
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

export function DiscountedPaymentsBlock({
  toggleComponent,
  config,
  updateInvoiceConfig,
}: DiscountedPaymentsBlockProps) {
  const [componentConfig, setComponentConfig] = useState<EarlyDiscountConfig>(
    loadEarlyDiscountConfig(config)
  );

  useEffect(() => {
    if (!config.early_discount_terms) {
      const defaultTerms = loadEarlyDiscountConfig(config);
      updateInvoiceConfig("", "early_discount_terms", defaultTerms);
    }
  }, [config.early_discount_terms, updateInvoiceConfig]);

  const updateComponentConfig = (field: string, value: any) => {
    const updatedConfig = {
      ...componentConfig,
      [field]: value,
    };
    setComponentConfig(updatedConfig);
    updateInvoiceConfig("", "early_discount_terms", updatedConfig);
  };

  const updateDiscountTier = (tierId: string, field: string, value: any) => {
    const updatedTiers = componentConfig.discount_tiers.map((tier) =>
      tier.id === tierId ? { ...tier, [field]: value } : tier
    );
    updateComponentConfig("discount_tiers", updatedTiers);
  };

  const addDiscountTier = () => {
    const newTier: DiscountTier = {
      id: generateId(),
      discount_percentage: 1,
      discount_days: 30,
      description: "Additional early payment discount",
    };
    const updatedTiers = [...componentConfig.discount_tiers, newTier];
    updateComponentConfig("discount_tiers", updatedTiers);
  };

  const removeDiscountTier = (tierId: string) => {
    if (componentConfig.discount_tiers.length <= 1) {
      return; // Don't allow removing the last tier
    }
    const updatedTiers = componentConfig.discount_tiers.filter(
      (tier) => tier.id !== tierId
    );
    updateComponentConfig("discount_tiers", updatedTiers);
  };

  // Sort tiers by days (ascending) for display
  const sortedTiers = [...componentConfig.discount_tiers].sort(
    (a, b) => a.discount_days - b.discount_days
  );

  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-emerald-800 flex items-center gap-2">
          <Percent className="h-4 w-4" />
          Early Payment Discounts
        </h3>
        <ConfirmationModalWithButton
          modalInformation={{
            modalTitle: "Delete Early Payment Discounts",
            modalDescription:
              "Are you sure you want to delete all early payment discounts? This action cannot be undone.",
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
            component: "earlyDiscount",
            section: "",
            field: "early_discount_terms",
            value: undefined,
          }}
        />
      </div>

      <div className="space-y-4">
        {/* Enable Early Discount Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-emerald-800">
              Enable Early Payment Discounts
            </label>
            <p className="text-xs text-emerald-600">
              Offer multiple discount tiers for payments made before due date
            </p>
          </div>
          <Switch
            checked={componentConfig.early_discount_enabled}
            onCheckedChange={(val) =>
              updateComponentConfig("early_discount_enabled", val)
            }
          />
        </div>

        {componentConfig.early_discount_enabled && (
          <div className="bg-white border border-emerald-200 rounded-lg p-4 space-y-4">
            {/* Discount Tiers */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Discount Tiers
                </label>
                <Button
                  onClick={addDiscountTier}
                  size="sm"
                  variant="outline"
                  className="text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Tier
                </Button>
              </div>

              {sortedTiers.map((tier, index) => (
                <div
                  key={tier.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-800">
                      Discount Tier {index + 1}
                    </h4>
                    {componentConfig.discount_tiers.length > 1 && (
                      <Button
                        onClick={() => removeDiscountTier(tier.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">
                        Discount Percentage:
                      </label>
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-gray-500" />
                        <EditableInputField
                          value={tier.discount_percentage}
                          type="number"
                          onEdit={(value) =>
                            updateDiscountTier(
                              tier.id,
                              "discount_percentage",
                              value
                            )
                          }
                          placeholder="2"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-600 block mb-1">
                        Payment Days:
                      </label>
                      <div className="flex items-center gap-2">
                        <EditableInputField
                          value={tier.discount_days}
                          type="number"
                          onEdit={(value) =>
                            updateDiscountTier(tier.id, "discount_days", value)
                          }
                          placeholder="10"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      Description:
                    </label>
                    <EditableInputField
                      value={tier.description}
                      type="text"
                      onEdit={(value) =>
                        updateDiscountTier(tier.id, "description", value)
                      }
                      placeholder="Early payment discount description"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
