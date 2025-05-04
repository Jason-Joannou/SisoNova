// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useStoryLine } from "@/lib/hooks/use-storyline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UbuntuHeading } from "@/components/ui/ubuntu-heading";
import LoadingState from "@/components/shared/loading-state";
import {
  DownloadIcon,
  FilterIcon,
  BarChart3Icon,
  PieChartIcon,
  TableIcon,
  HomeIcon,
  InfoIcon,
} from "lucide-react";
import DemographicsCharts from "@/components/dashboard/demographic-charts";
import PersonalIncomeCharts from "@/components/dashboard/personal-income-charts";
import IncomeManagementCharts from "@/components/dashboard/personal-income-management-charts";
import FinancialAccessCharts from "@/components/dashboard/financial-access-charts";
import FinancialBarriersCharts from "@/components/dashboard/financial-barriers-charts";
import PsychologicalBarriersCharts from "@/components/dashboard/psychological-barriers-charts";
import TechnologicalUnderstandingCharts from "@/components/dashboard/technological-barriers-charts";
import DataTable from "@/components/dashboard/data-table";

export default function DashboardPage() {
  const [gender, setGender] = useState<string | undefined>(undefined);
  const [ageGroup, setAgeGroup] = useState<string | undefined>(undefined);
  const [province, setProvince] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("demographics");
  const [viewMode, setViewMode] = useState<"charts" | "table">("charts");

  const { data, loading, error } = useStoryLine(gender);

  // Reset filters
  const resetFilters = () => {
    setGender(undefined);
    setAgeGroup(undefined);
    setProvince(undefined);
  };

  const dashboardFilters = {
    gender,
    ageGroup,
    province,
  };

  // Download CSV
  const downloadData = () => {
    if (!data || !data.raw_data) return;

    const rows = data.raw_data;
    const header = Object.keys(rows[0]);
    const csv = [
      header.join(","), // header row
      ...rows.map((row) =>
        header.map((field) => JSON.stringify(row[field] ?? "")).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sisonova_survey_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen w-full relative">
      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-end mb-6"
        >
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              asChild
            >
              <Link href="/">
                <HomeIcon className="h-4 w-4 mr-1" />
                Home
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              asChild
            >
              <Link href="/about">
                <InfoIcon className="h-4 w-4 mr-1" />
                About
              </Link>
            </Button>
          </div>
        </motion.div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <UbuntuHeading>Survey Data Dashboard</UbuntuHeading>
            <p className="text-muted-foreground">
              Explore and analyze the financial inclusion survey data
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === "charts" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("charts")}
            >
              <BarChart3Icon className="h-4 w-4 mr-2" />
              Charts
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              <TableIcon className="h-4 w-4 mr-2" />
              Table
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FilterIcon className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Gender</label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Genders" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={undefined}>All Genders</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Age Group
                </label>
                <Select value={ageGroup} onValueChange={setAgeGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Age Groups" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={undefined}>All Age Groups</SelectItem>
                    <SelectItem value="Under 18">Under 18 years</SelectItem>
                    <SelectItem value="18-24">18-24 years</SelectItem>
                    <SelectItem value="25-34">25-34 years</SelectItem>
                    <SelectItem value="35-44">35-44 years</SelectItem>
                    <SelectItem value="45-54">45-54 years</SelectItem>
                    <SelectItem value="55 and above">55 and above</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Province
                </label>
                <Select value={province} onValueChange={setProvince}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Provinces" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={undefined}>All Provinces</SelectItem>
                    <SelectItem value="Gauteng">Gauteng</SelectItem>
                    <SelectItem value="Western Cape">Western Cape</SelectItem>
                    <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                    <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                    <SelectItem value="Free State">Free State</SelectItem>
                    <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                    <SelectItem value="North West">North West</SelectItem>
                    <SelectItem value="Limpopo">Limpopo</SelectItem>
                    <SelectItem value="Northern Cape">Northern Cape</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end gap-2">
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="flex-1"
                >
                  Reset Filters
                </Button>
                <Button
                  onClick={downloadData}
                  variant="outline"
                  className="flex-1"
                >
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {viewMode === "charts" ? (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="bg-gray-100 rounded-2xl flex flex-nowrap overflow-x-auto gap-x-2 w-full px-2">
              <TabsTrigger
                value="demographics"
                className="data-[state=active]:bg-black data-[state=active]:text-white border border-black rounded-xl px-4 py-2"
              >
                User Demographics
              </TabsTrigger>
              <TabsTrigger
                value="income"
                className="data-[state=active]:bg-black data-[state=active]:text-white border border-black rounded-xl px-4 py-2"
              >
                User Income Information
              </TabsTrigger>
              <TabsTrigger
                value="financial"
                className="data-[state=active]:bg-black data-[state=active]:text-white border border-black rounded-xl px-4 py-2"
              >
                User Financial Management
              </TabsTrigger>
              <TabsTrigger
                value="access"
                className="data-[state=active]:bg-black data-[state=active]:text-white border border-black rounded-xl px-4 py-2"
              >
                User Financial Access
              </TabsTrigger>
              <TabsTrigger
                value="barriers"
                className="data-[state=active]:bg-black data-[state=active]:text-white border border-black rounded-xl px-4 py-2"
              >
                User Financial Barriers
              </TabsTrigger>
              <TabsTrigger
                value="psych-barriers"
                className="data-[state=active]:bg-black data-[state=active]:text-white border border-black rounded-xl px-4 py-2"
              >
                User Psychological Barriers
              </TabsTrigger>
              <TabsTrigger
                value="technology"
                className="data-[state=active]:bg-black data-[state=active]:text-white border border-black rounded-xl px-4 py-2"
              >
                User Technology Barriers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="demographics" className="space-y-4">
              <DemographicsCharts
                filters={dashboardFilters}
                apiUrlSuffix="demographics"
              />
            </TabsContent>

            <TabsContent value="income" className="space-y-4">
              <PersonalIncomeCharts
                filters={dashboardFilters}
                apiUrlSuffix="income"
              />
            </TabsContent>

            <TabsContent value="financial" className="space-y-4">
              <IncomeManagementCharts
                filters={dashboardFilters}
                apiUrlSuffix="income_management"
              />
            </TabsContent>

            <TabsContent value="access" className="space-y-4">
              <FinancialAccessCharts
                filters={dashboardFilters}
                apiUrlSuffix="financial_access"
              />
            </TabsContent>

            <TabsContent value="barriers" className="space-y-4">
              <FinancialBarriersCharts
                filters={dashboardFilters}
                apiUrlSuffix="financial_barriers"
              />
            </TabsContent>

            <TabsContent value="psych-barriers" className="space-y-4">
              <PsychologicalBarriersCharts
                filters={dashboardFilters}
                apiUrlSuffix="psychological_barriers"
              />
            </TabsContent>

            <TabsContent value="technology" className="space-y-4">
              <TechnologicalUnderstandingCharts
                filters={dashboardFilters}
                apiUrlSuffix="technological_understanding"
              />
            </TabsContent>
          </Tabs>
        ) : (
          <DataTable data={data.stats} />
        )}
      </div>
    </div>
  );
}
