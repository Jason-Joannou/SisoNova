"use client";

import { InvoiceConfiguration } from "@/lib/types/invoicing";
import { MessageSquare, X, Sparkles } from "lucide-react";
import { ConfirmationModalWithButton } from "../modals/invoice-form/confirmation-modal-button";
import { EditableInputField } from "../ui/editable-field";
import { useState, useEffect } from "react";
import { loadNotesConfig } from "@/lib/utility/invoicing/utils";

interface NotesBlockProps {
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

export function NotesBlock({
  toggleComponent,
  config,
  updateInvoiceConfig,
}: NotesBlockProps) {
  const [componentConfig, setComponentConfig] = useState<string>(
    loadNotesConfig(config)
  );

  useEffect(() => {
    if (!config.notes) {
      const defaultNotes = loadNotesConfig(config);
      updateInvoiceConfig("", "notes", defaultNotes);
    }
  }, [config.notes, updateInvoiceConfig]);

  const updateComponentConfig = (value: string) => {
    setComponentConfig(value);
    updateInvoiceConfig("", "notes", value);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[1.5rem] p-5 shadow-sm">
      {/* HEADER SECTION - TIGHTER */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-3.5 w-3.5 text-slate-900" />
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Operational Notes
          </h3>
        </div>

        <ConfirmationModalWithButton
          modalInformation={{
            modalTitle: "Delete Additional Notes",
            modalDescription:
              "Are you sure you want to delete the additional notes section? This action cannot be undone.",
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
            component: "notes",
            section: "",
            field: "notes",
            value: undefined,
          }}
        />
      </div>

      <div className="space-y-3">
        <div className="relative group">
          {/* COMPACT INPUT BOX */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all group-focus-within:border-slate-900 group-focus-within:bg-white">
            <EditableInputField
              value={componentConfig}
              type="text"
              onEdit={(value) => updateComponentConfig(value)}
              placeholder="Add instructions or footer notes..."
              multiline
              // Reduced min-height from 120px to 60px
              className="w-full min-h-[60px] text-[10px] font-medium leading-tight text-slate-600 border-none focus:ring-0 p-0"
            />
          </div>

          {/* TIGHTER METADATA FOOTER */}
          <div className="flex items-center gap-2 mt-2 px-1 opacity-60">
            <Sparkles className="h-2.5 w-2.5 text-slate-400" />
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
              Footer Metadata
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}