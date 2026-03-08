"use client";

import {
  InvoiceConfiguration,
  EarlyDiscountConfig,
  DiscountTier,
} from "@/lib/types/invoicing";
import { Percent, X, Plus, Trash2, Zap } from "lucide-react";
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
      return;
    }
    const updatedTiers = componentConfig.discount_tiers.filter(
      (tier) => tier.id !== tierId
    );
    updateComponentConfig("discount_tiers", updatedTiers);
  };

  const sortedTiers = [...componentConfig.discount_tiers].sort(
    (a, b) => a.discount_days - b.discount_days
  );

  return (
    <div className="bg-white border border-slate-200 rounded-[1.5rem] p-5 shadow-sm transition-all">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <Percent className="h-3.5 w-3.5 text-emerald-500" />
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Settlement Incentives
          </h3>
        </div>
        
        <div className="flex items-center gap-3">
          <Switch
            checked={componentConfig.early_discount_enabled}
            onCheckedChange={(val) => updateComponentConfig("early_discount_enabled", val)}
            className="scale-75 data-[state=checked]:bg-slate-900"
          />
          <ConfirmationModalWithButton
            modalInformation={{
              modalTitle: "Delete Early Payment Discounts",
              modalDescription: "Are you sure you want to delete all early payment discounts? This action cannot be undone.",
            }}
            buttonInformation={{
              buttonText: "",
              buttonIcon: <X className="h-3.5 w-3.5" />,
              buttonVariant: "ghost",
              buttonSize: "sm",
              buttonClass: "h-6 w-6 p-0 text-slate-300 hover:text-rose-500 transition-colors",
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
      </div>

      <div className="space-y-3">
        {componentConfig.early_discount_enabled && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
            {/* ACTION ROW */}
            <div className="flex items-center justify-between px-1">
              <label className="text-[9px] font-black text-slate-900 uppercase tracking-widest">
                Tiered Configurations
              </label>
              <Button
                onClick={addDiscountTier}
                size="sm"
                variant="ghost"
                className="h-6 text-[8px] font-black text-slate-900 uppercase hover:bg-slate-50 px-2 rounded-lg border border-slate-100"
              >
                <Plus className="h-2.5 w-2.5 mr-1" /> Append Tier
              </Button>
            </div>

            {/* TIERS LIST */}
            <div className="space-y-3">
              {sortedTiers.map((tier, index) => (
                <div
                  key={tier.id}
                  className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                      Tier Module {index + 1}
                    </h4>
                    {componentConfig.discount_tiers.length > 1 && (
                      <button
                        onClick={() => removeDiscountTier(tier.id)}
                        className="text-slate-300 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  {/* INPUT GRID */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">
                        Percentage:
                      </label>
                      <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-100">
                        <Percent className="h-3 w-3 text-slate-400" />
                        <EditableInputField
                          value={tier.discount_percentage}
                          type="number"
                          onEdit={(value) => updateDiscountTier(tier.id, "discount_percentage", value)}
                          className="text-[10px] font-bold text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">
                        Window:
                      </label>
                      <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-100">
                        <EditableInputField
                          value={tier.discount_days}
                          type="number"
                          onEdit={(value) => updateDiscountTier(tier.id, "discount_days", value)}
                          className="text-[10px] font-bold text-slate-900"
                        />
                        <span className="text-[8px] font-black text-slate-400 uppercase">Days</span>
                      </div>
                    </div>
                  </div>

                  {/* DESCRIPTION AREA */}
                  <div className="bg-slate-900 p-3 rounded-lg shadow-inner">
                    <label className="text-[7px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                      Internal Rationale
                    </label>
                    <EditableInputField
                      value={tier.description}
                      type="text"
                      onEdit={(value) => updateDiscountTier(tier.id, "description", value)}
                      className="text-white text-[10px] font-medium placeholder:text-slate-700 bg-transparent border-none focus:ring-0 p-0 w-full"
                      placeholder="Rationale for ledger..."
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