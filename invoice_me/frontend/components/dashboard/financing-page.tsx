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
import { StatsCardData } from "@/lib/types/user-interface"
import { StatsGrid } from "../ui/stats-cards"
import { FinancingRequest, FinancingStats } from "@/lib/types/financing"
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
    requested_amount: 12750,
    invoice_date: "2025-08-25",
    due_date: "2025-09-25",
    days_to_maturity: 10,
    status: "funded",
    recommended_offer: {
      funding_partner: "Capital Partners", // Internal reference
      advance_rate: 85,
      fee_rate: 2.5,
      reserve_percentage: 15,
      net_advance: 12375,
      total_fee: 375,
      processing_time: "2-4 hours",
      terms_conditions: [
        "Invoice must be genuine and unpaid",
        "Buyer credit verification completed",
        "Payment routed through dedicated account",
        "Reserve released upon buyer payment"
      ]
    },
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
    requested_amount: 7225,
    invoice_date: "2025-08-20",
    due_date: "2025-09-20",
    days_to_maturity: 5,
    status: "offer_ready", // New status for when we have the best offer ready
    recommended_offer: {
      funding_partner: "SME Finance Solutions", // Internal
      advance_rate: 85,
      fee_rate: 3.0,
      reserve_percentage: 15,
      net_advance: 6908.75, // 7225 - (7225 * 0.03) - fee calculation
      total_fee: 216.25,
      processing_time: "1-2 hours",
      terms_conditions: [
        "Buyer verification completed via CIPC",
        "Same-day funding available",
        "Automated payment reconciliation",
        "No hidden fees or charges"
      ]
    },
    proof_of_work_uploaded: true,
    created_at: "2025-08-20"
  },
  {
    id: "3",
    invoice_number: "INV-250815-003",
    buyer_name: "WLDF SA",
    invoice_amount: 12000,
    requested_amount: 10200,
    invoice_date: "2025-08-15",
    due_date: "2025-09-15",
    days_to_maturity: 0,
    status: "under_review", // Still matching with partners
    proof_of_work_uploaded: true,
    created_at: "2025-08-15"
  },
  {
    id: "4",
    invoice_number: "INV-250810-004",
    buyer_name: "Tech Solutions Ltd",
    invoice_amount: 22500,
    requested_amount: 19125,
    invoice_date: "2025-08-10",
    due_date: "2025-09-10",
    days_to_maturity: -5, // Overdue
    status: "completed",
    recommended_offer: {
      funding_partner: "Capital Partners",
      advance_rate: 85,
      fee_rate: 2.5,
      reserve_percentage: 15,
      net_advance: 18562.5,
      total_fee: 562.5,
      processing_time: "2-4 hours",
      terms_conditions: [
        "Invoice must be genuine and unpaid",
        "Buyer credit verification completed",
        "Payment routed through dedicated account",
        "Reserve released upon buyer payment"
      ]
    },
    proof_of_work_uploaded: true,
    created_at: "2025-08-10",
    funded_at: "2025-08-10"
  }
]

