"use client";

import {
  InvoiceConfiguration,
  InvoiceConfigurationSettings,
} from "@/lib/types/invoicing";
import {
  Settings,
  X,
  MessageCircle,
  Mail,
  Phone,
  Plus,
  Trash2,
  Zap,
} from "lucide-react";
import { ConfirmationModalWithButton } from "../modals/invoice-form/confirmation-modal-button";
import { EditableInputField } from "../ui/editable-field";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { loadInvoiceConfigurationSettings } from "@/lib/utility/invoicing/utils";

interface InvoiceSettingsBlockProps {
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

export function InvoiceSettingsBlock({
  config,
  toggleComponent,
  updateInvoiceConfig,
}: InvoiceSettingsBlockProps) {
  const [componentConfig, setComponentConfig] =
    useState<InvoiceConfigurationSettings>(
      loadInvoiceConfigurationSettings(config)
    );

  useEffect(() => {
    if (!config.invoice_settings) {
      const defaultSettings = loadInvoiceConfigurationSettings(config);
      updateInvoiceConfig("", "invoice_settings", defaultSettings);
    }
  }, [config.invoice_settings, updateInvoiceConfig]);

  const updateComponentConfig = (
    section: string,
    field: string,
    value: any
  ) => {
    let updatedConfig;
    switch (section) {
      case "collection_service_settings":
        updatedConfig = {
          ...componentConfig,
          collection_service_settings: {
            ...componentConfig.collection_service_settings,
            [field]: value,
          },
        };
        setComponentConfig(updatedConfig);
        updateInvoiceConfig("", "invoice_settings", updatedConfig);
        break;
      default:
        updatedConfig = {
          ...componentConfig,
          [field]: value,
        };
        setComponentConfig(updatedConfig);
        updateInvoiceConfig("", "invoice_settings", updatedConfig);
    }
  };

  const addReminderDay = () => {
    const currentSchedule =
      componentConfig?.collection_service_settings?.reminder_schedule || [];
    const newSchedule = [...currentSchedule, 0];
    updateComponentConfig(
      "collection_service_settings",
      "reminder_schedule",
      newSchedule
    );
  };

  const removeReminderDay = (index: number) => {
    const currentSchedule =
      componentConfig?.collection_service_settings?.reminder_schedule || [];
    const newSchedule = currentSchedule.filter((_, i) => i !== index);
    updateComponentConfig(
      "collection_service_settings",
      "reminder_schedule",
      newSchedule
    );
  };

  const updateReminderSchedule = (index: number, value: number) => {
    const currentSchedule =
      componentConfig?.collection_service_settings?.reminder_schedule || [];
    const newSchedule = [...currentSchedule];
    newSchedule[index] = value;
    updateComponentConfig(
      "collection_service_settings",
      "reminder_schedule",
      newSchedule
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[1.5rem] p-5 shadow-sm">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <Settings className="h-3.5 w-3.5 text-slate-900" />
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            System Settings
          </h3>
        </div>
        <ConfirmationModalWithButton
          modalInformation={{
            modalTitle: "Close Invoice Settings",
            modalDescription: "Are you sure you want to close the invoice settings? Your changes will be saved.",
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
            component: "invoiceSettings",
            section: "",
            field: "invoice_settings",
            value: undefined,
          }}
        />
      </div>

      <div className="space-y-4">
        {/* PRIMARY TOGGLE BLOCK */}
        <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl shadow-lg">
          <div className="space-y-0.5">
            <label className="text-[10px] font-black text-white uppercase tracking-tight">
              Collection Service
            </label>
            <p className="text-[8px] font-bold text-slate-400 uppercase leading-none">
              Automated Payment Recovery Protocol
            </p>
          </div>
          <Switch
            checked={componentConfig.enable_collections_service}
            onCheckedChange={(val) => updateComponentConfig("", "enable_collections_service", val)}
            className="scale-75 data-[state=checked]:bg-emerald-500"
          />
        </div>

        {componentConfig.enable_collections_service && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
            {/* CHANNELS GRID */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "WhatsApp", icon: MessageCircle, field: "whatsapp_enabled" },
                { label: "Email", icon: Mail, field: "email_enabled" },
                { label: "SMS", icon: Phone, field: "sms_enabled" },
              ].map((channel) => (
                <div key={channel.field} className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl flex flex-col items-center gap-2">
                  <channel.icon className="h-3 w-3 text-slate-400" />
                  <span className="text-[8px] font-black text-slate-500 uppercase">{channel.label}</span>
                  <Switch
                    checked={(componentConfig.collection_service_settings as any)[channel.field]}
                    onCheckedChange={(val) => updateComponentConfig("collection_service_settings", channel.field, val)}
                    className="scale-50 data-[state=checked]:bg-slate-900"
                  />
                </div>
              ))}
            </div>

            {/* REMINDER SCHEDULE - HIGH DENSITY */}
            <div className="p-4 bg-white border border-slate-100 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black text-slate-900 uppercase tracking-widest">
                  Reminder Cadence
                </label>
                <Button
                  onClick={addReminderDay}
                  variant="ghost"
                  size="sm"
                  className="h-6 text-[8px] font-black text-slate-900 uppercase hover:bg-slate-50 px-2"
                >
                  <Plus className="h-2.5 w-2.5 mr-1" /> Add Phase
                </Button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(componentConfig?.collection_service_settings?.reminder_schedule || []).map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1.5 bg-slate-900 text-white rounded-lg px-2 py-1 transition-all"
                  >
                    <EditableInputField
                      value={day}
                      type="number"
                      onEdit={(v) => updateReminderSchedule(index, Number(v) || 0)}
                      className="w-6 text-center text-[10px] font-bold bg-transparent p-0 border-none text-white focus:ring-0"
                    />
                    <span className="text-[8px] font-black uppercase opacity-50">D</span>
                    <button
                      onClick={() => removeReminderDay(index)}
                      className="ml-1 text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ESCALATION BLOCK - COMPACT */}
            <div className="p-4 bg-rose-50/30 border border-rose-100 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-[9px] font-black text-rose-900 uppercase tracking-tight">
                    Critical Escalation
                  </label>
                  <p className="text-[8px] font-bold text-rose-400 uppercase">Intensive Recovery Mode</p>
                </div>
                <Switch
                  checked={componentConfig.collection_service_settings.escalation_enabled}
                  onCheckedChange={(val) => updateComponentConfig("collection_service_settings", "escalation_enabled", val)}
                  className="scale-75 data-[state=checked]:bg-rose-500"
                />
              </div>

              {componentConfig.collection_service_settings.escalation_enabled && (
                <div className="flex items-center gap-3 bg-white/50 p-2.5 rounded-lg border border-rose-100/50">
                  <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest">Trigger After:</span>
                  <EditableInputField
                    value={componentConfig.collection_service_settings.escalation_days}
                    type="number"
                    onEdit={(v) => updateComponentConfig("collection_service_settings", "escalation_days", Number(v) || 30)}
                    className="text-[10px] font-bold text-rose-700 w-10 text-center"
                  />
                  <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest">Days Post-Due</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}