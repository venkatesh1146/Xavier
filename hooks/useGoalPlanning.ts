import { useState, useCallback } from 'react'
import axios, { AxiosError } from 'axios'
import { API_CONFIG } from '@/lib/config'
import type { FinancialProfile, InvestmentAsset, GoalPlanningResult } from '@/types/investment'

interface UseGoalPlanningReturn {
  calculateGoalPlan: (profile: FinancialProfile, assets: InvestmentAsset[]) => Promise<GoalPlanningResult>
  isLoading: boolean
  error: string | null
  clearError: () => void
}

export const useGoalPlanning = (): UseGoalPlanningReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const calculateGoalPlan = useCallback(async (
    profile: FinancialProfile,
    assets: InvestmentAsset[]
  ): Promise<GoalPlanningResult> => {
    setIsLoading(true)
    setError(null)

    try {
      // Map the data to match the API expected format
      const apiPayload = {
        age: profile.age,
        income: profile.annual_income,
        expenses: profile.monthly_expenses,
        savings: profile.total_savings,
        goals: profile.financial_goals.join(", "),
        risk_appetite: profile.risk_appetite,
        investments: assets.map(asset => ({
          type: asset.asset_type,
          amount: asset.amount,
          name: asset.name,
          expected_returns: asset.expected_returns || 0,
          current_value: asset.current_value
        }))
      }

      console.log("API Payload:", apiPayload)

      // Prepare headers
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      }

      // Add CSRF token if available
      if (API_CONFIG.CSRF_TOKEN) {
        headers["Cookie"] = `csrftoken=${API_CONFIG.CSRF_TOKEN}`
      }

      // Make the API call using axios
      const response = await axios.post<GoalPlanningResult>(
        API_CONFIG.RISK_ASSESSMENT_API_URL,
        apiPayload,
        {
          headers,
          timeout: 180000, // 3 minutes timeout for slow API
        }
      )

      console.log("API Response:", response.data)
      return response.data

    } catch (err) {
      let errorMessage = "An error occurred while processing your goal planning. Please try again."

      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError

        if (axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ENOTFOUND') {
          errorMessage = "Unable to connect to the goal planning service. Please ensure the API server is running."
        } else if (axiosError.code === 'ETIMEDOUT') {
          errorMessage = "Request timed out. Please check your internet connection and try again."
        } else if (axiosError.response?.status === 400) {
          errorMessage = "Invalid data provided. Please check your inputs and try again."
        } else if (axiosError.response?.status === 401) {
          errorMessage = "Authentication failed. Please check your API credentials."
        } else if (axiosError.response?.status === 500) {
          errorMessage = "Server error occurred. Please try again later."
        } else if (axiosError.response?.status) {
          errorMessage = `API request failed with status ${axiosError.response.status}. Please try again.`
        }
      } else if (err instanceof Error) {
        if (err.message.includes("API URL not configured")) {
          errorMessage = "Goal planning service is not configured. Please contact support."
        }
      }

      console.error("Error calling goal planning API:", err)
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    calculateGoalPlan,
    isLoading,
    error,
    clearError
  }
}

// Export the old hook for backward compatibility
export const useRiskAssessment = () => {
  const goalPlanningHook = useGoalPlanning()
  return {
    ...goalPlanningHook,
    calculateRiskAssessment: goalPlanningHook.calculateGoalPlan
  }
} 