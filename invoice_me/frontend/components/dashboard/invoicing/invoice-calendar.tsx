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
        
        {/* 1. NARRATIVE HEADER (Condensed/Polished) */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">
              Payment <span className="text-slate-400 font-light not-italic">Calendar</span>
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed max-w-lg">
              Manage upcoming deadlines and visualize your cash flow rhythm. 
            </p>
          </div>
          
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
                  const isCurrentDay = isToday(day);
                  
                  // HIGHLIGHT LOGIC: Is the currently selected invoice on THIS day?
                  const isDaySelected = selectedInvoice && 
                    new Date(selectedInvoice.dueDate).getDate() === day &&
                    new Date(selectedInvoice.dueDate).getMonth() === currentDate.getMonth();

                  return (
                    <div 
                      key={day} 
                      className={`min-h-[110px] p-3 rounded-[1.5rem] border transition-all duration-300 relative group
                        ${isDaySelected 
                          ? 'border-purple-600 bg-white shadow-xl shadow-purple-100 z-10 scale-[1.02]' 
                          : isCurrentDay 
                            ? 'bg-purple-600 border-purple-600 shadow-lg shadow-purple-200' 
                            : 'bg-slate-50/50 border-slate-100 hover:border-slate-300 hover:bg-white'
                        }`}
                    >
                      <div className={`text-xs font-black mb-2 flex justify-between items-center
                        ${isCurrentDay ? 'text-white' : isDaySelected ? 'text-purple-600' : 'text-slate-400'}`}>
                        {day}
                        {isCurrentDay && <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
                      </div>

                      <div className="space-y-1.5">
                        {invoicesForDay.map(inv => (
                          <div 
                            key={inv.id} 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedInvoice(inv);
                            }}
                            className={`px-2 py-1 rounded-lg text-[9px] font-bold truncate cursor-pointer transition-all border
                              ${selectedInvoice?.id === inv.id 
                                ? 'bg-purple-600 text-white border-purple-600 scale-105 shadow-md' 
                                : isCurrentDay 
                                  ? 'bg-white/20 text-white border-transparent'
                                  : inv.status === 'overdue' 
                                    ? 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100' 
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-purple-300'}`}
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
             <Card className={`rounded-[2.5rem] border-none shadow-2xl transition-all duration-500 p-8
                ${selectedInvoice ? 'bg-white shadow-purple-100' : 'bg-slate-50/50 shadow-slate-200'}`}>
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Invoice Detail</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {selectedInvoice ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
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

                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Amount</p>
                          <p className="text-sm font-black text-slate-900 mt-1">R{selectedInvoice.amount.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Due Date</p>
                          <p className="text-sm font-black text-slate-900 mt-1">{new Date(selectedInvoice.dueDate).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</p>
                        </div>
                      </div>

                      <Button className="w-full bg-slate-900 text-white rounded-2xl font-black text-xs py-6 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                        <Eye className="h-4 w-4 mr-2" /> VIEW FULL INVOICE
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12 space-y-4 opacity-40">
                       <MousePointer2 className="h-10 w-10 text-slate-300 mx-auto animate-bounce" />
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select a date <br/> to view activity</p>
                    </div>
                  )}
                </CardContent>
             </Card>

             {/* Upcoming Quick View */}
             <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
                <Zap className="absolute -top-4 -right-4 h-24 w-24 text-white/5 rotate-12" />
                <h3 className="text-xs font-black uppercase tracking-widest text-purple-400 mb-8 relative z-10">Next 7 Days</h3>
                <div className="space-y-6 relative z-10">
                   {upcomingInvoices.slice(0, 4).map(inv => (
                     <div key={inv.id} className="flex items-center justify-between group cursor-pointer" onClick={() => setSelectedInvoice(inv)}>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-300 group-hover:text-purple-400 transition-colors">{inv.buyerName}</p>
                          <p className="text-[9px] text-slate-500 font-bold uppercase">{inv.invoiceNumber}</p>
                        </div>
                        <span className="text-xs font-black">R{(inv.amount/1000).toFixed(1)}k</span>
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