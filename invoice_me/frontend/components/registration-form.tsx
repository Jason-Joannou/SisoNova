"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ShieldCheck, Chrome } from "lucide-react"; // Swapped for Google icon context
import { LoadingOverlay } from "./loading";
import { config } from "@/lib/secrets";

export function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await register(formData.email, formData.password);
    } catch (err: any) {
      setError(err.message || "Registration failed");
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    const baseUrl = config.ENVIRONMENT === "production" ? config.PRODUCTION_API_URL : config.ENVIRONMENT === "staging" ? config.STAGING_API_URL : "http://localhost:3000"
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${baseUrl}/auth/callback` },
    });
  };

  return (
    <>
      {loading && <LoadingOverlay message="Initializing Account..." />}
      <div className="space-y-6">
        {/* Google Signup - Tightened */}
        <Button
          type="button"
          variant="outline"
          className="w-full border-slate-200 rounded-xl h-11 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
          onClick={handleGoogleSignup}
          disabled={loading}
        >
          <Chrome className="mr-2 h-4 w-4 text-slate-400" />
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100" /></div>
          <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.2em]">
            <span className="bg-white px-4 text-slate-300">Or use email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.co.za"
                value={formData.email}
                onChange={handleChange}
                required
                className="rounded-xl border-slate-100 bg-slate-50/50 h-11 focus:border-slate-900 focus:ring-0 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="rounded-xl border-slate-100 bg-slate-50/50 h-11 focus:border-slate-900 focus:ring-0 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm_password" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Verify Password</Label>
              <Input
                id="confirm_password"
                name="confirm_password"
                type="password"
                placeholder="••••••••"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                className="rounded-xl border-slate-100 bg-slate-50/50 h-11 focus:border-slate-900 focus:ring-0 transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wide">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-slate-900 hover:bg-black text-white rounded-xl h-12 text-xs font-black tracking-widest transition-all shadow-xl shadow-slate-200"
            disabled={loading}
          >
            {loading ? "PROCESSING..." : "CREATE ACCOUNT"}
          </Button>

          <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            Already registered?{" "}
            <Link href="/login" className="text-slate-900 underline underline-offset-4 decoration-slate-200 hover:decoration-slate-900 transition-all">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}