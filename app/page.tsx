import GoalPlanningForm from "@/components/goal-planning-form"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Financial Goal Planner</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Analyze your financial profile and investment portfolio to receive personalized goal planning and
            recommendations.
          </p>
        </div>
        <GoalPlanningForm />
      </div>
    </div>
  )
}
