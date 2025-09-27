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
} from "lucide-react";
import { ConfirmationModalWithButton } from "../modals/invoice-form/confirmation-modal-button";
import { EditableInputField } from "../ui/editable-field";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CollectionSettings } from "@/lib/types/collections";

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

function loadInvoiceConfigurationSettings(
  config: InvoiceConfiguration
): InvoiceConfigurationSettings {
  const enable_collections_service =
    config?.invoice_settings?.enable_collections_service ?? false;
  const collection_service_settings =
    config?.invoice_settings?.collection_service_settings ??
    ({
      enabled: false,
      reminder_schedule: [-7, -3, 0, 3, 7, 14], // Days relative to due date
      whatsapp_enabled: true,
      email_enabled: false,
      sms_enabled: false,
      escalation_enabled: true,
      escalation_days: 30,
    } as CollectionSettings);
  return {
    enable_collections_service: enable_collections_service,
    collection_service_settings: collection_service_settings,
  } as InvoiceConfigurationSettings;
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
    <div className="bg-slate-50 border border-slate-300 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-700 flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Invoice Settings
        </h3>
        <ConfirmationModalWithButton
          modalInformation={{
            modalTitle: "Close Invoice Settings",
            modalDescription:
              "Are you sure you want to close the invoice settings? Your changes will be saved.",
          }}
          buttonInformation={{
            buttonText: "Close",
            buttonIcon: <X className="h-4 w-4" />,
            buttonVariant: "ghost",
            buttonSize: "sm",
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

      <div className="space-y-6">
        {/* Collection Service Configuration */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Enable Collection Service
              </label>
              <p className="text-xs text-slate-600">
                Let SisoNova handle payment reminders and collections for you
              </p>
            </div>
            <Switch
              checked={componentConfig.enable_collections_service}
              onCheckedChange={(val) =>
                updateComponentConfig("", "enable_collections_service", val)
              }
            />
          </div>

          {componentConfig.enable_collections_service && (
            <div className="space-y-6 ml-4">
              {/* Communication Channels */}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-3">
                  Communication Channels:
                </label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">
                        WhatsApp
                      </span>
                    </div>
                    <Switch
                      checked={
                        componentConfig.collection_service_settings
                          .whatsapp_enabled
                      }
                      onCheckedChange={(val) =>
                        updateComponentConfig(
                          "collection_service_settings",
                          "whatsapp_enabled",
                          val
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">
                        Email
                      </span>
                    </div>
                    <Switch
                      checked={
                        componentConfig.collection_service_settings
                          .email_enabled
                      }
                      onCheckedChange={(val) =>
                        updateComponentConfig(
                          "collection_service_settings",
                          "email_enabled",
                          val
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">
                        SMS
                      </span>
                    </div>
                    <Switch
                      checked={
                        componentConfig.collection_service_settings.sms_enabled
                      }
                      onCheckedChange={(val) =>
                        updateComponentConfig(
                          "collection_service_settings",
                          "sms_enabled",
                          val
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Reminder Schedule - Improved UI */}
              <div className="border-t border-slate-200 pt-4">
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  Reminder Schedule:
                </label>
                <p className="text-xs text-slate-600 mb-4">
                  Set reminder days relative to due date (negative = before due,
                  positive = after due)
                </p>

                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(
                      componentConfig?.collection_service_settings
                        ?.reminder_schedule || []
                    ).map((day, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-slate-100 rounded-md px-2 py-1 text-sm"
                      >
                        <EditableInputField
                          value={day}
                          type="number"
                          onEdit={(value) =>
                            updateReminderSchedule(index, Number(value) || 0)
                          }
                          placeholder="0"
                          className="w-12 text-center text-xs bg-transparent border-none p-0"
                        />
                        <span className="text-xs text-slate-600">days</span>
                        {(componentConfig?.collection_service_settings
                          ?.reminder_schedule?.length || 0) > 1 && (
                          <button
                            onClick={() => removeReminderDay(index)}
                            className="ml-1 text-red-500 hover:text-red-700 p-0.5"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={addReminderDay}
                    variant="outline"
                    size="sm"
                    className="text-slate-600 border-slate-300 hover:bg-slate-50"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Day
                  </Button>
                </div>
              </div>

              {/* Escalation Settings */}
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">
                    Enable Escalation:
                  </label>
                  <Switch
                    checked={
                      componentConfig.collection_service_settings
                        .escalation_enabled
                    }
                    onCheckedChange={(val) =>
                      updateComponentConfig(
                        "collection_service_settings",
                        "escalation_enabled",
                        val
                      )
                    }
                  />
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Escalate to more intensive collection methods
                </p>

                {componentConfig.collection_service_settings
                  .escalation_enabled && (
                  <div className="bg-white p-3 rounded border border-slate-200 ml-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-600 block mb-1">
                          Escalation After:
                        </label>
                        <EditableInputField
                          value={
                            componentConfig.collection_service_settings
                              .escalation_days
                          }
                          type="number"
                          onEdit={(value) =>
                            updateComponentConfig(
                              "collection_service_settings",
                              "escalation_days",
                              Number(value) || 30
                            )
                          }
                          placeholder="30"
                        />
                      </div>
                      <div className="flex items-end">
                        <span className="text-xs text-slate-600 pb-2">
                          days after due date
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
