"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowRight, ArrowLeft, Building2, Shield, CheckCircle2 } from "lucide-react"
import Link from "next/link"

// Industry types enum
const INDUSTRY_TYPES = [
  { value: "retail", label: "Retail" },
  { value: "legal", label: "Legal" },
  { value: "entertainment", label: "Entertainment" },
  { value: "construction", label: "Construction" },
  { value: "consulting", label: "Consulting" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "other", label: "Other" },
]

// South African provinces
const SA_PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
]

export function RegisterForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Business Profile
    company_name: "",
    trading_name: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    province: "",
    postal_code: "",
    country: "South Africa",
    vat_number: "",
    company_registration: "",
    industry_type: "",
    
    // Step 2: User Details
    email: "",
    password: "",
    confirm_password: "",
    phone_number: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNextStep = () => {
    setCurrentStep(2)
  }

  const handlePrevStep = () => {
    setCurrentStep(1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Registration data:", formData)
  }

  return (
    <div className="w-full max-w-2xl">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            currentStep >= 1 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
          }`}>
            {currentStep > 1 ? <CheckCircle2 className="w-5 h-5" /> : "1"}
          </div>
          <div className={`w-16 h-1 ${currentStep >= 2 ? "bg-emerald-600" : "bg-slate-200"}`}></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            currentStep >= 2 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
          }`}>
            2
          </div>
        </div>
      </div>

      <Card className="shadow-lg border-0">
        {currentStep === 1 ? (
          // Step 1: Business Profile
          <>
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-emerald-600" />
              </div>
              <CardTitle className="text-2xl text-slate-900">Business Information</CardTitle>
              <CardDescription className="text-slate-600">
                Tell us about your business so we can verify and tailor our services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
                <div className="grid gap-6">
                  {/* Company Details */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company_name" className="text-slate-700 font-medium">
                        Company Name *
                      </Label>
                      <Input
                        id="company_name"
                        value={formData.company_name}
                        onChange={(e) => handleInputChange("company_name", e.target.value)}
                        placeholder="Your Company (Pty) Ltd"
                        required
                        className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="trading_name" className="text-slate-700 font-medium">
                        Trading Name
                      </Label>
                      <Input
                        id="trading_name"
                        value={formData.trading_name}
                        onChange={(e) => handleInputChange("trading_name", e.target.value)}
                        placeholder="If different from company name"
                        className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Industry */}
                  <div className="space-y-2">
                    <Label htmlFor="industry_type" className="text-slate-700 font-medium">
                      Industry *
                    </Label>
                    <Select value={formData.industry_type} onValueChange={(value) => handleInputChange("industry_type", value)}>
                      <SelectTrigger className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRY_TYPES.map((industry) => (
                          <SelectItem key={industry.value} value={industry.value}>
                            {industry.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Address */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">Business Address</h3>
                    <div className="space-y-2">
                      <Label htmlFor="address_line_1" className="text-slate-700 font-medium">
                        Address Line 1 *
                      </Label>
                      <Input
                        id="address_line_1"
                        value={formData.address_line_1}
                        onChange={(e) => handleInputChange("address_line_1", e.target.value)}
                        placeholder="Street address"
                        required
                        className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address_line_2" className="text-slate-700 font-medium">
                        Address Line 2
                      </Label>
                      <Input
                        id="address_line_2"
                        value={formData.address_line_2}
                        onChange={(e) => handleInputChange("address_line_2", e.target.value)}
                        placeholder="Suite, unit, building, floor, etc."
                        className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-slate-700 font-medium">
                          City *
                        </Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          placeholder="City"
                          required
                          className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="province" className="text-slate-700 font-medium">
                          Province *
                        </Label>
                        <Select value={formData.province} onValueChange={(value) => handleInputChange("province", value)}>
                          <SelectTrigger className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500">
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                          <SelectContent>
                            {SA_PROVINCES.map((province) => (
                              <SelectItem key={province} value={province}>
                                {province}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postal_code" className="text-slate-700 font-medium">
                          Postal Code *
                        </Label>
                        <Input
                          id="postal_code"
                          value={formData.postal_code}
                          onChange={(e) => handleInputChange("postal_code", e.target.value)}
                          placeholder="0000"
                          required
                          className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Registration Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">Registration Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company_registration" className="text-slate-700 font-medium">
                          Company Registration Number
                        </Label>
                        <Input
                          id="company_registration"
                          value={formData.company_registration}
                          onChange={(e) => handleInputChange("company_registration", e.target.value)}
                          placeholder="2023/123456/07"
                          className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vat_number" className="text-slate-700 font-medium">
                          VAT Number
                        </Label>
                        <Input
                          id="vat_number"
                          value={formData.vat_number}
                          onChange={(e) => handleInputChange("vat_number", e.target.value)}
                          placeholder="4123456789"
                          className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Why we need this info */}
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-emerald-900 mb-2">Why we need this information</h4>
                        <ul className="text-sm text-emerald-800 space-y-1">
                          <li>• <strong>Verification:</strong> We verify your business with CIPC to ensure legitimacy</li>
                          <li>• <strong>Risk Assessment:</strong> Industry and location help us assess financing options</li>
                          <li>• <strong>Compliance:</strong> Required for KYC/AML and regulatory compliance</li>
                          <li>• <strong>Tailored Service:</strong> We customize our offerings based on your business type</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Continue to Account Setup <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </>
        ) : (
          // Step 2: User Account
          <>
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              <CardTitle className="text-2xl text-slate-900">Create Your Account</CardTitle>
              <CardDescription className="text-slate-600">
                Set up your login credentials to access your SisoNova dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone_number" className="text-slate-700 font-medium">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone_number"
                      type="tel"
                      value={formData.phone_number}
                      onChange={(e) => handleInputChange("phone_number", e.target.value)}
                      placeholder="+27 12 345 6789"
                      required
                      className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700 font-medium">
                      Password *
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="Create a strong password"
                      required
                      className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm_password" className="text-slate-700 font-medium">
                      Confirm Password *
                    </Label>
                    <Input
                      id="confirm_password"
                      type="password"
                      value={formData.confirm_password}
                      onChange={(e) => handleInputChange("confirm_password", e.target.value)}
                      placeholder="Confirm your password"
                      required
                      className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Security note */}
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Your data is secure</h4>
                        <p className="text-sm text-slate-600">
                          Your data is encrypted and in compliance with POPIA regulations. 
                          Your information is never shared without your consent.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handlePrevStep}
                      className="flex-1"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    >
                      Create Account
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </>
        )}
      </Card>

      {/* Login link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}