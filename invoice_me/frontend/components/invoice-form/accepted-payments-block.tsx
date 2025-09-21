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
} from "lucide-react";
import { ConfirmationModalWithButton } from "../modals/invoice-form/confirmation-modal-button";
import { EditableInputField } from "../ui/editable-field";
import {
  BasePaymentMethodInfo,
  EFTPaymentInfo,
  CardPaymentInfo,
  InstantEFTPaymentInfo,
  ZapperPaymentInfo,
  SnapScanPaymentInfo,
  PayShapPaymentInfo,
  CashPaymentInfo,
  MobileMoneyPaymentInfo,
} from "@/lib/types/payment-information";
import { useState, useEffect } from "react";

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
      | "vatSettings"
  ) => void;
  updateInvoiceConfig: (section: string, field: string, value: any) => void;
  config: InvoiceConfiguration;
}

function loadAcceptedPaymentMethods(
  config: InvoiceConfiguration
): InvoiceAcceptedPaymentMethods {
  if (config?.accepted_payment_methods) {
    return config.accepted_payment_methods;
  }

  const defaultAcceptedPaymentMethods: InvoiceAcceptedPaymentMethods = {
    accepted_payment_methods: [
      AcceptedPaymentMethods.EFT,
      AcceptedPaymentMethods.CARD_PAYMENTS,
    ],
    payments_method_information: [
      {
        payment_method: AcceptedPaymentMethods.EFT,
        payment_method_info: initPaymentMethodInformation(
          AcceptedPaymentMethods.EFT
        ),
      },
      {
        payment_method: AcceptedPaymentMethods.CARD_PAYMENTS,
        payment_method_info: initPaymentMethodInformation(
          AcceptedPaymentMethods.CARD_PAYMENTS
        ),
      },
    ],
  };

  return defaultAcceptedPaymentMethods;
}

function getPaymentMethodNameAndDescription(method: string) {
  switch (method) {
    case AcceptedPaymentMethods.EFT:
      return {
        name: "EFT",
        description: "Pay instantly online using EFT",
      };
    case AcceptedPaymentMethods.PAYSHAP:
      return {
        name: "PayShap",
        description: "Pay instantly online using PayShap ID",
      };
    case AcceptedPaymentMethods.ZAPPER:
      return {
        name: "Zapper",
        description: "Pay instantly online using Zapper merchant ID",
      };
    case AcceptedPaymentMethods.SNAPSCAN:
      return {
        name: "SnapScan",
        description: "Pay instantly online using SnapScan merchant ID",
      };
    case AcceptedPaymentMethods.MOBILE_MONEY:
      return {
        name: "Mobile Money",
        description: "Pay instantly online using Mobile Money number",
      };
    case AcceptedPaymentMethods.INSTANT_EFT:
      return {
        name: "Instant EFT",
        description: "Pay instantly online using Instant EFT",
      };
    case AcceptedPaymentMethods.CASH:
      return {
        name: "Cash",
        description: "Pay using cash by coming in person",
      };
    case AcceptedPaymentMethods.CARD_PAYMENTS:
      return {
        name: "Card Payment",
        description: "Credit/Debit",
      };
    default:
      return {
        name: "",
        description: "",
      };
  }
}

function initPaymentMethodInformation(method: AcceptedPaymentMethods) {
  const paymentMethod = method;
  const paymentMethodMetaData =
    getPaymentMethodNameAndDescription(paymentMethod);
  const basePaymentMethodInfo: BasePaymentMethodInfo = {
    payment_method: paymentMethod,
    enabled: true,
    information_present: false,
    display_name: paymentMethodMetaData.name,
    description: paymentMethodMetaData.description,
  };

  switch (paymentMethod) {
    case AcceptedPaymentMethods.EFT:
      return {
        ...basePaymentMethodInfo,
        payment_method: AcceptedPaymentMethods.EFT,
        bank_name: "",
        account_holder: "",
        account_number: "",
        branch_code: "",
        swift_code: "",
      } as EFTPaymentInfo;
    case AcceptedPaymentMethods.CARD_PAYMENTS:
      return {
        ...basePaymentMethodInfo,
        payment_method: AcceptedPaymentMethods.CARD_PAYMENTS,
        merchant_id: "",
      } as CardPaymentInfo;
    case AcceptedPaymentMethods.ZAPPER:
      return {
        ...basePaymentMethodInfo,
        payment_method: AcceptedPaymentMethods.ZAPPER,
        merchant_id: "",
        store_id: "",
        qr_code_url: "",
      } as ZapperPaymentInfo;
    case AcceptedPaymentMethods.SNAPSCAN:
      return {
        ...basePaymentMethodInfo,
        payment_method: AcceptedPaymentMethods.SNAPSCAN,
        merchant_id: "",
        store_id: "",
        qr_code_url: "",
      } as SnapScanPaymentInfo;
    case AcceptedPaymentMethods.MOBILE_MONEY:
      return {
        ...basePaymentMethodInfo,
        payment_method: AcceptedPaymentMethods.MOBILE_MONEY,
        provider: "",
        merchant_code: "",
      } as MobileMoneyPaymentInfo;
    case AcceptedPaymentMethods.INSTANT_EFT:
      return {
        ...basePaymentMethodInfo,
        payment_method: AcceptedPaymentMethods.INSTANT_EFT,
        bank_name: "",
        account_holder: "",
        account_number: "",
        branch_code: "",
        swift_code: "",
      } as InstantEFTPaymentInfo;
    case AcceptedPaymentMethods.CASH:
      return {
        ...basePaymentMethodInfo,
        payment_method: AcceptedPaymentMethods.CASH,
      } as CashPaymentInfo;
    default:
      return undefined;
  }
}

