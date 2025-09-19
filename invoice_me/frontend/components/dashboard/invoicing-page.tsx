// components/dashboard/invoicing-page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EditableInputField } from "../ui/editable-field";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BusinessProfile,
  ClientDetails,
  InvoiceItem,
  CreditTerms,
  PaymentConfiguration,
  InvoiceConfiguration,
} from "@/lib/types/invoicing";
import {
  Plus,
  Trash2,
  Eye,
  Download,
  Send,
  FileText,
  Calculator,
  Building,
  User,
  CreditCard,
  Settings,
  Smartphone,
  Clock,
  AlertTriangle,
  Percent,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  Edit,
  Save,
  X,
  MoreHorizontal,
  PlusCircle,
  FileX,
  Banknote,
  Receipt,
  MessageSquare,
  Shield,
  Zap,
} from "lucide-react";
import { ExpandedBusinessDetailsBlock } from "../invoice-form/expanded-business-details-block";

// Enhanced dummy data (same as before)
const defaultBusinessProfile: BusinessProfile = {
  company_name: "SisoNova Solutions (Pty) Ltd",
  trading_name: "SisoNova",
  address_line_1: "123 Business Park Drive",
  address_line_2: "Suite 456",
  city: "Cape Town",
  province: "Western Cape",
  postal_code: "8001",
  vat_number: "4123456789",
  company_registration: "2023/123456/07",
  email: "billing@SisoNova.co.za",
  phone: "+27 21 123 4567",
  website: "www.SisoNova.co.za",
  industry: "consulting",
};

const defaultClientDetails: ClientDetails = {
  company_name: "Ridgeway Butchery",
  contact_person: "John Smith",
  email: "accounts@ridgewaybutchery.co.za",
  phone: "+27 11 987 6543",
  address_line_1: "789 Main Street",
  city: "Johannesburg",
  province: "Gauteng",
  postal_code: "2000",
  vat_number: "4987654321",
  purchase_order_number: "PO123",
  credit_limit_enabled: false,
};

const defaultCreditTerms: CreditTerms = {
  payment_terms_type: "net_30",
  payment_due_days: 30,
  late_fee_enabled: false,
  late_fee_type: "percentage",
  late_fee_amount: 2.0,
  late_fee_frequency: "monthly",
  early_discount_enabled: false,
  early_discount_days: 10,
  early_discount_percentage: 2.0,
  credit_limit_enabled: false,
  dispute_period_days: 7,
  retention_enabled: false,
};

const defaultPaymentConfig: PaymentConfiguration = {
  bank_name: "First National Bank",
  account_holder: "SisoNova Solutions (Pty) Ltd",
  account_number: "62123456789",
  branch_code: "250655",
  swift_code: "FIRNZAJJ",
  enable_instant_eft: true,
  enable_payshap: true,
  enable_snapscan: true,
  enable_zapper: false,
  enable_mobile_money: true,
  enable_bank_transfer: true,
  enable_card_payments: false,
  reference_prefix: "INV",
  include_company_code: true,
  include_date: false,
};

