"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react"
import PersonalProfile from "@/components/personal-profile"
import InvestmentData from "@/components/investment-data"
import RiskResults from "@/components/risk-results"
import { useTheme } from "next-themes"

// Define the form steps
const STEPS = [
  { id: "profile", title: "Personal Profile" },
  { id: "investments", title: "Investment Data" },
  { id: "results", title: "Risk Assessment" },
]

// Define the types for our form data
export type FinancialProfile = {
  age: number
  annual_income: number
  monthly_expenses: number
  total_savings: number
  risk_appetite: "conservative" | "moderate" | "aggressive"
  financial_goals: string[]
  investment_horizon: "short" | "medium" | "long"
}

export type InvestmentAsset = {
  id: string
  asset_type: string
  name: string
  amount: number // Initial investment amount
  expected_returns?: number // Optional - Expected annual returns as percentage
  current_value?: number // Optional - Current value if different from initial investment
  purchase_date?: string // Optional - When the asset was acquired
  tenure?: number // Optional - How long the asset has been held or investment duration
  risk_category?: string // Optional - User's assessment of the asset's risk
  additional_notes?: string // Optional - Any other relevant information
  
  // Asset-specific fields
  company_name?: string // For stocks
  shares?: number // For stocks
  purchase_price?: number // For stocks
  dividend_yield?: number // For stocks
  property_type?: string // For real estate
  rental_income?: number // For real estate
  mortgage_details?: string // For real estate
}

// Update the RiskAssessmentResult type to include optional HTML
export type RiskAssessmentResult = {
  riskScore?: number
  riskCategory?: "Conservative" | "Moderate" | "Aggressive"
  recommendations?: { 
    assetAllocation: {
      equity: number
      debt: number
      realEstate: number
      gold: number
      cash: number
    }
    productSuggestions: Array<{
      name: string
      type: string
      description: string
      riskLevel: string
      expectedReturn: string
    }>
  }
  html?: string
}