const financingStatsData: StatsCardData[] = [
  {
    title: "Total Financed",
    value: financingStats.total_financed,
    subtitle: "Invoices",
    icon: FileText,
    iconColor: "text-slate-500",
    subtitleColor: "text-slate-500"
  },
  {
    title: "Advanced",
    value: `${(financingStats.total_advanced / 1000000).toFixed(1)}M`,
    subtitle: "Total funded",
    icon: DollarSign,
    iconColor: "text-emerald-600",
    subtitleColor: "text-emerald-600 font-medium",
    valuePrefix: "R"
  },
  {
    title: "Active",
    value: financingStats.active_requests,
    subtitle: "Requests",
    icon: Clock,
    iconColor: "text-blue-600",
    subtitleColor: "text-slate-500"
  },
  {
    title: "Avg Rate",
    value: financingStats.average_advance_rate,
    subtitle: "Advance",
    icon: Percent,
    iconColor: "text-emerald-600",
    subtitleColor: "text-slate-500",
    valueSuffix: "%"
  },
  {
    title: "Avg Time",
    value: financingStats.average_processing_time,
    subtitle: "Processing",
    icon: Timer,
    iconColor: "text-blue-600",
    subtitleColor: "text-slate-500",
    valueSuffix: "h"
  },
  {
    title: "Success Rate",
    value: financingStats.success_rate,
    subtitle: "Approval",
    icon: Target,
    iconColor: "text-emerald-600",
    subtitleColor: "text-emerald-600 font-medium",
    valueSuffix: "%"
  },
  {
    title: "Fees Paid",
    value: `${(financingStats.total_fees_paid / 1000).toFixed(0)}K`,
    subtitle: "Total",
    icon: CreditCard,
    iconColor: "text-slate-500",
    subtitleColor: "text-slate-500",
    valuePrefix: "R"
  }
];

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
      case 'offer_ready': return 'bg-green-100 text-green-800'
      case 'accepted': return 'bg-emerald-100 text-emerald-800'
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
      case 'offer_ready': return <CheckCircle2 className="h-3 w-3" />
      case 'accepted': return <CheckCircle2 className="h-3 w-3" />
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
  const acceptOffer = async (requestId: string) => {
    console.log("Accepting offer for request:", requestId)
    // API call to accept the offer
    // Update status to 'accepted' then 'funded'
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
              <p className="text-slate-600">Upload your invoice and get our best funding offer instantly</p>
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
        <StatsGrid 
          cards={financingStatsData} 
          columns={{ md: 7, lg: 7 }}
          className="mb-8"
        />

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
                Upload your invoice and proof of work to get our best funding offer
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
            <TabsTrigger value="ready">Ready to Accept</TabsTrigger>
            <TabsTrigger value="funded">Funded</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <BarChart3 className="h-5 w-5 text-emerald-600" />
                  How SisoNova Financing Works
                </CardTitle>
                <CardDescription>
                  We find you the best funding offer from our partner network
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
                    <h3 className="font-semibold text-slate-900 mb-2">2. We Match</h3>
                    <p className="text-sm text-slate-600">We find the best offer from our funding partners</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">3. Single Offer</h3>
                    <p className="text-sm text-slate-600">Receive one clear, competitive offer</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Zap className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">4. Get Paid</h3>
                    <p className="text-sm text-slate-600">Same-day payment to your account</p>
                  </div>
                </div>

                {/* Value Proposition */}
                <div className="mt-8 grid grid-cols-3 gap-6 p-6 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600 mb-2">No Auctions</div>
                    <p className="text-sm text-slate-600">Single, firm offer only</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600 mb-2">Clear Pricing</div>
                    <p className="text-sm text-slate-600">Flat fees, no surprises</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600 mb-2">Private Process</div>
                    <p className="text-sm text-slate-600">Your data stays confidential</p>
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
                        {request.recommended_offer && (
                          <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                            {request.recommended_offer.advance_rate}% advance
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-900">R{request.invoice_amount.toLocaleString()}</p>
                        <p className="text-sm text-emerald-600">
                          {request.recommended_offer && `Net: R${request.recommended_offer.net_advance.toLocaleString()}`}
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
                      <SelectItem value="offer_ready">Offer Ready</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
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

                      {request.recommended_offer && (request.status === 'funded' || request.status === 'completed') && (
                        <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-emerald-800">Funded Successfully</p>
                              <p className="text-sm text-emerald-600">
                                {request.recommended_offer.advance_rate}% advance • {request.recommended_offer.fee_rate}% fee
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-emerald-800">R{request.recommended_offer.net_advance.toLocaleString()}</p>
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
                        {(request.status === 'funded' || request.status === 'completed') && (
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

          <TabsContent value="ready" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-slate-900">Ready to Accept</CardTitle>
                <CardDescription>
                  We've found the best funding offers for your invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {financingRequests
                    .filter(request => request.status === 'offer_ready')
                    .map((request) => (
                    <div key={request.id} className="p-6 border-2 border-emerald-200 rounded-lg bg-emerald-50">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{request.invoice_number}</h3>
                          <p className="text-slate-600">{request.buyer_name}</p>
                          <p className="text-sm text-slate-500">Invoice Amount: R{request.invoice_amount.toLocaleString()}</p>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Offer Ready
                        </Badge>
                      </div>

                      {request.recommended_offer && (
                        <>
                          <div className="mb-6">
                            <h4 className="font-medium text-slate-900 mb-3">Your Funding Offer</h4>
                            <div className="grid grid-cols-4 gap-4">
                              <div className="text-center p-4 bg-white rounded-lg border">
                                <p className="text-2xl font-bold text-emerald-600">{request.recommended_offer.advance_rate}%</p>
                                <p className="text-sm text-slate-600">Advance Rate</p>
                              </div>
                              <div className="text-center p-4 bg-white rounded-lg border">
                                <p className="text-2xl font-bold text-blue-600">{request.recommended_offer.fee_rate}%</p>
                                <p className="text-sm text-slate-600">Total Fee</p>
                              </div>
                              <div className="text-center p-4 bg-white rounded-lg border">
                                <p className="text-2xl font-bold text-emerald-600">R{request.recommended_offer.net_advance.toLocaleString()}</p>
                                <p className="text-sm text-slate-600">You Receive</p>
                              </div>
                              <div className="text-center p-4 bg-white rounded-lg border">
                                <p className="text-2xl font-bold text-slate-600">{request.recommended_offer.processing_time}</p>
                                <p className="text-sm text-slate-600">Processing Time</p>
                              </div>
                            </div>
                          </div>

                          <div className="mb-6 p-4 bg-white rounded-lg border">
                            <h5 className="font-medium text-slate-900 mb-3">How it works:</h5>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-slate-600">• You receive: <span className="font-medium text-emerald-600">R{request.recommended_offer.net_advance.toLocaleString()}</span></p>
                                <p className="text-slate-600">• Reserve held: <span className="font-medium">R{(request.invoice_amount * (request.recommended_offer.reserve_percentage / 100)).toLocaleString()}</span></p>
                              </div>
                              <div>
                                <p className="text-slate-600">• Total fee: <span className="font-medium">R{request.recommended_offer.total_fee.toLocaleString()}</span></p>
                                <p className="text-slate-600">• Reserve released when buyer pays</p>
                              </div>
                            </div>
                          </div>

                          <div className="mb-6">
                            <h5 className="font-medium text-slate-900 mb-3">Terms & Conditions:</h5>
                            <ul className="text-sm text-slate-600 space-y-2">
                              {request.recommended_offer.terms_conditions.map((term, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                  {term}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="text-sm text-slate-500">
                              This offer is valid for 24 hours
                            </div>
                            <div className="flex gap-3">
                              <Button variant="outline">
                                Need More Info?
                              </Button>
                              <Button 
                                onClick={() => acceptOffer(request.id)}
                                className="bg-emerald-600 hover:bg-emerald-700"
                              >
                                Accept Offer
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}

                  {financingRequests.filter(r => r.status === 'offer_ready').length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">No offers ready</h3>
                      <p className="text-slate-600 mb-4">Submit a new financing request to get started</p>
                      <Button 
                        onClick={() => setShowNewRequestForm(true)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Request
                      </Button>
                    </div>
                  )}
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
                            <p className="text-xs text-slate-500">SisoNova Financing</p>
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
                          <p className="font-medium text-emerald-600">R{request.recommended_offer?.net_advance.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Reserve</p>
                          <p className="font-medium">R{request.recommended_offer ? (request.invoice_amount * (request.recommended_offer.reserve_percentage / 100)).toLocaleString() : 0}</p>
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