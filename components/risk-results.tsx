"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import type { RiskAssessmentResult } from "./risk-assessment-form"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { AlertCircle, CheckCircle2, Info, Lightbulb, PieChartIcon } from "lucide-react"

interface RiskResultsProps {
  result: RiskAssessmentResult
}

export default function RiskResults({ result }: RiskResultsProps) {
  const [activeTab, setActiveTab] = useState("summary")
  const [isMounted, setIsMounted] = useState(false)

  // Ensure hydration happens on client only
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Colors for risk score gauge
  const getRiskColor = (score: number) => {
    if (score < 40) return "#4ade80" // green-400
    if (score < 70) return "#facc15" // yellow-400
    return "#f87171" // red-400
  }

  // Handle HTML content from API
  if (result.html) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <PieChartIcon className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Risk Assessment Results</h2>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Risk Profile</CardTitle>
            <CardDescription>Based on your financial profile and investment portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div dangerouslySetInnerHTML={{ __html: result.html }} />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Ensure we have dummy data for asset allocation if it's missing
  const assetAllocation = result.recommendations?.assetAllocation || {
    equity: 40,
    debt: 30,
    realEstate: 15,
    gold: 10,
    cash: 5,
  }

  // Data for asset allocation pie chart
  const assetAllocationData = Object.entries(assetAllocation).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
  }))

  // Colors for asset allocation pie chart
  const COLORS = ["#8242f7", "#4ade80", "#facc15", "#f87171", "#60a5fa"]

  // Define chart config
  const chartConfig = {
    equity: { color: COLORS[0] },
    debt: { color: COLORS[1] },
    realEstate: { color: COLORS[2] },
    gold: { color: COLORS[3] },
    cash: { color: COLORS[4] },
  }

  // If not mounted yet, return null or a loading state to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <PieChartIcon className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Risk Assessment Results</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 w-full animate-pulse rounded-md bg-muted"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <PieChartIcon className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Risk Assessment Results</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="allocation">Asset Allocation</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Risk Profile</CardTitle>
                <CardDescription>Based on your financial profile and investment portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Risk Score Gauge */}
                  <div className="relative flex flex-col items-center">
                    <div className="relative w-48 h-48">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Background circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="10"
                          strokeDasharray="282.7"
                          strokeDashoffset="0"
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                        {/* Foreground circle */}
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke={getRiskColor(result.riskScore || 50)}
                          strokeWidth="10"
                          strokeDasharray="282.7"
                          strokeDashoffset="282.7"
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                          initial={{ strokeDashoffset: 282.7 }}
                          animate={{
                            strokeDashoffset: 282.7 - ((result.riskScore || 50) / 100) * 282.7,
                          }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5, duration: 0.5 }}
                          className="text-4xl font-bold"
                        >
                          {result.riskScore || 50}
                        </motion.div>
                        <div className="text-sm text-muted-foreground">Risk Score</div>
                      </div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="mt-4"
                    >
                      <Badge
                        className={`px-3 py-1 text-white ${
                          result.riskCategory === "Conservative"
                            ? "bg-green-500"
                            : result.riskCategory === "Moderate"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      >
                        {result.riskCategory || "Moderate"}
                      </Badge>
                    </motion.div>
                  </div>

                  {/* Risk Explanation */}
                  <div className="flex-1 space-y-4">
                    <h3 className="text-xl font-semibold">Your Risk Profile: {result.riskCategory || "Moderate"}</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-muted-foreground">
                          {result.riskCategory === "Conservative"
                            ? "You prefer stability and security over high returns. Your portfolio should focus on preserving capital with some growth potential."
                            : result.riskCategory === "Moderate"
                              ? "You seek a balance between growth and security. Your portfolio should include a mix of growth-oriented and stable investments."
                              : "You're comfortable with volatility for potentially higher returns. Your portfolio can focus on growth-oriented investments."}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <p className="text-muted-foreground">
                          {result.riskCategory === "Conservative"
                            ? "Conservative portfolios typically have lower returns but also lower volatility."
                            : result.riskCategory === "Moderate"
                              ? "Moderate portfolios aim to balance risk and return, with medium volatility."
                              : "Aggressive portfolios can experience significant short-term fluctuations but potentially higher long-term returns."}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <p className="text-muted-foreground">
                          Your investment horizon of{" "}
                          <span className="font-medium">
                            {result.riskCategory === "Conservative"
                              ? "shorter-term"
                              : result.riskCategory === "Moderate"
                                ? "medium-term"
                                : "longer-term"}
                          </span>{" "}
                          aligns with your risk profile.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>Recommended Asset Allocation</CardTitle>
                <CardDescription>Optimal distribution of your investments based on your risk profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Pie Chart */}
                  <div className="w-full md:w-1/2 h-[300px]">
                    <ChartContainer config={chartConfig}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={assetAllocationData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
                              const radius = innerRadius + (outerRadius - innerRadius) * 1.3
                              const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180))
                              const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180))
                              return (
                                <text
                                  x={x}
                                  y={y}
                                  fill="#888888"
                                  textAnchor={x > cx ? "start" : "end"}
                                  dominantBaseline="central"
                                  className="text-xs"
                                >
                                  {name} ({(percent * 100).toFixed(0)}%)
                                </text>
                              )
                            }}
                          >
                            {assetAllocationData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                            ))}
                          </Pie>
                          <Tooltip
                            content={(props) => {
                              const { active, payload } = props
                              if (active && payload && payload.length) {
                                return (
                                  <ChartTooltipContent>
                                    <div className="flex items-center gap-1">
                                      <div
                                        className="h-3 w-3 rounded-full"
                                        style={{
                                          backgroundColor:
                                            COLORS[
                                              assetAllocationData.findIndex((item) => item.name === payload[0].name)
                                            ],
                                        }}
                                      />
                                      <span className="font-medium">{payload[0].name}</span>
                                    </div>
                                    <div className="font-bold">{payload[0].value}%</div>
                                  </ChartTooltipContent>
                                )
                              }
                              return null
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>

                  {/* Allocation Details */}
                  <div className="w-full md:w-1/2 space-y-4">
                    <h3 className="text-lg font-semibold">{result.riskCategory || "Moderate"} Portfolio Allocation</h3>
                    <div className="space-y-3">
                      {assetAllocationData.map((asset, index) => (
                        <div key={asset.name} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                              <span>{asset.name}</span>
                            </div>
                            <span className="font-medium">{asset.value}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              initial={{ width: 0 }}
                              animate={{ width: `${asset.value}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4">
                      <div className="flex items-start gap-2">
                        <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-muted-foreground text-sm">
                          This allocation is designed for a{" "}
                          <span className="font-medium">{(result.riskCategory || "moderate").toLowerCase()}</span> risk
                          profile. Adjust based on your specific circumstances and consult with a financial advisor.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>Investment Recommendations</CardTitle>
                <CardDescription>Suggested products based on your risk profile and financial goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Product Suggestions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(
                      result.recommendations?.productSuggestions || [
                        {
                          name: "Nifty 50 Index Fund",
                          type: "Mutual Fund",
                          description: "A diversified portfolio of India's top 50 companies",
                          riskLevel: "Medium",
                          expectedReturn: "10-12%",
                        },
                        {
                          name: "Government Bonds",
                          type: "Fixed Income",
                          description: "Secure government bonds with fixed returns",
                          riskLevel: "Low",
                          expectedReturn: "5-6%",
                        },
                        {
                          name: "Fixed Deposit",
                          type: "Bank Product",
                          description: "Secure fixed deposit with guaranteed returns",
                          riskLevel: "Very Low",
                          expectedReturn: "4-5%",
                        },
                      ]
                    ).map((product, index) => (
                      <motion.div
                        key={product.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="h-full">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">{product.name}</h4>
                                <p className="text-sm text-muted-foreground">{product.type}</p>
                              </div>
                              <Badge
                                variant="outline"
                                className={`${
                                  product.riskLevel === "Low" || product.riskLevel === "Very Low"
                                    ? "border-green-500 text-green-500"
                                    : product.riskLevel === "Medium"
                                      ? "border-yellow-500 text-yellow-500"
                                      : "border-red-500 text-red-500"
                                }`}
                              >
                                {product.riskLevel} Risk
                              </Badge>
                            </div>
                            <div className="mt-4 space-y-2">
                              <p className="text-sm">{product.description}</p>
                              <div className="flex items-center gap-1 text-sm">
                                <span className="text-muted-foreground">Expected Return:</span>
                                <span className="font-medium">{product.expectedReturn}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* General Advice */}
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Next Steps</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0 mt-0.5">
                                1
                              </div>
                              <span>
                                Review your current portfolio and consider rebalancing to match the recommended asset
                                allocation.
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0 mt-0.5">
                                2
                              </div>
                              <span>
                                Consider the suggested investment products that align with your risk profile and
                                financial goals.
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0 mt-0.5">
                                3
                              </div>
                              <span>
                                Consult with a financial advisor to create a personalized investment strategy based on
                                these recommendations.
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0 mt-0.5">
                                4
                              </div>
                              <span>
                                Regularly review and adjust your portfolio as your financial situation and goals evolve.
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
