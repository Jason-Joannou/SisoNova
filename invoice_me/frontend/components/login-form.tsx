"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Chrome, KeyRound } from "lucide-react";
import { LoadingOverlay } from "./loading";
import { config } from "@/lib/secrets";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleGoogleLogin = async () => {
    const baseUrl = config.ENVIRONMENT === "production" ? config.PRODUCTION_API_URL : config.ENVIRONMENT === "staging" ? config.STAGING_API_URL : "http://localhost:3000"
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${baseUrl}/auth/callback` },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingOverlay message="Verifying Credentials..." />}
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Identity</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl border-slate-100 bg-slate-50/50 h-11 focus:border-slate-900 focus:ring-0 transition-all"
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <Label htmlFor="password" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secret</Label>
                <Link href="#" className="text-[9px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-900 transition-colors">
                  Lost Password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full bg-slate-900 hover:bg-black text-white rounded-xl h-12 text-xs font-black tracking-widest transition-all shadow-xl shadow-slate-200"
              disabled={loading}
            >
              {loading ? "AUTHENTICATING..." : "SIGN IN"}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full border-slate-200 rounded-xl h-11 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
              onClick={handleGoogleLogin}
            >
              <Chrome className="mr-2 h-4 w-4 text-slate-400" />
              Continue with Google
            </Button>
          </div>
        </form>

        <div className="text-center pt-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            New to the platform?{" "}
            <Link href="/register" className="text-slate-900 underline underline-offset-4 decoration-slate-200 hover:decoration-slate-900 transition-all">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}