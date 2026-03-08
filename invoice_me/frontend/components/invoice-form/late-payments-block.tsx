"use client";

import { InvoiceConfiguration, LatePaymentConfig } from "@/lib/types/invoicing";
import { AlertTriangle, X, Calendar, Percent, ShieldAlert } from "lucide-react";
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
    <div className="bg-white border border-slate-200 rounded-[1.5rem] p-5 shadow-sm transition-all">
      {/* HEADER SECTION - TIGHTER WITH INTEGRATED TOGGLE */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Arrears Policy
          </h3>
        </div>
        
        <div className="flex items-center gap-3">
          <Switch
            checked={componentConfig.late_fee_enabled}
            onCheckedChange={(val) => updateComponentConfig("late_fee_enabled", val)}
            className="scale-75 data-[state=checked]:bg-slate-900"
          />
          <ConfirmationModalWithButton
            modalInformation={{
              modalTitle: "Delete Late Payment Terms",
              modalDescription: "Are you sure you want to delete these late payment terms? This action cannot be undone.",
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
              component: "lateFees",
              section: "",
              field: "late_payment_terms",
              value: undefined,
            }}
          />
        </div>
      </div>

      {/* Late Fee Configuration */}
      <div className="space-y-3">
        {componentConfig.late_fee_enabled && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
            {/* GRACE & QUANTUM GRID */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                  Grace Period
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-slate-400" />
                  <EditableInputField
                    value={componentConfig.grace_period_days}
                    type="number"
                    onEdit={(value) => updateComponentConfig("grace_period_days", value)}
                    className="text-[10px] font-bold text-slate-900"
                    placeholder="0"
                  />
                  <span className="text-[8px] font-black text-slate-400 uppercase">Days</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                  Penalty Quantum
                </label>
                <div className="flex items-center gap-2">
                  {componentConfig.late_fee_type === "percentage" ? (
                    <Percent className="h-3 w-3 text-slate-400" />
                  ) : (
                    <span className="text-[10px] font-black text-slate-400">R</span>
                  )}
                  <EditableInputField
                    value={componentConfig.late_fee_amount}
                    type="number"
                    onEdit={(value) => updateComponentConfig("late_fee_amount", value)}
                    className="text-[10px] font-bold text-slate-900"
                    placeholder="0"
                  />
                  <EditableInputField
                    value={componentConfig.late_fee_type}
                    selectOptions={["percentage", "fixed"]}
                    displayValue={componentConfig.late_fee_type === "percentage" ? "%" : "VAL"}
                    onEdit={(value) => updateComponentConfig("late_fee_type", value)}
                    className="text-[8px] font-black uppercase text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* COMPOUND INTEREST - COMPACT ROW */}
            <div className="flex items-center justify-between p-3 bg-rose-50/30 border border-rose-100/50 rounded-xl">
              <div className="space-y-0.5">
                <label className="text-[9px] font-black text-rose-900 uppercase tracking-tight">
                  Compound Interest
                </label>
                <p className="text-[8px] font-bold text-rose-400 uppercase leading-none">
                  Apply fees to existing penalties
                </p>
              </div>
              <Switch
                checked={componentConfig.compound_interest}
                onCheckedChange={(val) => updateComponentConfig("compound_interest", val)}
                className="scale-50 data-[state=checked]:bg-rose-500"
              />
            </div>

            {/* DISCLOSURE CARD - SLATE 900 */}
            <div className="p-4 bg-slate-900 rounded-xl shadow-md">
              <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                Contractual Disclosure
              </label>
              <EditableInputField
                value={componentConfig.late_fee_description}
                type="text"
                onEdit={(value) => updateComponentConfig("late_fee_description", value)}
                className="text-white text-[10px] font-medium placeholder:text-slate-600 p-0 bg-transparent border-none focus:ring-0 w-full"
                placeholder="Description for invoice..."
              />
              <div className="flex items-center gap-2 mt-3 opacity-30">
                  <ShieldAlert className="h-2.5 w-2.5 text-white" />
                  <span className="text-[7px] font-black text-white uppercase tracking-widest">Legal Metadata</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}