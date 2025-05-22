
# Financial Risk Assessment Application

A responsive, elegant frontend UI for a financial risk assessment agent designed for Indian users. This application helps users understand their risk profile and provides personalized investment recommendations.

![Financial Risk Assessment Screenshot](/placeholder.svg?height=400&width=800)

## Features

- Multi-step form to collect user's financial profile
- Dynamic investment data collection
- Risk assessment visualization with score and category
- Asset allocation recommendations with interactive charts
- Investment product suggestions based on risk profile
- Support for both light and dark themes
- Responsive design for all device sizes
- Smooth animations and transitions
- API integration for risk assessment calculations

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Charts**: Recharts with shadcn/ui chart components
- **State Management**: React Hooks
- **Form Handling**: React state with controlled components
- **TypeScript**: For type safety and better developer experience

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/financial-risk-assessment.git
   cd financial-risk-assessment
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```code
financial-risk-assessment/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout with theme provider
│   ├── page.tsx              # Main page component
│   └── globals.css           # Global styles
├── components/               # React components
│   ├── risk-assessment-form.tsx  # Main form container
│   ├── personal-profile.tsx      # Personal info collection
│   ├── investment-data.tsx       # Investment data collection
│   ├── risk-results.tsx          # Results display
│   ├── theme-provider.tsx        # Theme context provider
│   └── ui/                       # shadcn/ui components
├── public/                   # Static assets
├── tailwind.config.ts        # Tailwind configuration
└── README.md                 # Project documentation
```

## Component Architecture

### Main Components

1. **RiskAssessmentForm**: The main container component that manages the multi-step form process, state, and API calls.

2. **PersonalProfile**: Collects user's financial profile including age, income, savings, risk appetite, and financial goals.

3. **InvestmentData**: Allows users to add and manage multiple investment assets with dynamic form fields.

4. **RiskResults**: Displays the risk assessment results with visualizations, including:
   - Risk score gauge
   - Asset allocation pie chart
   - Product recommendations
   - Next steps

### Data Flow

1. User inputs financial profile data in the first step
2. User adds investment assets in the second step
3. Form data is sent to the risk assessment API
4. Results are displayed in the third step with visualizations

## API Integration

The application is designed to integrate with a risk assessment API. Currently, it uses a simulated API call with dummy data, but it can be easily connected to a real API.

### API Call Structure

```typescript
// Example API call
const result = await fetch('/api/risk-assessment', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    financialProfile,
    investmentAssets
  })
});

const data = await result.json();
```

The API can return either a structured JSON object or HTML content that will be rendered directly in the results component.

## Contributing

### Adding New Features

When adding new features to the project, please follow these guidelines:

1. **Create a new branch**: Always create a feature branch for your work

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Follow the component structure**: Keep components modular and focused on a single responsibility

3. **Maintain type safety**: Use TypeScript interfaces and types for all props and state

4. **Ensure responsive design**: All new UI elements should work on mobile, tablet, and desktop

5. **Write clean code**: Follow the established code style and patterns

6. **Test thoroughly**: Ensure your feature works in both light and dark themes

### Code Style Guidelines

- Use functional components with hooks
- Use TypeScript for type safety
- Follow the established naming conventions
- Use Tailwind CSS for styling
- Keep components modular and reusable
- Use shadcn/ui components where appropriate
- Add proper comments for complex logic

## Deployment

This application can be easily deployed to Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables if needed
4. Deploy

## License

This project is licensed under the MIT License - see the LICENSE file for details.
