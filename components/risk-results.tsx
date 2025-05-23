"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import type { GoalPlanningResult } from "@/types/investment"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ComposedChart, Area, AreaChart } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { AlertCircle, CheckCircle2, Info, Lightbulb, PieChartIcon, TrendingUp, TrendingDown, BarChart3, Target, IndianRupee, Calendar, Zap } from "lucide-react"

interface RiskResultsProps {
  result: GoalPlanningResult
  activeTab: string
  availableTabs: string[]
}

export default function RiskResults({ result, activeTab, availableTabs }: RiskResultsProps) {
  const [isMounted, setIsMounted] = useState(false)

  // Ensure hydration happens on client only
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Determine available tabs based on data and props
  const getAvailableTabs = () => {
    const tabs = []
    
    // Overview tab is always available
    tabs.push({ id: "overview", title: "Overview" })
    
    // Portfolio Analysis tab - available if portfolio_analysis exists and in availableTabs
    if (result?.portfolio_analysis && availableTabs.includes("portfolio")) {
      tabs.push({ id: "portfolio", title: "Portfolio Analysis" })
    }
    
    // Comprehensive Recommendations tab - available if comprehensive_recommendations exists and in availableTabs
    if (result?.comprehensive_recommendations && availableTabs.includes("comprehensive")) {
      tabs.push({ id: "comprehensive", title: "Investment Plan" })
    }
    
    // Standard Recommendations tab - available if recommendations exists and in availableTabs
    if (result?.recommendations && availableTabs.includes("recommendations")) {
      tabs.push({ id: "recommendations", title: "Asset Allocation" })
    }
    
    // Action Plan tab - available if next_steps exists and in availableTabs
    if (result?.next_steps?.length > 0 && availableTabs.includes("action-plan")) {
      tabs.push({ id: "action-plan", title: "Action Plan" })
    }
    
    return tabs
  }

  const availableTabsList = getAvailableTabs()

  // Colors for charts
  const COLORS = ["#8242f7", "#4ade80", "#facc15", "#f87171", "#60a5fa", "#f97316", "#06b6d4", "#8b5cf6"]

  // Handle HTML content from API
  if (result?.html) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <PieChartIcon className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Goal Planning Results</h2>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Financial Profile</CardTitle>
            <CardDescription>Based on your financial profile and investment portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div dangerouslySetInnerHTML={{ __html: result.html }} />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Prepare data for charts with null checks
  const currentAllocationData = result?.portfolio_analysis?.asset_allocation 
    ? Object.entries(result.portfolio_analysis.asset_allocation).map(([key, value]) => ({
        name: key,
        value: value,
        type: 'current'
      }))
    : []

  const suggestedAllocationData = result?.recommendations?.suggested_allocation 
    ? Object.entries(result.recommendations.suggested_allocation).map(([key, value]) => ({
        name: key,
        value: value,
        type: 'suggested'
      }))
    : []

  // Compare current vs suggested allocation
  const allocationComparison = result?.recommendations?.suggested_allocation 
    ? Object.keys(result.recommendations.suggested_allocation).map(key => ({
        name: key,
        current: result?.portfolio_analysis?.asset_allocation?.[key] || 0,
        suggested: result.recommendations.suggested_allocation[key],
        difference: (result.recommendations.suggested_allocation[key] - (result?.portfolio_analysis?.asset_allocation?.[key] || 0))
      }))
    : []

  // Equity breakdown data
  const equityBreakdownData = result?.recommendations?.equity_breakdown 
    ? Object.entries(result.recommendations.equity_breakdown).map(([key, value]) => ({
        name: key.replace(' stocks', ''),
        value: value
      }))
    : []

  const getRiskColor = (score: number) => {
    if (score < 4) return "#4ade80" // green-400
    if (score < 7) return "#facc15" // yellow-400
    return "#f87171" // red-400
  }

  const getDiversityColor = (score: number) => {
    if (score < 3) return "#f87171" // red-400 - poor diversity
    if (score < 6) return "#facc15" // yellow-400 - moderate diversity
    return "#4ade80" // green-400 - good diversity
  }

  // Format currency for Indian market
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // If not mounted yet, return loading state
  if (!isMounted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <PieChartIcon className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Goal Planning Results</h2>
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
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-2"
      >
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <PieChartIcon className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Goal Planning Results</h2>
      </motion.div>

      <Tabs value={activeTab} className="w-full">
        <TabsList className={`grid mb-6 ${availableTabsList.length === 2 ? 'grid-cols-2' : availableTabsList.length === 3 ? 'grid-cols-3' : availableTabsList.length === 4 ? 'grid-cols-4' : 'grid-cols-5'}`}>
          {availableTabsList.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {/* Financial Assessment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Risk Score Card */}
              {result?.risk_assessment && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Financial Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6">
                      <div className="relative w-24 h-24">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="8"
                            strokeDasharray="251.2"
                            strokeDashoffset="0"
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                          />
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke={getRiskColor(result.risk_assessment.risk_score)}
                            strokeWidth="8"
                            strokeDasharray="251.2"
                            strokeDashoffset="251.2"
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                            initial={{ strokeDashoffset: 251.2 }}
                            animate={{
                              strokeDashoffset: 251.2 - ((result.risk_assessment.risk_score / 10) * 251.2),
                            }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="text-2xl font-bold"
                          >
                            {result.risk_assessment.risk_score}/10
                          </motion.div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <Badge
                          className={`px-3 py-1 text-white mb-2 ${
                            result.risk_assessment.risk_category === "Conservative"
                              ? "bg-green-500"
                              : result.risk_assessment.risk_category === "Moderate"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        >
                          {result.risk_assessment.risk_category} Risk
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {result.risk_assessment.explanation}
                        </p>
                      </div>
                    </div>
                    
                    {/* Contributing Factors */}
                    {result.risk_assessment.contributing_factors?.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium text-sm">Contributing Factors:</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.risk_assessment.contributing_factors.map((factor: string, index: number) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.8 }}
                            >
                              <Badge variant="outline" className="text-xs">
                                {factor}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Portfolio Diversity Score */}
              {result?.portfolio_analysis && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Portfolio Diversity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{result.portfolio_analysis.diversity_score}/10</span>
                        <Badge
                          variant="outline"
                          className={`${
                            result.portfolio_analysis.diversity_score < 3
                              ? "border-red-500 text-red-500"
                              : result.portfolio_analysis.diversity_score < 6
                                ? "border-yellow-500 text-yellow-500"
                                : "border-green-500 text-green-500"
                          }`}
                        >
                          {result.portfolio_analysis.diversity_score < 3
                            ? "Needs Improvement"
                            : result.portfolio_analysis.diversity_score < 6
                              ? "Moderate"
                              : "Well Diversified"}
                        </Badge>
                      </div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                      >
                        <Progress 
                          value={(result.portfolio_analysis.diversity_score / 10) * 100} 
                          className="h-3"
                        />
                      </motion.div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        {result.portfolio_analysis.asset_count && (
                          <div className="flex justify-between">
                            <span>Asset Count:</span>
                            <span className="font-medium">{result.portfolio_analysis.asset_count}</span>
                          </div>
                        )}
                        {result.portfolio_analysis.risk_concentration && (
                          <div className="flex justify-between">
                            <span>Risk Concentration:</span>
                            <span className="font-medium">{result.portfolio_analysis.risk_concentration}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Age-Specific Advice */}
            {result?.age_specific_advice && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold mb-2">Personalized Advice</h4>
                        <p className="text-sm text-muted-foreground">{result.age_specific_advice}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </TabsContent>

        {result?.portfolio_analysis && (
          <TabsContent value="portfolio" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {/* Current vs Suggested Allocation Comparison */}
              {(currentAllocationData.length > 0 || suggestedAllocationData.length > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Current vs Recommended Allocation</CardTitle>
                    <CardDescription>Compare your current portfolio with our recommendations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Current Allocation Pie Chart */}
                      {currentAllocationData.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                        >
                          <h4 className="font-semibold mb-4 text-center">Current Portfolio</h4>
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={currentAllocationData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={120}
                                  dataKey="value"
                                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                  labelLine={false}
                                >
                                  {currentAllocationData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </motion.div>
                      )}

                      {/* Suggested Allocation Pie Chart */}
                      {suggestedAllocationData.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                        >
                          <h4 className="font-semibold mb-4 text-center">Recommended Portfolio</h4>
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={suggestedAllocationData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={120}
                                  dataKey="value"
                                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                  labelLine={false}
                                >
                                  {suggestedAllocationData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Allocation Comparison Bar Chart */}
                    {allocationComparison.length > 0 && (
                      <motion.div 
                        className="mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                      >
                        <h4 className="font-semibold mb-4">Allocation Changes Needed</h4>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={allocationComparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis label={{ value: 'Allocation %', angle: -90, position: 'insideLeft' }} />
                              <Tooltip />
                              <Bar dataKey="current" fill="#8884d8" name="Current %" />
                              <Bar dataKey="suggested" fill="#82ca9d" name="Recommended %" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Portfolio Summary */}
              {result.portfolio_analysis.summary && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Portfolio Analysis Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{result.portfolio_analysis.summary}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </TabsContent>
        )}

        {result?.comprehensive_recommendations && (
          <TabsContent value="comprehensive" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {/* Investment Strategy Overview */}
              <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Your Investment Strategy
                  </CardTitle>
                  <CardDescription>Personalized investment plan based on your profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {result.comprehensive_recommendations.suggested_sip_amount > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center p-4 bg-white rounded-lg shadow-sm"
                      >
                        <IndianRupee className="h-8 w-8 text-primary mx-auto mb-2" />
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(result.comprehensive_recommendations.suggested_sip_amount)}
                        </div>
                        <div className="text-sm text-muted-foreground">Monthly SIP</div>
                      </motion.div>
                    )}
                    
                    {result.comprehensive_recommendations.time_horizon && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-center p-4 bg-white rounded-lg shadow-sm"
                      >
                        <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                        <div className="text-2xl font-bold text-primary">
                          {result.comprehensive_recommendations.time_horizon}
                        </div>
                        <div className="text-sm text-muted-foreground">Investment Horizon</div>
                      </motion.div>
                    )}
                    
                    {result.comprehensive_recommendations.emergency_fund_needed && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-center p-4 bg-white rounded-lg shadow-sm"
                      >
                        <Zap className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-orange-500">
                          {formatCurrency(result.comprehensive_recommendations.emergency_fund_needed)}
                        </div>
                        <div className="text-sm text-muted-foreground">Emergency Fund</div>
                      </motion.div>
                    )}
                  </div>
                  
                  {result.comprehensive_recommendations.primary_strategy && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="p-4 bg-white rounded-lg border-l-4 border-primary"
                    >
                      <h4 className="font-semibold mb-2">Primary Strategy</h4>
                      <p className="text-muted-foreground">{result.comprehensive_recommendations.primary_strategy}</p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Recommended Products */}
              {result.comprehensive_recommendations.recommended_products?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Investment Products</CardTitle>
                    <CardDescription>Detailed breakdown of your investment allocation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {result.comprehensive_recommendations.recommended_products.map((product: any, index: number) => (
                        <motion.div
                          key={product.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.2 }}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-lg">{product.name}</h4>
                              <p className="text-sm text-muted-foreground">{product.description}</p>
                            </div>
                            <Badge variant="outline" className="text-primary border-primary">
                              {product.allocation}%
                            </Badge>
                          </div>
                          
                          {product.funds?.length > 0 && (
                            <div className="space-y-3">
                              <h5 className="font-medium text-sm">Recommended Funds:</h5>
                              {product.funds.map((fund: any, fundIndex: number) => (
                                <motion.div
                                  key={fund.name}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.2 + fundIndex * 0.1 + 0.3 }}
                                  className="bg-muted/50 rounded-md p-3"
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <div className="font-medium">{fund.name}</div>
                                      <div className="text-sm text-muted-foreground">{fund.description}</div>
                                    </div>
                                    {fund.return && (
                                      <Badge variant="secondary" className="text-green-600">
                                        {fund.return}
                                      </Badge>
                                    )}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Investment Rationale */}
              {result.comprehensive_recommendations.investment_rationale && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-primary" />
                        Investment Rationale
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{result.comprehensive_recommendations.investment_rationale}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </TabsContent>
        )}

        {result?.recommendations && (
          <TabsContent value="recommendations" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {/* Equity Breakdown */}
              {equityBreakdownData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Equity Breakdown</CardTitle>
                    <CardDescription>Detailed allocation within equity investments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={equityBreakdownData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis label={{ value: 'Allocation %', angle: -90, position: 'insideLeft' }} />
                          <Tooltip />
                          <Bar dataKey="value" fill="#8242f7" />
                        </BarChart>
                      </ResponsiveContainer>
                    </motion.div>
                  </CardContent>
                </Card>
              )}

              {/* Product Recommendations by Category */}
              {result.recommendations.suggested_products && Object.keys(result.recommendations.suggested_products).length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(result.recommendations.suggested_products).map(([category, products], categoryIndex) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: categoryIndex * 0.2 + 0.5 }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">{category}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {(products as Array<{name: string; description: string}>).map((product: {name: string; description: string}, index: number) => (
                              <motion.div
                                key={product.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: categoryIndex * 0.2 + index * 0.1 + 0.7 }}
                                className="p-3 border rounded-lg"
                              >
                                <h5 className="font-medium">{product.name}</h5>
                                <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>
        )}

        {result?.next_steps?.length > 0 && (
          <TabsContent value="action-plan" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Your Action Plan
                  </CardTitle>
                  <CardDescription>Follow these steps to optimize your investment portfolio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.next_steps.map((step: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start gap-3 p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <motion.div 
                          className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                        >
                          {index + 1}
                        </motion.div>
                        <p className="text-sm">{step}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Summary Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Ready to Optimize Your Portfolio?</h4>
                        <p className="text-muted-foreground mb-4">
                          Based on your goal assessment and current portfolio, we've identified key areas for improvement. 
                          Implementing these recommendations could help you achieve better diversification and align 
                          your investments with your financial goals.
                        </p>
                        <div className="flex gap-2 text-sm flex-wrap">
                          {result?.risk_assessment && (
                            <Badge variant="outline">Risk Score: {result.risk_assessment.risk_score}/10</Badge>
                          )}
                          {result?.portfolio_analysis && (
                            <Badge variant="outline">Diversity: {result.portfolio_analysis.diversity_score}/10</Badge>
                          )}
                          {result?.risk_assessment?.risk_category && (
                            <Badge variant="outline">{result.risk_assessment.risk_category} Risk Profile</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
