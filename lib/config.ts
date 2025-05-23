// Risk Assessment API Configuration
export const API_CONFIG = {
  RISK_ASSESSMENT_API_URL: process.env.NEXT_PUBLIC_RISK_ASSESSMENT_API_URL || 'http://localhost:8000/analyze',
  CSRF_TOKEN: process.env.RISK_ASSESSMENT_CSRF_TOKEN || 'K3LHDuYol5fWHPnr7O9mwoDxc0826kW6wJtrPTWi4xrMpOBh6akN5qZH5HocTbzD'
} 