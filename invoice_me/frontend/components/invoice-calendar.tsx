"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Eye, CalendarDays } from "lucide-react"
import { Invoice } from "@/lib/types/dashboard"

// Dummy calendar data
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

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Invoice Calendar</CardTitle>
                <CardDescription>Track due dates and payment schedules</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium min-w-[120px] text-center">{monthYear}</span>
                <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDay }, (_, i) => (
                <div key={`empty-${i}`} className="p-2 h-20" />
              ))}
              
              {/* Days of the month */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1
                const invoicesForDay = getInvoicesForDate(day)
                
                return (
                  <div key={day} className="p-1 h-20 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <div className="text-sm font-medium mb-1">{day}</div>
                    <div className="space-y-1">
                      {invoicesForDay.slice(0, 2).map(invoice => (
                        <div
                          key={invoice.id}
                          className="text-xs p-1 rounded bg-primary/10 text-primary truncate"
                          onClick={() => setSelectedInvoice(invoice)}
                        >
                          {invoice.invoiceNumber}
                        </div>
                      ))}
                      {invoicesForDay.length > 2 && (
                        <div className="text-xs text-muted-foreground">
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
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
            <CardDescription>
              {selectedInvoice ? 'Selected invoice information' : 'Click on an invoice to view details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedInvoice ? (
              <div className="space-y-4">
                <div>
                  <p className="font-medium">{selectedInvoice.invoiceNumber}</p>
                  <p className="text-sm text-muted-foreground">{selectedInvoice.buyerName}</p>
                </div>
                
                <div className="flex gap-2">
                  <Badge variant={
                    selectedInvoice.status === 'paid' ? 'default' :
                    selectedInvoice.status === 'overdue' ? 'destructive' :
                    selectedInvoice.status === 'financed' ? 'secondary' : 'outline'
                  }>
                    {selectedInvoice.status}
                  </Badge>
                  <Badge variant="outline">
                    {selectedInvoice.service}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Amount:</span>
                    <span className="font-medium">R{selectedInvoice.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Due Date:</span>
                    <span className="font-medium">{selectedInvoice.dueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Created:</span>
                    <span className="font-medium">{selectedInvoice.createdAt}</span>
                  </div>
                </div>

                <Button className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Details
                </Button>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select an invoice from the calendar to view details</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Due Dates */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Upcoming Due Dates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {calendarInvoices.slice(0, 3).map(invoice => (
                <div key={invoice.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="text-sm font-medium">{invoice.invoiceNumber}</p>
                    <p className="text-xs text-muted-foreground">{invoice.buyerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">R{invoice.amount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{invoice.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}