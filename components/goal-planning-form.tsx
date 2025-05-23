"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react"
import PersonalProfile from "@/components/personal-profile"
import InvestmentData from "@/components/investment-data"
import RiskResults from "@/components/risk-results"
import { useGoalPlanning } from "@/hooks/useGoalPlanning"
import type { FinancialProfile, InvestmentAsset, GoalPlanningResult } from "@/types/investment"

// Define all the linear steps including sub-steps
const ALL_STEPS = [
  { id: "profile-basic", title: "Basic Info", mainStep: "profile", subStep: "basic" },
  { id: "profile-goals", title: "Financial Goals", mainStep: "profile", subStep: "goals" },
  { id: "profile-risk", title: "Investment Profile", mainStep: "profile", subStep: "risk" },
  { id: "investments", title: "Investment Data", mainStep: "investments", subStep: null },
  { id: "processing", title: "Processing", mainStep: "processing", subStep: null },
  { id: "results-overview", title: "Overview", mainStep: "results", subStep: "overview" },
  { id: "results-portfolio", title: "Portfolio Analysis", mainStep: "results", subStep: "portfolio" },
  { id: "results-comprehensive", title: "Investment Plan", mainStep: "results", subStep: "comprehensive" },
  { id: "results-recommendations", title: "Asset Allocation", mainStep: "results", subStep: "recommendations" },
  { id: "results-action-plan", title: "Action Plan", mainStep: "results", subStep: "action-plan" },
]

