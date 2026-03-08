"use client";

import { AcceptedPaymentMethods } from "@/lib/enums/invoicing";
import {
  InvoiceConfiguration,
  InvoiceAcceptedPaymentMethods,
} from "@/lib/types/invoicing";
import {
  CreditCard,
  X,
  Banknote,
  QrCode,
  Smartphone,
  Wallet,
  Check,
} from "lucide-react";
import { ConfirmationModalWithButton } from "../modals/invoice-form/confirmation-modal-button";
import React, { useState, useEffect } from "react";
import { AcceptedPaymentMethodInformationModal } from "../modals/invoice-form/accepted-payment-method-information-modal";
import { loadAcceptedPaymentMethods, initPaymentMethodInformation, getPaymentMethodNameAndDescription } from "@/lib/utility/invoicing/utils";

interface AcceptedPaymentsBlockProps {
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
  config: InvoiceConfiguration;
}

function getPaymentMethodIcon(method: AcceptedPaymentMethods): React.ReactNode {
  switch (method) {
    case AcceptedPaymentMethods.EFT:
    case AcceptedPaymentMethods.INSTANT_EFT:
      return <Banknote className="h-3.5 w-3.5" />;
    case AcceptedPaymentMethods.CARD_PAYMENTS:
      return <CreditCard className="h-3.5 w-3.5" />;
    case AcceptedPaymentMethods.SNAPSCAN:
    case AcceptedPaymentMethods.ZAPPER:
      return <QrCode className="h-3.5 w-3.5" />;
    case AcceptedPaymentMethods.PAYSHAP:
    case AcceptedPaymentMethods.MOBILE_MONEY:
      return <Smartphone className="h-3.5 w-3.5" />;
    case AcceptedPaymentMethods.CASH:
      return <Wallet className="h-3.5 w-3.5" />;
    default:
      return <CreditCard className="h-3.5 w-3.5" />;
  }
}

export function AcceptedPaymentsBlock({
  toggleComponent,
  updateInvoiceConfig,
  config,
}: AcceptedPaymentsBlockProps) {
  const [componentConfig, setComponentConfig] =
    useState<InvoiceAcceptedPaymentMethods>(loadAcceptedPaymentMethods(config));

  useEffect(() => {
    if (!config.accepted_payment_methods) {
      const defaultTerms = loadAcceptedPaymentMethods(config);
      updateInvoiceConfig("", "accepted_payment_methods", defaultTerms);
    }
  }, [config.accepted_payment_methods, updateInvoiceConfig]);

  const updateComponentConfig = (
    updatedComponentConfig: InvoiceAcceptedPaymentMethods
  ) => {
    setComponentConfig(updatedComponentConfig);
    updateInvoiceConfig("", "accepted_payment_methods", updatedComponentConfig);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[1.5rem] p-5 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <CreditCard className="h-3.5 w-3.5 text-slate-900" />
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Settlement Channels
          </h3>
        </div>
        <ConfirmationModalWithButton
          modalInformation={{
            modalTitle: "Delete Payment Information",
            modalDescription: "Are you sure you want to delete this payment information? This action cannot be undone.",
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
            component: "paymentMethods",
            section: "",
            field: "accepted_payment_methods",
            value: undefined,
          }}
        />
      </div>

      {/* Selected Payment Methods Display - TIGHTER TILES */}
      {componentConfig.accepted_payment_methods.length > 0 && (
        <div className="mb-6">
          <label className="text-[9px] font-black text-slate-900 uppercase tracking-widest block mb-2 px-1">
            Active Gateways
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {componentConfig.accepted_payment_methods.map((method) => {
              const methodInfo = getPaymentMethodNameAndDescription(method);
              const paymentInfo = componentConfig.payments_method_information.find(
                (info) => info.payment_method === method
              )?.payment_method_info;
              const isConfigured = componentConfig.payments_method_information.find(
                (info) => info.payment_method === method
              )?.payment_method_info?.information_present;

              return (
                <AcceptedPaymentMethodInformationModal
                  key={method}
                  paymentMethod={method}
                  initialData={paymentInfo || initPaymentMethodInformation(method)!}
                  updateComponentConfig={updateComponentConfig}
                  componentConfig={componentConfig}
                >
                  <div className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-full ${
                    isConfigured ? "bg-slate-900 border-slate-900 shadow-md" : "bg-white border-slate-100 shadow-sm hover:border-slate-300"
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={isConfigured ? "text-white" : "text-slate-400"}>
                        {getPaymentMethodIcon(method)}
                      </div>
                      <h4 className={`font-black text-[10px] uppercase tracking-tight ${isConfigured ? "text-white" : "text-slate-900"}`}>
                        {methodInfo.name}
                      </h4>
                    </div>
                    
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${isConfigured ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}></div>
                      <span className={`text-[8px] font-black uppercase tracking-widest ${isConfigured ? "text-emerald-400" : "text-amber-500"}`}>
                        {isConfigured ? "Vault Ready" : "Setup Required"}
                      </span>
                    </div>
                  </div>
                </AcceptedPaymentMethodInformationModal>
              );
            })}
          </div>
        </div>
      )}

      {/* SELECTION GRID - HIGH DENSITY */}
      <div>
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-3 px-1">
          Available Protocols
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.values(AcceptedPaymentMethods).map((method: AcceptedPaymentMethods) => {
            const isSelected = componentConfig.accepted_payment_methods.includes(method);
            const methodInfo = getPaymentMethodNameAndDescription(method);

            return (
              <div
                key={method}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected 
                    ? "border-slate-900 bg-slate-50 shadow-inner" 
                    : "border-slate-100 bg-white hover:border-slate-300"
                }`}
                onClick={() => {
                  const current = componentConfig.accepted_payment_methods;
                  const updated = isSelected ? current.filter((m) => m !== method) : [...current, method];
                  let updatedPaymentMethodInfo;

                  if (isSelected) {
                    updatedPaymentMethodInfo = componentConfig.payments_method_information.filter(
                      (info) => info.payment_method !== method
                    );
                  } else {
                    const existingInfo = componentConfig.payments_method_information.find(
                      (info) => info.payment_method === method
                    );
                    updatedPaymentMethodInfo = existingInfo ? componentConfig.payments_method_information : [
                      ...componentConfig.payments_method_information,
                      { payment_method: method, payment_method_info: initPaymentMethodInformation(method) }
                    ];
                  }

                  updateComponentConfig({
                    accepted_payment_methods: updated,
                    payments_method_information: updatedPaymentMethodInfo,
                  });
                }}
              >
                <div className="flex items-center gap-2">
                  <div className={isSelected ? "text-slate-900" : "text-slate-300"}>
                    {getPaymentMethodIcon(method)}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-tight ${isSelected ? "text-slate-900" : "text-slate-400"}`}>
                    {methodInfo.name}
                  </span>
                </div>
                {isSelected ? (
                  <div className="w-4 h-4 bg-slate-900 rounded-lg flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white stroke-[4]" />
                  </div>
                ) : (
                  <div className="w-4 h-4 border-2 border-slate-100 rounded-lg group-hover:border-slate-200"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}