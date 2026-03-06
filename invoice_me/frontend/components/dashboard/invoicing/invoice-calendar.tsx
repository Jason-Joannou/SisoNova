"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Eye, CalendarDays, Clock, AlertTriangle, CheckCircle2, MousePointer2, ArrowRight, Zap } from "lucide-react"
import { Invoice } from "@/lib/types/invoicing"

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
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* 1. NARRATIVE HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">
              Payment <span className="text-slate-400 font-light not-italic">Calendar</span>
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed max-w-lg">
              Manage upcoming deadlines and visualize your cash flow rhythm. 
              <span className="text-slate-900 font-bold ml-1">Track what's due to ensure steady liquidity.</span>
            </p>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
             <Button variant="ghost" size="sm" onClick={() => navigateMonth('prev')} className="h-9 w-9 rounded-xl hover:bg-slate-50"><ChevronLeft className="h-4 w-4" /></Button>
             <span className="text-[10px] font-black uppercase tracking-widest min-w-[120px] text-center">{monthYear}</span>
             <Button variant="ghost" size="sm" onClick={() => navigateMonth('next')} className="h-9 w-9 rounded-xl hover:bg-slate-50"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          
          {/* 2. THE CALENDAR STAGE */}
          <main className="col-span-12 lg:col-span-8">
            <Card className="rounded-[3rem] border-none shadow-2xl shadow-slate-200/50 bg-white p-8">
              <div className="grid grid-cols-7 gap-2 mb-6">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: firstDay }, (_, i) => (<div key={`empty-${i}`} />))}
                
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const invoicesForDay = getInvoicesForDate(day);
                  return (
                    <div key={day} className={`min-h-[100px] p-3 rounded-[1.5rem] border transition-all ${isToday(day) ? 'bg-purple-50 border-purple-200' : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'}`}>
                      <div className={`text-xs font-black mb-2 ${isToday(day) ? 'text-purple-600' : 'text-slate-400'}`}>{day}</div>
                      <div className="space-y-1.5">
                        {invoicesForDay.map(inv => (
                          <div 
                            key={inv.id} 
                            onClick={() => setSelectedInvoice(inv)}
                            className={`px-2 py-1 rounded-lg text-[9px] font-bold truncate cursor-pointer transition-transform hover:scale-105 border 
                              ${inv.status === 'overdue' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                                inv.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                'bg-white border-slate-200 text-slate-600'}`}
                          >
                            {inv.buyerName}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </main>

          {/* 3. CONTEXTUAL DETAILS SIDEBAR */}
          <aside className="col-span-12 lg:col-span-4 space-y-8">
             <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/50 bg-white p-8">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Focus Date</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {selectedInvoice ? (
                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-black text-slate-900">{selectedInvoice.invoiceNumber}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{selectedInvoice.buyerName}</p>
                        </div>
                        <Badge className={`rounded-xl px-3 py-1 font-black text-[10px] uppercase border-none ${
                           selectedInvoice.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 
                           selectedInvoice.status === 'overdue' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {selectedInvoice.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Amount</p>
                          <p className="text-sm font-black text-slate-900 mt-1">R{selectedInvoice.amount.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Due Date</p>
                          <p className="text-sm font-black text-slate-900 mt-1">{selectedInvoice.dueDate}</p>
                        </div>
                      </div>

                      <Button className="w-full bg-slate-900 text-white rounded-2xl font-black text-xs py-6 hover:bg-slate-800 transition-all">
                        <Eye className="h-4 w-4 mr-2" /> VIEW INVOICE
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-10 space-y-4">
                       <CalendarDays className="h-10 w-10 text-slate-200 mx-auto" />
                       <p className="text-xs font-bold text-slate-400">SELECT AN INVOICE TO VIEW DETAILS</p>
                    </div>
                  )}
                </CardContent>
             </Card>

             {/* Upcoming */}
             <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-xl">
                <h3 className="text-xs font-black uppercase tracking-widest text-purple-400 mb-6 flex items-center gap-2">
                   <Zap className="h-3 w-3" /> Upcoming
                </h3>
                <div className="space-y-4">
                   {upcomingInvoices.map(inv => (
                     <div key={inv.id} className="flex items-center justify-between group">
                        <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{inv.buyerName}</span>
                        <span className="text-sm font-black">{inv.dueDate}</span>
                     </div>
                   ))}
                </div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  )
}