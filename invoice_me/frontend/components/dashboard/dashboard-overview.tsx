"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  Wallet,
  Zap,
  CreditCard,
  Smartphone,
  Clock,
  Activity,
  MessageSquare,
  Brain,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { BusinessProfileModal } from "../modals/ui/business-profile";
import { BusinessProfile } from "@/lib/types/invoicing";
import { API_ROUTES } from "@/lib/utility/api/routes";
import { apiClient } from "@/lib/api-client";

// Types
interface FinancialSnapshot {
  cashOnHand: number;
  moneyOwedToYou: number;
  overduePayments: number;
  nextPaymentDue: {
    amount: number;
    daysUntil: number;
    customerName: string;
  } | null;
}

interface AvailableService {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  isActive: boolean;
  summary: {
    label: string;
    value: string | number;
    trend?: "up" | "down" | "neutral";
  }[];
  route: string;
}

interface BusinessHealth {
  score: number;
  factors: {
    label: string;
    status: "good" | "fair" | "poor";
    value: string;
  }[];
}

export function DashboardOverview() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (user?.business_profile.length === 0) {
      setShowProfileModal(true);
    }
  }, [user?.business_profile]);

  const handleBusinessProfileSubmit = async (data: BusinessProfile) => {
    try {
      const response = await apiClient(API_ROUTES.addBusinessProfile, {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error("Failed to save business profile");
      }

      await refreshUser();
      setShowProfileModal(false);
    } catch (error) {
      console.error("Error saving business profile:", error);
    }
  };

  const businessHealth: BusinessHealth = {
    score: 72,
    factors: [
      { label: "Payment patterns", status: "good", value: "Good" },
      { label: "Cash flow", status: "good", value: "Stable" },
      { label: "Growth", status: "good", value: "+12%" },
    ],
  };

  const financialServices: AvailableService[] = [
    {
      id: "invoicing",
      name: "Invoicing",
      description: "Create and manage professional invoices",
      icon: Smartphone,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      isActive: true,
      summary: [
        { label: "Sent this month", value: 12, trend: "up" },
        { label: "Total outstanding", value: "R45k" },
        { label: "Paid on time", value: "85%", trend: "up" },
      ],
      route: "/dashboard/invoicing",
    },
    {
      id: "financing",
      name: "Invoice Financing",
      description: "Get paid immediately for your invoices",
      icon: Zap,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      isActive: true,
      summary: [
        { label: "Available to finance", value: "R8.5k" },
        { label: "Active advances", value: 2 },
        { label: "Total financed", value: "R145k" },
      ],
      route: "/dashboard/financing",
    },
    {
      id: "collections",
      name: "Collections",
      description: "Track and collect overdue payments",
      icon: CreditCard,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      isActive: true,
      summary: [
        { label: "Overdue invoices", value: 8 },
        { label: "Total overdue", value: "R15k" },
        { label: "Success rate", value: "92%", trend: "up" },
      ],
      route: "/dashboard/collections",
    },
  ];

  const aiAssistants: AvailableService[] = [
    {
      id: "ai-agents",
      name: "AI Agents",
      description: "Get personalized insights and recommendations",
      icon: Brain,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      isActive: true,
      summary: [
        { label: "Active agents", value: 4 },
        { label: "Insights today", value: 6 },
        { label: "Actions suggested", value: 3 },
      ],
      route: "/dashboard/agents",
    },
  ];

  const getHealthScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

  const getFactorColor = (status: "good" | "fair" | "poor") => {
    switch (status) {
      case "good":
        return "text-emerald-600";
      case "fair":
        return "text-amber-600";
      case "poor":
        return "text-red-600";
    }
  };

  const getTrendIcon = (trend?: "up" | "down" | "neutral") => {
    if (!trend) return null;
    if (trend === "up")
      return <TrendingUp className="h-3 w-3 text-emerald-600" />;
    if (trend === "down")
      return <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <BusinessProfileModal
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
        onSubmit={handleBusinessProfileSubmit}
        title="Complete Your Business Profile"
        description="Before you can access your dashboard, we need some information about your business."
        submitButtonText="Complete Setup"
        allowClose={false}
      />
      <div className="space-y-6 p-6 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.business_profile[0]?.company_name || "there"}
          </h1>
          <p className="text-slate-600 text-sm">Your available services</p>
        </div>

        {/* Financial Services */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Financial Services
            </h2>
            <p className="text-sm text-slate-600">
              Digital services that help you grow your business
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {financialServices.map((service) => (
              <Card
                key={service.id}
                className={`border-2 ${service.borderColor} hover:shadow-lg transition-all cursor-pointer group`}
                onClick={() => router.push(service.route)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`p-3 rounded-lg ${service.bgColor} ${service.color} group-hover:scale-110 transition-transform`}
                    >
                      <service.icon className="h-6 w-6" />
                    </div>
                    {service.isActive && (
                      <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base">{service.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2.5">
                    {service.summary.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between"
                      >
                        <span className="text-xs text-slate-600">
                          {item.label}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-slate-900">
                            {item.value}
                          </span>
                          {getTrendIcon(item.trend)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-3 group-hover:bg-slate-100 text-xs"
                  >
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* AI-Powered Insights */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              AI-Powered Insights
            </h2>
            <p className="text-sm text-slate-600">
              Smart recommendations to help grow your business
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {aiAssistants.map((service) => (
              <Card
                key={service.id}
                className={`border-2 ${service.borderColor} hover:shadow-lg transition-all cursor-pointer group`}
                onClick={() => router.push(service.route)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`p-3 rounded-lg ${service.bgColor} ${service.color} group-hover:scale-110 transition-transform`}
                    >
                      <service.icon className="h-6 w-6" />
                    </div>
                    {service.isActive && (
                      <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base">{service.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2.5">
                    {service.summary.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between"
                      >
                        <span className="text-xs text-slate-600">
                          {item.label}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-slate-900">
                            {item.value}
                          </span>
                          {getTrendIcon(item.trend)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-3 group-hover:bg-slate-100 text-xs"
                  >
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}