export function InvoicingPage() {
  const generateInvoiceNumber = () => {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `INV-${year}${month}${day}-001`;
  };

  const [config, setConfig] = useState<InvoiceConfiguration>({
    invoice_number: generateInvoiceNumber(),
    invoice_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    business_profile: defaultBusinessProfile,
    client_details: defaultClientDetails,
    items: [
      {
        id: "1",
        title: "Professional Services",
        description: "Consulting and advisory services",
        category: "Consulting",
        sku: "CONS-001",
        quantity: 10,
        unit: "hours",
        unit_price: 1500,
        discount_percentage: 0,
      },
    ],
    include_vat: true,
    vat_rate: 0.15,
    global_discount_enabled: false,
    global_discount_percentage: 0,
    credit_terms: defaultCreditTerms,
    payment_config: defaultPaymentConfig,
    currency: "ZAR",
    notes: "",
  });

  // Component visibility states
  const [showComponents, setShowComponents] = useState({
    paymentTerms: false,
    paymentMethods: false,
    notes: false,
    lateFees: false,
    earlyDiscount: false,
    clientAddress: false,
    businessDetails: false,
    vatSettings: true, // VAT is common enough to show by default
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<any>("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Calculate totals (same as before)
  const calculateTotals = () => {
    const subtotal = config.items.reduce((sum, item) => {
      const lineTotal = item.quantity * item.unit_price;
      const discountAmount = lineTotal * (item.discount_percentage / 100);
      return sum + (lineTotal - discountAmount);
    }, 0);

    const globalDiscountAmount = config.global_discount_enabled
      ? subtotal * (config.global_discount_percentage / 100)
      : 0;

    const taxableAmount = subtotal - globalDiscountAmount;
    const vatAmount = config.include_vat ? taxableAmount * config.vat_rate : 0;
    const total = taxableAmount + vatAmount;

    return { subtotal, globalDiscountAmount, vatAmount, total };
  };

  const { subtotal, globalDiscountAmount, vatAmount, total } =
    calculateTotals();

  // Toggle component visibility
  const toggleComponent = (component: keyof typeof showComponents) => {
    setShowComponents((prev) => ({
      ...prev,
      [component]: !prev[component],
    }));
  };

  // Inline editing functions (same as before)
  const startEditing = (field: string, currentValue: any) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const updateInvoiceConfig = (section: string, field: string, value: any) => {

    switch (section) {
      case "business_profile":
        setConfig((prev: InvoiceConfiguration) => ({
          ...prev,
          business_profile: {
            ...prev.business_profile,
            [field]: value,
          },
      }))
      break;

      case "client_details":
        setConfig((prev: InvoiceConfiguration) => ({
          ...prev,
          client_details: {
            ...prev.client_details,
            [field]: value,
          },
      }))
      break;

      case "invoice_items":
        setConfig((prev: InvoiceConfiguration) => ({
          ...prev,
          items: prev.items.map((item) => {
            if (item.id === field) {
              return {
                ...item,
                [field]: value,
              };
            }
            return item;
          }),
        }))

      default:
        setConfig((prev) => ({ ...prev, [field]: value }));
    }
  }

  const saveEdit = (field: string, value: any) => {
    const fieldParts = field.split(".");

    if (fieldParts.length === 2) {
      const [section, key] = fieldParts;

      switch (section) {
        case "business_profile":
          setConfig((prev) => ({
            ...prev,
            business_profile: {
              ...prev.business_profile,
              [key]: value,
            },
          }));
          break;

        case "client_details":
          setConfig((prev) => ({
            ...prev,
            client_details: {
              ...prev.client_details,
              [key]: value,
            },
          }));
          break;

        case "credit_terms":
          setConfig((prev) => ({
            ...prev,
            credit_terms: {
              ...prev.credit_terms,
              [key]: value,
            },
          }));
          break;

        case "payment_config":
          setConfig((prev) => ({
            ...prev,
            payment_config: {
              ...prev.payment_config,
              [key]: value,
            },
          }));
          break;

        default:
          setConfig((prev) => ({ ...prev, [field]: value }));
      }
    } else if (fieldParts.length === 3 && fieldParts[0] === "items") {
      const [, itemId, key] = fieldParts;
      setConfig((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === itemId ? { ...item, [key]: value } : item
        ),
      }));
    } else {
      setConfig((prev) => ({ ...prev, [field]: value }));
    }

    setEditingField(null);
    setTempValue("");
  };

  const cancelEdit = () => {
    setEditingField(null);
    setTempValue("");
  };

  // Add new item
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      title: "New Item",
      description: "",
      quantity: 1,
      unit: "each",
      unit_price: 0,
      discount_percentage: 0,
    };
    setConfig((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  // Remove item
  const removeItem = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  // Generate PDF
  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      console.log("Generating PDF with config:", config);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("PDF generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Editable field component (same as before but simplified)
  const EditableField = ({
    field,
    value,
    type = "text",
    className = "",
    placeholder = "Click to edit",
    multiline = false,
    selectOptions = null,
    displayValue = null,
  }: {
    field: string;
    value: any;
    type?: string;
    className?: string;
    placeholder?: string;
    multiline?: boolean;
    selectOptions?: string[] | null;
    displayValue?: string | null;
  }) => {
    const isEditing = editingField === field;
    const displayText = displayValue || value;

    if (isEditing) {
      return (
        <div className="flex items-center gap-2 min-w-0">
          {selectOptions ? (
            <Select value={tempValue} onValueChange={setTempValue}>
              <SelectTrigger className={`${className} min-w-[120px]`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {selectOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : multiline ? (
            <Textarea
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className={`${className} min-h-[60px] resize-none`}
              placeholder={placeholder}
              autoFocus
            />
          ) : (
            <Input
              type={type}
              value={tempValue}
              onChange={(e) =>
                setTempValue(
                  type === "number"
                    ? parseFloat(e.target.value) || 0
                    : e.target.value
                )
              }
              className={`${className} min-w-0`}
              placeholder={placeholder}
              autoFocus
            />
          )}
          <div className="flex gap-1 flex-shrink-0">
            <Button
              size="sm"
              onClick={() => saveEdit(field, tempValue)}
              className="h-8 w-8 p-0"
            >
              <Save className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={cancelEdit}
              className="h-8 w-8 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`${className} cursor-pointer hover:bg-blue-50 hover:border-blue-200 border border-transparent rounded px-2 py-1 transition-colors group inline-flex items-center gap-1 min-w-0`}
        onClick={() => startEditing(field, value)}
        title="Click to edit"
      >
        <span className="truncate">
          {displayText || (
            <span className="text-slate-400 italic">{placeholder}</span>
          )}
        </span>
        <Edit className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </div>
    );
  };

  // Component add buttons
  const AddComponentButtons = () => (
    <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
      <p className="w-full text-sm text-slate-600 mb-2">
        Add optional components to your invoice:
      </p>

      {!showComponents.paymentTerms && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleComponent("paymentTerms")}
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <Clock className="h-4 w-4 mr-2" />
          Payment Terms
        </Button>
      )}

      {!showComponents.paymentMethods && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleComponent("paymentMethods")}
          className="text-green-600 border-green-200 hover:bg-green-50"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Payment Methods
        </Button>
      )}

      {!showComponents.notes && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleComponent("notes")}
          className="text-purple-600 border-purple-200 hover:bg-purple-50"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Notes
        </Button>
      )}

      {!showComponents.lateFees && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            toggleComponent("lateFees");
            setConfig((prev) => ({
              ...prev,
              credit_terms: { ...prev.credit_terms, late_fee_enabled: true },
            }));
          }}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Late Fees
        </Button>
      )}

      {!showComponents.earlyDiscount && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            toggleComponent("earlyDiscount");
            setConfig((prev) => ({
              ...prev,
              credit_terms: {
                ...prev.credit_terms,
                early_discount_enabled: true,
              },
            }));
          }}
          className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
        >
          <Percent className="h-4 w-4 mr-2" />
          Early Discount
        </Button>
      )}

      {!showComponents.clientAddress && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleComponent("clientAddress")}
          className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
        >
          <Building className="h-4 w-4 mr-2" />
          Client Address
        </Button>
      )}

      {!showComponents.businessDetails && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleComponent("businessDetails")}
          className="text-slate-600 border-slate-200 hover:bg-slate-50"
        >
          <FileText className="h-4 w-4 mr-2" />
          Business Details
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Zap className="h-8 w-8 text-purple-600" />
                Smart Invoice Builder
              </h1>
              <p className="text-slate-600">
                Start with the basics, add what you need
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={generatePDF}
                disabled={isGenerating}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? (
                  "Generating..."
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Generate PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Interactive Invoice */}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-blue-600 pb-4">
                <div>
                  <h1 className="text-3xl font-bold text-blue-600 mb-2">
                    INVOICE
                  </h1>
                  <EditableInputField
                    value={config.business_profile.company_name}
                    placeholder="Your Company Name"
                    className="text-lg font-semibold"
                    onEdit={(value) => {
                      updateInvoiceConfig(
                        "business_profile",
                        "company_name",
                        value
                      );
                    }}
                  />
                </div>
                <div className="text-right">
                  <div className="bg-slate-50 p-4 rounded border-l-4 border-blue-600">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Invoice #:</span>
                        <EditableInputField
                          value={config.invoice_number}
                          placeholder="INV-001"
                          className="font-mono"
                          onEdit={(value) => {
                            updateInvoiceConfig("", "invoice_number", value);
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Date:</span>
                        <EditableInputField
                          value={config.invoice_date}
                          type="date"
                          onEdit={(value) => {
                            updateInvoiceConfig("", "invoice_date", value);
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Due:</span>
                        <EditableInputField
                          value={config.due_date}
                          type="date"
                          onEdit={(value) => {
                            updateInvoiceConfig("", "due_date", value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-2 gap-8">
                {/* Bill From - Essential */}
                <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <h3 className="font-bold text-blue-600 mb-3 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    BILL FROM
                  </h3>
                  <div className="space-y-2">
                    <EditableInputField
                      value={config.business_profile.company_name}
                      placeholder="Your Company Name"
                      className="font-bold text-base"
                      onEdit={(value) => {
                        updateInvoiceConfig(
                          "business_profile",
                          "company_name",
                          value
                        );
                      }}
                    />
                    {/* Essential Contact Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-slate-500" />
                        <EditableInputField
                          value={config.business_profile.email}
                          type="email"
                          placeholder="your@email.com"
                          onEdit={(value) => {
                            updateInvoiceConfig(
                              "business_profile",
                              "email",
                              value
                            );
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-slate-500" />
                        <EditableInputField
                          value={config.business_profile.phone}
                          placeholder="+27 11 123 4567"
                          onEdit={(value) => {
                            updateInvoiceConfig(
                              "business_profile",
                              "phone",
                              value
                            );
                          }}
                          className="text-sm"
                        />
                      </div>
                    </div>

                    {/* Extended Business Details */}
                    {showComponents.businessDetails && (
                      <ExpandedBusinessDetailsBlock
                        toggleComponent={toggleComponent}
                        businessType="buyer"
                        config={config}
                        updateInvoiceConfig={updateInvoiceConfig}
                      />
                    )}
                  </div>
                </div>

                {/* Bill To - Essential */}
                <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <h3 className="font-bold text-blue-600 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    BILL TO
                  </h3>
                  <div className="space-y-2">
                    <EditableInputField
                      value={config.client_details.company_name}
                      placeholder="Client Company Name"
                      onEdit={(value) => {
                        updateInvoiceConfig(
                          "client_details",
                          "company_name",
                          value
                        );
                      }}
                      className="font-bold text-base"
                    />

                    {/* Essential Contact Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-slate-500" />
                        <EditableInputField
                          value={config.client_details.email}
                          placeholder="client@email.com"
                          onEdit={(value) => {
                            updateInvoiceConfig(
                              "client_details",
                              "email",
                              value
                            );
                          }}
                          className="text-sm"
                          type="email"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-slate-500" />
                        <EditableInputField
                          value={config.client_details.phone}
                          placeholder="+27 11 123 4567"
                          className="text-sm"
                          onEdit={(value) => {
                            updateInvoiceConfig(
                              "client_details",
                              "phone",
                              value
                            );
                          }}
                        />
                      </div>
                    </div>

                    {/* Extended Client Details */}
                    {showComponents.clientAddress && (
                      <ExpandedBusinessDetailsBlock
                        toggleComponent={toggleComponent}
                        businessType="seller"
                        config={config}
                        updateInvoiceConfig={updateInvoiceConfig}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Items Table - Essential */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-blue-600 text-white p-3 flex items-center justify-between">
                  <h3 className="font-bold flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Invoice Items
                  </h3>
                  <Button
                    onClick={addItem}
                    size="sm"
                    variant="secondary"
                    className="bg-white text-blue-600 hover:bg-blue-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                <table className="w-full">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="text-left p-3 font-medium">Description</th>
                      <th className="text-center p-3 font-medium w-20">Qty</th>
                      <th className="text-center p-3 font-medium w-20">Unit</th>
                      <th className="text-right p-3 font-medium w-32">Rate</th>
                      <th className="text-right p-3 font-medium w-32">
                        Amount
                      </th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {config.items.map((item, index) => {
                      const lineTotal =
                        item.quantity *
                        item.unit_price *
                        (1 - item.discount_percentage / 100);
                      return (
                        <tr
                          key={item.id}
                          className="border-b hover:bg-slate-50"
                        >
                          <td className="p-3">
                            <div className="space-y-1">
                              <EditableField
                                field={`items.${item.id}.title`}
                                value={item.title}
                                className="font-medium block w-full"
                                placeholder="Item title"
                              />
                              <EditableField
                                field={`items.${item.id}.description`}
                                value={item.description}
                                className="text-sm text-slate-600 block w-full"
                                placeholder="Description (optional)"
                                multiline
                              />
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <EditableField
                              field={`items.${item.id}.quantity`}
                              value={item.quantity}
                              type="number"
                              className="w-16 text-center"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <EditableField
                              field={`items.${item.id}.unit`}
                              value={item.unit}
                              selectOptions={[
                                "each",
                                "hours",
                                "days",
                                "kg",
                                "m",
                                "m2",
                              ]}
                              className="w-16 text-center"
                            />
                          </td>
                          <td className="p-3 text-right">
                            R
                            <EditableField
                              field={`items.${item.id}.unit_price`}
                              value={item.unit_price}
                              type="number"
                              className="w-24 text-right"
                            />
                          </td>
                          <td className="p-3 text-right font-medium">
                            R
                            {lineTotal.toLocaleString("en-ZA", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td className="p-3">
                            {config.items.length > 1 && (
                              <Button
                                onClick={() => removeItem(item.id)}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Totals - Essential */}
              <div className="flex justify-end">
                <div className="w-80 space-y-2">
                  <div className="flex justify-between py-2">
                    <span className="font-medium">Subtotal:</span>
                    <span className="font-medium">
                      R
                      {subtotal.toLocaleString("en-ZA", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  {globalDiscountAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>
                        Discount ({config.global_discount_percentage}%):
                      </span>
                      <span>
                        -R
                        {globalDiscountAmount.toLocaleString("en-ZA", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}

                  {/* VAT Toggle - Common enough to show by default */}
                  {showComponents.vatSettings && (
                    <div className="flex justify-between items-center py-2 border-t">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={config.include_vat}
                          onCheckedChange={(checked) =>
                            setConfig((prev) => ({
                              ...prev,
                              include_vat: checked,
                            }))
                          }
                        />
                        <span className="font-medium">
                          VAT ({(config.vat_rate * 100).toFixed(0)}%):
                        </span>
                      </div>
                      <span className="font-medium">
                        {config.include_vat
                          ? `R${vatAmount.toLocaleString("en-ZA", {
                              minimumFractionDigits: 2,
                            })}`
                          : "R0.00"}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between py-3 bg-blue-600 text-white px-4 rounded font-bold text-lg">
                    <span>TOTAL:</span>
                    <span>
                      R
                      {total.toLocaleString("en-ZA", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Terms - Optional */}
              {showComponents.paymentTerms && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-blue-800 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Payment Terms
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleComponent("paymentTerms")}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm">
                    <p>
                      <strong>Terms:</strong>{" "}
                      <EditableField
                        field="credit_terms.payment_terms_type"
                        value={config.credit_terms.payment_terms_type}
                        selectOptions={[
                          "due_on_receipt",
                          "net_15",
                          "net_30",
                          "net_60",
                          "custom",
                        ]}
                        displayValue={config.credit_terms.payment_terms_type
                          .replace("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      />
                    </p>
                    <p>
                      <strong>Disputes:</strong> Must be raised within{" "}
                      <EditableField
                        field="credit_terms.dispute_period_days"
                        value={config.credit_terms.dispute_period_days}
                        type="number"
                      />{" "}
                      days
                    </p>
                  </div>
                </div>
              )}

              {/* Late Fees - Optional */}
              {showComponents.lateFees &&
                config.credit_terms.late_fee_enabled && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-red-800 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Late Payment Fees
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          toggleComponent("lateFees");
                          setConfig((prev) => ({
                            ...prev,
                            credit_terms: {
                              ...prev.credit_terms,
                              late_fee_enabled: false,
                            },
                          }));
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-sm">
                      <p>
                        <strong>Late Fee:</strong>{" "}
                        <EditableField
                          field="credit_terms.late_fee_amount"
                          value={config.credit_terms.late_fee_amount}
                          type="number"
                        />
                        % {config.credit_terms.late_fee_frequency} service
                        charge applies to overdue invoices
                      </p>
                    </div>
                  </div>
                )}

              {/* Early Discount - Optional */}
              {showComponents.earlyDiscount &&
                config.credit_terms.early_discount_enabled && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-emerald-800 flex items-center gap-2">
                        <Percent className="h-4 w-4" />
                        Early Payment Discount
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          toggleComponent("earlyDiscount");
                          setConfig((prev) => ({
                            ...prev,
                            credit_terms: {
                              ...prev.credit_terms,
                              early_discount_enabled: false,
                            },
                          }));
                        }}
                        className="text-emerald-600 hover:text-emerald-800"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-sm">
                      <p>
                        <strong>Early Payment:</strong>{" "}
                        <EditableField
                          field="credit_terms.early_discount_percentage"
                          value={config.credit_terms.early_discount_percentage}
                          type="number"
                        />
                        % discount if paid within{" "}
                        <EditableField
                          field="credit_terms.early_discount_days"
                          value={config.credit_terms.early_discount_days}
                          type="number"
                        />{" "}
                        days
                      </p>
                    </div>
                  </div>
                )}

              {/* Notes - Optional */}
              {showComponents.notes && (
                <div className="border rounded-lg p-4 hover:border-purple-300 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-purple-600 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Additional Notes
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleComponent("notes")}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <EditableField
                    field="notes"
                    value={config.notes}
                    placeholder="Add any additional notes or terms..."
                    multiline
                    className="w-full min-h-[60px]"
                  />
                </div>
              )}

              {/* Payment Methods - Optional */}
              {showComponents.paymentMethods && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-green-800 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Payment Information
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleComponent("paymentMethods")}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {config.payment_config.enable_instant_eft && (
                      <div className="bg-white p-2 rounded text-center border">
                        <strong className="text-xs">Instant EFT</strong>
                        <div className="text-xs">Pay instantly online</div>
                      </div>
                    )}
                    {config.payment_config.enable_payshap && (
                      <div className="bg-white p-2 rounded text-center border">
                        <strong className="text-xs">PayShap</strong>
                        <div className="text-xs">Mobile payment</div>
                      </div>
                    )}
                    {config.payment_config.enable_snapscan && (
                      <div className="bg-white p-2 rounded text-center border">
                        <strong className="text-xs">SnapScan</strong>
                        <div className="text-xs">QR payment</div>
                      </div>
                    )}
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 p-2 rounded text-sm">
                    <p>
                      <strong>Payment Reference:</strong>{" "}
                      {config.invoice_number}
                    </p>
                    <p>
                      <strong>Bank:</strong>{" "}
                      <EditableField
                        field="payment_config.bank_name"
                        value={config.payment_config.bank_name}
                        placeholder="Bank Name"
                      />{" "}
                      | <strong>Account:</strong>{" "}
                      <EditableField
                        field="payment_config.account_number"
                        value={config.payment_config.account_number}
                        placeholder="Account Number"
                      />
                    </p>
                    <p>
                      <strong>Account Holder:</strong>{" "}
                      <EditableField
                        field="payment_config.account_holder"
                        value={config.payment_config.account_holder}
                        placeholder="Account Holder"
                      />
                    </p>
                  </div>
                </div>
              )}

              {/* Add Components Section */}
              <AddComponentButtons />

              {/* Footer */}
              <div className="bg-slate-800 text-white p-4 rounded text-center">
                <p className="text-sm">
                  <strong>{config.business_profile.company_name}</strong> |{" "}
                  {config.business_profile.email} |{" "}
                  {config.business_profile.phone}
                </p>
                <p className="text-xs mt-1">
                  This invoice was generated electronically and is valid without
                  signature.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