function getPaymentMethodIcon(method: AcceptedPaymentMethods) {
  switch (method) {
    case AcceptedPaymentMethods.EFT:
    case AcceptedPaymentMethods.INSTANT_EFT:
      return <Banknote className="h-4 w-4" />;
    case AcceptedPaymentMethods.CARD_PAYMENTS:
      return <CreditCard className="h-4 w-4" />;
    case AcceptedPaymentMethods.SNAPSCAN:
    case AcceptedPaymentMethods.ZAPPER:
      return <QrCode className="h-4 w-4" />;
    case AcceptedPaymentMethods.PAYSHAP:
    case AcceptedPaymentMethods.MOBILE_MONEY:
      return <Smartphone className="h-4 w-4" />;
    case AcceptedPaymentMethods.CASH:
      return <Wallet className="h-4 w-4" />;
    default:
      return <CreditCard className="h-4 w-4" />;
  }
}

function loadPaymentMethodInformation(
  method: AcceptedPaymentMethods,
  componentConfig: InvoiceAcceptedPaymentMethods
) {
  const paymentInformation = componentConfig.payments_method_information.find(
    (info) => info.payment_method === method
  );
  return (
    paymentInformation?.payment_method_info ??
    initPaymentMethodInformation(method)
  );
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

  const formatPaymentMethod = (method: string) =>
    method.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-green-800 flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Payment Information
        </h3>
        <ConfirmationModalWithButton
          modalInformation={{
            modalTitle: "Delete Payment Information",
            modalDescription:
              "Are you sure you want to delete this payment information? This action cannot be undone.",
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
            component: "paymentMethods",
            section: "",
            field: "accepted_payment_methods",
            value: undefined,
          }}
        />
      </div>

      {/* Selected Payment Methods Display */}
      {componentConfig.accepted_payment_methods.length > 0 && (
        <div className="mb-4">
          <label className="text-sm font-medium text-green-800 block mb-2">
            Selected Payment Methods
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {componentConfig.accepted_payment_methods.map((method) => {
              const methodInfo = getPaymentMethodNameAndDescription(method);
              return (
                <div
                  key={method}
                  className="bg-white border border-green-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-green-600">
                      {getPaymentMethodIcon(method)}
                    </div>
                    <h4 className="font-semibold text-sm text-gray-900">
                      {methodInfo.name}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {methodInfo.description}
                  </p>

                  {/* Configuration Status Indicator */}
                  <div className="mt-2 flex items-center gap-1">
                    {componentConfig.payments_method_information.find(
                      (info) => info.payment_method === method
                    )?.payment_method_info?.information_present ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600 font-medium">
                          Configured
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="text-xs text-amber-600 font-medium">
                          Needs Setup
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-green-800 block mb-3">
          How can clients pay you?
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.values(AcceptedPaymentMethods).map((method: AcceptedPaymentMethods) => {
            const isSelected =
              componentConfig.accepted_payment_methods.includes(method);
            const methodInfo = getPaymentMethodNameAndDescription(method);

            return (
              <div
                key={method}
                className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                    : "border-gray-200 bg-white hover:border-green-300 hover:shadow-sm"
                }`}
                onClick={() => {
                  const current = componentConfig.accepted_payment_methods;
                  const updated = isSelected
                    ? current.filter((m) => m !== method)
                    : [...current, method];

                  let updatedPaymentMethodInfo;

                  if (isSelected) {
                    updatedPaymentMethodInfo =
                      componentConfig.payments_method_information.filter(
                        (info) => info.payment_method !== method
                      );
                  } else {
                    const existingInfo =
                      componentConfig.payments_method_information.find(
                        (info) => info.payment_method === method
                      );

                    if (existingInfo) {
                      updatedPaymentMethodInfo =
                        componentConfig.payments_method_information;
                    } else {
                      updatedPaymentMethodInfo = [
                        ...componentConfig.payments_method_information,
                        {
                          payment_method: method,
                          payment_method_info:
                            initPaymentMethodInformation(method),
                        },
                      ];
                    }
                  }

                  const updatedPaymentInfo: InvoiceAcceptedPaymentMethods = {
                    accepted_payment_methods: updated,
                    payments_method_information: updatedPaymentMethodInfo,
                  };

                  updateComponentConfig(updatedPaymentInfo);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`${
                          isSelected ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        {getPaymentMethodIcon(method)}
                      </div>
                      <h4 className="font-medium text-sm text-gray-900">
                        {methodInfo.name}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {methodInfo.description}
                    </p>
                  </div>
                  <div className="ml-2 mt-1">
                    {isSelected ? (
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
