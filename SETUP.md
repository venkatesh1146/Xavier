# Environment Setup for Risk Assessment API

## Environment Variables

To use the risk assessment API, you need to create a `.env.local` file in the root directory of your project with the following variables:

```bash
# Risk Assessment API Configuration
NEXT_PUBLIC_RISK_ASSESSMENT_API_URL=http://localhost:8000/analyze
RISK_ASSESSMENT_CSRF_TOKEN=K3LHDuYol5fWHPnr7O9mwoDxc0826kW6wJtrPTWi4xrMpOBh6akN5qZH5HocTbzD
```

## API Integration

The application now integrates with the real risk assessment API instead of using mock data. The API expects the following request format:

### Request Format
```json
{
  "age": 30,
  "income": 75000,
  "expenses": 2000,
  "savings": 15000,
  "goals": "Buy a house in 5 years",
  "risk_appetite": "Moderate",
  "investments": [
    {
      "type": "Stocks",
      "amount": 10000,
      "name": "Tech Fund",
      "expected_returns": 8.5,
      "current_value": 12000
    }
  ]
}
```

### Configuration

If environment variables are not available, the application will fall back to default values defined in `lib/config.ts`.

## Making Changes

To modify the API URL or token:
1. Update the `.env.local` file, or
2. Modify the default values in `lib/config.ts`

**Note:** Environment files are ignored by git to keep sensitive information secure. 