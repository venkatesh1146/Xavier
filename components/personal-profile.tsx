"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { DollarSign, Clock, Target, TrendingUp } from "lucide-react"
import type { FinancialProfile } from "./risk-assessment-form"

interface PersonalProfileProps {
  financialProfile: FinancialProfile
  setFinancialProfile: React.Dispatch<React.SetStateAction<FinancialProfile>>
}

const financialGoalOptions = [
  { id: "retirement", label: "Retirement" },
  { id: "house", label: "Buying a House" },
  { id: "education", label: "Education" },
  { id: "emergency", label: "Emergency Fund" },
  { id: "wealth", label: "Wealth Creation" },
]

export default function PersonalProfile({ financialProfile, setFinancialProfile }: PersonalProfileProps) {
  const [activeTab, setActiveTab] = useState("basic")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFinancialProfile((prev) => ({
      ...prev,
      [name]:
        name === "age" || name === "income" || name === "savings" || name === "expenses"
          ? Number.parseInt(value) || 0
          : value,
    }))
  }

  const handleRiskAppetiteChange = (value: string) => {
    setFinancialProfile((prev) => ({
      ...prev,
      riskAppetite: value as "low" | "medium" | "high",
    }))
  }

  const handleInvestmentHorizonChange = (value: string) => {
    setFinancialProfile((prev) => ({
      ...prev,
      investmentHorizon: value as "short" | "medium" | "long",
    }))
  }

  const handleGoalToggle = (goalId: string) => {
    setFinancialProfile((prev) => {
      const currentGoals = [...prev.financialGoals]

      if (currentGoals.includes(goalId)) {
        return {
          ...prev,
          financialGoals: currentGoals.filter((id) => id !== goalId),
        }
      } else {
        return {
          ...prev,
          financialGoals: [...currentGoals, goalId],
        }
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <DollarSign className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Personal Financial Profile</h2>
      </div>

      <p className="text-muted-foreground">Let's start by understanding your financial situation and goals.</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="goals">Financial Goals</TabsTrigger>
          <TabsTrigger value="risk">Risk Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={financialProfile.age}
                  onChange={handleInputChange}
                  min={18}
                  max={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="income">Annual Income (₹)</Label>
                <Input
                  id="income"
                  name="income"
                  type="number"
                  value={financialProfile.income}
                  onChange={handleInputChange}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="savings">Total Savings (₹)</Label>
                <Input
                  id="savings"
                  name="savings"
                  type="number"
                  value={financialProfile.savings}
                  onChange={handleInputChange}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expenses">Monthly Expenses (₹)</Label>
                <Input
                  id="expenses"
                  name="expenses"
                  type="number"
                  value={financialProfile.expenses}
                  onChange={handleInputChange}
                  min={0}
                />
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">What are your financial goals?</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {financialGoalOptions.map((goal) => (
                  <Card key={goal.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <label
                        htmlFor={`goal-${goal.id}`}
                        className={`flex items-center space-x-3 p-4 cursor-pointer transition-colors ${
                          financialProfile.financialGoals.includes(goal.id) ? "bg-primary/10 border-primary" : ""
                        }`}
                      >
                        <Checkbox
                          id={`goal-${goal.id}`}
                          checked={financialProfile.financialGoals.includes(goal.id)}
                          onCheckedChange={() => handleGoalToggle(goal.id)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                        <span className="font-medium">{goal.label}</span>
                      </label>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Risk Appetite</h3>
                </div>
                <p className="text-muted-foreground mb-4">How comfortable are you with financial risk?</p>
                <RadioGroup
                  value={financialProfile.riskAppetite}
                  onValueChange={handleRiskAppetiteChange}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <Card
                    className={`border ${financialProfile.riskAppetite === "low" ? "border-primary bg-primary/5" : ""}`}
                  >
                    <CardContent className="p-4">
                      <label htmlFor="risk-low" className="flex flex-col items-center space-y-2 cursor-pointer">
                        <RadioGroupItem value="low" id="risk-low" className="sr-only" />
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                          <div className="h-6 w-6 rounded-full bg-green-500" />
                        </div>
                        <span className="font-medium">Low Risk</span>
                        <p className="text-xs text-center text-muted-foreground">
                          Prefer stability and security over high returns
                        </p>
                      </label>
                    </CardContent>
                  </Card>

                  <Card
                    className={`border ${financialProfile.riskAppetite === "medium" ? "border-primary bg-primary/5" : ""}`}
                  >
                    <CardContent className="p-4">
                      <label htmlFor="risk-medium" className="flex flex-col items-center space-y-2 cursor-pointer">
                        <RadioGroupItem value="medium" id="risk-medium" className="sr-only" />
                        <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                          <div className="h-6 w-6 rounded-full bg-yellow-500" />
                        </div>
                        <span className="font-medium">Medium Risk</span>
                        <p className="text-xs text-center text-muted-foreground">Balance between growth and security</p>
                      </label>
                    </CardContent>
                  </Card>

                  <Card
                    className={`border ${financialProfile.riskAppetite === "high" ? "border-primary bg-primary/5" : ""}`}
                  >
                    <CardContent className="p-4">
                      <label htmlFor="risk-high" className="flex flex-col items-center space-y-2 cursor-pointer">
                        <RadioGroupItem value="high" id="risk-high" className="sr-only" />
                        <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
                          <div className="h-6 w-6 rounded-full bg-red-500" />
                        </div>
                        <span className="font-medium">High Risk</span>
                        <p className="text-xs text-center text-muted-foreground">
                          Willing to accept volatility for higher returns
                        </p>
                      </label>
                    </CardContent>
                  </Card>
                </RadioGroup>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Investment Horizon</h3>
                </div>
                <p className="text-muted-foreground mb-4">How long do you plan to invest before needing the funds?</p>
                <RadioGroup
                  value={financialProfile.investmentHorizon}
                  onValueChange={handleInvestmentHorizonChange}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <Card
                    className={`border ${financialProfile.investmentHorizon === "short" ? "border-primary bg-primary/5" : ""}`}
                  >
                    <CardContent className="p-4">
                      <label htmlFor="horizon-short" className="flex flex-col items-center space-y-2 cursor-pointer">
                        <RadioGroupItem value="short" id="horizon-short" className="sr-only" />
                        <span className="font-medium">Short Term</span>
                        <p className="text-xs text-center text-muted-foreground">Less than 3 years</p>
                      </label>
                    </CardContent>
                  </Card>

                  <Card
                    className={`border ${financialProfile.investmentHorizon === "medium" ? "border-primary bg-primary/5" : ""}`}
                  >
                    <CardContent className="p-4">
                      <label htmlFor="horizon-medium" className="flex flex-col items-center space-y-2 cursor-pointer">
                        <RadioGroupItem value="medium" id="horizon-medium" className="sr-only" />
                        <span className="font-medium">Medium Term</span>
                        <p className="text-xs text-center text-muted-foreground">3-7 years</p>
                      </label>
                    </CardContent>
                  </Card>

                  <Card
                    className={`border ${financialProfile.investmentHorizon === "long" ? "border-primary bg-primary/5" : ""}`}
                  >
                    <CardContent className="p-4">
                      <label htmlFor="horizon-long" className="flex flex-col items-center space-y-2 cursor-pointer">
                        <RadioGroupItem value="long" id="horizon-long" className="sr-only" />
                        <span className="font-medium">Long Term</span>
                        <p className="text-xs text-center text-muted-foreground">More than 7 years</p>
                      </label>
                    </CardContent>
                  </Card>
                </RadioGroup>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
