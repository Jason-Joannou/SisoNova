"use client";

import { Clock, X, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { EditableInputField } from "../ui/editable-field";
import { Switch } from "@/components/ui/switch";
import {
  PaymentTermsType,
} from "@/lib/enums/invoicing";

import {
  InvoicePaymentTerms,
  InvoiceConfiguration,
} from "@/lib/types/invoicing";
import { ConfirmationModalWithButton } from "../modals/invoice-form/confirmation-modal-button";
import { getDefaultDescription, loadPaymentTerms, formatPaymentMethod } from "@/lib/utility/invoicing/utils";

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
      | "invoiceSettings"
  ) => void;
  updateInvoiceConfig: (section: string, field: string, value: any) => void;
}

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
    <div className="bg-white border border-slate-200 rounded-[1.5rem] p-5 shadow-sm">
      {/* HEADER SECTION - TIGHTER */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-slate-900" />
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Maturity Schedule
          </h3>
        </div>
        <ConfirmationModalWithButton
          modalInformation={{
            modalTitle: "Remove Payment Terms?",
            modalDescription: "Are you sure you want to remove this component? This will reset all payment terms to default.",
          }}
          buttonInformation={{
            buttonVariant: "ghost",
            buttonSize: "sm",
            buttonClass: "h-6 w-6 p-0 text-slate-300 hover:text-rose-500 transition-colors",
            buttonIcon: <X className="h-3.5 w-3.5" />,
            buttonText: "",
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

      <div className="space-y-4">
        {/* PROTOCOL SELECTION - TIGHT GRID */}
        <div>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(PaymentTermsType).map((term) => {
              const isSelected = componentConfig.payment_terms_type.includes(term);
              return (
                <div
                  key={term}
                  onClick={() => handlePaymentTermToggle(term, !isSelected)}
                  className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "border-slate-900 bg-slate-900 text-white shadow-md shadow-slate-100"
                      : "border-slate-100 bg-slate-50/50 hover:border-slate-300"
                  }`}
                >
                  <span className="text-[9px] font-black uppercase tracking-tight truncate">
                    {formatPaymentMethod(term)}
                  </span>
                  {isSelected && <Check className="w-3 h-3 text-white stroke-[4]" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* DESCRIPTION CUSTOMIZATION - HIGH DENSITY CARDS */}
        {componentConfig.payment_description && componentConfig.payment_description.length > 0 ? (
          <div className="space-y-2 pt-2 border-t border-slate-50">
            {componentConfig.payment_description.map((desc, index) => (
              <div
                key={desc.payment_terms_type}
                className="bg-slate-50/50 border border-slate-100 rounded-xl p-3"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="h-1 w-1 bg-slate-900 rounded-full"></div>
                  <h5 className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                    {formatPaymentMethod(desc.payment_terms_type)}
                  </h5>
                </div>
                <EditableInputField
                  value={desc.description}
                  onEdit={(value) => {
                    const currentDescriptions = componentConfig.payment_description || [];
                    const updatedDescriptions = currentDescriptions.map((d, i) =>
                      i === index ? { ...d, description: value } : d
                    );
                    updateComponentConfig("payment_description", updatedDescriptions);
                  }}
                  placeholder={getDefaultDescription(desc.payment_terms_type)}
                  multiline
                  className="w-full text-[10px] font-medium leading-tight text-slate-600 p-0 bg-transparent border-none focus:ring-0"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
            <p className="text-[9px] font-bold text-slate-400 uppercase italic">
              Select protocols to configure language
            </p>
          </div>
        )}
      </div>
    </div>
  );
}