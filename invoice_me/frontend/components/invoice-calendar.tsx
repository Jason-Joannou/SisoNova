"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Eye, CalendarDays, Clock, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Invoice } from "@/lib/types/dashboard"

// More realistic calendar data with various dates
const calendarInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-001",
    buyerName: "Ridgeway Butchery",
    amount: 15000,
    dueDate: "2025-09-15",
    status: "pending",
    service: "financing",
    createdAt: "2025-08-25"
  },
  {
    id: "2",
    invoiceNumber: "INV-002",
    buyerName: "De Abreu Essop Inc",
    amount: 8500,
    dueDate: "2025-09-10",
    status: "overdue",
    service: "collections",
    createdAt: "2025-08-20"
  },
  {
    id: "3",
    invoiceNumber: "INV-003",
    buyerName: "WLDF SA",
    amount: 12000,
    dueDate: "2025-09-20",
    status: "financed",
    service: "financing",
    createdAt: "2025-08-28"
  },
  {
    id: "4",
    invoiceNumber: "INV-004",
    buyerName: "Tech Solutions Ltd",
    amount: 22500,
    dueDate: "2025-09-05",
    status: "paid",
    service: "invoicing",
    createdAt: "2025-08-15"
  },
  {
    id: "5",
    invoiceNumber: "INV-005",
    buyerName: "Green Energy Co",
    amount: 18750,
    dueDate: "2025-09-25",
    status: "pending",
    service: "collections",
    createdAt: "2025-08-30"
  },
  {
    id: "6",
    invoiceNumber: "INV-006",
    buyerName: "Metro Construction",
    amount: 35000,
    dueDate: "2025-09-12",
    status: "financed",
    service: "financing",
    createdAt: "2025-08-22"
  }
]

export function InvoiceCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getInvoicesForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return calendarInvoices.filter(invoice => invoice.dueDate === dateStr)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getInvoiceColor = (invoice: Invoice) => {
    if (invoice.status === 'overdue') return 'bg-red-100 text-red-800 border-red-200'
    if (invoice.status === 'paid') return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    if (invoice.status === 'financed') return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    if (invoice.service === 'financing') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    if (invoice.service === 'collections') return 'bg-blue-50 text-blue-700 border-blue-200'
    return 'bg-purple-50 text-purple-700 border-purple-200'
  }

  const isToday = (day: number) => {
    const today = new Date()
    return today.getDate() === day && 
           today.getMonth() === currentDate.getMonth() && 
           today.getFullYear() === currentDate.getFullYear()
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  // Get upcoming invoices (next 7 days)
  const getUpcomingInvoices = () => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    return calendarInvoices
      .filter(invoice => {
        const dueDate = new Date(invoice.dueDate)
        return dueDate >= today && dueDate <= nextWeek
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  }

  const upcomingInvoices = getUpcomingInvoices()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-900">Invoice Calendar</CardTitle>
                  <CardDescription className="text-slate-600">Track due dates and payment schedules</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')} className="border-slate-200 hover:bg-slate-50">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="font-medium min-w-[120px] text-center text-slate-900">{monthYear}</span>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('next')} className="border-slate-200 hover:bg-slate-50">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-slate-600">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: firstDay }, (_, i) => (
                  <div key={`empty-${i}`} className="p-2 h-24" />
                ))}
                
                {/* Days of the month */}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1
                  const invoicesForDay = getInvoicesForDate(day)
                  const todayClass = isToday(day) ? 'bg-emerald-50 border-emerald-200' : 'border-slate-200'
                  
                  return (
                    <div key={day} className={`p-1 h-24 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors ${todayClass}`}>
                      <div className={`text-sm font-medium mb-1 ${isToday(day) ? 'text-emerald-700' : 'text-slate-900'}`}>
                        {day}
                      </div>
                      <div className="space-y-1">
                        {invoicesForDay.slice(0, 2).map(invoice => (
                          <div
                            key={invoice.id}
                            className={`text-xs p-1 rounded truncate cursor-pointer transition-colors ${getInvoiceColor(invoice)}`}
                            onClick={() => setSelectedInvoice(invoice)}
                            title={`${invoice.invoiceNumber} - ${invoice.buyerName} - R${invoice.amount.toLocaleString()}`}
                          >
                            {invoice.invoiceNumber}
                          </div>
                        ))}
                        {invoicesForDay.length > 2 && (
                          <div className="text-xs text-slate-500 font-medium">
                            +{invoicesForDay.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoice Details Sidebar */}
        <div className="space-y-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-slate-900">Invoice Details</CardTitle>
              <CardDescription className="text-slate-600">
                {selectedInvoice ? 'Selected invoice information' : 'Click on an invoice to view details'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedInvoice ? (
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-slate-900">{selectedInvoice.invoiceNumber}</p>
                    <p className="text-sm text-slate-600">{selectedInvoice.buyerName}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Badge variant={
                      selectedInvoice.status === 'paid' ? 'default' :
                      selectedInvoice.status === 'overdue' ? 'destructive' :
                      selectedInvoice.status === 'financed' ? 'secondary' : 'outline'
                    } className={
                      selectedInvoice.status === 'paid' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' :
                      selectedInvoice.status === 'financed' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' : ''
                    }>
                      {selectedInvoice.status === 'paid' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {selectedInvoice.status === 'overdue' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {selectedInvoice.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                      {selectedInvoice.status}
                    </Badge>
                    <Badge variant="outline" className={
                      selectedInvoice.service === 'financing' ? 'border-emerald-200 text-emerald-700' :
                      selectedInvoice.service === 'collections' ? 'border-blue-200 text-blue-700' :
                      'border-purple-200 text-purple-700'
                    }>
                      {selectedInvoice.service}
                    </Badge>
                  </div>

                  <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Amount:</span>
                      <span className="font-medium text-slate-900">R{selectedInvoice.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Due Date:</span>
                      <span className="font-medium text-slate-900">{selectedInvoice.dueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Created:</span>
                      <span className="font-medium text-slate-900">{selectedInvoice.createdAt}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Details
                  </Button>
                </div>
              ) : (
                <div className="text-center text-slate-500 py-8">
                  <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select an invoice from the calendar to view details</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Due Dates */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-600" />
                Upcoming Due Dates
              </CardTitle>
              <CardDescription className="text-slate-600">
                Next 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingInvoices.length > 0 ? (
                  upcomingInvoices.map(invoice => (
                    <div 
                      key={invoice.id} 
                      className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedInvoice(invoice)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          invoice.status === 'overdue' ? 'bg-red-500' :
                          invoice.status === 'paid' ? 'bg-emerald-500' :
                          invoice.status === 'financed' ? 'bg-emerald-500' :
                          'bg-slate-400'
                        }`} />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{invoice.invoiceNumber}</p>
                          <p className="text-xs text-slate-600">{invoice.buyerName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">R{invoice.amount.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">{invoice.dueDate}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-500">
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No invoices due in the next 7 days</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}