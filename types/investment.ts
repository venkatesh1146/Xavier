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
  amount: number
  expected_returns?: number
  current_value?: number
  purchase_date?: string
  tenure?: number
  risk_category?: string
  additional_notes?: string
  company_name?: string
  shares?: number
  purchase_price?: number
  dividend_yield?: number
  property_type?: string
  rental_income?: number
  mortgage_details?: string
}

export type GoalPlanningResult = {
  risk_assessment: {
    risk_score: number
    risk_category: "Conservative" | "Moderate" | "Aggressive"
    contributing_factors: string[]
    explanation: string
  }
  portfolio_analysis: {
    diversity_score: number
    asset_count: number
    asset_allocation: Record<string, number>
    risk_concentration: string
    summary: string
  }
  comprehensive_recommendations?: {
    status: string
    risk_category: string
    time_horizon: string
    lumpsum_available: boolean
    emergency_fund_needed: number
    suggested_sip_amount: number
    suggested_lumpsum_amount: number
    primary_strategy: string
    recommended_products: Array<{
      name: string
      allocation: number
      description: string
      funds?: Array<{
        name: string
        return: string
        description: string
      }>
    }>
    investment_rationale: string
  }
  recommendations: {
    suggested_allocation: Record<string, number>
    equity_breakdown: Record<string, number>
    suggested_products: Record<string, Array<{
      name: string
      description: string
    }>>
  }
  next_steps: string[]
  age_specific_advice: string
  html?: string
}

// Keep the old name for backward compatibility
export type RiskAssessmentResult = GoalPlanningResult 