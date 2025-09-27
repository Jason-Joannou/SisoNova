import { InvoiceConfiguration } from "@/lib/types/invoicing";
import { MessageSquare, X } from "lucide-react";
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
      updateInvoiceConfig("", "notes", defaultNotes); // Changed from "notes_config" to "notes"
    }
  }, [config.notes, updateInvoiceConfig]);

  const updateComponentConfig = (value: string) => { // Simplified - just takes the value directly
    setComponentConfig(value);
    updateInvoiceConfig("", "notes", value); // Changed from "notes_config" to "notes"
  };

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-purple-800 flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Additional Notes
        </h3>
        <ConfirmationModalWithButton
          modalInformation={{
            modalTitle: "Delete Additional Notes",
            modalDescription:
              "Are you sure you want to delete the additional notes section? This action cannot be undone.",
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
            component: "notes",
            section: "",
            field: "notes", // Changed from "notes_config" to "notes"
            value: undefined,
          }}
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-purple-800 block mb-2">
            Notes & Additional Information
          </label>
          <EditableInputField
            value={componentConfig} // Changed from componentConfig.notes to just componentConfig
            type="text"
            onEdit={(value) => updateComponentConfig(value)} // Simplified call
            placeholder="Add any additional notes, terms, or special instructions..."
            multiline
            className="w-full min-h-[80px]"
          />
          <p className="text-xs text-purple-600 mt-1">
            These notes will appear at the bottom of your invoice
          </p>
        </div>
      </div>
    </div>
  );
}