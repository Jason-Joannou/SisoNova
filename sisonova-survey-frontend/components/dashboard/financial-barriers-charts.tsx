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
import LoadingState from "../shared/loading-state";
import { useDashboard } from "@/lib/hooks/use-dashboard";
import { DemographicsChartsProps } from "@/lib/types/component";

export default function FinancialBarriersCharts({
  filters,
  apiUrlSuffix,
}: DemographicsChartsProps) {
  const { data, loading, error } = useDashboard(filters, apiUrlSuffix);

  const paperworkAvoidance = data.dashboard_response?.PAPERWORK_AVOIDANCE;
  const financialLiteracyLevel =
    data.dashboard_response?.FINANCIAL_LITERACY_LEVEL;
  const documentationBarriers = data.dashboard_response?.DOCUMENTATION_BARRIERS;
  const financialServiceConcerns =
    data.dashboard_response?.FINANCIAL_SERVICE_CONCERNS;
  const financialConfidence =
    data.dashboard_response?.FINANCIAL_CONFIDENCE?.avg;
  const financialConfusionResponse =
    data.dashboard_response?.FINANCIAL_CONFUSION_RESPONSE;
  const financialInstitutionTrust =
    data.dashboard_response?.FINANCIAL_INSTITUTION_TRUST;
  const negativeFinancialExperiences =
    data.dashboard_response?.NEGATIVE_FINANCIAL_EXPERIENCES;
  const financialExclusionFeeling =
    data.dashboard_response?.FINANCIAL_EXCLUSION_FEELING;
  const clarityImpactOnUsage = data.dashboard_response?.CLARITY_IMPACT_ON_USAGE;

  const dataFound = data.data_found !== false;

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
      {!dataFound && (
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <p>No data found for the selected filters.</p>
              <p>Try adjusting your filter criteria.</p>
            </div>
          </CardContent>
        </Card>
      )}
      {dataFound && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Paper Work Avoidance Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paperworkAvoidance}
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
                      {paperworkAvoidance.map((entry, index) => (
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
              <div className="text-muted-foreground text-sm text-center px-4">
                This represents how often a respondent has avoided a financial
                service due to paperwork issues.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Literacy Level Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={financialLiteracyLevel}
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
                      {financialLiteracyLevel.map((entry, index) => (
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
              <div className="text-muted-foreground text-sm text-center px-4">
                This represents the level of understanding respondents have of
                financial paperwork.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documentation Barriers Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={documentationBarriers}
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
                      {documentationBarriers.map((entry, index) => (
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
              <div className="text-muted-foreground text-sm text-center px-4">
                This represents whether respondents have been asked for
                documentation but could deliver.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Service Concerns Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={financialServiceConcerns}
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
                      {financialServiceConcerns.map((entry, index) => (
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
              <div className="text-muted-foreground text-sm text-center px-4">
                This represents the worries that a respondents faces when using
                financial services.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Confusion Response Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={financialConfusionResponse}
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
                      {financialConfusionResponse.map((entry, index) => (
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
              <div className="text-muted-foreground text-sm text-center px-4">
                This represents the action the respondent takes when they do not
                understand a financial service.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Negative Financial Experience Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={negativeFinancialExperiences}
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
                      {negativeFinancialExperiences.map((entry, index) => (
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
              <div className="text-muted-foreground text-sm text-center px-4">
                This represents whether the respondent had any bad experiences
                when using a financial service.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Institution Trust Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={financialInstitutionTrust}
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
                      {financialInstitutionTrust.map((entry, index) => (
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
              <div className="text-muted-foreground text-sm text-center px-4">
                This represents the trust respondents have in financial
                institutions.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Exclusion Feelings Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={financialExclusionFeeling}
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
                      {financialExclusionFeeling.map((entry, index) => (
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
              <div className="text-muted-foreground text-sm text-center px-4">
                This represents whether a respondent feels included in the
                current financial landscape.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clarity Impact on Usage Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={clarityImpactOnUsage}
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
                      {clarityImpactOnUsage.map((entry, index) => (
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
              <div className="text-muted-foreground text-sm text-center px-4">
                This represents whether or not respondents would use more
                financial services if they were explained clearer.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                The average financial confidence score rated by a respondend{" "}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
                <div className="text-6xl font-bold text-primary">
                  {financialConfidence}/5
                </div>
                <div className="text-muted-foreground text-sm text-center px-4">
                  This represents the average financial confidence based on the
                  selected filters.
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
