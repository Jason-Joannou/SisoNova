// components/dashboard/invoicing-page.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Mail
} from "lucide-react"

// Enhanced types based on your backend models
interface InvoiceItem {
  id: string
  title: string
  description?: string
  category?: string
  sku?: string
  quantity: number
  unit: string
  unit_price: number
  discount_percentage: number
  tax_rate?: number
}

interface BusinessProfile {
  company_name: string
  trading_name?: string
  address_line_1: string
  address_line_2?: string
  city: string
  province: string
  postal_code: string
  vat_number?: string
  company_registration?: string
  email: string
  phone: string
  website?: string
  logo_url?: string
  industry: string
}

interface ClientDetails {
  company_name: string
  contact_person: string
  email: string
  phone?: string
  address_line_1?: string
  address_line_2?: string
  city?: string
  province?: string
  postal_code?: string
  vat_number?: string
  purchase_order_number?: string
}

interface CreditTerms {
  payment_terms_type: 'net_15' | 'net_30' | 'net_60' | 'due_on_receipt' | 'custom'
  custom_payment_terms?: string
  payment_due_days?: number
  late_fee_enabled: boolean
  late_fee_type: 'percentage' | 'fixed'
  late_fee_amount: number
  late_fee_frequency: 'daily' | 'monthly' | 'once'
  early_discount_enabled: boolean
  early_discount_days?: number
  early_discount_percentage?: number
  credit_limit_enabled: boolean
  credit_limit_amount?: number
  dispute_period_days: number
  dispute_contact_email?: string
  dispute_contact_number?: string
  retention_enabled: boolean
  retention_percentage?: number
  retention_period_days?: number
}

interface PaymentConfiguration {
  bank_name: string
  account_holder: string
  account_number: string
  branch_code: string
  swift_code?: string
  enable_instant_eft: boolean
  enable_payshap: boolean
  enable_snapscan: boolean
  enable_zapper: boolean
  enable_mobile_money: boolean
  enable_bank_transfer: boolean
  enable_card_payments: boolean
  reference_prefix: string
  include_company_code: boolean
  include_date: boolean
}

interface InvoiceConfiguration {
  invoice_number: string
  invoice_date: string
  due_date: string
  business_profile: BusinessProfile
  client_details: ClientDetails
  items: InvoiceItem[]
  include_vat: boolean
  vat_rate: number
  global_discount_enabled: boolean
  global_discount_percentage: number
  global_discount_amount?: number
  credit_terms: CreditTerms
  payment_config: PaymentConfiguration
  currency: string
  notes?: string
  internal_notes?: string
}

// Enhanced dummy data
const defaultBusinessProfile: BusinessProfile = {
  company_name: "PayFlow Solutions (Pty) Ltd",
  trading_name: "PayFlow",
  address_line_1: "123 Business Park Drive",
  address_line_2: "Suite 456",
  city: "Cape Town",
  province: "Western Cape",
  postal_code: "8001",
  vat_number: "4123456789",
  company_registration: "2023/123456/07",
  email: "billing@payflow.co.za",
  phone: "+27 21 123 4567",
  website: "www.payflow.co.za",
  industry: "consulting"
}

const defaultClientDetails: ClientDetails = {
  company_name: "Ridgeway Butchery",
  contact_person: "John Smith",
  email: "accounts@ridgewaybutchery.co.za",
  phone: "+27 11 987 6543",
  address_line_1: "789 Main Street",
  city: "Johannesburg",
  province: "Gauteng",
  postal_code: "2000",
  vat_number: "4987654321"
}

const defaultCreditTerms: CreditTerms = {
  payment_terms_type: 'net_30',
  payment_due_days: 30,
  late_fee_enabled: true,
  late_fee_type: 'percentage',
  late_fee_amount: 2.0,
  late_fee_frequency: 'monthly',
  early_discount_enabled: false,
  early_discount_days: 10,
  early_discount_percentage: 2.0,
  credit_limit_enabled: false,
  dispute_period_days: 7,
  retention_enabled: false
}

const defaultPaymentConfig: PaymentConfiguration = {
  bank_name: "First National Bank",
  account_holder: "PayFlow Solutions (Pty) Ltd",
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
  include_date: false
}

