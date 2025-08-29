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
  Smartphone
} from "lucide-react"

// Types based on your backend models
interface InvoiceItem {
  id: string
  title: string
  description?: string
  quantity: number
  unit: string
  unit_price: number
  discount_percentage: number
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
  email: string
  phone: string
  logo_url?: string
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
  currency: string
  notes?: string
}

// Dummy data
const defaultBusinessProfile: BusinessProfile = {
  company_name: "PayFlow Solutions (Pty) Ltd",
  trading_name: "PayFlow",
  address_line_1: "123 Business Park Drive",
  address_line_2: "Suite 456",
  city: "Cape Town",
  province: "Western Cape",
  postal_code: "8001",
  vat_number: "4123456789",
  email: "billing@payflow.co.za",
  phone: "+27 21 123 4567"
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

export function InvoicingPage() {
  const [config, setConfig] = useState<InvoiceConfiguration>({
    invoice_number: `INV-${Date.now().toString().slice(-6)}`,
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    business_profile: defaultBusinessProfile,
    client_details: defaultClientDetails,
    items: [
      {
        id: "1",
        title: "Professional Services",
        description: "Consulting and advisory services",
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
      // Here you would call your API
      console.log("Generating PDF with config:", config)
      // Simulate API call
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="form" className="text-xs">Invoice</TabsTrigger>
                <TabsTrigger value="business" className="text-xs">Business</TabsTrigger>
                <TabsTrigger value="client" className="text-xs">Client</TabsTrigger>
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

                {/* Items */}
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
                              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateItem(item.id, 'description', e.target.value)}
                              placeholder="Detailed description"
                              rows={2}
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
                        <Input
                          value={config.business_profile.province}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            business_profile: { ...prev.business_profile, province: e.target.value }
                          }))}
                        />
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
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

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
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

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
                        onCheckedChange={(checked: boolean) => setConfig(prev => ({ ...prev, include_vat: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Global Discount</Label>
                        <p className="text-sm text-slate-600">Apply discount to entire invoice</p>
                      </div>
                      <Switch
                        checked={config.global_discount_enabled}
                        onCheckedChange={(checked: boolean) => setConfig(prev => ({ ...prev, global_discount_enabled: checked }))}
                      />
                    </div>

                    {config.global_discount_enabled && (
                      <div>
                        <Label>Discount Percentage</Label>
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
                      <Label>Notes</Label>
                      <Textarea
                        value={config.notes || ''}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setConfig(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Additional notes for the invoice"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Live Preview Section */}
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
                  {/* Invoice Preview - Simplified version of your HTML template */}
                  <div className="space-y-4 text-xs">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b-2 border-blue-600 pb-3">
                      <div>
                        <h1 className="text-2xl font-bold text-blue-600">INVOICE</h1>
                        <div className="text-slate-600">{config.business_profile.company_name}</div>
                      </div>
                    </div>

                    {/* Invoice Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-3 rounded border-l-2 border-blue-600">
                        <h3 className="font-bold text-blue-600 mb-2">Invoice Information</h3>
                        <p><strong>Invoice #:</strong> {config.invoice_number}</p>
                        <p><strong>Date:</strong> {config.invoice_date}</p>
                        <p><strong>Due:</strong> {config.due_date}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded">
                        <h3 className="font-bold mb-2">Total</h3>
                        <p className="text-lg font-bold">R{total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>

                    {/* Addresses */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border p-3 rounded">
                        <h3 className="font-bold text-blue-600 mb-2">BILL FROM</h3>
                        <p className="font-bold">{config.business_profile.company_name}</p>
                        <p>{config.business_profile.address_line_1}</p>
                        <p>{config.business_profile.city}, {config.business_profile.province}</p>
                        <p><strong>Email:</strong> {config.business_profile.email}</p>
                        <p><strong>Phone:</strong> {config.business_profile.phone}</p>
                      </div>
                      <div className="border p-3 rounded">
                        <h3 className="font-bold text-blue-600 mb-2">BILL TO</h3>
                        <p className="font-bold">{config.client_details.company_name}</p>
                        <p><strong>Attn:</strong> {config.client_details.contact_person}</p>
                        <p><strong>Email:</strong> {config.client_details.email}</p>
                        {config.client_details.phone && <p><strong>Phone:</strong> {config.client_details.phone}</p>}
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <table className="w-full border-collapse border">
                        <thead className="bg-blue-600 text-white">
                          <tr>
                            <th className="border p-2 text-left text-xs">Description</th>
                            <th className="border p-2 text-xs">Qty</th>
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
                                </td>
                                <td className="border p-2 text-center">{item.quantity}</td>
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
                              <span>VAT (15%):</span>
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

                    {/* Notes */}
                    {config.notes && (
                      <div className="bg-slate-50 p-3 rounded">
                        <h4 className="font-bold mb-2">Additional Notes</h4>
                        <p>{config.notes}</p>
                      </div>
                    )}
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