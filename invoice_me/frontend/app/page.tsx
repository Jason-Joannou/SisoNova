"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle2, Clock, CreditCard, FileText, Shield, Smartphone, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-slate-900">SisoNova</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="cursor-pointer">How it works</Button>
              <Button variant="ghost" className="cursor-pointer">Pricing</Button>
              <Link href="/register">
                <Button variant="outline" className="cursor-pointer">Register</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="cursor-pointer">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
              Get paid <span className="text-emerald-600">today</span> on your invoices
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Stop waiting 30-60 days for payment. Upload your invoice, get verified, and receive instant cash. 
              We handle collections while you focus on growing your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer">
                Get Paid Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="cursor-pointer">
                See How It Works
              </Button>
            </div>
            <p className="mt-6 text-sm text-slate-500">
              Trusted by SMEs across South Africa • No hidden fees • Same-day payment
            </p>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                The cashflow crisis killing South African SMEs
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">30-60 day payment terms</p>
                    <p className="text-slate-600">Your money is trapped while bills keep coming</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FileText className="h-6 w-6 text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">Manual chaos</p>
                    <p className="text-slate-600">WhatsApp threads, wrong references, lost invoices</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="h-6 w-6 text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">Hours wasted chasing</p>
                    <p className="text-slate-600">Time you could spend growing your business</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-center">
                <div className="text-6xl font-bold text-red-500 mb-2">R30.5B</div>
                <p className="text-slate-600 mb-4">Outstanding invoices in SA</p>
                <div className="text-4xl font-bold text-slate-900 mb-2">42 days</div>
                <p className="text-slate-600">Average payment delay</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Services */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Three ways to take control of your cashflow
            </h2>
            <p className="text-xl text-slate-600">Choose what works for your business</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <div className="absolute top-0 right-0 bg-emerald-600 text-white px-3 py-1 text-sm rounded-bl-lg">
                Most Popular
              </div>
              <CardHeader>
                <Zap className="h-10 w-10 text-emerald-600 mb-4" />
                <CardTitle>Pay-Me-Now Financing</CardTitle>
                <CardDescription>Get instant cash for your invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm">Upload invoice & proof of work</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm">Get verified offer in minutes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm">Same-day payment via PayShap/RTC</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm">We handle collections</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 cursor-pointer">
                  Get Financing
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CreditCard className="h-10 w-10 text-blue-600 mb-4" />
                <CardTitle>Smart Collections</CardTitle>
                <CardDescription>Automate payment collection</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm">Dedicated payment accounts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm">Automated WhatsApp reminders</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm">Auto-reconciliation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm">No financing required</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 cursor-pointer" variant="outline">
                  Start Collecting
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Smartphone className="h-10 w-10 text-purple-600 mb-4" />
                <CardTitle>Mobile Invoicing</CardTitle>
                <CardDescription>Create & send invoices instantly</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm">WhatsApp-first design</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm">Instant payment links</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm">QR code payments</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm">Xero, Sage, QuickBooks sync</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 cursor-pointer" variant="outline">
                  Create Invoice
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              From invoice to cash in 4 simple steps
            </h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">1</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Upload Invoice</h3>
              <p className="text-sm text-slate-600">Add your invoice and proof of delivery</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">2</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Get Verified</h3>
              <p className="text-sm text-slate-600">We verify your buyer via CIPC</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">3</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Receive Offer</h3>
              <p className="text-sm text-slate-600">Clear, flat-fee pricing instantly</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">4</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Get Paid</h3>
              <p className="text-sm text-slate-600">Same-day payment to your account</p>
            </div>
          </div>

          <div className="mt-12 bg-white p-8 rounded-xl shadow-lg">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-2">No auctions</div>
                <p className="text-slate-600">Single, firm offers only</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-2">Clear pricing</div>
                <p className="text-slate-600">Flat fees, no surprises</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-2">Private process</div>
                <p className="text-slate-600">Your data stays confidential</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              SMEs across South Africa trust us with their cashflow
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <p className="text-slate-600 mb-4 italic">
                  "No more cashflow chokehold. We upload our invoices and get paid the same day. Game changer for our butchery."
                </p>
                <div>
                  <p className="font-semibold text-slate-900">Ridgeway Butchery</p>
                  <p className="text-sm text-slate-500">Retail</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <p className="text-slate-600 mb-4 italic">
                  "Collection headaches are gone. The automated reminders and reconciliation save us hours every week."
                </p>
                <div>
                  <p className="font-semibold text-slate-900">De Abreu Essop Inc</p>
                  <p className="text-sm text-slate-500">Legal Services</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <p className="text-slate-600 mb-4 italic">
                  "Finally, professional invoicing that works with WhatsApp. Our clients love the instant payment links."
                </p>
                <div>
                  <p className="font-semibold text-slate-900">WLDF SA</p>
                  <p className="text-sm text-slate-500">Entertainment</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-600 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Stop waiting. Start growing.
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join thousands of SMEs who've taken control of their cashflow
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 cursor-pointer">
              Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-emerald-600 hover:bg-white/10 cursor-pointer">
              Talk to Sales
            </Button>
          </div>
          <p className="mt-6 text-emerald-100 text-sm">
            No credit card required • Setup in 5 minutes • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">SisoNova</h3>
              <p className="text-sm">The ooba of receivables. Get paid now, grow faster.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Financing</a></li>
                <li><a href="#" className="hover:text-white">Collections</a></li>
                <li><a href="#" className="hover:text-white">Invoicing</a></li>
                <li><a href="#" className="hover:text-white">Trade Insurance</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Partners</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">POPIA</a></li>
                <li><a href="#" className="hover:text-white">FIC Act</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 SisoNova. All rights reserved. Licensed credit provider.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}