// components/dashboard/financing-page.tsx
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
import { Progress } from "@/components/ui/progress"
import { 
  Plus, 
  Upload, 
  Eye, 
  Download, 
  Zap, 
  Clock,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  FileText,
  Building,
  User,
  Calendar,
  TrendingUp,
  Shield,
  CreditCard,
  Percent,
  Timer,
  Target,
  BarChart3,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react"

// Types for Financing
interface FinancingRequest {
  id: string
  invoice_number: string
  buyer_name: string
  buyer_company_registration?: string
  invoice_amount: number
  requested_amount: number
  invoice_date: string
  due_date: string
  days_to_maturity: number
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'funded' | 'declined' | 'completed'
  funding_partner?: string
  advance_rate?: number
  fee_rate?: number
  reserve_amount?: number
  net_advance?: number
  proof_of_work_uploaded: boolean
  created_at: string
  funded_at?: string
  expected_collection_date?: string
}

interface FundingOffer {
  id: string
  request_id: string
  funding_partner: string
  partner_logo?: string
  advance_rate: number // percentage
  fee_rate: number // percentage
  reserve_percentage: number
  net_advance: number
  total_fee: number
  processing_time: string // e.g., "2-4 hours"
  expires_at: string
  terms_conditions: string[]
  status: 'pending' | 'accepted' | 'declined' | 'expired'
}

interface FinancingStats {
  total_financed: number
  total_advanced: number
  active_requests: number
  average_advance_rate: number
  average_processing_time: number // hours
  total_fees_paid: number
  success_rate: number
}

// Dummy data
const financingStats: FinancingStats = {
  total_financed: 89,
  total_advanced: 1250000,
  active_requests: 12,
  average_advance_rate: 85,
  average_processing_time: 2.3,
  total_fees_paid: 45000,
  success_rate: 94.2
}

const financingRequests: FinancingRequest[] = [
  {
    id: "1",
    invoice_number: "INV-250825-001",
    buyer_name: "Ridgeway Butchery",
    buyer_company_registration: "2019/123456/07",
    invoice_amount: 15000,
    requested_amount: 12750, // 85% advance
    invoice_date: "2025-08-25",
    due_date: "2025-09-25",
    days_to_maturity: 10,
    status: "funded",
    funding_partner: "Capital Partners",
    advance_rate: 85,
    fee_rate: 2.5,
    reserve_amount: 2250,
    net_advance: 12375, // After fees
    proof_of_work_uploaded: true,
    created_at: "2025-08-25",
    funded_at: "2025-08-25",
    expected_collection_date: "2025-09-25"
  },
  {
    id: "2",
    invoice_number: "INV-250820-002",
    buyer_name: "De Abreu Essop Inc",
    buyer_company_registration: "2018/987654/07",
    invoice_amount: 8500,
    requested_amount: 7225, // 85% advance
    invoice_date: "2025-08-20",
    due_date: "2025-09-20",
    days_to_maturity: 5,
    status: "under_review",
    proof_of_work_uploaded: true,
    created_at: "2025-08-20"
  },
  {
    id: "3",
    invoice_number: "INV-250815-003",
    buyer_name: "WLDF SA",
    invoice_amount: 12000,
    requested_amount: 10200, // 85% advance
    invoice_date: "2025-08-15",
    due_date: "2025-09-15",
    days_to_maturity: 0,
    status: "approved",
    funding_partner: "SME Finance Solutions",
    advance_rate: 85,
    fee_rate: 3.0,
    proof_of_work_uploaded: true,
    created_at: "2025-08-15"
  },
  {
    id: "4",
    invoice_number: "INV-250810-004",
    buyer_name: "Tech Solutions Ltd",
    invoice_amount: 22500,
    requested_amount: 19125, // 85% advance
    invoice_date: "2025-08-10",
    due_date: "2025-09-10",
    days_to_maturity: -5, // Overdue
    status: "completed",
    funding_partner: "Capital Partners",
    advance_rate: 85,
    fee_rate: 2.5,
    reserve_amount: 3375,
    net_advance: 18562.5,
    proof_of_work_uploaded: true,
    created_at: "2025-08-10",
    funded_at: "2025-08-10"
  }
]

const sampleOffers: FundingOffer[] = [
  {
    id: "1",
    request_id: "2",
    funding_partner: "Capital Partners",
    partner_logo: "/logos/capital-partners.png",
    advance_rate: 85,
    fee_rate: 2.5,
    reserve_percentage: 15,
    net_advance: 7043.75, // 7225 - (7225 * 0.025)
    total_fee: 181.25,
    processing_time: "2-4 hours",
    expires_at: "2025-09-16T17:00:00Z",
    terms_conditions: [
      "Invoice must be genuine and unpaid",
      "Buyer must have good credit standing",
      "Payment routed through dedicated account",
      "Reserve released upon buyer payment"
    ],
    status: "pending"
  },
  {
    id: "2",
    request_id: "2",
    funding_partner: "SME Finance Solutions",
    advance_rate: 80,
    fee_rate: 3.0,
    reserve_percentage: 20,
    net_advance: 6596, // (8500 * 0.8) - (6800 * 0.03)
    total_fee: 204,
    processing_time: "1-2 hours",
    expires_at: "2025-09-16T17:00:00Z",
    terms_conditions: [
      "Minimum 30-day payment terms",
      "Buyer verification required",
      "Trade credit insurance recommended",
      "Same-day funding available"
    ],
    status: "pending"
  }
]

export function FinancingPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedRequest, setSelectedRequest] = useState<FinancingRequest | null>(null)
  const [showNewRequestForm, setShowNewRequestForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // New request form state
  const [newRequest, setNewRequest] = useState({
    invoice_number: "",
    buyer_name: "",
    buyer_company_registration: "",
    invoice_amount: 0,
    requested_amount: 0,
    invoice_date: "",
    due_date: "",
    proof_of_work_file: null as File | null,
    invoice_file: null as File | null
  })

  // Calculate advance amount when invoice amount changes
  useEffect(() => {
    if (newRequest.invoice_amount > 0) {
      setNewRequest(prev => ({
        ...prev,
        requested_amount: Math.round(prev.invoice_amount * 0.85) // Default 85% advance
      }))
    }
  }, [newRequest.invoice_amount])

  // Filter requests
  const filteredRequests = financingRequests.filter(request => 
    filterStatus === "all" || request.status === filterStatus
  )

  // Get status color and icon
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'funded': return 'bg-emerald-100 text-emerald-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'under_review': return 'bg-yellow-100 text-yellow-800'
      case 'declined': return 'bg-red-100 text-red-800'
      case 'submitted': return 'bg-purple-100 text-purple-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'funded': return <CheckCircle2 className="h-3 w-3" />
      case 'completed': return <CheckCircle className="h-3 w-3" />
      case 'approved': return <CheckCircle2 className="h-3 w-3" />
      case 'under_review': return <Clock className="h-3 w-3" />
      case 'declined': return <XCircle className="h-3 w-3" />
      case 'submitted': return <Upload className="h-3 w-3" />
      default: return <FileText className="h-3 w-3" />
    }
  }

  // Submit new request
  const submitRequest = async () => {
    console.log("Submitting financing request:", newRequest)
    // API call here
    setShowNewRequestForm(false)
    // Reset form
    setNewRequest({
      invoice_number: "",
      buyer_name: "",
      buyer_company_registration: "",
      invoice_amount: 0,
      requested_amount: 0,
      invoice_date: "",
      due_date: "",
      proof_of_work_file: null,
      invoice_file: null
    })
  }

  // Accept offer
  const acceptOffer = async (offerId: string) => {
    console.log("Accepting offer:", offerId)
    // API call here
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Zap className="h-8 w-8 text-emerald-600" />
                Pay-Me-Now Financing
              </h1>
              <p className="text-slate-600">Get instant cash for your invoices with funding partner matching</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                onClick={() => setShowNewRequestForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Total Financed</CardTitle>
              <FileText className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{financingStats.total_financed}</div>
              <p className="text-xs text-slate-500">Invoices</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Advanced</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">R{(financingStats.total_advanced / 1000000).toFixed(1)}M</div>
              <p className="text-xs text-emerald-600 font-medium">Total funded</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Active</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{financingStats.active_requests}</div>
              <p className="text-xs text-slate-500">Requests</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Avg Rate</CardTitle>
              <Percent className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{financingStats.average_advance_rate}%</div>
              <p className="text-xs text-slate-500">Advance</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Avg Time</CardTitle>
              <Timer className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{financingStats.average_processing_time}h</div>
              <p className="text-xs text-slate-500">Processing</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Success Rate</CardTitle>
              <Target className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{financingStats.success_rate}%</div>
              <p className="text-xs text-emerald-600 font-medium">Approval</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Fees Paid</CardTitle>
              <CreditCard className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">R{(financingStats.total_fees_paid / 1000).toFixed(0)}K</div>
              <p className="text-xs text-slate-500">Total</p>
            </CardContent>
          </Card>
        </div>

        {/* New Request Modal/Form */}
        {showNewRequestForm && (
          <Card className="mb-8 border-emerald-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Plus className="h-5 w-5 text-emerald-600" />
                  New Financing Request
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowNewRequestForm(false)}
                >
                  ✕
                </Button>
              </div>
              <CardDescription>
                Upload your invoice and proof of work to get instant funding offers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Invoice Number</Label>
                  <Input
                    value={newRequest.invoice_number}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, invoice_number: e.target.value }))}
                    placeholder="INV-250829-001"
                  />
                </div>
                <div>
                  <Label>Buyer Company Name</Label>
                  <Input
                    value={newRequest.buyer_name}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, buyer_name: e.target.value }))}
                    placeholder="Ridgeway Butchery"
                  />
                </div>
                <div>
                  <Label>Buyer Company Registration (Optional)</Label>
                  <Input
                    value={newRequest.buyer_company_registration}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, buyer_company_registration: e.target.value }))}
                    placeholder="2019/123456/07"
                  />
                </div>
                <div>
                  <Label>Invoice Amount (R)</Label>
                  <Input
                    type="number"
                    value={newRequest.invoice_amount || ''}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, invoice_amount: parseFloat(e.target.value) || 0 }))}
                    placeholder="15000"
                  />
                </div>
                <div>
                  <Label>Invoice Date</Label>
                  <Input
                    type="date"
                    value={newRequest.invoice_date}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, invoice_date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={newRequest.due_date}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, due_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Requested Advance Amount (R)</Label>
                  <Input
                    type="number"
                    value={newRequest.requested_amount || ''}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, requested_amount: parseFloat(e.target.value) || 0 }))}
                    placeholder="12750"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Typically 80-90% of invoice value
                  </p>
                </div>
                <div className="flex items-end">
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 w-full">
                    <p className="text-sm font-medium text-emerald-800">Advance Rate</p>
                    <p className="text-2xl font-bold text-emerald-900">
                      {newRequest.invoice_amount > 0 ? Math.round((newRequest.requested_amount / newRequest.invoice_amount) * 100) : 0}%
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Upload Invoice (PDF)</Label>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setNewRequest(prev => ({ ...prev, invoice_file: e.target.files?.[0] || null }))}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Original invoice document
                  </p>
                </div>
                <div>
                  <Label>Upload Proof of Work (PDF/Image)</Label>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setNewRequest(prev => ({ ...prev, proof_of_work_file: e.target.files?.[0] || null }))}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Delivery note, signed contract, etc.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewRequestForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={submitRequest}
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={!newRequest.invoice_number || !newRequest.buyer_name || !newRequest.invoice_amount}
                >
                  Submit Request
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requests">My Requests</TabsTrigger>
            <TabsTrigger value="offers">Active Offers</TabsTrigger>
            <TabsTrigger value="funded">Funded</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <BarChart3 className="h-5 w-5 text-emerald-600" />
                  How Pay-Me-Now Works
                </CardTitle>
                <CardDescription>
                  Get cash for your invoices in 4 simple steps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Upload className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">1. Upload</h3>
                    <p className="text-sm text-slate-600">Upload your invoice and proof of delivery</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">2. Verify</h3>
                    <p className="text-sm text-slate-600">We verify your buyer via CIPC and credit checks</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">3. Get Offers</h3>
                    <p className="text-sm text-slate-600">Receive firm offers from funding partners</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Zap className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">4. Get Paid</h3>
                    <p className="text-sm text-slate-600">Same-day payment via RTC/PayShap</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-slate-900">Recent Financing Activity</CardTitle>
                <CardDescription>
                  Your latest financing requests and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financingRequests.slice(0, 5).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{request.invoice_number}</p>
                          <p className="text-sm text-slate-600">{request.buyer_name}</p>
                        </div>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.replace('_', ' ')}
                        </Badge>
                        {request.funding_partner && (
                          <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                            {request.funding_partner}
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-900">R{request.invoice_amount.toLocaleString()}</p>
                        <p className="text-sm text-emerald-600">
                          {request.advance_rate && `${request.advance_rate}% advance`}
                        </p>
                        <p className="text-xs text-slate-500">Due: {request.due_date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            {/* Filter */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-900">My Financing Requests</CardTitle>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="funded">Funded</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="declined">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRequests.map((request) => (
                    <div key={request.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-medium text-slate-900">{request.invoice_number}</p>
                            <p className="text-sm text-slate-600">{request.buyer_name}</p>
                          </div>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusIcon(request.status)}
                            {request.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-slate-900">R{request.invoice_amount.toLocaleString()}</p>
                          <p className="text-sm text-slate-500">Requested: R{request.requested_amount.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500">Invoice Date</p>
                          <p className="font-medium">{request.invoice_date}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Due Date</p>
                          <p className="font-medium">{request.due_date}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Days to Maturity</p>
                          <p className={`font-medium ${request.days_to_maturity < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                            {request.days_to_maturity} days
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">Proof of Work</p>
                          <p className={`font-medium ${request.proof_of_work_uploaded ? 'text-emerald-600' : 'text-red-600'}`}>
                            {request.proof_of_work_uploaded ? 'Uploaded' : 'Missing'}
                          </p>
                        </div>
                      </div>

                      {request.funding_partner && (
                        <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-emerald-800">Funded by {request.funding_partner}</p>
                              <p className="text-sm text-emerald-600">
                                {request.advance_rate}% advance • {request.fee_rate}% fee
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-emerald-800">R{request.net_advance?.toLocaleString()}</p>
                              <p className="text-sm text-emerald-600">Net advance</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        {request.status === 'funded' && (
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                            <Download className="h-3 w-3 mr-1" />
                            Download Agreement
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="offers" className="space-y-6">
            {/* Active Offers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-slate-900">Active Funding Offers</CardTitle>
                <CardDescription>
                  Review and accept offers from funding partners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {sampleOffers.map((offer) => (
                    <div key={offer.id} className="p-6 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Building className="h-6 w-6 text-slate-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{offer.funding_partner}</p>
                            <p className="text-sm text-slate-600">Processing time: {offer.processing_time}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-yellow-200 text-yellow-700">
                          Expires: {new Date(offer.expires_at).toLocaleDateString()}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-emerald-50 rounded-lg">
                          <p className="text-2xl font-bold text-emerald-600">{offer.advance_rate}%</p>
                          <p className="text-sm text-slate-600">Advance Rate</p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{offer.fee_rate}%</p>
                          <p className="text-sm text-slate-600">Fee Rate</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">R{offer.net_advance.toLocaleString()}</p>
                          <p className="text-sm text-slate-600">Net Advance</p>
                        </div>
                        <div className="text-center p-3 bg-slate-50 rounded-lg">
                          <p className="text-2xl font-bold text-slate-600">R{offer.total_fee.toLocaleString()}</p>
                          <p className="text-sm text-slate-600">Total Fee</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="font-medium text-slate-900 mb-2">Terms & Conditions:</p>
                        <ul className="text-sm text-slate-600 space-y-1">
                          {offer.terms_conditions.map((term, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                              {term}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline">
                          Decline
                        </Button>
                        <Button 
                          onClick={() => acceptOffer(offer.id)}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          Accept Offer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="funded" className="space-y-6">
            {/* Funded Invoices */}
            <Card>
              <CardHeader>
                <CardTitle className="text-slate-900">Funded Invoices</CardTitle>
                <CardDescription>
                  Track your funded invoices and expected collections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financingRequests.filter(r => r.status === 'funded' || r.status === 'completed').map((request) => (
                    <div key={request.id} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{request.invoice_number}</p>
                            <p className="text-sm text-slate-600">{request.buyer_name}</p>
                            <p className="text-xs text-slate-500">Funded by {request.funding_partner}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-5 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-slate-500">Invoice Amount</p>
                          <p className="font-medium">R{request.invoice_amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Net Advance</p>
                          <p className="font-medium text-emerald-600">R{request.net_advance?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Reserve</p>
                          <p className="font-medium">R{request.reserve_amount?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Due Date</p>
                          <p className="font-medium">{request.due_date}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Days to Collection</p>
                          <p className={`font-medium ${request.days_to_maturity < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                            {request.days_to_maturity} days
                          </p>
                        </div>
                      </div>

                      {request.status === 'funded' && (
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-blue-800">Awaiting buyer payment</p>
                              <p className="text-sm text-blue-600">Reserve will be released upon collection</p>
                            </div>
                            <Progress value={75} className="w-32" />
                          </div>
                        </div>
                      )}

                      {request.status === 'completed' && (
                        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-emerald-800">Payment collected & reserve released</p>
                              <p className="text-sm text-emerald-600">Transaction completed successfully</p>
                            </div>
                            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}