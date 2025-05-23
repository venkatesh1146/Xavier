"use client"

import React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { DollarSign, Clock, Target, TrendingUp, Calendar, Banknote, TrendingDown, CircleDollarSign, AlertCircle } from "lucide-react"
import type { FinancialProfile } from "@/types/investment"

interface PersonalProfileProps {
  financialProfile: FinancialProfile
  setFinancialProfile: React.Dispatch<React.SetStateAction<FinancialProfile>>
  activeTab: string
}

const financialGoalOptions = [
  { id: "emergency_fund", label: "Emergency Funds" },
  { id: "home", label: "Home loan down payment" },
  { id: "education", label: "Higher Education" },
  { id: "retirement", label: "Retirement" },
  { id: "vacation", label: "Vacations" },
  { id: "car", label: "Car" },
  { id: "gadgets", label: "Electronic gadget / Clothes" },
  { id: "marriage", label: "Marriage" },
  { id: "kids_marriage", label: "Kid's marriage" },
  { id: "kids_education", label: "Kid's education" },
  { id: "wealth_generation", label: "I am not sure" },
]

export default function PersonalProfile({ financialProfile, setFinancialProfile, activeTab }: PersonalProfileProps) {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const validateField = (name: string, value: number | string) => {
    const errors: Record<string, string> = { ...validationErrors }

    switch (name) {
      case "age":
        if (typeof value === "number" && (value < 18 || value > 120)) {
          errors[name] = "Age must be between 18 and 120 years"
        } else {
          delete errors[name]
        }
        break
      case "annual_income":
        if (typeof value === "number" && value < 0) {
          errors[name] = "Annual income cannot be negative"
        } else {
          delete errors[name]
        }
        break
      case "monthly_expenses":
        if (typeof value === "number" && value < 0) {
          errors[name] = "Monthly expenses cannot be negative"
        } else if (typeof value === "number" && financialProfile.annual_income && value * 12 > financialProfile.annual_income * 1.5) {
          errors[name] = "Monthly expenses seem unusually high compared to income"
        } else {
          delete errors[name]
        }
        break
      case "total_savings":
        if (typeof value === "number" && value < 0) {
          errors[name] = "Total savings cannot be negative"
        } else {
          delete errors[name]
        }
        break
    }

    setValidationErrors(errors)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numericValue = name === "age" || name === "annual_income" || name === "total_savings" || name === "monthly_expenses"
      ? Number.parseInt(value) || 0
      : value

    setFinancialProfile((prev: FinancialProfile) => ({
      ...prev,
      [name]: numericValue,
    }))

    // Validate the field
    if (typeof numericValue === "number") {
      validateField(name, numericValue)
    }
  }

  const handleRiskAppetiteChange = (value: string) => {
    setFinancialProfile((prev: FinancialProfile) => ({
      ...prev,
      risk_appetite: value as "conservative" | "moderate" | "aggressive",
    }))
  }

  const handleInvestmentHorizonChange = (value: string) => {
    setFinancialProfile((prev: FinancialProfile) => ({
      ...prev,
      investment_horizon: value as "short" | "medium" | "long",
    }))
  }

  const handleGoalToggle = (goalId: string) => {
    setFinancialProfile((prev: FinancialProfile) => {
      const currentGoals = [...prev.financial_goals]

      if (currentGoals.includes(goalId)) {
        return {
          ...prev,
          financial_goals: currentGoals.filter((id) => id !== goalId),
        }
      } else {
        return {
          ...prev,
          financial_goals: [...currentGoals, goalId],
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

      <Tabs value={activeTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="goals">Financial Goals</TabsTrigger>
          <TabsTrigger value="risk">Investment Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="age" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Age
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={financialProfile.age}
                  onChange={handleInputChange}
                  min={18}
                  max={120}
                  className={validationErrors.age ? "border-red-500" : ""}
                />
                {validationErrors.age && (
                  <div className="flex items-center gap-1 text-sm text-red-500">
                    <AlertCircle className="h-3 w-3" />
                    {validationErrors.age}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="annual_income" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  Annual Income (₹)
                </Label>
                <Input
                  id="annual_income"
                  name="annual_income"
                  type="number"
                  value={financialProfile.annual_income}
                  onChange={handleInputChange}
                  min={0}
                  className={validationErrors.annual_income ? "border-red-500" : ""}
                />
                {validationErrors.annual_income && (
                  <div className="flex items-center gap-1 text-sm text-red-500">
                    <AlertCircle className="h-3 w-3" />
                    {validationErrors.annual_income}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_savings" className="flex items-center gap-2">
                  <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                  Total Savings (₹)
                </Label>
                <Input
                  id="total_savings"
                  name="total_savings"
                  type="number"
                  value={financialProfile.total_savings}
                  onChange={handleInputChange}
                  min={0}
                  className={validationErrors.total_savings ? "border-red-500" : ""}
                />
                {validationErrors.total_savings && (
                  <div className="flex items-center gap-1 text-sm text-red-500">
                    <AlertCircle className="h-3 w-3" />
                    {validationErrors.total_savings}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly_expenses" className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                  Monthly Expenses (₹)
                </Label>
                <Input
                  id="monthly_expenses"
                  name="monthly_expenses"
                  type="number"
                  value={financialProfile.monthly_expenses}
                  onChange={handleInputChange}
                  min={0}
                  className={validationErrors.monthly_expenses ? "border-red-500" : ""}
                />
                {validationErrors.monthly_expenses && (
                  <div className="flex items-center gap-1 text-sm text-red-500">
                    <AlertCircle className="h-3 w-3" />
                    {validationErrors.monthly_expenses}
                  </div>
                )}
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
                          financialProfile.financial_goals.includes(goal.id) ? "bg-primary/10 border-primary" : ""
                        }`}
                      >
                        <Checkbox
                          id={`goal-${goal.id}`}
                          checked={financialProfile.financial_goals.includes(goal.id)}
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
                  value={financialProfile.risk_appetite}
                  onValueChange={handleRiskAppetiteChange}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <Card
                    className={`border ${financialProfile.risk_appetite === "conservative" ? "border-primary bg-primary/5" : ""}`}
                  >
                    <CardContent className="p-4">
                      <label htmlFor="risk-conservative" className="flex flex-col items-center space-y-2 cursor-pointer">
                        <RadioGroupItem value="conservative" id="risk-conservative" className="sr-only" />
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                          <div className="h-6 w-6 rounded-full bg-green-500" />
                        </div>
                        <span className="font-medium">Conservative</span>
                        <p className="text-xs text-center text-muted-foreground">
                          Prefer stability and security over high returns
                        </p>
                      </label>
                    </CardContent>
                  </Card>

                  <Card
                    className={`border ${financialProfile.risk_appetite === "moderate" ? "border-primary bg-primary/5" : ""}`}
                  >
                    <CardContent className="p-4">
                      <label htmlFor="risk-moderate" className="flex flex-col items-center space-y-2 cursor-pointer">
                        <RadioGroupItem value="moderate" id="risk-moderate" className="sr-only" />
                        <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                          <div className="h-6 w-6 rounded-full bg-yellow-500" />
                        </div>
                        <span className="font-medium">Moderate</span>
                        <p className="text-xs text-center text-muted-foreground">Balance between growth and security</p>
                      </label>
                    </CardContent>
                  </Card>

                  <Card
                    className={`border ${financialProfile.risk_appetite === "aggressive" ? "border-primary bg-primary/5" : ""}`}
                  >
                    <CardContent className="p-4">
                      <label htmlFor="risk-aggressive" className="flex flex-col items-center space-y-2 cursor-pointer">
                        <RadioGroupItem value="aggressive" id="risk-aggressive" className="sr-only" />
                        <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
                          <div className="h-6 w-6 rounded-full bg-red-500" />
                        </div>
                        <span className="font-medium">Aggressive</span>
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
                  value={financialProfile.investment_horizon}
                  onValueChange={handleInvestmentHorizonChange}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <Card
                    className={`border ${financialProfile.investment_horizon === "short" ? "border-primary bg-primary/5" : ""}`}
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
                    className={`border ${financialProfile.investment_horizon === "medium" ? "border-primary bg-primary/5" : ""}`}
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
                    className={`border ${financialProfile.investment_horizon === "long" ? "border-primary bg-primary/5" : ""}`}
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
