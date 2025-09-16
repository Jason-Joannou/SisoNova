// components/dashboard/collections-page.tsx
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
import { StatsCardData } from "@/lib/types/user-interface"
import { StatsGrid } from "../ui/stats-cards"
import { ReminderSettings, CollectionItem, CollectionStats } from "@/lib/types/collections"
import { 
  Plus, 
  Trash2, 
  Eye, 
  Send, 
  TrendingUp, 
  Clock,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Phone,
  Mail,
  Building,
  User,
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  Bell,
  Target,
  Zap
} from "lucide-react"

// Dummy data
const collectionStats: CollectionStats = {
  total_outstanding: 145000,
  total_collected_this_month: 89500,
  average_collection_days: 18,
  collection_success_rate: 94.2,
  overdue_amount: 23500,
  active_collections: 34
}

const collectionItems: CollectionItem[] = [
  {
    id: "1",
    invoice_number: "INV-250825-001",
    buyer_name: "Ridgeway Butchery",
    buyer_email: "accounts@ridgewaybutchery.co.za",
    buyer_phone: "+27 11 987 6543",
    amount: 15000,
    due_date: "2025-09-15",
    days_overdue: 0,
    status: "active",
    dedicated_account: "ACC-RID-001",
    payment_reference: "INV-250825-001-RID",
    reminder_count: 1,
    created_at: "2025-08-25"
  },
  {
    id: "2",
    invoice_number: "INV-250820-002",
    buyer_name: "De Abreu Essop Inc",
    buyer_email: "finance@deabreuessop.co.za",
    amount: 8500,
    due_date: "2025-09-10",
    days_overdue: 5,
    status: "overdue",
    dedicated_account: "ACC-DEA-002",
    payment_reference: "INV-250820-002-DEA",
    last_reminder_sent: "2025-09-12",
    reminder_count: 2,
    created_at: "2025-08-20"
  },
  {
    id: "3",
    invoice_number: "INV-250815-003",
    buyer_name: "WLDF SA",
    buyer_email: "admin@wldfsa.co.za",
    amount: 12000,
    due_date: "2025-08-30",
    days_overdue: 15,
    status: "overdue",
    dedicated_account: "ACC-WLD-003",
    payment_reference: "INV-250815-003-WLD",
    last_reminder_sent: "2025-09-10",
    reminder_count: 3,
    created_at: "2025-08-15"
  },
  {
    id: "4",
    invoice_number: "INV-250810-004",
    buyer_name: "Tech Solutions Ltd",
    buyer_email: "payments@techsolutions.co.za",
    amount: 22500,
    due_date: "2025-08-25",
    days_overdue: 0,
    status: "paid",
    dedicated_account: "ACC-TEC-004",
    payment_reference: "INV-250810-004-TEC",
    reminder_count: 0,
    created_at: "2025-08-10"
  }
]

const defaultReminderSettings: ReminderSettings = {
  enabled: true,
  reminder_schedule: [-7, -3, 0, 3, 7, 14], // Days relative to due date
  whatsapp_enabled: true,
  email_enabled: true,
  sms_enabled: false,
  escalation_enabled: true,
  escalation_days: 30,
  custom_message: "Hi {buyer_name}, this is a friendly reminder that invoice {invoice_number} for R{amount} is due on {due_date}. Please use reference {payment_reference} when making payment. Thank you!"
}

const collectionsStatsData: StatsCardData[] = [
  {
    title: "Outstanding",
    value: collectionStats.total_outstanding.toLocaleString(),
    subtitle: "Total pending",
    icon: DollarSign,
    iconColor: "text-slate-500",
    subtitleColor: "text-slate-500",
    valuePrefix: "R"
  },
  {
    title: "Collected",
    value: collectionStats.total_collected_this_month.toLocaleString(),
    subtitle: "This month",
    icon: TrendingUp,
    iconColor: "text-emerald-600",
    subtitleColor: "text-emerald-600 font-medium",
    valuePrefix: "R"
  },
  {
    title: "Avg Days",
    value: collectionStats.average_collection_days,
    subtitle: "To collect",
    icon: Calendar,
    iconColor: "text-blue-600",
    subtitleColor: "text-slate-500"
  },
  {
    title: "Success Rate",
    value: collectionStats.collection_success_rate,
    subtitle: "Collection rate",
    icon: Target,
    iconColor: "text-emerald-600",
    subtitleColor: "text-emerald-600 font-medium",
    valueSuffix: "%"
  },
  {
    title: "Overdue",
    value: collectionStats.overdue_amount.toLocaleString(),
    subtitle: "Needs attention",
    icon: AlertTriangle,
    iconColor: "text-red-500",
    subtitleColor: "text-red-600 font-medium",
    valuePrefix: "R"
  },
  {
    title: "Active",
    value: collectionStats.active_collections,
    subtitle: "Collections",
    icon: BarChart3,
    iconColor: "text-blue-600",
    subtitleColor: "text-slate-500"
  }
];

