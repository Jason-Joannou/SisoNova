"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RegisterForm } from "@/components/registration-form"

export default function page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/">
                <span className="text-2xl font-bold text-slate-900 cursor-pointer">SisoNova</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="cursor-pointer">How it works</Button>
              <Button variant="ghost" className="cursor-pointer">Pricing</Button>
              <Link href="/login">
                <Button variant="outline" className="cursor-pointer">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Registration Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex justify-center">
          <div className="w-full max-w-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Join SisoNova</h1>
              <p className="text-slate-600">Get your business paid faster in just 2 steps</p>
            </div>
            
            {/* Register Form Component */}
            <RegisterForm />
          </div>
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