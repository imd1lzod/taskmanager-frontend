import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface TaskStatusProps {
  stats: {
    label: string
    percentage: number
    color: string
  }[]
}

export default function TaskStatus({ stats }: TaskStatusProps) {
  return (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900">Vazifa Holati</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {stats.map((stat, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{stat.label}</span>
              <span className={`text-sm font-bold ${stat.color}`}>{stat.percentage}%</span>
            </div>
            
            {/* Donut Chart */}
            <div className="relative w-20 h-20 mx-auto">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                {/* Background circle */}
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                {/* Progress circle */}
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke={
                    stat.label === 'Completed' ? '#10b981' :
                    stat.label === 'In Progress' ? '#3b82f6' : '#ef4444'
                  }
                  strokeWidth="2"
                  strokeDasharray={`${stat.percentage * 0.5} 50`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">{stat.percentage}%</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