export default function RiskAssessmentForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  // Update the initial state for financial profile with Indian currency values
  const [financialProfile, setFinancialProfile] = useState<FinancialProfile>({
    age: 30,
    annual_income: 1200000, // ₹12 lakhs per annum
    monthly_expenses: 40000, // ₹40,000 per month
    total_savings: 500000, // ₹5 lakhs
    risk_appetite: "moderate",
    financial_goals: ["retirement"],
    investment_horizon: "medium",
  })
  // Update the initial state for investment assets with Indian currency values
  const [investmentAssets, setInvestmentAssets] = useState<InvestmentAsset[]>([
    {
      id: "1",
      asset_type: "Equities (Stocks)",
      name: "Stock Portfolio",
      amount: 250000, // ₹2.5 lakhs
      expected_returns: 12,
      current_value: 280000, // ₹2.8 lakhs
      tenure: 5,
    },
  ])
  const [assessmentResult, setAssessmentResult] = useState<RiskAssessmentResult | null>(null)
  const { theme } = useTheme()

  const progress = ((currentStep + 1) / STEPS.length) * 100

  // Validation function to check required fields
  const validatePersonalProfile = (profile: FinancialProfile): string[] => {
    const missingFields: string[] = []
    const issues: string[] = []


    if (!profile.age) missingFields.push("Age")
    if (!profile.annual_income) missingFields.push("Annual Income")
    if (!profile.monthly_expenses && profile.monthly_expenses !== 0) missingFields.push("Monthly Expenses")
    if (!profile.total_savings && profile.total_savings !== 0) missingFields.push("Total Savings")
    if (!profile.financial_goals || profile.financial_goals.length === 0) missingFields.push("Financial Goals")
    if (!profile.risk_appetite) missingFields.push("Risk Appetite")

    // Validate data integrity
    if (profile.age && (profile.age < 18 || profile.age > 120)) {
      issues.push("Age must be between 18 and 120 years")
    }
    
    if (profile.annual_income && profile.annual_income < 0) {
      issues.push("Annual income cannot be negative")
    }
    
    if (profile.monthly_expenses && profile.monthly_expenses < 0) {
      issues.push("Monthly expenses cannot be negative")
    }
    
    if (profile.monthly_expenses && profile.annual_income && profile.monthly_expenses * 12 > profile.annual_income * 1.5) {
      issues.push("Monthly expenses seem unusually high compared to income")
    }
    
    if (profile.total_savings !== undefined && profile.total_savings < 0) {
      issues.push("Total savings cannot be negative")
    }

    return [...missingFields.map(field => `${field} is required`), ...issues]
  }

  // Update the handleNext function to use the async API call
  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      if (currentStep === 0) {
        // Validate personal profile before proceeding
        const validationErrors = validatePersonalProfile(financialProfile)
        if (validationErrors.length > 0) {
          alert(`Please fix the following issues before proceeding:\n\n${validationErrors.join('\n')}`)
          return
        }
        setCurrentStep(currentStep + 1)
      } else if (currentStep === 1) {
        // Process before showing results
        setIsProcessing(true)
        try {
            console.log(financialProfile, investmentAssets)
            debugger
          // Make API call to get risk assessment
          const result = await calculateRiskAssessment(financialProfile, investmentAssets)
          setAssessmentResult(result)
          setIsProcessing(false)
          setCurrentStep(currentStep + 1)
        } catch (error) {
          console.error("Error calculating risk assessment:", error)
          setIsProcessing(false)
          // Handle error state here
        }
      } else {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    setAssessmentResult(null)
  }

  // Update the calculateRiskAssessment function to simulate an API call
  const calculateRiskAssessment = async (
    profile: FinancialProfile,
    assets: InvestmentAsset[],
  ): Promise<RiskAssessmentResult | { html?: string }> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Prepare data for backend API
        const apiPayload = {
          age: profile.age,
          annual_income: profile.annual_income,
          monthly_expenses: profile.monthly_expenses,
          total_savings: profile.total_savings,
          financial_goals: profile.financial_goals.join(", "), // Convert array to string description
          risk_appetite: profile.risk_appetite,
          // Note: investment_horizon is not required by backend but can be included
          investment_horizon: profile.investment_horizon,
          // Investment assets data
          investment_assets: assets,
        }

        console.log("API Payload:", apiPayload)
        
        // This would be replaced with actual API call
        // Example: const response = await fetch('/api/risk-assessment', { 
        //   method: 'POST', 
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(apiPayload) 
        // });

        // Mock response data
        let baseScore = 50

        // Adjust based on risk appetite
        if (profile.risk_appetite === "conservative") baseScore -= 15
        if (profile.risk_appetite === "aggressive") baseScore += 15

        // Adjust based on age (younger = higher risk tolerance)
        baseScore += Math.max(0, (40 - profile.age) / 2)

        // Adjust based on investment horizon
        if (profile.investment_horizon === "short") baseScore -= 10
        if (profile.investment_horizon === "long") baseScore += 10

        // Ensure score is between 0-100
        const riskScore = Math.min(100, Math.max(0, baseScore))

        // Determine risk category
        let riskCategory: "Conservative" | "Moderate" | "Aggressive"
        if (riskScore < 40) riskCategory = "Conservative"
        else if (riskScore < 70) riskCategory = "Moderate"
        else riskCategory = "Aggressive"

        // Generate recommendations based on risk profile
        const recommendations = {
          assetAllocation: {
            equity: riskCategory === "Conservative" ? 30 : riskCategory === "Moderate" ? 50 : 70,
            debt: riskCategory === "Conservative" ? 40 : riskCategory === "Moderate" ? 30 : 15,
            realEstate: riskCategory === "Conservative" ? 15 : riskCategory === "Moderate" ? 10 : 5,
            gold: riskCategory === "Conservative" ? 10 : riskCategory === "Moderate" ? 5 : 5,
            cash: riskCategory === "Conservative" ? 5 : riskCategory === "Moderate" ? 5 : 5,
          },
          productSuggestions: [
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
              name: "Real Estate Investment Trust",
              type: "REIT",
              description: "Commercial real estate investment trust",
              riskLevel: "Medium",
              expectedReturn: "8-10%",
            },
          ],
        }

        // Add more aggressive options for aggressive investors
        if (riskCategory === "Aggressive") {
          recommendations.productSuggestions.push({
            name: "Small Cap Growth Fund",
            type: "Mutual Fund",
            description: "High growth potential small cap companies",
            riskLevel: "High",
            expectedReturn: "12-15%",
          })
        }

        // Add more conservative options for conservative investors
        if (riskCategory === "Conservative") {
          recommendations.productSuggestions.push({
            name: "Fixed Deposit",
            type: "Bank Product",
            description: "Secure fixed deposit with guaranteed returns",
            riskLevel: "Very Low",
            expectedReturn: "4-5%",
          })
        }

        // Occasionally return HTML content to demonstrate that capability
        const shouldReturnHtml = Math.random() > 0.7

        if (shouldReturnHtml) {
          resolve({
            html: `
              <div class="space-y-4">
                <h3 class="text-xl font-semibold">Your Risk Profile: ${riskCategory}</h3>
                <p>Based on your inputs, your risk score is <strong>${riskScore}</strong>.</p>
                <p>We recommend the following asset allocation:</p>
                <ul class="list-disc pl-5 space-y-1">
                  <li>Equity: ${recommendations.assetAllocation.equity}%</li>
                  <li>Debt: ${recommendations.assetAllocation.debt}%</li>
                  <li>Real Estate: ${recommendations.assetAllocation.realEstate}%</li>
                  <li>Gold: ${recommendations.assetAllocation.gold}%</li>
                  <li>Cash: ${recommendations.assetAllocation.cash}%</li>
                </ul>
                <p>Consider investing in:</p>
                <ul class="list-disc pl-5 space-y-1">
                  ${recommendations.productSuggestions
                    .map(
                      (product) =>
                        `<li><strong>${product.name}</strong> (${product.type}) - Expected return: ${product.expectedReturn}</li>`,
                    )
                    .join("")}
                </ul>
              </div>
            `,
          })
        } else {
          resolve({
            riskScore,
            riskCategory,
            recommendations,
          })
        }
      }, 2000) // Simulate network delay
    })
  }

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`text-sm font-medium ${index <= currentStep ? "text-primary" : "text-muted-foreground"}`}
            >
              {step.title}
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Form content */}
      <Card className="border border-border/40 shadow-lg">
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="py-16 flex flex-col items-center justify-center"
              >
                <div className="relative w-24 h-24 mb-6">
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-primary/30"
                    style={{ borderRadius: "50%" }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary"
                    style={{ borderRadius: "50%" }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">Analyzing Your Financial Profile</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Our AI is assessing your risk profile and generating personalized recommendations...
                </p>
              </motion.div>
            ) : (
              <>
                {currentStep === 0 && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PersonalProfile financialProfile={financialProfile} setFinancialProfile={setFinancialProfile} />
                  </motion.div>
                )}

                {currentStep === 1 && (
                  <motion.div
                    key="investments"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <InvestmentData investmentAssets={investmentAssets} setInvestmentAssets={setInvestmentAssets} />
                  </motion.div>
                )}

                {currentStep === 2 && assessmentResult && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <RiskResults result={assessmentResult} />
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        {currentStep > 0 ? (
          <Button variant="outline" onClick={handleBack} disabled={isProcessing} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        ) : (
          <div></div>
        )}

        {currentStep < STEPS.length - 1 ? (
          <Button
            onClick={handleNext}
            disabled={isProcessing}
            className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Processing
              </>
            ) : (
              <>
                Next <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        ) : (
          <Button onClick={handleReset} className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2">
            <Check className="h-4 w-4" /> Start Over
          </Button>
        )}
      </div>
    </div>
  )
}
