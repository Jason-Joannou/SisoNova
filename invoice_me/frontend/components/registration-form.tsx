// components/registration-form.tsx
"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Shield } from "lucide-react"

export function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate passwords match
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match")
      return
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setLoading(true)

    try {
      await register(formData)
    } catch (err: any) {
      setError(err.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="text-center pb-6">
        <div className="flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-emerald-600" />
        </div>
        <CardTitle className="text-2xl text-slate-900">Create Your Account</CardTitle>
        <CardDescription className="text-slate-600">
          Get started with SisoNova in seconds
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 font-medium">
              Email Address *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 font-medium">
              Password *
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
            <p className="text-xs text-slate-500">
              Must be at least 8 characters with uppercase, lowercase, and number
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm_password" className="text-slate-700 font-medium">
              Confirm Password *
            </Label>
            <Input
              id="confirm_password"
              name="confirm_password"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              disabled={loading}
              className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>

          <p className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-600 hover:underline font-semibold">
              Sign in here
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}