export default function GoalPlanningForm() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const { calculateGoalPlan, isLoading: isProcessing, error, clearError } = useGoalPlanning()

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
  const [assessmentResult, setAssessmentResult] = useState<GoalPlanningResult | null>(null)
  const [availableResultSteps, setAvailableResultSteps] = useState<string[]>([])

  const currentStep = ALL_STEPS[currentStepIndex]
  
  // Calculate progress based on available steps
  const getAvailableSteps = () => {
    const profileSteps = ALL_STEPS.filter(step => step.mainStep === "profile")
    const investmentSteps = ALL_STEPS.filter(step => step.mainStep === "investments")
    const processingSteps = ALL_STEPS.filter(step => step.mainStep === "processing")
    
    // Always include profile, investment, and processing steps
    let availableSteps = [...profileSteps, ...investmentSteps, ...processingSteps]
    
    // Add result steps only if we have assessment result
    if (assessmentResult) {
      // Always include overview
      availableSteps.push({ id: "results-overview", title: "Overview", mainStep: "results", subStep: "overview" })
      
      // Conditionally add other result steps based on assessment result content
      if (assessmentResult?.portfolio_analysis) {
        availableSteps.push({ id: "results-portfolio", title: "Portfolio Analysis", mainStep: "results", subStep: "portfolio" })
      }
      
      if (assessmentResult?.comprehensive_recommendations) {
        availableSteps.push({ id: "results-comprehensive", title: "Investment Plan", mainStep: "results", subStep: "comprehensive" })
      }
      
      if (assessmentResult?.recommendations) {
        availableSteps.push({ id: "results-recommendations", title: "Asset Allocation", mainStep: "results", subStep: "recommendations" })
      }
      
      if (assessmentResult?.next_steps?.length > 0) {
        availableSteps.push({ id: "results-action-plan", title: "Action Plan", mainStep: "results", subStep: "action-plan" })
      }
    }
    
    return availableSteps
  }

  const availableSteps = getAvailableSteps()
  const progress = ((currentStepIndex + 1) / availableSteps.length) * 100

  // Track elapsed time during processing
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (currentStep.mainStep === "processing") {
      setElapsedTime(0)
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1)
      }, 1000)
    } else {
      setElapsedTime(0)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [currentStep.mainStep])

  // Update available result steps when assessment result changes
  useEffect(() => {
    if (assessmentResult) {
      const newAvailableSteps = []
      if (assessmentResult?.portfolio_analysis) newAvailableSteps.push("portfolio")
      if (assessmentResult?.comprehensive_recommendations) newAvailableSteps.push("comprehensive")
      if (assessmentResult?.recommendations) newAvailableSteps.push("recommendations")
      if (assessmentResult?.next_steps?.length > 0) newAvailableSteps.push("action-plan")
      setAvailableResultSteps(newAvailableSteps)
    }
  }, [assessmentResult])

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

  // Check if we can proceed from current step
  const canProceed = () => {
    if (currentStep.mainStep === "profile" && currentStep.subStep === "risk") {
      // Validate the complete profile before leaving the profile section
      const validationErrors = validatePersonalProfile(financialProfile)
      return validationErrors.length === 0
    }
    return true
  }

  // Get validation errors for current step
  const getValidationErrors = () => {
    if (currentStep.mainStep === "profile" && currentStep.subStep === "risk") {
      return validatePersonalProfile(financialProfile)
    }
    return []
  }

  const handleNext = async () => {
    // Check if we can proceed
    if (!canProceed()) {
      const errors = getValidationErrors()
      alert(`Please fix the following issues before proceeding:\n\n${errors.join('\n')}`)
      return
    }

    // If we're at the investment step, move to processing step and trigger API call
    if (currentStep.id === "investments") {
      // First, move to processing step
      setCurrentStepIndex(currentStepIndex + 1)
      
      // Then trigger the API call
      try {
        console.log(financialProfile, investmentAssets)
        // Make API call to get goal planning assessment using the hook
        const result = await calculateGoalPlan(financialProfile, investmentAssets)
        setAssessmentResult(result)
        
        // Small delay to ensure state updates, then move to overview step
        setTimeout(() => {
          // Calculate the overview step index directly (profile steps + investment steps + processing steps)
          const profileStepsCount = ALL_STEPS.filter(step => step.mainStep === "profile").length
          const investmentStepsCount = ALL_STEPS.filter(step => step.mainStep === "investments").length
          const processingStepsCount = ALL_STEPS.filter(step => step.mainStep === "processing").length
          const overviewStepIndex = profileStepsCount + investmentStepsCount + processingStepsCount
          
          setCurrentStepIndex(overviewStepIndex)
        }, 100)
      } catch (error) {
        console.error("Error calculating goal planning:", error)
        const errorMessage = error instanceof Error ? error.message : "An error occurred while processing your goal planning. Please try again."
        alert(errorMessage)
        // On error, go back to investments step
        setCurrentStepIndex(currentStepIndex)
      }
      return
    }

    // For all other steps, just move to the next available step
    const availableSteps = getAvailableSteps()
    if (currentStepIndex < availableSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const handleReset = () => {
    setCurrentStepIndex(0)
    setAssessmentResult(null)
    setAvailableResultSteps([])
  }

  const isLastStep = currentStepIndex === availableSteps.length - 1
  const isFirstStep = currentStepIndex === 0

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <div className="text-sm font-medium text-primary">
            {currentStep.title}
          </div>
          <div className="text-sm text-muted-foreground">
            {currentStepIndex + 1} of {availableSteps.length}
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Form content */}
      <Card className="border border-border/40 shadow-lg">
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            <>
              {currentStep.mainStep === "profile" && (
                <motion.div
                  key={`profile-${currentStep.subStep}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <PersonalProfile 
                    financialProfile={financialProfile} 
                    setFinancialProfile={setFinancialProfile}
                    activeTab={currentStep.subStep || "basic"}
                  />
                </motion.div>
              )}

              {currentStep.mainStep === "investments" && (
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

              {currentStep.mainStep === "processing" && (
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
                  <p className="text-muted-foreground text-center max-w-md mb-4">
                    Our AI is processing your data and generating personalized recommendations. This may take 1-2 minutes...
                  </p>
                  {elapsedTime > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Elapsed time: {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
                    </p>
                  )}
                </motion.div>
              )}

              {currentStep.mainStep === "results" && assessmentResult && (
                <motion.div
                  key={`results-${currentStep.subStep}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <RiskResults 
                    result={assessmentResult}
                    activeTab={currentStep.subStep || "overview"}
                    availableTabs={availableResultSteps}
                  />
                </motion.div>
              )}
            </>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        {!isFirstStep ? (
          <Button 
            variant="outline" 
            onClick={handleBack} 
            disabled={isProcessing || currentStep.mainStep === "processing"} 
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        ) : (
          <div></div>
        )}

        {!isLastStep ? (
          <Button
            onClick={handleNext}
            disabled={isProcessing || currentStep.mainStep === "processing"}
            className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
          >
            {currentStep.mainStep === "processing" ? (
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
          <Button 
            onClick={handleReset} 
            className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
          >
            <Check className="h-4 w-4" /> Start Over
          </Button>
        )}
      </div>
    </div>
  )
} 