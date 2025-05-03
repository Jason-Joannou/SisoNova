// components/dashboard/demographics-charts.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface DemographicsChartsProps {
  data: any;
}

export default function DemographicsCharts({ data }: DemographicsChartsProps) {
  if (!data) return null;

  // Sample data - in a real implementation, you would process your actual data
  const genderData = [
    { name: "Male", value: 48 },
    { name: "Female", value: 48 },
    { name: "Non-binary", value: 2 },
    { name: "Prefer not to say", value: 2 },
  ];

  const ageData = [
    { name: "18-24", value: 15 },
    { name: "25-34", value: 25 },
    { name: "35-44", value: 25 },
    { name: "45-54", value: 15 },
    { name: "55-64", value: 10 },
    { name: "65+", value: 10 },
  ];

  const provinceData = [
    { name: "Gauteng", value: 30 },
    { name: "Western Cape", value: 20 },
    { name: "KwaZulu-Natal", value: 15 },
    { name: "Eastern Cape", value: 10 },
    { name: "Free State", value: 8 },
    { name: "Mpumalanga", value: 7 },
    { name: "North West", value: 5 },
    { name: "Limpopo", value: 3 },
    { name: "Northern Cape", value: 2 },
  ];

  const educationData = [
    { name: "Less than high school", value: 10 },
    { name: "High school", value: 30 },
    { name: "Some college", value: 25 },
    { name: "Bachelor's degree", value: 20 },
    { name: "Master's degree", value: 10 },
    { name: "Doctorate", value: 5 },
  ];

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82ca9d",
    "#ffc658",
    "#8dd1e1",
    "#a4de6c",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Gender Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {genderData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Age Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Geographic Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={provinceData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Education Level</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={educationData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