export function InvoicingPage() {
    const generateInvoiceNumber = () => {
  const today = new Date()
  const year = today.getFullYear().toString().slice(-2) // Last 2 digits of year
  const month = (today.getMonth() + 1).toString().padStart(2, '0')
  const day = today.getDate().toString().padStart(2, '0')
  
  // This will be the same for the entire day on both server and client
  return `INV-${year}${month}${day}-001`
}
  const [config, setConfig] = useState<InvoiceConfiguration>({
    invoice_number: generateInvoiceNumber(),
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
        discount_percentage: 0
      }
    ],
    include_vat: true,
    vat_rate: 0.15,
    global_discount_enabled: false,
    global_discount_percentage: 0,
    credit_terms: defaultCreditTerms,
    payment_config: defaultPaymentConfig,
    currency: "ZAR",
    notes: "Thank you for your business!"
  })

  const [activeTab, setActiveTab] = useState("form")
  const [isGenerating, setIsGenerating] = useState(false)

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = config.items.reduce((sum, item) => {
      const lineTotal = item.quantity * item.unit_price
      const discountAmount = lineTotal * (item.discount_percentage / 100)
      return sum + (lineTotal - discountAmount)
    }, 0)

    const globalDiscountAmount = config.global_discount_enabled 
      ? subtotal * (config.global_discount_percentage / 100) 
      : 0

    const taxableAmount = subtotal - globalDiscountAmount
    const vatAmount = config.include_vat ? taxableAmount * config.vat_rate : 0
    const total = taxableAmount + vatAmount

    return { subtotal, globalDiscountAmount, vatAmount, total }
  }

  const { subtotal, globalDiscountAmount, vatAmount, total } = calculateTotals()

  // Generate payment reference
  const generatePaymentReference = () => {
    const companyCode = config.payment_config.include_company_code 
      ? config.client_details.company_name.slice(0, 3).toUpperCase() 
      : ""
    const dateCode = config.payment_config.include_date 
      ? new Date().toISOString().slice(5, 10).replace('-', '') 
      : ""
    return `${config.payment_config.reference_prefix}-${config.invoice_number}-${companyCode}${dateCode}`.replace(/--+/g, '-')
  }

  // Add new item
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      title: "",
      description: "",
      quantity: 1,
      unit: "each",
      unit_price: 0,
      discount_percentage: 0
    }
    setConfig(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }))
  }

  // Remove item
  const removeItem = (id: string) => {
    setConfig(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }))
  }

  // Update item
  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setConfig(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
  }

  // Generate PDF (placeholder)
  const generatePDF = async () => {
    setIsGenerating(true)
    try {
      console.log("Generating PDF with config:", config)
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert("PDF generated successfully!")
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Smartphone className="h-8 w-8 text-purple-600" />
                Mobile Invoicing
              </h1>
              <p className="text-slate-600">Create professional invoices with live preview</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button 
                onClick={generatePDF}
                disabled={isGenerating}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? (
                  <>Generating...</>
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

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="form" className="text-xs">Invoice</TabsTrigger>
                <TabsTrigger value="business" className="text-xs">Business</TabsTrigger>
                <TabsTrigger value="client" className="text-xs">Client</TabsTrigger>
                <TabsTrigger value="credit" className="text-xs">Terms</TabsTrigger>
                <TabsTrigger value="payment" className="text-xs">Payment</TabsTrigger>
                <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="form" className="space-y-4">
                {/* Invoice Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                      <FileText className="h-5 w-5 text-purple-600" />
                      Invoice Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="invoice_number">Invoice Number</Label>
                        <Input
                          id="invoice_number"
                          value={config.invoice_number}
                          onChange={(e) => setConfig(prev => ({ ...prev, invoice_number: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="invoice_date">Invoice Date</Label>
                        <Input
                          id="invoice_date"
                          type="date"
                          value={config.invoice_date}
                          onChange={(e) => setConfig(prev => ({ ...prev, invoice_date: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="due_date">Due Date</Label>
                      <Input
                        id="due_date"
                        type="date"
                        value={config.due_date}
                        onChange={(e) => setConfig(prev => ({ ...prev, due_date: e.target.value }))}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Items - Same as before */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-slate-900">
                        <Calculator className="h-5 w-5 text-purple-600" />
                        Invoice Items
                      </CardTitle>
                      <Button onClick={addItem} size="sm" className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {config.items.map((item, index) => (
                      <div key={item.id} className="p-4 border border-slate-200 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-900">Item {index + 1}</span>
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
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-2">
                            <Label>Title</Label>
                            <Input
                              value={item.title}
                              onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                              placeholder="Service or product name"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label>Description</Label>
                            <Textarea
                              value={item.description || ''}
                              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                              placeholder="Detailed description"
                              rows={2}
                            />
                          </div>
                          <div>
                            <Label>Category</Label>
                            <Input
                              value={item.category || ''}
                              onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                              placeholder="e.g., Consulting"
                            />
                          </div>
                          <div>
                            <Label>SKU</Label>
                            <Input
                              value={item.sku || ''}
                              onChange={(e) => updateItem(item.id, 'sku', e.target.value)}
                              placeholder="Product code"
                            />
                          </div>
                          <div>
                            <Label>Quantity</Label>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div>
                            <Label>Unit</Label>
                            <Select value={item.unit} onValueChange={(value) => updateItem(item.id, 'unit', value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="each">Each</SelectItem>
                                <SelectItem value="hours">Hours</SelectItem>
                                <SelectItem value="days">Days</SelectItem>
                                <SelectItem value="kg">Kg</SelectItem>
                                <SelectItem value="m">Meters</SelectItem>
                                <SelectItem value="m2">Square Meters</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Unit Price (R)</Label>
                            <Input
                              type="number"
                              value={item.unit_price}
                              onChange={(e) => updateItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div>
                            <Label>Discount (%)</Label>
                            <Input
                              type="number"
                              value={item.discount_percentage}
                              onChange={(e) => updateItem(item.id, 'discount_percentage', parseFloat(e.target.value) || 0)}
                              min="0"
                              max="100"
                              step="0.01"
                            />
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span className="text-sm text-slate-600">Line Total: </span>
                          <span className="font-medium text-slate-900">
                            R{((item.quantity * item.unit_price) * (1 - item.discount_percentage / 100)).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Totals Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-slate-900">Invoice Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Subtotal:</span>
                        <span className="font-medium">R{subtotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                      </div>
                      {globalDiscountAmount > 0 && (
                        <div className="flex justify-between text-red-600">
                          <span>Discount:</span>
                          <span>-R{globalDiscountAmount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                        </div>
                      )}
                      {config.include_vat && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">VAT (15%):</span>
                          <span className="font-medium">R{vatAmount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between text-lg font-bold text-slate-900">
                        <span>Total:</span>
                        <span>R{total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Business Tab - Same as before */}
              <TabsContent value="business" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                      <Building className="h-5 w-5 text-purple-600" />
                      Business Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label>Company Name</Label>
                        <Input
                          value={config.business_profile.company_name}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            business_profile: { ...prev.business_profile, company_name: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Trading Name (if different)</Label>
                        <Input
                          value={config.business_profile.trading_name || ''}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            business_profile: { ...prev.business_profile, trading_name: e.target.value }
                          }))}
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={config.business_profile.email}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            business_profile: { ...prev.business_profile, email: e.target.value }
                          }))}
                        />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input
                          value={config.business_profile.phone}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            business_profile: { ...prev.business_profile, phone: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Address Line 1</Label>
                        <Input
                          value={config.business_profile.address_line_1}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            business_profile: { ...prev.business_profile, address_line_1: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Address Line 2</Label>
                        <Input
                          value={config.business_profile.address_line_2 || ''}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            business_profile: { ...prev.business_profile, address_line_2: e.target.value }
                          }))}
                        />
                      </div>
                      <div>
                        <Label>City</Label>
                        <Input
                          value={config.business_profile.city}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            business_profile: { ...prev.business_profile, city: e.target.value }
                          }))}
                        />
                      </div>
                      <div>
                        <Label>Province</Label>
                        <Select 
                          value={config.business_profile.province} 
                          onValueChange={(value) => setConfig(prev => ({
                            ...prev,
                            business_profile: { ...prev.business_profile, province: value }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Western Cape">Western Cape</SelectItem>
                            <SelectItem value="Gauteng">Gauteng</SelectItem>
                            <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                            <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                            <SelectItem value="Free State">Free State</SelectItem>
                            <SelectItem value="Limpopo">Limpopo</SelectItem>
                            <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                            <SelectItem value="Northern Cape">Northern Cape</SelectItem>
                            <SelectItem value="North West">North West</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Postal Code</Label>
                        <Input
                          value={config.business_profile.postal_code}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            business_profile: { ...prev.business_profile, postal_code: e.target.value }
                          }))}
                        />
                      </div>
                      <div>
                        <Label>VAT Number</Label>
                        <Input
                          value={config.business_profile.vat_number || ''}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            business_profile: { ...prev.business_profile, vat_number: e.target.value }
                          }))}
                        />
                      </div>
                      <div>
                        <Label>Company Registration</Label>
                        <Input
                          value={config.business_profile.company_registration || ''}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            business_profile: { ...prev.business_profile, company_registration: e.target.value }
                          }))}
                        />
                      </div>
                      <div>
                        <Label>Website</Label>
                        <Input
                          value={config.business_profile.website || ''}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            business_profile: { ...prev.business_profile, website: e.target.value }
                          }))}
                        />
                      </div>
                      <div>
                        <Label>Industry</Label>
                        <Select 
                          value={config.business_profile.industry} 
                          onValueChange={(value) => setConfig(prev => ({
                            ...prev,
                            business_profile: { ...prev.business_profile, industry: value }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="legal">Legal</SelectItem>
                            <SelectItem value="entertainment">Entertainment</SelectItem>
                            <SelectItem value="construction">Construction</SelectItem>
                            <SelectItem value="consulting">Consulting</SelectItem>
                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Client Tab - Enhanced */}
              <TabsContent value="client" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                      <User className="h-5 w-5 text-purple-600" />
                      Client Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label>Company Name</Label>
                        <Input
                          value={config.client_details.company_name}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            client_details: { ...prev.client_details, company_name: e.target.value }
                          }))}
                        />
                      </div>
                      <div>
                        <Label>Contact Person</Label>
                        <Input
                          value={config.client_details.contact_person}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            client_details: { ...prev.client_details, contact_person: e.target.value }
                          }))}
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={config.client_details.email}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            client_details: { ...prev.client_details, email: e.target.value }
                          }))}
                        />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input
                          value={config.client_details.phone || ''}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            client_details: { ...prev.client_details, phone: e.target.value }
                          }))}
                        />
                      </div>
                      <div>
                        <Label>VAT Number</Label>
                        <Input
                          value={config.client_details.vat_number || ''}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            client_details: { ...prev.client_details, vat_number: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Purchase Order Number</Label>
                        <Input
                          value={config.client_details.purchase_order_number || ''}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            client_details: { ...prev.client_details, purchase_order_number: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Address Line 1</Label>
                        <Input
                          value={config.client_details.address_line_1 || ''}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            client_details: { ...prev.client_details, address_line_1: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Address Line 2</Label>
                        <Input
                          value={config.client_details.address_line_2 || ''}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            client_details: { ...prev.client_details, address_line_2: e.target.value }
                          }))}
                        />
                      </div>
                      <div>
                        <Label>City</Label>
                        <Input
                          value={config.client_details.city || ''}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            client_details: { ...prev.client_details, city: e.target.value }
                          }))}
                        />
                      </div>
                      <div>
                        <Label>Province</Label>
                        <Input
                          value={config.client_details.province || ''}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            client_details: { ...prev.client_details, province: e.target.value }
                          }))}
                        />
                      </div>
                      <div>
                        <Label>Postal Code</Label>
                        <Input
                          value={config.client_details.postal_code || ''}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            client_details: { ...prev.client_details, postal_code: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* NEW: Credit Terms Tab */}
              <TabsContent value="credit" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                      <Clock className="h-5 w-5 text-purple-600" />
                      Payment Terms
                    </CardTitle>
                    <CardDescription>
                      Configure payment terms and credit conditions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label>Payment Terms</Label>
                        <Select 
                          value={config.credit_terms.payment_terms_type} 
                          onValueChange={(value: any) => setConfig(prev => ({
                            ...prev,
                            credit_terms: { ...prev.credit_terms, payment_terms_type: value }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="due_on_receipt">Due on Receipt</SelectItem>
                            <SelectItem value="net_15">Net 15 Days</SelectItem>
                            <SelectItem value="net_30">Net 30 Days</SelectItem>
                            <SelectItem value="net_60">Net 60 Days</SelectItem>
                            <SelectItem value="custom">Custom Terms</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {config.credit_terms.payment_terms_type === 'custom' && (
                        <div className="col-span-2">
                          <Label>Custom Payment Terms</Label>
                          <Textarea
                            value={config.credit_terms.custom_payment_terms || ''}
                            onChange={(e) => setConfig(prev => ({
                              ...prev,
                              credit_terms: { ...prev.credit_terms, custom_payment_terms: e.target.value }
                            }))}
                            placeholder="Enter custom payment terms..."
                            rows={2}
                          />
                        </div>
                      )}

                      <div>
                        <Label>Payment Due Days</Label>
                        <Input
                          type="number"
                          value={config.credit_terms.payment_due_days || ''}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            credit_terms: { ...prev.credit_terms, payment_due_days: parseInt(e.target.value) || undefined }
                          }))}
                          min="0"
                        />
                      </div>
                      <div>
                        <Label>Dispute Period (Days)</Label>
                        <Input
                          type="number"
                          value={config.credit_terms.dispute_period_days}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            credit_terms: { ...prev.credit_terms, dispute_period_days: parseInt(e.target.value) || 7 }
                          }))}
                          min="1"
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Late Fee Configuration */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Late Payment Fees</Label>
                          <p className="text-sm text-slate-600">Charge fees for overdue payments</p>
                        </div>
                        <Switch
                          checked={config.credit_terms.late_fee_enabled}
                          onCheckedChange={(checked) => setConfig(prev => ({
                            ...prev,
                            credit_terms: { ...prev.credit_terms, late_fee_enabled: checked }
                          }))}
                        />
                      </div>

                      {config.credit_terms.late_fee_enabled && (
                        <div className="grid grid-cols-3 gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
                          <div>
                            <Label>Fee Type</Label>
                            <Select 
                              value={config.credit_terms.late_fee_type} 
                              onValueChange={(value: any) => setConfig(prev => ({
                                ...prev,
                                credit_terms: { ...prev.credit_terms, late_fee_type: value }
                              }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="percentage">Percentage</SelectItem>
                                <SelectItem value="fixed">Fixed Amount</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Fee Amount {config.credit_terms.late_fee_type === 'percentage' ? '(%)' : '(R)'}</Label>
                            <Input
                              type="number"
                              value={config.credit_terms.late_fee_amount}
                              onChange={(e) => setConfig(prev => ({
                                ...prev,
                                credit_terms: { ...prev.credit_terms, late_fee_amount: parseFloat(e.target.value) || 0 }
                              }))}
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div>
                            <Label>Frequency</Label>
                            <Select 
                              value={config.credit_terms.late_fee_frequency} 
                              onValueChange={(value: any) => setConfig(prev => ({
                                ...prev,
                                credit_terms: { ...prev.credit_terms, late_fee_frequency: value }
                              }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="once">One-time</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Early Payment Discount */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Early Payment Discount</Label>
                          <p className="text-sm text-slate-600">Offer discount for early payment</p>
                        </div>
                        <Switch
                          checked={config.credit_terms.early_discount_enabled}
                          onCheckedChange={(checked) => setConfig(prev => ({
                            ...prev,
                            credit_terms: { ...prev.credit_terms, early_discount_enabled: checked }
                          }))}
                        />
                      </div>

                      {config.credit_terms.early_discount_enabled && (
                        <div className="grid grid-cols-2 gap-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                          <div>
                            <Label>Discount Days</Label>
                            <Input
                              type="number"
                              value={config.credit_terms.early_discount_days || ''}
                              onChange={(e) => setConfig(prev => ({
                                ...prev,
                                credit_terms: { ...prev.credit_terms, early_discount_days: parseInt(e.target.value) || undefined }
                              }))}
                              min="1"
                              placeholder="e.g., 10"
                            />
                          </div>
                          <div>
                            <Label>Discount Percentage (%)</Label>
                            <Input
                              type="number"
                              value={config.credit_terms.early_discount_percentage || ''}
                              onChange={(e) => setConfig(prev => ({
                                ...prev,
                                credit_terms: { ...prev.credit_terms, early_discount_percentage: parseFloat(e.target.value) || undefined }
                              }))}
                              min="0"
                              max="100"
                              step="0.01"
                              placeholder="e.g., 2.0"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Credit Limit */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Credit Limit Display</Label>
                          <p className="text-sm text-slate-600">Show credit limit on invoice</p>
                        </div>
                        <Switch
                          checked={config.credit_terms.credit_limit_enabled}
                          onCheckedChange={(checked) => setConfig(prev => ({
                            ...prev,
                            credit_terms: { ...prev.credit_terms, credit_limit_enabled: checked }
                          }))}
                        />
                      </div>

                      {config.credit_terms.credit_limit_enabled && (
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <Label>Credit Limit Amount (R)</Label>
                          <Input
                            type="number"
                            value={config.credit_terms.credit_limit_amount || ''}
                            onChange={(e) => setConfig(prev => ({
                              ...prev,
                              credit_terms: { ...prev.credit_terms, credit_limit_amount: parseFloat(e.target.value) || undefined }
                            }))}
                            min="0"
                            step="0.01"
                            placeholder="e.g., 50000"
                          />
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Retention Terms */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Retention Terms</Label>
                          <p className="text-sm text-slate-600">Hold percentage of payment</p>
                        </div>
                        <Switch
                          checked={config.credit_terms.retention_enabled}
                          onCheckedChange={(checked) => setConfig(prev => ({
                            ...prev,
                            credit_terms: { ...prev.credit_terms, retention_enabled: checked }
                          }))}
                        />
                      </div>

                      {config.credit_terms.retention_enabled && (
                        <div className="grid grid-cols-2 gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div>
                            <Label>Retention Percentage (%)</Label>
                            <Input
                              type="number"
                              value={config.credit_terms.retention_percentage || ''}
                              onChange={(e) => setConfig(prev => ({
                                ...prev,
                                credit_terms: { ...prev.credit_terms, retention_percentage: parseFloat(e.target.value) || undefined }
                              }))}
                              min="0"
                              max="100"
                              step="0.01"
                              placeholder="e.g., 10"
                            />
                          </div>
                          <div>
                            <Label>Retention Period (Days)</Label>
                            <Input
                              type="number"
                              value={config.credit_terms.retention_period_days || ''}
                              onChange={(e) => setConfig(prev => ({
                                ...prev,
                                credit_terms: { ...prev.credit_terms, retention_period_days: parseInt(e.target.value) || undefined }
                              }))}
                              min="1"
                              placeholder="e.g., 90"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Dispute Contact Information */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Dispute Contact Information</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Dispute Contact Email</Label>
                          <Input
                            type="email"
                            value={config.credit_terms.dispute_contact_email || ''}
                            onChange={(e) => setConfig(prev => ({
                              ...prev,
                              credit_terms: { ...prev.credit_terms, dispute_contact_email: e.target.value }
                            }))}
                            placeholder="disputes@company.com"
                          />
                        </div>
                        <div>
                          <Label>Dispute Contact Number</Label>
                          <Input
                            value={config.credit_terms.dispute_contact_number || ''}
                            onChange={(e) => setConfig(prev => ({
                              ...prev,
                              credit_terms: { ...prev.credit_terms, dispute_contact_number: e.target.value }
                            }))}
                            placeholder="+27 11 123 4567"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* NEW: Payment Configuration Tab */}
              <TabsContent value="payment" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                      <CreditCard className="h-5 w-5 text-purple-600" />
                      Payment Configuration
                    </CardTitle>
                    <CardDescription>
                      Configure payment methods and banking details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Bank Details */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Banking Details</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Bank Name</Label>
                          <Input
                            value={config.payment_config.bank_name}
                            onChange={(e) => setConfig(prev => ({
                              ...prev,
                              payment_config: { ...prev.payment_config, bank_name: e.target.value }
                            }))}
                          />
                        </div>
                        <div>
                          <Label>Account Holder</Label>
                          <Input
                            value={config.payment_config.account_holder}
                            onChange={(e) => setConfig(prev => ({
                              ...prev,
                              payment_config: { ...prev.payment_config, account_holder: e.target.value }
                            }))}
                          />
                        </div>
                        <div>
                          <Label>Account Number</Label>
                          <Input
                            value={config.payment_config.account_number}
                            onChange={(e) => setConfig(prev => ({
                              ...prev,
                              payment_config: { ...prev.payment_config, account_number: e.target.value }
                            }))}
                          />
                        </div>
                        <div>
                          <Label>Branch Code</Label>
                          <Input
                            value={config.payment_config.branch_code}
                            onChange={(e) => setConfig(prev => ({
                              ...prev,
                              payment_config: { ...prev.payment_config, branch_code: e.target.value }
                            }))}
                          />
                        </div>
                        <div>
                          <Label>SWIFT Code (Optional)</Label>
                          <Input
                            value={config.payment_config.swift_code || ''}
                            onChange={(e) => setConfig(prev => ({
                              ...prev,
                              payment_config: { ...prev.payment_config, swift_code: e.target.value }
                            }))}
                            placeholder="For international payments"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Payment Methods */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Enabled Payment Methods</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-emerald-600" />
                            <span className="text-sm font-medium">Instant EFT</span>
                          </div>
                          <Switch
                            checked={config.payment_config.enable_instant_eft}
                            onCheckedChange={(checked) => setConfig(prev => ({
                              ...prev,
                              payment_config: { ...prev.payment_config, enable_instant_eft: checked }
                            }))}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">PayShap</span>
                          </div>
                          <Switch
                            checked={config.payment_config.enable_payshap}
                            onCheckedChange={(checked) => setConfig(prev => ({
                              ...prev,
                              payment_config: { ...prev.payment_config, enable_payshap: checked }
                            }))}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">SnapScan</span>
                          </div>
                          <Switch
                            checked={config.payment_config.enable_snapscan}
                            onCheckedChange={(checked) => setConfig(prev => ({
                              ...prev,
                              payment_config: { ...prev.payment_config, enable_snapscan: checked }
                            }))}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium">Zapper</span>
                          </div>
                          <Switch
                            checked={config.payment_config.enable_zapper}
                            onCheckedChange={(checked) => setConfig(prev => ({
                              ...prev,
                              payment_config: { ...prev.payment_config, enable_zapper: checked }
                            }))}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium">Mobile Money</span>
                          </div>
                          <Switch
                            checked={config.payment_config.enable_mobile_money}
                            onCheckedChange={(checked) => setConfig(prev => ({
                              ...prev,
                              payment_config: { ...prev.payment_config, enable_mobile_money: checked }
                            }))}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-slate-600" />
                            <span className="text-sm font-medium">Bank Transfer</span>
                          </div>
                          <Switch
                            checked={config.payment_config.enable_bank_transfer}
                            onCheckedChange={(checked) => setConfig(prev => ({
                              ...prev,
                              payment_config: { ...prev.payment_config, enable_bank_transfer: checked }
                            }))}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-red-600" />
                            <span className="text-sm font-medium">Card Payments</span>
                          </div>
                          <Switch
                            checked={config.payment_config.enable_card_payments}
                            onCheckedChange={(checked) => setConfig(prev => ({
                              ...prev,
                              payment_config: { ...prev.payment_config, enable_card_payments: checked }
                            }))}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Payment Reference Configuration */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Payment Reference Configuration</Label>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Reference Prefix</Label>
                          <Input
                            value={config.payment_config.reference_prefix}
                            onChange={(e) => setConfig(prev => ({
                              ...prev,
                              payment_config: { ...prev.payment_config, reference_prefix: e.target.value }
                            }))}
                            placeholder="INV"
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm font-medium">Include Company Code</span>
                          <Switch
                            checked={config.payment_config.include_company_code}
                            onCheckedChange={(checked) => setConfig(prev => ({
                              ...prev,
                              payment_config: { ...prev.payment_config, include_company_code: checked }
                            }))}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm font-medium">Include Date</span>
                          <Switch
                            checked={config.payment_config.include_date}
                            onCheckedChange={(checked) => setConfig(prev => ({
                              ...prev,
                              payment_config: { ...prev.payment_config, include_date: checked }
                            }))}
                          />
                        </div>
                      </div>
                      
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <Label className="text-sm font-medium">Preview Reference:</Label>
                        <p className="text-sm text-slate-600 mt-1">{generatePaymentReference()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab - Enhanced */}
              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                      <Settings className="h-5 w-5 text-purple-600" />
                      Invoice Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Include VAT</Label>
                        <p className="text-sm text-slate-600">Add 15% VAT to invoice</p>
                      </div>
                      <Switch
                        checked={config.include_vat}
                        onCheckedChange={(checked) => setConfig(prev => ({ ...prev, include_vat: checked }))}
                      />
                    </div>

                    {config.include_vat && (
                      <div>
                        <Label>VAT Rate (%)</Label>
                        <Input
                          type="number"
                          value={config.vat_rate * 100}
                          onChange={(e) => setConfig(prev => ({ ...prev, vat_rate: (parseFloat(e.target.value) || 15) / 100 }))}
                          min="0"
                          max="100"
                          step="0.01"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Global Discount</Label>
                        <p className="text-sm text-slate-600">Apply discount to entire invoice</p>
                      </div>
                      <Switch
                        checked={config.global_discount_enabled}
                        onCheckedChange={(checked) => setConfig(prev => ({ ...prev, global_discount_enabled: checked }))}
                      />
                    </div>

                    {config.global_discount_enabled && (
                      <div>
                        <Label>Discount Percentage (%)</Label>
                        <Input
                          type="number"
                          value={config.global_discount_percentage}
                          onChange={(e) => setConfig(prev => ({ ...prev, global_discount_percentage: parseFloat(e.target.value) || 0 }))}
                          min="0"
                          max="100"
                          step="0.01"
                        />
                      </div>
                    )}

                    <div>
                      <Label>Currency</Label>
                      <Select value={config.currency} onValueChange={(value) => setConfig(prev => ({ ...prev, currency: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ZAR">South African Rand (ZAR)</SelectItem>
                          <SelectItem value="USD">US Dollar (USD)</SelectItem>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                          <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Notes</Label>
                      <Textarea
                        value={config.notes || ''}
                        onChange={(e) => setConfig(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Additional notes for the invoice"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Internal Notes</Label>
                      <Textarea
                        value={config.internal_notes || ''}
                        onChange={(e) => setConfig(prev => ({ ...prev, internal_notes: e.target.value }))}
                        placeholder="Internal notes (not shown on invoice)"
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Enhanced Live Preview Section */}
          <div className="lg:sticky lg:top-6">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Eye className="h-5 w-5 text-purple-600" />
                  Live Preview
                </CardTitle>
                <CardDescription>
                  See how your invoice will look
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm max-h-[600px] overflow-y-auto">
                  {/* Enhanced Invoice Preview */}
                  <div className="space-y-4 text-xs">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b-2 border-blue-600 pb-3">
                      <div>
                        <h1 className="text-2xl font-bold text-blue-600">INVOICE</h1>
                        <div className="text-slate-600">{config.business_profile.company_name}</div>
                        {config.business_profile.trading_name && config.business_profile.trading_name !== config.business_profile.company_name && (
                          <div className="text-xs text-slate-500 italic">t/a {config.business_profile.trading_name}</div>
                        )}
                      </div>
                    </div>

                    {/* Invoice Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-3 rounded border-l-2 border-blue-600">
                        <h3 className="font-bold text-blue-600 mb-2">Invoice Information</h3>
                        <p><strong>Invoice #:</strong> {config.invoice_number}</p>
                        <p><strong>Date:</strong> {config.invoice_date}</p>
                        <p><strong>Due:</strong> {config.due_date}</p>
                        <p><strong>Terms:</strong> {
                          config.credit_terms.payment_terms_type === 'custom' 
                            ? config.credit_terms.custom_payment_terms?.slice(0, 20) + '...'
                            : config.credit_terms.payment_terms_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                        }</p>
                        {config.client_details.purchase_order_number && (
                          <p><strong>PO #:</strong> {config.client_details.purchase_order_number}</p>
                        )}
                      </div>
                      <div className="bg-red-50 p-3 rounded border-l-2 border-red-600">
                        <h3 className="font-bold text-red-600 mb-2">Payment Terms</h3>
                        {config.credit_terms.late_fee_enabled && (
                          <p><strong>Late Fee:</strong> {config.credit_terms.late_fee_amount}% {config.credit_terms.late_fee_frequency}</p>
                        )}
                        {config.credit_terms.early_discount_enabled && (
                          <p><strong>Early Discount:</strong> {config.credit_terms.early_discount_percentage}% ({config.credit_terms.early_discount_days} days)</p>
                        )}
                        {config.credit_terms.credit_limit_enabled && config.credit_terms.credit_limit_amount && (
                          <p><strong>Credit Limit:</strong> R{config.credit_terms.credit_limit_amount.toLocaleString('en-ZA')}</p>
                        )}
                        <p><strong>Total:</strong> R{total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>

                    {/* Addresses */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border p-3 rounded">
                        <h3 className="font-bold text-blue-600 mb-2">BILL FROM</h3>
                        <p className="font-bold">{config.business_profile.company_name}</p>
                        {config.business_profile.trading_name && config.business_profile.trading_name !== config.business_profile.company_name && (
                          <p className="italic">t/a {config.business_profile.trading_name}</p>
                        )}
                        <p>{config.business_profile.address_line_1}</p>
                        {config.business_profile.address_line_2 && <p>{config.business_profile.address_line_2}</p>}
                        <p>{config.business_profile.city}, {config.business_profile.province} {config.business_profile.postal_code}</p>
                        {config.business_profile.vat_number && <p><strong>VAT:</strong> {config.business_profile.vat_number}</p>}
                        <p><strong>Email:</strong> {config.business_profile.email}</p>
                        <p><strong>Phone:</strong> {config.business_profile.phone}</p>
                      </div>
                      <div className="border p-3 rounded">
                        <h3 className="font-bold text-blue-600 mb-2">BILL TO</h3>
                        <p className="font-bold">{config.client_details.company_name}</p>
                        <p><strong>Attn:</strong> {config.client_details.contact_person}</p>
                        <p><strong>Email:</strong> {config.client_details.email}</p>
                        {config.client_details.phone && <p><strong>Phone:</strong> {config.client_details.phone}</p>}
                        {config.client_details.address_line_1 && (
                          <>
                            <p>{config.client_details.address_line_1}</p>
                            {config.client_details.address_line_2 && <p>{config.client_details.address_line_2}</p>}
                            {config.client_details.city && (
                              <p>{config.client_details.city}, {config.client_details.province} {config.client_details.postal_code}</p>
                            )}
                          </>
                        )}
                        {config.client_details.vat_number && <p><strong>VAT:</strong> {config.client_details.vat_number}</p>}
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <table className="w-full border-collapse border">
                        <thead className="bg-blue-600 text-white">
                          <tr>
                            <th className="border p-2 text-left text-xs">Description</th>
                            <th className="border p-2 text-xs">Qty</th>
                            <th className="border p-2 text-xs">Unit</th>
                            <th className="border p-2 text-xs">Rate</th>
                            <th className="border p-2 text-xs">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {config.items.map((item) => {
                            const lineTotal = (item.quantity * item.unit_price) * (1 - item.discount_percentage / 100)
                            return (
                              <tr key={item.id} className="border-b">
                                <td className="border p-2">
                                  <div className="font-medium">{item.title}</div>
                                  {item.description && <div className="text-slate-600 text-xs">{item.description}</div>}
                                  {(item.sku || item.category) && (
                                    <div className="text-slate-500 text-xs">
                                      {item.sku && `SKU: ${item.sku}`}
                                      {item.sku && item.category && ' • '}
                                      {item.category}
                                    </div>
                                  )}
                                </td>
                                <td className="border p-2 text-center">{item.quantity}</td>
                                <td className="border p-2 text-center">{item.unit}</td>
                                <td className="border p-2 text-right">R{item.unit_price.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
                                <td className="border p-2 text-right">R{lineTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end">
                      <div className="w-64">
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>R{subtotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                          </div>
                          {globalDiscountAmount > 0 && (
                            <div className="flex justify-between text-red-600">
                              <span>Discount:</span>
                              <span>-R{globalDiscountAmount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                            </div>
                          )}
                          {config.include_vat && (
                            <div className="flex justify-between">
                              <span>VAT ({(config.vat_rate * 100).toFixed(0)}%):</span>
                              <span>R{vatAmount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                            </div>
                          )}
                          <div className="flex justify-between bg-blue-600 text-white p-2 font-bold">
                            <span>TOTAL:</span>
                            <span>R{total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Terms & Conditions Preview */}
                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
                      <h4 className="font-bold text-yellow-800 mb-2">Terms & Conditions</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {config.credit_terms.late_fee_enabled && (
                          <div className="bg-white p-2 rounded border-l-2 border-yellow-400">
                            <strong>Late Payment:</strong> {config.credit_terms.late_fee_amount}% {config.credit_terms.late_fee_frequency} service charge
                          </div>
                        )}
                        {config.credit_terms.early_discount_enabled && (
                          <div className="bg-white p-2 rounded border-l-2 border-yellow-400">
                            <strong>Early Payment:</strong> {config.credit_terms.early_discount_percentage}% discount if paid within {config.credit_terms.early_discount_days} days
                          </div>
                        )}
                        <div className="bg-white p-2 rounded border-l-2 border-yellow-400">
                          <strong>Disputes:</strong> Must be raised within {config.credit_terms.dispute_period_days} days
                        </div>
                        {config.credit_terms.retention_enabled && (
                          <div className="bg-white p-2 rounded border-l-2 border-yellow-400">
                            <strong>Retention:</strong> {config.credit_terms.retention_percentage}% held for {config.credit_terms.retention_period_days} days
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment Information Preview */}
                    <div className="bg-green-50 border border-green-200 p-3 rounded">
                      <h4 className="font-bold text-green-800 mb-2">Payment Information</h4>
                      
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
                        {config.payment_config.enable_bank_transfer && (
                          <div className="bg-white p-2 rounded text-center border">
                            <strong className="text-xs">Bank Transfer</strong>
                            <div className="text-xs">Traditional EFT</div>
                          </div>
                        )}
                        {config.payment_config.enable_card_payments && (
                          <div className="bg-white p-2 rounded text-center border">
                            <strong className="text-xs">Card Payment</strong>
                            <div className="text-xs">Credit/Debit</div>
                          </div>
                        )}
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 p-2 rounded">
                        <p className="text-xs"><strong>Payment Reference:</strong> {generatePaymentReference()}</p>
                        <p className="text-xs"><strong>Bank:</strong> {config.payment_config.bank_name} | <strong>Account:</strong> {config.payment_config.account_number} | <strong>Branch:</strong> {config.payment_config.branch_code}</p>
                        <p className="text-xs"><strong>Account Holder:</strong> {config.payment_config.account_holder}</p>
                        {config.payment_config.swift_code && (
                          <p className="text-xs"><strong>SWIFT:</strong> {config.payment_config.swift_code} (international)</p>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    {config.notes && (
                      <div className="bg-slate-50 p-3 rounded border-l-2 border-slate-400">
                        <h4 className="font-bold mb-2">Additional Notes</h4>
                        <p className="text-xs">{config.notes}</p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="bg-slate-800 text-white p-2 rounded text-center">
                      <p className="text-xs"><strong>{config.business_profile.company_name}</strong> | {config.business_profile.email} | {config.business_profile.phone}</p>
                      <p className="text-xs">This invoice was generated electronically and is valid without signature.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}