export function CollectionsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>(defaultReminderSettings)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Filter items based on status and search
  const filteredItems = collectionItems.filter(item => {
    const matchesStatus = filterStatus === "all" || item.status === filterStatus
    const matchesSearch = searchTerm === "" || 
      item.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      case 'disputed': return 'bg-yellow-100 text-yellow-800'
      case 'written_off': return 'bg-gray-100 text-gray-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle2 className="h-3 w-3" />
      case 'overdue': return <AlertTriangle className="h-3 w-3" />
      case 'disputed': return <MessageSquare className="h-3 w-3" />
      default: return <Clock className="h-3 w-3" />
    }
  }

  // Send reminder function (placeholder)
  const sendReminder = async (itemId: string, method: 'email' | 'whatsapp' | 'sms') => {
    console.log(`Sending ${method} reminder for item ${itemId}`)
    // Here you would call your API
  }

  // Bulk actions
  const sendBulkReminders = async () => {
    console.log("Sending bulk reminders to:", selectedItems)
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
                <TrendingUp className="h-8 w-8 text-blue-600" />
                Smart Collections
              </h1>
              <p className="text-slate-600">Automated payment collection and reconciliation</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <Plus className="h-4 w-4 mr-2" />
                Add Collection
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsGrid 
          cards={collectionsStatsData} 
          columns={{ md: 6, lg: 6 }}
          className="mb-8"
        />

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common collection tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col gap-2 border-blue-200 hover:bg-blue-50">
                    <Plus className="h-5 w-5 text-blue-600" />
                    <span className="text-sm">New Collection</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 border-emerald-200 hover:bg-emerald-50">
                    <Send className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm">Send Reminders</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 border-purple-200 hover:bg-purple-50">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    <span className="text-sm">WhatsApp Blast</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 border-slate-200 hover:bg-slate-50">
                    <BarChart3 className="h-5 w-5 text-slate-600" />
                    <span className="text-sm">View Reports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-slate-900">Recent Collection Activity</CardTitle>
                <CardDescription>
                  Latest updates on your collections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {collectionItems.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${getStatusColor(item.status)}`}>
                          {getStatusIcon(item.status)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{item.invoice_number}</p>
                          <p className="text-sm text-slate-600">{item.buyer_name}</p>
                        </div>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        {item.days_overdue > 0 && (
                          <Badge variant="destructive">
                            {item.days_overdue} days overdue
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-900">R{item.amount.toLocaleString()}</p>
                        <p className="text-sm text-slate-500">Due: {item.due_date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collections" className="space-y-6">
            {/* Filters and Search */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-900">Active Collections</CardTitle>
                  <div className="flex gap-2">
                    {selectedItems.length > 0 && (
                      <Button onClick={sendBulkReminders} size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Send className="h-4 w-4 mr-2" />
                        Send Reminders ({selectedItems.length})
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by buyer name or invoice number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="disputed">Disputed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Collections Table */}
                <div className="space-y-2">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems([...selectedItems, item.id])
                            } else {
                              setSelectedItems(selectedItems.filter(id => id !== item.id))
                            }
                          }}
                          className="rounded border-slate-300"
                        />
                        <div>
                          <p className="font-medium text-slate-900">{item.invoice_number}</p>
                          <p className="text-sm text-slate-600">{item.buyer_name}</p>
                          <p className="text-xs text-slate-500">Ref: {item.payment_reference}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(item.status)}>
                            {getStatusIcon(item.status)}
                            {item.status}
                          </Badge>
                          {item.days_overdue > 0 && (
                            <Badge variant="destructive">
                              {item.days_overdue} days overdue
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium text-slate-900">R{item.amount.toLocaleString()}</p>
                          <p className="text-sm text-slate-500">Due: {item.due_date}</p>
                          {item.last_reminder_sent && (
                            <p className="text-xs text-slate-400">Last reminder: {item.last_reminder_sent}</p>
                          )}
                        </div>
                        
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendReminder(item.id, 'email')}
                            className="border-blue-200 text-blue-700 hover:bg-blue-50"
                          >
                            <Mail className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendReminder(item.id, 'whatsapp')}
                            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          >
                            <MessageSquare className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendReminder(item.id, 'sms')}
                            className="border-purple-200 text-purple-700 hover:bg-purple-50"
                          >
                            <Phone className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reminders" className="space-y-6">
            {/* Reminder Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Bell className="h-5 w-5 text-blue-600" />
                  Automated Reminder Settings
                </CardTitle>
                <CardDescription>
                  Configure when and how reminders are sent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Enable Automated Reminders</Label>
                    <p className="text-sm text-slate-600">Automatically send payment reminders</p>
                  </div>
                  <Switch
                    checked={reminderSettings.enabled}
                    onCheckedChange={(checked) => setReminderSettings(prev => ({ ...prev, enabled: checked }))}
                  />
                </div>

                {reminderSettings.enabled && (
                  <>
                    <Separator />
                    
                    {/* Reminder Channels */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Reminder Channels</Label>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">Email</span>
                          </div>
                          <Switch
                            checked={reminderSettings.email_enabled}
                            onCheckedChange={(checked) => setReminderSettings(prev => ({ ...prev, email_enabled: checked }))}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-emerald-600" />
                            <span className="text-sm font-medium">WhatsApp</span>
                          </div>
                          <Switch
                            checked={reminderSettings.whatsapp_enabled}
                            onCheckedChange={(checked) => setReminderSettings(prev => ({ ...prev, whatsapp_enabled: checked }))}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium">SMS</span>
                          </div>
                          <Switch
                            checked={reminderSettings.sms_enabled}
                            onCheckedChange={(checked) => setReminderSettings(prev => ({ ...prev, sms_enabled: checked }))}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Reminder Schedule */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Reminder Schedule</Label>
                      <p className="text-sm text-slate-600">Days relative to due date (negative = before, positive = after)</p>
                      <div className="grid grid-cols-6 gap-2">
                        {reminderSettings.reminder_schedule.map((day, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={day}
                              onChange={(e) => {
                                const newSchedule = [...reminderSettings.reminder_schedule]
                                newSchedule[index] = parseInt(e.target.value) || 0
                                setReminderSettings(prev => ({ ...prev, reminder_schedule: newSchedule }))
                              }}
                              className="text-center"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setReminderSettings(prev => ({
                            ...prev,
                            reminder_schedule: [...prev.reminder_schedule, 0]
                          }))}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Day
                        </Button>
                        {reminderSettings.reminder_schedule.length > 1 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setReminderSettings(prev => ({
                              ...prev,
                              reminder_schedule: prev.reminder_schedule.slice(0, -1)
                            }))}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Custom Message */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Custom Reminder Message</Label>
                      <p className="text-sm text-slate-600">
                        Available variables: {"{buyer_name}"}, {"{invoice_number}"}, {"{amount}"}, {"{due_date}"}, {"{payment_reference}"}
                      </p>
                      <Textarea
                        value={reminderSettings.custom_message || ''}
                        onChange={(e) => setReminderSettings(prev => ({ ...prev, custom_message: e.target.value }))}
                        rows={4}
                        placeholder="Enter your custom reminder message..."
                      />
                    </div>

                    <Separator />

                    {/* Escalation Settings */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Enable Escalation</Label>
                          <p className="text-sm text-slate-600">Escalate to management after specified days</p>
                        </div>
                        <Switch
                          checked={reminderSettings.escalation_enabled}
                          onCheckedChange={(checked) => setReminderSettings(prev => ({ ...prev, escalation_enabled: checked }))}
                        />
                      </div>

                      {reminderSettings.escalation_enabled && (
                        <div>
                          <Label>Escalation Days</Label>
                          <Input
                            type="number"
                            value={reminderSettings.escalation_days}
                            onChange={(e) => setReminderSettings(prev => ({ ...prev, escalation_days: parseInt(e.target.value) || 30 }))}
                            min="1"
                            className="w-32"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* Collection Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Settings className="h-5 w-5 text-blue-600" />
                  Collection Settings
                </CardTitle>
                <CardDescription>
                  Configure your collection preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label>Default Payment Terms</Label>
                    <Select defaultValue="net_30">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="due_on_receipt">Due on Receipt</SelectItem>
                        <SelectItem value="net_15">Net 15 Days</SelectItem>
                        <SelectItem value="net_30">Net 30 Days</SelectItem>
                        <SelectItem value="net_60">Net 60 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Currency</Label>
                    <Select defaultValue="ZAR">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ZAR">South African Rand (ZAR)</SelectItem>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-base font-medium">Auto-Reconciliation Settings</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm font-medium">Auto-match payments</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm font-medium">Send payment confirmations</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm font-medium">Update accounting system</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm font-medium">Generate receipts</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-base font-medium">Integration Settings</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <Button variant="outline" className="h-16 flex-col gap-2">
                      <Building className="h-5 w-5" />
                      <span className="text-sm">Xero</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col gap-2">
                      <Building className="h-5 w-5" />
                      <span className="text-sm">Sage</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col gap-2">
                      <Building className="h-5 w-5" />
                      <span className="text-sm">QuickBooks</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}