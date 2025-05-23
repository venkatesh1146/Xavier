# Frontend-Backend Integration Guide

## Overview
This document outlines the changes made to align the frontend Financial Risk Assessment form with the backend API requirements.

## Backend API Expected Fields

```json
{
  "age": "User's age in years",
  "annual_income": "Annual income in dollars",
  "monthly_expenses": "Monthly expenses in dollars", 
  "total_savings": "Total savings and investments in dollars",
  "financial_goals": "Description of financial goals (e.g., retirement, house purchase)",
  "risk_appetite": "Self-described risk tolerance (e.g., conservative, moderate, aggressive)"
}
```

## Changes Made

### 1. Updated FinancialProfile Type (`components/risk-assessment-form.tsx`)

**Before:**
```typescript
export type FinancialProfile = {
  age: number
  income: number
  savings: number
  expenses: number
  riskAppetite: "low" | "medium" | "high"
  financialGoals: string[]
  investmentHorizon: "short" | "medium" | "long"
}
```

**After:**
```typescript
export type FinancialProfile = {
  age: number
  annual_income: number
  monthly_expenses: number
  total_savings: number
  risk_appetite: "conservative" | "moderate" | "aggressive"
  financial_goals: string[]
  investment_horizon: "short" | "medium" | "long"
}
```

### 2. Updated Personal Profile Component (`components/personal-profile.tsx`)

#### Field Name Changes:
- `income` → `annual_income`
- `expenses` → `monthly_expenses`  
- `savings` → `total_savings`
- `riskAppetite` → `risk_appetite`
- `financialGoals` → `financial_goals`
- `investmentHorizon` → `investment_horizon`

#### Added Icons:
- **Age**: Calendar icon (represents time/age)
- **Annual Income**: TrendingUp icon (represents growth/income) 
- **Monthly Expenses**: TrendingDown icon (represents spending/outflow)
- **Total Savings**: CircleDollarSign icon (represents accumulated wealth)

#### Updated Risk Appetite Options:
- `"low"` → `"conservative"`
- `"medium"` → `"moderate"`
- `"high"` → `"aggressive"`

#### Updated Financial Goals Options:
```typescript
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
```

### 3. Updated Investment Data Component (`components/investment-data.tsx`)

#### Updated InvestmentAsset Type:
```typescript
export type InvestmentAsset = {
  id: string
  asset_type: string // Required - Asset category
  name: string // Required - Asset name/description
  amount: number // Required - Initial investment amount
  expected_returns?: number // Optional - Expected annual returns as percentage
  current_value?: number // Optional - Current value if different from initial investment
  purchase_date?: string // Optional - When the asset was acquired
  tenure?: number // Optional - How long the asset has been held
  risk_category?: string // Optional - User's assessment of the asset's risk
  additional_notes?: string // Optional - Any other relevant information
  
  // Asset-specific fields (optional)
  company_name?: string // For stocks
  shares?: number // For stocks
  purchase_price?: number // For stocks
  purchase_date?: string // For stocks
  dividend_yield?: number // For stocks
  property_type?: string // For real estate
  rental_income?: number // For real estate
  mortgage_details?: string // For real estate
}
```

#### Updated Asset Types:
```typescript
const assetTypes = [
  "Equities (Stocks)",
  "Fixed Income (Bonds)",
  "Real Estate",
  "Cash & Equivalents",
  "Gold & Precious Metals",
  "Alternative Investments",
  "Cryptocurrencies",
  "Mutual Funds",
  "ETFs",
  "Retirement Accounts"
]
```

#### Field Organization:
- **Required Fields Section**: Asset Type, Asset Name, Initial Investment
- **Optional Details Section**: Expected Returns, Current Value, Purchase Date, Holding Period, Risk Category
- **Asset-Specific Sections**: 
  - Stock Details (for Equities)
  - Real Estate Details (for Real Estate)
- **Additional Notes Section**: Free text field for extra information

#### Added Icons for Investment Fields:
- **Asset Type**: BarChart3 icon
- **Asset Name**: FileText icon  
- **Initial Investment**: DollarSign icon
- **Expected Returns**: TrendingUp icon
- **Current Value**: CircleDollarSign icon
- **Purchase Date**: Calendar icon
- **Holding Period**: Clock icon
- **Risk Category**: Shield icon
- **Property Type**: Building2 icon
- **Additional Notes**: FileText icon

#### Asset-Specific Questions:

**For Stocks (Equities):**
- Company Name
- Number of Shares
- Purchase Price per Share
- Dividend Yield

**For Real Estate:**
- Property Type (Residential, Commercial, Industrial, Land)
- Monthly Rental Income
- Mortgage Details

### 4. Added Field Validations

#### Real-time validation for:
- **Age**: Must be between 18 and 120 years
- **Annual Income**: Cannot be negative
- **Monthly Expenses**: Cannot be negative, and should not exceed 1.5x annual income
- **Total Savings**: Cannot be negative

#### Visual validation indicators:
- Red border on invalid fields
- Error messages with alert icons
- Validation errors displayed below each field

### 5. Updated API Integration

#### Before proceeding to results:
- Validates all required fields are filled
- Checks data integrity according to backend rules
- Shows alert with specific validation errors if any

#### API Payload Preparation:
```typescript
const apiPayload = {
  age: profile.age,
  annual_income: profile.annual_income,
  monthly_expenses: profile.monthly_expenses,
  total_savings: profile.total_savings,
  financial_goals: profile.financial_goals.join(", "), // Convert array to string
  risk_appetite: profile.risk_appetite,
  investment_horizon: profile.investment_horizon, // Optional
  investment_assets: assets,
}
```

## Backend Validation Rules Implemented

### Required Fields Check:
- All fields marked as required in backend are validated
- User cannot proceed without completing all required fields

### Data Integrity Checks:
- Age must be between 18 and 120 years
- Annual income cannot be negative
- Monthly expenses cannot be negative
- Monthly expenses should not exceed 1.5x annual income (warning)
- Total savings cannot be negative

## Data Flow

1. **User Input** → Personal Profile Component
2. **Real-time Validation** → Field-level validation with visual feedback
3. **Form Submission** → Comprehensive validation before proceeding
4. **API Preparation** → Convert frontend data to backend-expected format
5. **API Call** → Send data to backend risk assessment endpoint
6. **Results Display** → Show processed risk assessment results

## Testing Checklist

- [ ] All field validations work correctly
- [ ] Icons display properly for each field
- [ ] Required field validation prevents form submission
- [ ] Data integrity validations show appropriate errors
- [ ] API payload matches backend expectations
- [ ] Financial goals array converts to string properly
- [ ] Risk appetite values map correctly
- [ ] Form state persists during navigation

## Notes

- `investment_horizon` is kept for frontend logic but may not be required by backend
- Financial goals are stored as array in frontend but converted to comma-separated string for API
- Currency values are in Indian Rupees (₹) in the UI but sent as numbers to backend
- Real-time validation provides immediate feedback while comprehensive validation runs before form submission 