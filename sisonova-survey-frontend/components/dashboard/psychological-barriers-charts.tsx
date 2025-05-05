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

export default function PsychologicalBarriersCharts({
  filters,
  apiUrlSuffix,
}: DemographicsChartsProps) {
  const { data, loading, error } = useDashboard(filters, apiUrlSuffix);

  const financialRiskTolerance =
    data.dashboard_response?.FINANCIAL_RISK_TOLERANCE?.avg;
  const debtAttitude = data.dashboard_response?.DEBT_ATTITUDE;
  const debtPerception = data.dashboard_response?.DEBT_PERCEPTION;
  const borrowingComfort = data.dashboard_response?.BORROWING_COMFORT;
  const savingPerception = data.dashboard_response?.SAVING_PERCEPTION;
  const savingPossibilityBelief =
    data.dashboard_response?.SAVING_POSSIBILITY_BELIEF;
  const windfallUsage = data.dashboard_response?.WINDFALL_USAGE;
  const savingBenefitBelief = data.dashboard_response?.SAVING_BENEFIT_BELIEF;
  const purchaseDecisionCriteria =
    data.dashboard_response?.PURCHASE_DECISION_CRITERIA;

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
              <CardTitle>Debt Attitude Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={debtAttitude}
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
                      {debtAttitude.map((entry, index) => (
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
                This represents whether the respondents think that taking on
                debt (like a loan) can be a good idea if they can manage it
                well.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Debt Perception Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={debtPerception}
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
                      {debtPerception.map((entry, index) => (
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
                This represents how the respondents feel when they think of
                debt.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Borrowing Comfort Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={borrowingComfort}
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
                      {borrowingComfort.map((entry, index) => (
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
                This represents how a respondent would feel if they had to
                borrow money when they are short of cash.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Saving Perception Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={savingPerception}
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
                      {savingPerception.map((entry, index) => (
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
                This represents what the term 'saving' means to respondents.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Saving Benefit Belief Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={savingBenefitBelief}
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
                      {savingBenefitBelief.map((entry, index) => (
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
                This represents whether a respondent believes that saving money
                will pay off in the long run.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Saving Possibility Belief Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={savingPossibilityBelief}
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
                      {savingPossibilityBelief.map((entry, index) => (
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
                This represents whether a respondent thinks its possible to save
                money even if they don't have a lot of money or their income
                changes often.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wind Fall Usage Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={windfallUsage}
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
                      {windfallUsage.map((entry, index) => (
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
                This represents what respondents do when they recieve extra
                income
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Purchase Decision Criteria Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={purchaseDecisionCriteria}
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
                      {purchaseDecisionCriteria.map((entry, index) => (
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
                This represents how respondents decide if something is worth
                buying.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                The average financial risk tolerance rated by a respondend{" "}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
                <div className="text-6xl font-bold text-primary">
                  {financialRiskTolerance}/5
                </div>
                <div className="text-muted-foreground text-sm text-center px-4">
                  This represents the average financial risk tolerance based on
                  the selected filters.
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
